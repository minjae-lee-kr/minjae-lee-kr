import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createRecording,
  readViewState,
  viewSearch,
  stages,
} from "../docs/research/what-the-client-knows/model.js";

const base = new URL("../docs/notes/retention-boundary/", import.meta.url);
const raw = await readFile(new URL("recording/evidence.json", base));
const mapping = await readFile(new URL("mapping.json", base));
const manifest = JSON.parse(
  await readFile(new URL("recording.json", base), "utf8"),
);
const original = JSON.parse(raw);

test("each caller view contains only a recorded local prefix and its exact pointer", async () => {
  const recording = await createRecording(raw, mapping, manifest);
  const lengths = [3, 5, 6];
  for (const [offset, stage] of stages.entries()) {
    const view = recording.project(stage);
    assert.equal(view.equal, true);
    for (const [column, row] of view.rows.entries()) {
      const index = column === 0 ? 3 : 2;
      assert.equal(Object.hasOwn(row, "audit"), false);
      assert.deepEqual(
        row.journal,
        original.cases[index].audit.localJournal.slice(0, lengths[offset]),
      );
      assert.deepEqual(
        row.event,
        original.cases[index].audit.localJournal[lengths[offset] - 1],
      );
      assert.equal(
        row.pointer,
        `/cases/${index}/audit/localJournal/${lengths[offset] - 1}`,
      );
    }
  }
});

test("revealed data is the final audit, is never projected from a logical-clock guess, and is detached", async () => {
  const recording = await createRecording(raw, mapping, manifest);
  for (const stage of stages) {
    const view = recording.project(stage, true);
    assert.deepEqual(
      view.rows.map((row) => row.audit.effects.length),
      [0, 1],
    );
    for (const [column, row] of view.rows.entries()) {
      const index = column === 0 ? 3 : 2;
      assert.deepEqual(
        row.audit.remoteJournal,
        original.cases[index].audit.remoteJournal,
      );
      assert.deepEqual(row.audit.effects, original.cases[index].audit.effects);
    }
    view.rows[0].journal.splice(0);
    view.rows[1].audit.effects.splice(0);
  }
  assert.equal(
    recording.project("unknown", true).rows[1].audit.effects.length,
    1,
  );
  assert.equal(recording.project("unknown").rows[0].journal.length, 3);
});

test("no view is created from a changed historical capture or a mismatched mapping", async () => {
  await assert.rejects(
    createRecording(Buffer.concat([raw, Buffer.from("\n")]), mapping, manifest),
    /Raw recording hash/,
  );
  await assert.rejects(
    createRecording(raw, Buffer.concat([mapping, Buffer.from("\n")]), manifest),
    /Mapping hash/,
  );
  const recording = await createRecording(raw, mapping, manifest);
  assert.throws(() => recording.project("__proto__"), /Unknown stage/);
});

test("shared states round-trip without accepting arbitrary stages or truthy audit values", () => {
  for (const stage of stages)
    for (const audit of [false, true])
      for (const lang of ["en", "ko"]) {
        const state = { stage, audit, lang };
        assert.deepEqual(readViewState(viewSearch(state)), state);
      }
  assert.deepEqual(readViewState("?stage=bogus&audit=true&lang=javascript:"), {
    stage: "unknown",
    audit: false,
    lang: "en",
  });
});
