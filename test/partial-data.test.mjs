import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  caseIds,
  readRecording,
  readState,
  formatPath,
} from "../docs/research/partial-data/model.js";

const raw = await readFile(
  new URL("../docs/research/partial-data/recording.json", import.meta.url),
);
const report = JSON.parse(raw);

test("cards and paths derive from the pinned actual gateway responses", async () => {
  const recording = await readRecording(raw);
  const expectedCounts = [
    [3, 2],
    [3, 0],
    [2, 2],
  ];
  for (const [index, id] of caseIds.entries()) {
    const view = recording.project(id);
    assert.deepEqual(
      view.products,
      report.cases[index].response.body.data.products,
    );
    assert.deepEqual(
      [view.productCount, view.inventoryCount],
      expectedCounts[index],
    );
    assert.equal(view.response.status, 200);
    assert.equal(view.pointer, `/cases/${index}/response/body`);
    const indices = index === 1 ? [0, 1, 2] : [1];
    assert.deepEqual(
      view.paths,
      indices.map((n) => ["products", n, "availability"]),
    );
    view.products.splice(0);
  }
  assert.equal(recording.project(caseIds[0]).products.length, 3);
});

test("historical source manifests and clean revision agree across the capture", () => {
  assert.equal(report.sourceUnchanged, true);
  assert.deepEqual(report.sourceBefore, report.sourceAfter);
  assert.equal(report.sourceBefore.git.dirty, false);
  assert.equal(
    createHash("sha256")
      .update(JSON.stringify(report.sourceBefore.manifest))
      .digest("hex"),
    report.sourceBefore.sha256,
  );
  assert.equal(
    report.sourceBefore.git.head,
    "e34b17ef006b819fda6df8def2b38384d18f453a",
  );
});

test("modified results cannot silently become a displayed historical recording", async () => {
  const altered = structuredClone(report);
  altered.cases[2].response.body.data.products[1] =
    report.cases[0].response.body.data.products[1];
  await assert.rejects(
    readRecording(Buffer.from(JSON.stringify(altered))),
    /hash mismatch/,
  );
  await assert.rejects(
    readRecording(Buffer.concat([raw, Buffer.from("\n")])),
    /hash mismatch/,
  );
  const recording = await readRecording(raw);
  assert.throws(
    () => recording.project("unknown-case"),
    /Unknown recorded case/,
  );
});

test("shared selections have bounded values and error paths retain zero-based positions", () => {
  assert.deepEqual(readState("?case=non-null-per-key&lang=ko"), {
    id: "non-null-per-key",
    lang: "ko",
  });
  assert.deepEqual(readState("?case=invalid&lang=invalid"), {
    id: caseIds[0],
    lang: "en",
  });
  assert.equal(
    formatPath(["products", 0, "availability"]),
    "products[0].availability",
  );
});
