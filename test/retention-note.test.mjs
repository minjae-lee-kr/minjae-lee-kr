import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PIN,
  analyzeEvidence,
  atPointer,
  validateBundle,
} from "../docs/notes/retention-boundary/contract.js";
import {
  loadRecording,
  startNote,
} from "../docs/notes/retention-boundary/retention.js";
import { captureInputs } from "../scripts/bundle-retention.mjs";
import { startPreview } from "../scripts/serve.mjs";

const root = fileURLToPath(
  new URL("../docs/notes/retention-boundary/", import.meta.url),
);
const raw = await readFile(path.join(root, "recording/evidence.json"));
const mappingBytes = await readFile(path.join(root, "mapping.json"));
const report = JSON.parse(raw);
const mapping = JSON.parse(mappingBytes);
const manifest = JSON.parse(
  await readFile(path.join(root, "recording.json"), "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

function pair() {
  return [structuredClone(report), structuredClone(mapping)];
}
// Deliberately update selected-value assertions after tampering: the relational
// checker must reject the contradiction, not merely notice a stale JSON copy.
function refreshSelections(r, m) {
  for (const selection of m.selections)
    selection.expected = structuredClone(atPointer(r, selection.pointer));
}

test("one frozen capture supplies all 23 original records and the two displayed contrasts", async () => {
  const view = await validateBundle(raw, mappingBytes, manifest);
  assert.equal(hash(raw), PIN.rawSha256);
  assert.equal(view.selected.size, 23);
  assert.deepEqual(view.metrics, { zero: 0, one: 1, remote: 2, local: 1 });
  assert.deepEqual(view.clocks, {
    dispatch: 10020,
    cutoff: 10900,
    minimum: 11000,
    arrival: 12000,
  });
  assert.equal(
    manifest.sourceRevision,
    "c60801f969ab0223812bb4fa609c2de3e7651c91",
  );
  assert.equal(manifest.historicalGitBlobsVerified, true);
  for (const file of manifest.files)
    assert.equal(
      hash(await readFile(path.join(root, file.path))),
      file.sha256,
      file.path,
    );
  await assert.rejects(
    validateBundle(
      Buffer.concat([raw, Buffer.from("\n")]),
      mappingBytes,
      manifest,
    ),
    /Raw recording hash/,
  );
});

test("equality flags cannot conceal different local tables or API responses", () => {
  {
    const [r, m] = pair();
    r.cases[2].audit.localClockFloor[0].value = 12001;
    refreshSelections(r, m);
    assert.throws(
      () => analyzeEvidence(r, m),
      /Local tables are not identical/,
    );
  }
  {
    const [r, m] = pair();
    r.cases[2].observations.find(
      (e) => e.type === "local-http-response",
    ).body.status = "confirmed";
    refreshSelections(r, m);
    assert.throws(
      () => analyzeEvidence(r, m),
      /Local HTTP responses are not identical/,
    );
  }
});

test("invented metrics are rejected even when success booleans remain green", () => {
  const [r, m] = pair();
  m.panels[1].metrics.remoteEffects = 9000;
  assert.throws(
    () => analyzeEvidence(r, m),
    /Presentation late metrics mismatch/,
  );
  m.panels[1].metrics.remoteEffects = 2;
  r.cases[4].audit.checks.remoteEffects = 9000;
  assert.throws(() => analyzeEvidence(r, m), /Summary metrics disagree/);
});

test("a forwarded-before-prune parent trace cannot support the late-arrival narrative", () => {
  const [r, m] = pair();
  const stream = r.cases[4].observations;
  [stream[13], stream[14]] = [stream[14], stream[13]];
  stream.forEach((entry, i) => (entry.sequence = i + 1));
  refreshSelections(r, m);
  assert.throws(
    () => analyzeEvidence(r, m),
    /Attempt correlation mismatch|Parent control semantics mismatch/,
  );
});

test("the local receipt must belong to this retry, not merely exist under the same key", () => {
  const [r, m] = pair();
  const late = r.cases[4];
  const first = late.audit.effects[0].receipt;
  late.audit.intents[0].receipt = first;
  late.audit.grants[0].receipt = first;
  late.audit.localJournal.find(
    (e) => e.event === "local-grant",
  ).detail.receipt = first;
  for (const e of late.observations.filter(
    (e) => e.type === "local-http-response" && e.status === 200,
  ))
    e.body.receipt = first;
  refreshSelections(r, m);
  assert.throws(
    () => analyzeEvidence(r, m),
    /New receipt is not bound to the exact retry/,
  );
});

test("premature pruning and an invented cutoff cannot be presented as retention expiry", () => {
  {
    const [r, m] = pair();
    const late = r.cases[4];
    late.audit.remoteJournal[1].clock = 10020;
    late.audit.remoteJournal[2].clock = 10020;
    late.audit.effects[1].created_at = 10020;
    late.audit.localJournal[4].clock = 10020;
    for (const e of late.observations)
      if (e.control === "clock" && e.value === 12000) e.value = 10020;
    refreshSelections(r, m);
    assert.throws(
      () => analyzeEvidence(r, m),
      /Expiry or arrival threshold mismatch/,
    );
  }
  {
    const [r, m] = pair();
    m.panels[1].thresholds[0].value = 20000;
    assert.throws(
      () => analyzeEvidence(r, m),
      /Presentation thresholds mismatch/,
    );
  }
});

test("missing static assets fail closed; no successful narrative survives a failed load", async () => {
  const blobs = new Map([
    ["recording/evidence.json", raw],
    ["mapping.json", mappingBytes],
    ["recording.json", Buffer.from(JSON.stringify(manifest))],
  ]);
  for (const missing of blobs.keys()) {
    const loader = () =>
      loadRecording(async (url) => {
        const name = [...blobs.keys()].find((candidate) =>
          url.pathname.endsWith("/" + candidate),
        );
        return new Response(
          name === missing ? "Unavailable" : blobs.get(name),
          { status: name === missing ? 404 : 200 },
        );
      });
    const nodes = new Map(
      ["verified-content", "mismatch", "load-status"].map((id) => [
        id,
        { hidden: false },
      ]),
    );
    const doc = {
      getElementById: (id) => nodes.get(id),
      documentElement: { dataset: {} },
    };
    await startNote(doc, loader);
    assert.equal(nodes.get("verified-content").hidden, true);
    assert.equal(nodes.get("mismatch").hidden, false);
    assert.equal(doc.documentElement.dataset.evidence, "mismatch");
  }
});

test("import preflight refuses missing files before producing generated outputs", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "retention-note-import-"));
  try {
    const source = path.join(scratch, "source");
    const note = path.join(scratch, "note");
    await mkdir(path.join(source, "reports", PIN.runId), { recursive: true });
    await mkdir(note);
    await writeFile(
      path.join(source, "reports", PIN.runId, "evidence.json"),
      raw,
    );
    for (const name of [
      "index.html",
      "retention.css",
      "retention.js",
      "contract.js",
    ])
      await writeFile(path.join(note, name), "fixture");
    await assert.rejects(captureInputs(source, note), { code: "ENOENT" });
    await assert.rejects(readFile(path.join(note, "recording.json")), {
      code: "ENOENT",
    });
  } finally {
    assert.equal(path.dirname(scratch), path.resolve(tmpdir()));
    assert.ok(path.basename(scratch).startsWith("retention-note-import-"));
    await rm(scratch, { recursive: true, force: true });
  }
});

test("the note and its relative modules, shared assets and raw evidence are available over read-only HTTP", async () => {
  const preview = await startPreview({ port: 0 });
  try {
    const base = preview.url + "/notes/retention-boundary/";
    const html = await (await fetch(base)).text();
    for (const [, relative] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|#)/.test(relative)) continue;
      const response = await fetch(new URL(relative, base));
      assert.equal(response.status, 200, relative);
    }
    assert.equal(
      (await fetch(new URL("contract.js", base))).headers.get("content-type"),
      "text/javascript; charset=utf-8",
    );
    assert.equal(
      hash(
        Buffer.from(
          await (
            await fetch(new URL("recording/evidence.json", base))
          ).arrayBuffer(),
        ),
      ),
      PIN.rawSha256,
    );
    assert.equal(
      (await fetch(base, { method: "POST", body: "{}" })).status,
      405,
    );
    assert.doesNotMatch(
      html,
      /(?:^|["\s])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/m,
    );
    assert.match(html, /id="verified-content" hidden/);
  } finally {
    await preview.stop();
  }
});
