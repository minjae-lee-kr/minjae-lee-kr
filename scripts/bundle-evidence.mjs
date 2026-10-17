import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { validateRecording } from './recording-contract.mjs';
import { adaptCancellationDisplay } from './cancellation-display.mjs';
import { withReaderContext, readerContextCss } from './reader-context.mjs';
import { adaptEvidenceLanguage } from './evidence-language.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const parent = path.dirname(root);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const exec = promisify(execFile);
const sources = [
  {
    id: 'intent',
    repository: 'intent-recovery-lab',
    revision: 'e081192189297311b1ebc9e8b40d2ef1993b578a',
    report: 'reports/2026-10-16T17-57-36-452Z-c4acd058',
    evidenceSha256: 'a6174c07e38d4befeb39cb76d10705a3153ed3d636637e27bb03a5146f19fb14',
    evidence: 'evidence.json',
    files: ['index.html', 'report.css', 'report.js', 'evidence.json'],
  },
  {
    id: 'change',
    repository: 'verified-change-lab',
    revision: '5eb3fe8779ac018617e6a1ac4055cd497629503b',
    evidence: 'report.json',
    evidenceSha256: 'a135f8ed283e8b64eb0341a5a85bc23d39ae9cfd4f64a5a584e43e9ed32ffa0f',
    files: ['index.html', 'style.css', 'app.js', 'report.json'],
  },
  {
    id: 'cancellation',
    repository: 'federated-catalog-lab',
    revision: 'ff47d27ac38071cf7d1c611492b55f657d8d0a27',
    report: '.local/cancellation-export',
    evidence: 'report.json',
    evidenceSha256: '421617b5c8e27bb1446a864e909dfc3f0a3de6e223f914d323aa07502893aa50',
    recordedDataFile: 'report-data.js',
    files: ['index.html', 'debt.css', 'debt.js', 'report-data.js', 'report.json', 'export.json'],
  },
];
const selection = process.argv[2] ?? 'all';
assert.ok(
  process.argv.length <= 3 &&
    (selection === 'all' || sources.some((source) => source.id === selection)),
  'Usage: node scripts/bundle-evidence.mjs [intent|change|cancellation]',
);
const banner = `<aside class="recorded-banner"><a href="../../"><span class="recorded-ko">← 포트폴리오</span><span class="recorded-en">← Portfolio</span></a><p><span class="recorded-ko">기록된 로컬 실행 · 읽기 전용 · 현재 시스템을 조회하지 않습니다.</span><span class="recorded-en">Recorded local run · read-only · no live system connection.</span></p><a href="recording.json"><span class="recorded-ko">기록 출처</span><span class="recorded-en">Recording source</span></a></aside>`;
const bannerCss = `\n.recorded-banner{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px max(20px,calc((100% - 1100px)/2));background:#eaf1fc;border-bottom:1px solid #cddcf2;color:#294b7a;font:12px/1.6 system-ui,sans-serif}.recorded-banner a{color:inherit;font-weight:600;white-space:nowrap}.recorded-banner p{margin:0}html[lang=ko] .recorded-en,html:not([lang=ko]) .recorded-ko{display:none}@media(max-width:680px){.recorded-banner{flex-wrap:wrap;gap:8px 16px}.recorded-banner p{order:3;flex-basis:100%}}\n`;

