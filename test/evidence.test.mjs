import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { startPreview } from '../scripts/serve.mjs';
import { validateRecording } from '../scripts/recording-contract.mjs';

const docs = fileURLToPath(new URL('../docs/', import.meta.url));
const hash = (value) => createHash('sha256').update(value).digest('hex');

test('recording import refuses empty, truncated, duplicated and failed change evidence', async () => {
  const original = JSON.parse(
    await readFile(path.join(docs, 'evidence/change/report.json'), 'utf8'),
  );
  const revision = original.provenance.gitRevision;
  assert.doesNotThrow(() => validateRecording('change', original, revision));
  for (const mutate of [
    (report) => {
      report.cases = [];
    },
    (report) => {
      report.cases.pop();
    },
    (report) => {
      report.cases[0].observations = [];
    },
    (report) => {
      report.cases[0].observations[1] = report.cases[0].observations[0];
    },
    (report) => {
      report.cases[0].observations[0].passed = false;
    },
  ]) {
    const changed = structuredClone(original);
    mutate(changed);
    assert.throws(() => validateRecording('change', changed, revision));
  }
});

test('recorded bundles preserve raw evidence and expose only local relative display assets', async () => {
  const preview = await startPreview({ port: 0 });
  try {
    for (const id of ['intent', 'change', 'cancellation']) {
      const root = path.join(docs, 'evidence', id);
      const recording = JSON.parse(await readFile(path.join(root, 'recording.json'), 'utf8'));
      assert.equal(recording.kind, 'recorded-local-run');
      assert.equal(recording.sourceDirty, false);
      assert.equal(recording.readOnly, true);
      const evidence = await readFile(path.join(root, recording.evidenceFile));
      assert.equal(
        hash(evidence),
        recording.originalEvidenceSha256,
        'Raw recorded evidence is unchanged.',
      );
      validateRecording(id, JSON.parse(evidence.toString('utf8')), recording.sourceRevision);
      if (recording.recordedDataFile) {
        const embedded = await readFile(path.join(root, recording.recordedDataFile));
        assert.equal(hash(embedded), recording.originalRecordedDataSha256);
        const upstream = JSON.parse(
          await readFile(path.join(root, recording.upstreamManifest), 'utf8'),
        );
        assert.equal(upstream.report.sha256, hash(evidence));
        assert.equal(
          upstream.files.find((file) => file.path === recording.recordedDataFile).sha256,
          hash(embedded),
        );
      }
      const page = await fetch(preview.url + '/evidence/' + id + '/');
      assert.equal(page.status, 200);
      const html = await page.text();
      assert.match(html, /Recorded local run/);
      assert.match(html, /기록된 로컬 실행/);
      for (const file of recording.files) {
        const bytes = await readFile(path.join(root, file.path));
        assert.equal(hash(bytes), file.sha256, id + '/' + file.path);
        assert.equal((await fetch(preview.url + '/evidence/' + id + '/' + file.path)).status, 200);
        assert.doesNotMatch(
          bytes.toString('utf8'),
          /(?:^|["\s])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/m,
        );
      }
      for (const [, asset] of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)) {
        assert.ok(
          !asset.startsWith('/') && !asset.includes(':'),
          'Display assets remain relative.',
        );
        assert.equal(
          (await fetch(new URL(asset, preview.url + '/evidence/' + id + '/'))).status,
          200,
        );
      }
    }
    assert.equal(
      (await fetch(preview.url + '/api/intents', { method: 'POST', body: '{}' })).status,
      405,
    );
  } finally {
    await preview.stop();
  }
});

test('cancellation import refuses empty, truncated, duplicated and failed policy evidence', async () => {
  const original = JSON.parse(
    await readFile(path.join(docs, 'evidence/cancellation/report.json'), 'utf8'),
  );
  const revision = original.source.git.head;
  assert.doesNotThrow(() => validateRecording('cancellation', original, revision));
  for (const mutate of [
    (report) => {
      report.cases = [];
    },
    (report) => {
      report.cases[0].checks = [];
    },
    (report) => {
      report.cases[0].checks.pop();
    },
    (report) => {
      report.cases[0].checks[1] = report.cases[0].checks[0];
    },
    (report) => {
      report.cases[0].checks[0].passed = false;
    },
    (report) => {
      report.sourceUnchanged = false;
    },
    (report) => {
      report.source.git.dirty = true;
    },
  ]) {
    const changed = structuredClone(original);
    mutate(changed);
    assert.throws(() => validateRecording('cancellation', changed, revision));
  }
});
