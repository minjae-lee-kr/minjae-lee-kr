import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PIN } from "../docs/research/react-attempts/pin.js";
import { copy } from "../docs/research/react-attempts/copy.js";
import { caseCopy } from "../docs/research/react-attempts/cases.js";
import {
  readRecording,
  projectRecording,
  readState,
  stateSearch,
  caseIds,
} from "../docs/research/react-attempts/model.js";
const bytes = new Uint8Array(
  await readFile(
    new URL("../docs/research/react-attempts/recording.json", import.meta.url),
  ),
);
const raw = JSON.parse(new TextDecoder().decode(bytes));
test("five scenario pairs project actual final DOM, attempt status, cache and decisions", async () => {
  const r = await readRecording(bytes);
  assert.deepEqual(Object.keys(r.cases), caseIds);
  for (const scenario of caseIds) {
    const view = r.cases[scenario];
    for (const [panel, mode] of [
      ["baseline", "status-only"],
      ["managed", "guarded-write"],
    ]) {
      const original = raw.browser.cases.find(
          (c) => c.scenario === scenario && c.mode === mode,
        ),
        final = original.steps.at(-1);
      assert.equal(view[panel].display, final.hook.data?.product?.quantity);
      assert.deepEqual(view[panel].attempt, final.attempt);
      assert.deepEqual(view[panel].decisions, original.decisions);
      assert.deepEqual(view[panel].raw, original);
      assert.deepEqual(
        view.releases.map((r) => r.slot),
        original.releaseOrder,
      );
    }
  }
});
test("cache-only control preserves failure with no third HTTP request in either implementation", async () => {
  const r = await readRecording(bytes);
  for (const run of [
    r.cases["cache-read"].baseline,
    r.cases["cache-read"].managed,
  ]) {
    assert.equal(run.http, 2);
    assert.equal(run.display, 3);
    assert.equal(run.attempt.status, "failed");
    assert.equal(run.cache.a, 3);
  }
});
test("changed bytes, source mismatch and pending publication fail closed", async () => {
  const altered = bytes.slice();
  altered[altered.length - 2] ^= 1;
  await assert.rejects(readRecording(altered));
  await assert.rejects(
    readRecording(bytes, { ...PIN, revision: "0".repeat(40) }),
  );
  await assert.rejects(readRecording(bytes, { ...PIN, status: "pending" }));
});
test("semantic mismatches cannot become comparisons", async () => {
  const mutations = [
    (r) => (r.browser.sessionId = "wrong"),
    (r) => r.browser.cases.pop(),
    (r) => (r.browser.cases[1].caseId = r.browser.cases[0].caseId),
    (r) => r.browser.cases[0].releaseOrder.reverse(),
    (r) => (r.serverObservedRequests[0].response.bodyText += " "),
    (r) => (r.browser.cases[0].decisions.at(-1).accepted = true),
    (r) => (r.browser.cases[1].decisions.at(-1).cacheWrite = true),
    (r) => (r.browser.cases[0].steps.at(-1).attempt.status = "idle"),
    (r) =>
      (r.browser.cases[0].steps.at(-1).dom.html = r.browser.cases[0].steps
        .at(-1)
        .dom.html.replace("<dt>quantity</dt>", "<dt>invented</dt>")),
    (r) => (r.browser.cases[0].steps.at(-1).cache = {}),
    (r) => r.browser.faults.push({ message: "failure" }),
    (r) => (r.harnessStable = false),
    (r) =>
      (r.browser.cases[0].events.find((e) => e.type === "response-read").type =
        "invented"),
    (r) => (r.browser.cases[0].requests[0].requestWireText += " "),
  ];
  for (const mutate of mutations) {
    const changed = structuredClone(raw);
    mutate(changed);
    await assert.rejects(projectRecording(changed, PIN));
  }
});
test("selection and expanded details round-trip across language changes", () => {
  const state = {
    id: "variable-switch",
    details: ["case-detail", "provenance-detail"],
  };
  for (const lang of ["ko", "en"])
    assert.deepEqual(readState(stateSearch(state, lang)), state);
  assert.deepEqual(readState("?case=unknown&open=arbitrary"), {
    id: "late-success",
    details: [],
  });
});
test("KOEN cover the same five situations and interface text", () => {
  assert.deepEqual(Object.keys(copy.ko).sort(), Object.keys(copy.en).sort());
  for (const language of ["ko", "en"]) {
    assert.deepEqual(Object.keys(caseCopy[language]), caseIds);
    assert.ok(
      Object.values(copy[language]).every(
        (v) => typeof v === "string" && v.length > 0,
      ),
    );
  }
});