function safeText(text, label) {
  assert.ok(
    !/(?:^|["\s])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/m.test(text),
    `${label}: absolute private path`,
  );
  assert.ok(
    !/career-evidence-2026|commerce-case-card-2026|waiting-room-experience-2026|inapp-webview-experience-2026|-----BEGIN .*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20,}/i.test(
      text,
    ),
    `${label}: private source or credential marker`,
  );
}

for (const source of sources.filter((source) => selection === 'all' || source.id === selection)) {
  const repository = path.join(parent, source.repository);
  const originalEvidence = await readFile(
    path.join(repository, source.report ?? 'dist', source.evidence),
  );
  if (source.evidenceSha256)
    assert.equal(
      hash(originalEvidence),
      source.evidenceSha256,
      source.id + ': unexpected recording bytes',
    );
  const evidence = JSON.parse(originalEvidence.toString('utf8'));
  const sourceRevision =
    source.id === 'intent'
      ? evidence.sourceBefore.git.head
      : source.id === 'change'
        ? evidence.provenance.gitRevision
        : evidence.source.git.head;
  validateRecording(source.id, evidence, source.revision);
  let upstream;
  if (source.id === 'cancellation') {
    upstream = JSON.parse(
      await readFile(path.join(repository, source.report, 'export.json'), 'utf8'),
    );
    assert.equal(upstream.kind, 'prerecorded-read-only-cancellation-debt');
    assert.equal(upstream.version, 1);
    assert.equal(upstream.revision.head, source.revision);
    assert.equal(upstream.revision.dirty, false);
    assert.equal(upstream.sourceSha256, evidence.source.sha256);
    assert.equal(upstream.sourceUnchanged, true);
    assert.equal(upstream.report.path, source.evidence);
    assert.equal(upstream.report.sha256, hash(originalEvidence));
    assert.deepEqual(
      upstream.files.map((file) => file.path).sort(),
      source.files.filter((file) => file !== 'export.json').sort(),
      'cancellation: incomplete upstream export inventory',
    );
  }
  const destination = path.join(root, 'docs/evidence', source.id);
  await mkdir(destination, { recursive: true });
  const files = [];
  const pendingWrites = [];
  for (const file of source.files) {
    const input = source.report
      ? path.join(repository, source.report, file)
      : path.join(repository, file === 'report.json' ? 'dist' : 'web', file);
    // A later source edit must not silently relabel the recorded renderer.
    // Its exact blob hash is checked against the captured manifest below.
    const original = source.id === 'change' && file !== 'report.json'
      ? (await exec('git', ['-C', repository, 'show', `${source.revision}:web/${file}`], {
          encoding: 'buffer',
          windowsHide: true,
          timeout: 10_000,
          maxBuffer: 2_000_000,
          env: Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^GIT_/i.test(name))),
        })).stdout
      : await readFile(input);
    if (upstream && file !== 'export.json') {
      assert.equal(
        hash(original),
        upstream.files.find((entry) => entry.path === file)?.sha256,
        'cancellation/' + file + ': upstream export bytes changed',
      );
    }
    if (source.id === 'change' && file !== 'report.json') {
      const expected = evidence.provenance.files.find((entry) => entry.path === `web/${file}`);
      assert.equal(
        hash(original),
        expected?.sha256,
        `change/${file}: source no longer matches the recorded run`,
      );
    }
    let text = original.toString('utf8');
    safeText(text, input);
    // Display-only accessibility corrections to the frozen renderer. Evidence stays exact.
    if (source.id === 'change') {
      if (file === 'index.html') {
        assert.ok(text.includes(' aria-label="Verified Change Lab home"'));
        text = text.replace(' aria-label="Verified Change Lab home"', '');
      }
      if (file === 'app.js') {
        const setter = "  document.querySelector('.brand').setAttribute('aria-label', t.home);";
        assert.ok(text.includes(setter));
        text = text.replace(setter, '');
      }
      if (file === 'style.css') {
        const rule = 'nav button span:first-child {\n  font-size: 10px;\n  color: #637184;\n}';
        assert.ok(text.includes(rule));
        text = text.replace(rule, rule.replace('#637184', '#53657d'));
      }
    }
    if (file.endsWith('.html')) {
      text = withReaderContext(text, source.id);
      text = text.replace('<body>', `<body>\n${banner}`);
      if (source.id === 'change')
        text = text
          .replaceAll('href="/style.css"', 'href="style.css"')
          .replaceAll('src="/app.js"', 'src="app.js"')
          .replaceAll('href="/report.json"', 'href="report.json"')
          .replaceAll('href="/"', 'href="./"');
    }
    if (file.endsWith('.css')) text += bannerCss + readerContextCss;
    if (file.endsWith('.js') && file !== source.recordedDataFile)
      text = text
        .replaceAll('intent-recovery.report.language', 'minjae.portfolio.language')
        .replaceAll('verified-change-language', 'minjae.portfolio.language')
        .replaceAll('cancellation-lab-language', 'minjae.portfolio.language')
        .replaceAll("fetch('/report.json')", "fetch('report.json')");
    if (source.id === 'intent' && file === 'report.js') {
      text = adaptEvidenceLanguage(text, source.id);
    }
    if (source.id === 'change' && file === 'app.js') {
      text = text
        .replaceAll(
          'Run pnpm experiment, then reload.',
          'The saved report could not be loaded. Reload this page or return to the portfolio.',
        )
        .replaceAll(
          'pnpm experiment 실행 후 새로고침하세요.',
          '저장된 실행 기록을 불러오지 못했습니다. 새로고침하거나 포트폴리오로 돌아가세요.',
        );
      text = adaptEvidenceLanguage(text, source.id);
    }
    if (source.id === 'cancellation') {
      text = adaptCancellationDisplay(file, text);
      if (file === 'debt.js') text = adaptEvidenceLanguage(text, source.id);
    }
    const output = Buffer.from(text);
    safeText(text, `bundled/${file}`);
    // Evidence JSON is transported byte-for-byte; only display assets are adapted.
    if (file === source.evidence || file === source.recordedDataFile || file === 'export.json')
      assert.equal(hash(output), hash(original));
    pendingWrites.push({ file, output });
    files.push({ path: file, sha256: hash(output) });
  }
  const recording = {
    kind: 'recorded-local-run',
    readOnly: true,
    repository: source.repository,
    sourceRevision,
    sourceDirty: false,
    generatedAt: source.id === 'intent' ? evidence.completedAt : evidence.generatedAt,
    sourceFingerprint:
      source.id === 'intent'
        ? evidence.sourceBefore.sha256
        : source.id === 'change'
          ? evidence.provenance.sourceFingerprint
          : evidence.source.sha256,
    originalEvidenceSha256: hash(originalEvidence),
    evidenceFile: source.evidence,
    ...(upstream
      ? {
          upstreamManifest: 'export.json',
          recordedDataFile: source.recordedDataFile,
          originalRecordedDataSha256: upstream.files.find(
            (file) => file.path === source.recordedDataFile,
          ).sha256,
        }
      : {}),
    displayAdaptations: [
      'relative asset URLs',
      'explicit URL language before shared preference; language controls update the URL and reading links',
      'Back/Forward language restoration; no render when the language is unchanged',
      'recorded-run banner with cool-toned presentation',
      'standalone bilingual scenario, term definitions and reading guide; original evidence unchanged',
      ...(source.id === 'change' ? ['saved-report load failure copy', 'visible brand name and higher-contrast case numbers'] : []),
      ...(source.id === 'cancellation'
        ? ['readable timeline width with keyboard scrolling', 'Korean execution-slot terminology', 'higher-contrast focus and chart series with unchanged data', 'language control name includes its visible label']
        : []),
    ],
    files,
  };
  for (const { file, output } of pendingWrites)
    await writeFile(path.join(destination, file), output);
  await writeFile(
    path.join(destination, 'recording.json'),
    JSON.stringify(recording, null, 2) + '\n',
  );
  console.log(
    `Bundled ${source.id}: ${sourceRevision.slice(0, 12)} · evidence unchanged · no private path markers`,
  );
}
