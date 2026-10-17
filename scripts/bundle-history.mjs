import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withReaderContext, readerContextCss } from './reader-context.mjs';
import { adaptEvidenceLanguage } from './evidence-language.mjs';

// A fixed, reviewed recording. Updating these pins requires reviewing a new run.
const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(
  dirname(root),
  'intent-recovery-lab',
  'reports',
  'history-2026-10-16T17-57-47-236Z-6c275813',
  'view-31815c67',
);
const revision = 'e081192189297311b1ebc9e8b40d2ef1993b578a';
const evidenceDigest = 'abe23117465e57ec65c7b2d7954480c4ff7dc4da70ee255ba9df2a84d600d32d';
const manifestDigest = '1ceb381fc04ad82bc95c5a54ca52aaa8855fdd4da8325f649e836a45a00928e7';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const seeds = [104729, 130363, 155921];
const expected = [
  'evidence.json',
  'index.html',
  'report.css',
  'report.js',
  'recording.json',
  'report-data.js',
  ...seeds.flatMap((seed) => [`seed-${seed}.json`, `seed-${seed}-stale-control.json`]),
];
assert.equal(process.argv.length, 2, 'Usage: node scripts/bundle-history.mjs');
assert.equal(await realpath(source), source, 'Use the original regular export directory');
assert.equal((await lstat(source)).isSymbolicLink(), false);
async function capture(name) {
  const file = join(source, name);
  const stat = await lstat(file);
  assert.ok(stat.isFile() && !stat.isSymbolicLink() && stat.size < 2_000_000);
  assert.equal(dirname(await realpath(file)), source);
  const bytes = await readFile(file);
  const text = bytes.toString('utf8');
  assert.ok(
    !/(?:^|["\s])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/m.test(text),
    'Private absolute path',
  );
  assert.ok(
    !/career-evidence-2026|commerce-case-card-2026|waiting-room-experience-2026|inapp-webview-experience-2026|-----BEGIN .*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20,}/i.test(
      text,
    ),
    'Private source or credential marker',
  );
  return bytes;
}
const upstreamBytes = await capture('assets.json');
assert.equal(hash(upstreamBytes), manifestDigest, 'Unreviewed source export');
const upstream = JSON.parse(upstreamBytes);
assert.deepEqual(upstream.map((row) => row.name).sort(), expected.toSorted());
const files = new Map();
for (const row of upstream) {
  const bytes = await capture(row.name);
  assert.equal(hash(bytes), row.sha256, `Source bytes changed: ${row.name}`);
  files.set(row.name, bytes);
}
assert.equal(hash(files.get('evidence.json')), evidenceDigest);
const recording = JSON.parse(files.get('recording.json'));
assert.equal(recording.kind, 'recorded-local-history-experiment');
assert.equal(recording.sourceRevision, revision);
assert.equal(recording.evidenceSha256, evidenceDigest);
assert.equal(recording.sourceStable, true);
assert.equal(recording.established, true);
assert.equal(recording.gitDirty, false);
assert.equal(recording.renderer.git.head, revision);
assert.equal(recording.renderer.git.dirty, false);

// Adapt navigation and URL language precedence, keeping the report's own view state.
// Raw evidence and the original export manifest stay exact.
const index = files.get('index.html').toString('utf8');
assert.equal(index.split('<body>').length, 2);
files.set(
  'index.html',
  Buffer.from(
    withReaderContext(index, 'history')
      .replace(
        '<body>',
        `<body>
    <nav class="portfolio-return"><a href="../../#intent"><span class="return-ko">← 포트폴리오</span><span class="return-en">← Portfolio</span></a></nav>`,
      )
      .replace(
        '</footer>',
        '<a href="bundle.json"><span class="return-ko">표시 파일 출처</span><span class="return-en">Display-file provenance</span></a></footer>',
      ),
  ),
);
files.set(
  'report.css',
  Buffer.from(
    files.get('report.css').toString('utf8') +
      readerContextCss + `
.portfolio-return{max-width:1160px;margin:auto;padding:14px 28px 0;font:12px/1.6 system-ui,sans-serif}.portfolio-return a{color:#294b7a;text-decoration:none}.portfolio-return a:hover{text-decoration:underline}.portfolio-return a:focus-visible{outline:2px solid #294b7a;outline-offset:4px}html[lang=ko] .return-en,html:not([lang=ko]) .return-ko{display:none}
`,
  ),
);
files.set('upstream-assets.json', upstreamBytes);
files.set('report.js', Buffer.from(adaptEvidenceLanguage(files.get('report.js').toString('utf8'), 'history')));
const manifest = {
  kind: 'portfolio-history-bundle',
  repository: 'intent-recovery-lab',
  sourceRevision: revision,
  upstreamManifest: 'upstream-assets.json',
  upstreamManifestSha256: manifestDigest,
  evidenceSha256: evidenceDigest,
  displayAdaptations: [
    'Portfolio return navigation and display-file provenance link in index.html; navigation styling in report.css',
    'Standalone bilingual scenario, ledger definition and control-method explanation; original observations unchanged',
    'Explicit URL language before shared preference; language controls update the URL and reading links; restore without rendering when unchanged',
  ],
  note: 'The upstream manifest identifies original export bytes. This manifest identifies the portfolio files. Both are unsigned provenance, not attestation.',
  files: [...files].map(([path, bytes]) => ({ path, sha256: hash(bytes) })),
};
files.set('bundle.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
const destination = join(root, 'docs', 'evidence', 'history');
await mkdir(destination, { recursive: true });
for (const [name, bytes] of files) await writeFile(join(destination, name), bytes);
console.log(
  `Bundled observed history ${revision.slice(0, 7)}: seven raw JSON files unchanged; no live API.`,
);
