import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PIN } from "../docs/research/react-recheck/pin.js";
import { copy } from "../docs/research/react-recheck/copy.js";
import {
  readRecording,
  projectRecording,
  readState,
  stateSearch,
  inventory,
} from "../docs/research/react-recheck/model.js";
const bytes = new Uint8Array(
  await readFile(
    new URL("../docs/research/react-recheck/recording.json", import.meta.url),
  ),
);
const raw = JSON.parse(new TextDecoder().decode(bytes));
test("pinned React recording separates displayed, previous and failed-response inventory", async () => {
  const r = await readRecording(bytes);
  const none = r.cases.none.steps,
    all = r.cases.all.steps;
  assert.deepEqual(none[1].data, { kind: "quantity", quantity: 3 });
  assert.deepEqual(none[1].previous, { kind: "absent" });
  assert.deepEqual(none[1].errorData, { kind: "null" });
  assert.equal(none[1].promise, "rejected");
  assert.deepEqual(all[1].data, { kind: "null" });
  assert.deepEqual(all[1].previous, { kind: "quantity", quantity: 3 });
  assert.equal(all[1].promise, "resolved");
  for (const steps of [none, all]) {
    assert.deepEqual(
      steps.map((s) => s.http),
      [1, 1, 0],
    );
    assert.equal(steps[2].hasError, false);
    assert.equal(steps[2].networkStatus, 7);
  }
});
test("changed bytes and source pins fail closed", async () => {
  const changed = bytes.slice();
  changed[changed.length - 2] ^= 1;
  await assert.rejects(readRecording(changed));
  await assert.rejects(
    readRecording(bytes, { ...PIN, revision: "0".repeat(40) }),
  );
  await assert.rejects(readRecording(bytes, { ...PIN, status: "pending" }));
});
test("interpretation changes are rejected even before byte checking", async () => {
  const edits = [
    (r) =>
      (r.browser.cases.find(
        (c) => c.errorPolicy === "none",
      ).steps[1].after.latestHook.previousDataPresent = true),
    (r) => (r.browser.cases[0].steps[2].requestCount = 1),
    (r) =>
      (r.browser.cases.find(
        (c) => c.errorPolicy === "all",
      ).steps[1].settlement.status = "rejected"),
    (r) => (r.browser.cases[0].steps[1].after.latestHook.dataState = "empty"),
    (r) => (r.serverObservedRequests[0].response.bodyText += " "),
    (r) =>
      (r.browser.cases[0].domObservations.findLast(
        (o) => o.phase === "warm",
      ).dom.html = r.browser.cases[0].domObservations
        .findLast((o) => o.phase === "warm")
        .dom.html.replace("<strong>3</strong>", "<strong>999</strong>")),
    (r) => r.browser.cases.pop(),
    (r) => (r.harnessStable = false),
    (r) => (r.browser.sessionId = "wrong-session"),
    (r) => (r.browser.cases[1].caseId = r.browser.cases[0].caseId),
    (r) => (r.browser.cases[0].requests[0].transportError = "failed"),
    (r) =>
      (r.browser.cases.find(
        (c) => c.errorPolicy === "none",
      ).steps[1].after.latestHook.previousData = { products: [] }),
    (r) =>
      (r.browser.cases[0].domObservations.findLast(
        (o) => o.phase === "warm",
      ).dom.html = r.browser.cases[0].domObservations
        .findLast((o) => o.phase === "warm")
        .dom.html.replace("7 · ready", "999 · ready")),
  ];
  for (const edit of edits) {
    const modified = structuredClone(raw);
    edit(modified);
    await assert.rejects(projectRecording(modified, PIN));
  }
});
test("URL keeps language, selected policy, phase and expanded details", () => {
  const state = {
    policy: "all",
    step: "cache-first",
    details: ["step-detail", "provenance-detail"],
  };
  assert.deepEqual(readState(stateSearch(state, "ko")), state);
  assert.deepEqual(readState("?policy=unknown&step=unknown&open=untrusted"), {
    policy: "none",
    step: "failed",
    details: [],
  });
});
test("missing values do not become null or zero, and KOEN cover the same text keys", () => {
  assert.deepEqual(inventory(null, false), { kind: "absent" });
  assert.throws(() => inventory(null, true));
  assert.deepEqual(Object.keys(copy.ko).sort(), Object.keys(copy.en).sort());
  assert.ok(
    Object.values(copy.ko).every((v) => typeof v === "string" && v.length),
  );
});
