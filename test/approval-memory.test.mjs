import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  PIN,
  readRecording,
  readState,
  stateSearch,
} from "../docs/research/approval-memory/model.js";
import { copy } from "../docs/research/approval-memory/copy.js";
import { EXPIRY_PIN } from "../docs/research/approval-memory/expiry-pin.js";

const base = new URL("../docs/research/approval-memory/", import.meta.url);
const bytes = await readFile(new URL("recording.json", base));
const original = JSON.parse(bytes);
function pointed(pointer) {
  return pointer
    .split("/")
    .slice(1)
    .reduce((value, part) => value[part], original);
}
function exact(record) {
  assert.deepEqual(record.value, pointed(record.pointer));
}

test("interruption views use only the corresponding post-exit observations", async () => {
  const recording = await readRecording(bytes);
  for (const [id, code, receiptCount] of [
    ["separate", "B", 0],
    ["prepared", "A", 0],
    ["selected", "B", 1],
  ]) {
    const view = recording.stop(id);
    assert.equal(view.code, code);
    assert.equal(view.receipts.length, receiptCount);
    assert.equal(view.worker.value.acknowledgement, null);
    assert.equal(view.worker.value.process.directChildExitConfirmed, true);
    view.records.forEach(exact);
  }
  const separate = recording.stop("separate");
  assert.equal(separate.stateOid, null);
  assert.equal(
    separate.records.some((r) => r.pointer.includes("finalSeparateReceipt")),
    false,
  );
  const prepared = recording.stop("prepared");
  assert.equal(prepared.stateOid, original.cases[1].facts.initial.oid);
  assert.notEqual(
    prepared.stateOid,
    original.cases[1].facts.worker.phases[1].detail.next.oid,
  );
});

test("rollback views retain their own before/after pair and approval identity", async () => {
  const recording = await readRecording(bytes);
  const preserve = recording.rollback("preserve");
  const rewind = recording.rollback("rewind");
  for (const view of [preserve, rewind]) view.records.forEach(exact);
  assert.deepEqual([preserve.before.code, preserve.after.code], ["A", "A"]);
  assert.equal(preserve.before.stateOid, preserve.after.stateOid);
  assert.equal(preserve.action.value.code, "ALREADY_RECORDED");
  assert.deepEqual([rewind.before.code, rewind.after.code], ["A", "B"]);
  assert.equal(rewind.before.receipts.length, 0);
  assert.equal(
    rewind.after.receipts[0].operationId,
    preserve.before.receipts[0].operationId,
  );
  assert.notEqual(rewind.before.stateOid, preserve.before.stateOid);
});

test("reader view does not turn the illustrative mixed read into an observed state", async () => {
  const recording = await readRecording(bytes);
  const [first, current, again] = recording.reader();
  [first, current, again].forEach(exact);
  assert.deepEqual([first.code, current.code, again.code], ["A", "B", "A"]);
  assert.equal(first.stateOid, again.stateOid);
  assert.notEqual(first.stateOid, current.stateOid);
  assert.deepEqual(first.value, again.value);
  assert.equal(
    recording.reader().some((r) => r.pointer.endsWith("mixedRead")),
    false,
  );
  first.value.state.receipts.push({ forged: true });
  assert.equal(recording.reader()[0].receipts.length, 0);
});

test("the fixed capture is clean and any changed or truncated bytes fail closed", async () => {
  assert.equal(createHash("sha256").update(bytes).digest("hex"), PIN.sha256);
  assert.deepEqual(original.sourceBefore, original.sourceAfter);
  assert.equal(original.sourceBefore.gitRevision, PIN.revision);
  assert.equal(original.sourceBefore.gitDirty, false);
  for (const changed of [
    bytes.subarray(0, bytes.length - 1),
    Buffer.from(JSON.stringify({ ...original, passed: false })),
    Buffer.concat([bytes, Buffer.from("\n")]),
  ])
    await assert.rejects(readRecording(changed), /hash mismatch/);
  const recording = await readRecording(bytes);
  assert.throws(() => recording.stop("invented"), /Unknown stop/);
  assert.throws(() => recording.rollback("invented"), /Unknown rollback/);
});

test("URL state and bilingual controls retain bounded selections and detail IDs", () => {
  const state = {
    stop: "selected",
    rollback: "rewind",
    details: ["stop-raw", "rollback-raw"],
  };
  assert.deepEqual(readState(stateSearch(state, "ko")), state);
  assert.deepEqual(readState(stateSearch(state, "en")), state);
  assert.deepEqual(
    readState("?stop=fake&rollback=fake&details=fake,reader-raw,reader-raw"),
    { stop: "separate", rollback: "preserve", details: ["reader-raw"] },
  );
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ko).sort());
  assert.equal(copy.en.readerLabels.length, 3);
  assert.equal(copy.ko.readerLabels.length, 3);
});

test("page copy keys, local links and pinned technical links resolve", async () => {
  const html = await readFile(new URL("index.html", base), "utf8");
  for (const match of html.matchAll(/data-(?:copy|label)="([^"]+)"/g))
    for (const lang of ["ko", "en"])
      assert.equal(
        typeof copy[lang][match[1]],
        "string",
        `${lang}:${match[1]}`,
      );
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith("https://github.com/"))
      assert.ok(
        value.includes(PIN.revision) || value.includes(EXPIRY_PIN.revision),
      );
    else if (value.startsWith("#"))
      assert.ok(html.includes(`id="${value.slice(1)}"`));
    else if (!value.startsWith("https:")) await access(new URL(value, base));
  }
  assert.equal(html.includes('aria-live="polite"'), true);
  assert.equal(html.includes("data-observations hidden"), true);
});

test("the deadline follow-up keeps a separate clean recording and source pin", async () => {
  const bytes = await readFile(new URL("expiry-recording.json", base));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    EXPIRY_PIN.sha256,
  );
  const followUp = JSON.parse(bytes);
  assert.deepEqual(followUp.sourceBefore, followUp.sourceAfter);
  assert.equal(followUp.sourceBefore.gitRevision, EXPIRY_PIN.revision);
  assert.equal(followUp.sourceBefore.gitDirty, false);
  assert.equal(followUp.sourceBefore.sourceFingerprint, EXPIRY_PIN.source);
  assert.equal(followUp.sourceStable, true);
  assert.notEqual(EXPIRY_PIN.revision, PIN.revision);
  assert.notEqual(EXPIRY_PIN.sha256, PIN.sha256);
});
