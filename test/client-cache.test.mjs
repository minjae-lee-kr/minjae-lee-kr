import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PIN } from "../docs/research/client-cache/pin.js";
import { copy } from "../docs/research/client-cache/copy.js";
import {
  caseIds,
  projectReport,
  readRecording,
  readState,
  stateSearch,
} from "../docs/research/client-cache/model.js";

// A private frozen capture can exercise this reader before a clean publication
// capture is installed. CI uses the committed recording.json by default.
const bytes = new Uint8Array(
  await readFile(
    process.env.CLIENT_CACHE_RECORDING ||
      new URL("../docs/research/client-cache/recording.json", import.meta.url),
  ),
);
const raw = JSON.parse(new TextDecoder().decode(bytes));

test("the pinned recording projects actual steps, with inspectable raw pointers", async () => {
  const r = await readRecording(bytes);
  assert.equal(r.hash, PIN.sha256);
  for (const [index, id] of caseIds.entries()) {
    const view = r.project(id);
    assert.equal(view.pointer, `/cases/${index}`);
    assert.deepEqual(view.raw, raw.cases[index]);
    for (const [stepIndex, step] of view.steps.entries()) {
      assert.equal(step.pointer, `/cases/${index}/steps/${stepIndex}`);
      assert.equal(
        step.httpCount,
        raw.cases[index].steps[stepIndex].http.length,
      );
      assert.equal(
        step.status,
        raw.cases[index].steps[stepIndex].result.status,
      );
    }
  }
});

test("the comparison distinguishes cached null, rejected partial data and a later cache write", () => {
  const r = projectReport(raw);
  const all = r.project("all-cold");
  assert.equal(all.failed.hasError, true);
  assert.deepEqual(all.failed.cached, { kind: "null" });
  assert.equal(all.next.hasError, false);
  assert.equal(all.next.httpCount, 0);
  assert.deepEqual(all.next.resultValue, { kind: "null" });
  const none = r.project("none-warm");
  assert.equal(none.failed.status, "rejected");
  assert.deepEqual(none.failed.resultValue, { kind: "no-result" });
  assert.deepEqual(none.failed.errorData, { kind: "null" });
  assert.deepEqual(none.next.resultValue, { kind: "quantity", quantity: 3 });
  assert.equal(none.next.httpCount, 0);
  assert.equal(none.next.hasError, false);
  assert.deepEqual(r.project("all-warm").failed.cached, { kind: "null" });
  assert.equal(r.project("ignore-warm").failed.hasError, false);
  const noCache = r.project("all-no-cache");
  assert.deepEqual(noCache.failed.cached, { kind: "empty" });
  assert.equal(noCache.next.httpCount, 1);
  assert.equal(noCache.next.hasError, true);
  assert.deepEqual(noCache.next.cached, { kind: "null" });
});

test("projection is isolated from the capture and other selected views", () => {
  const before = JSON.stringify(raw);
  const r = projectReport(raw);
  const first = r.project("all-cold");
  first.failed.cached.kind = "changed";
  first.raw.steps.length = 0;
  assert.equal(r.project("all-cold").failed.cached.kind, "null");
  assert.equal(r.project("all-cold").raw.steps.length, 2);
  assert.equal(JSON.stringify(raw), before);
});

test("missing or inconsistent observations are rejected even with a passing producer summary", () => {
  const mutations = [
    (r) => {
      r.cases[0].steps[1].http = [structuredClone(r.cases[0].steps[0].http[0])];
    },
    (r) => {
      r.cases[1].steps[1].result.error.data.products[1].availability = {
        quantity: 3,
      };
    },
    (r) => {
      r.cases[1].steps[1].result.dataPresent = true;
    },
    (r) => {
      r.cases[2].steps[1].cacheBefore = {};
    },
    (r) => {
      r.cases[0].steps[1].cacheAfter[
        'Product:{"sku":"demo-lamp"}'
      ].availability = { quantity: 3 };
    },
    (r) => {
      r.cases[4].steps[1].http[0].response.status = 503;
    },
    (r) => {
      delete r.cases[0].steps[1].readAfter.products[1].availability;
    },
    (r) => {
      r.cases[0].steps[0].result.error.errors[0].path = [
        "products",
        0,
        "availability",
      ];
    },
    (r) => {
      r.sourceAfter.git.head = "0".repeat(40);
    },
    (r) => {
      r.assessment.evidenceValid = false;
    },
  ];
  for (const mutate of mutations) {
    const changed = structuredClone(raw);
    mutate(changed);
    assert.throws(() => projectReport(changed), /Recording contract:/);
  }
  assert.throws(
    () => projectReport(raw, { ...PIN, status: "published", dirty: true }),
    /published capture is dirty|source pin/,
  );
});

test("raw byte changes cannot bypass the fixed capture identity", async () => {
  const altered = bytes.slice();
  altered[altered.length - 1] ^= 1;
  await assert.rejects(readRecording(altered), /recording hash mismatch/);
  await assert.rejects(
    readRecording(bytes.slice(0, -1)),
    /recording hash mismatch/,
  );
});

test("URL state keeps only supported selections and details across language changes", () => {
  const state = readState(
    "?case=none-warm&details=case-raw,unknown,case-raw,provenance-raw",
  );
  assert.deepEqual(state, {
    id: "none-warm",
    details: ["case-raw", "provenance-raw"],
  });
  for (const lang of ["ko", "en"]) {
    assert.deepEqual(readState(stateSearch(state, lang)), state);
    assert.equal(
      new URLSearchParams(stateSearch(state, lang)).get("lang"),
      lang,
    );
  }
  assert.deepEqual(readState("?case=unknown&details=x"), {
    id: "all-cold",
    details: [],
  });
  assert.throws(
    () => stateSearch({ id: "unknown", details: [] }, "en"),
    /unknown case/,
  );
});

test("both languages cover the same interface and five case explanations", async () => {
  assert.deepEqual(Object.keys(copy.ko).sort(), Object.keys(copy.en).sort());
  assert.deepEqual(Object.keys(copy.ko.explanations), caseIds);
  assert.deepEqual(Object.keys(copy.en.explanations), caseIds);
  const html = await readFile(
    new URL("../docs/research/client-cache/index.html", import.meta.url),
    "utf8",
  );
  for (const [, key] of html.matchAll(/data-(?:copy|label)="([^"]+)"/g)) {
    assert.equal(typeof copy.ko[key], "string", key);
    assert.equal(typeof copy.en[key], "string", key);
  }
});
