// Editorial social cards: vector type and diagrams, never screenshots of results.
// Tool-only requirements: fontkit 2.0.4 and sharp 0.35.5. They may be supplied
// through NODE_PATH; neither package is a dependency of the published website.
// node scripts/generate-social-cards.mjs --font <SUIT-Variable.ttf>
//   [--preview-dir <private-directory>]
// Use the OFL-licensed TTF from https://github.com/sun-typeface/SUIT:
// fonts/variable/ttf/SUIT-Variable.ttf (blob8082a4844fe9e8f385175859638e1b733b521d1b).
// TTF is supplied as build input, not published twice beside the website WOFF2.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');
const sharp = require('sharp');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'docs/assets/social');
const args = process.argv.slice(2), options = new Map();
for (let i = 0; i < args.length; i += 2) {
  if (!['--font', '--preview-dir'].includes(args[i]) || !args[i + 1] || options.has(args[i])) throw new Error('Usage: --font <SUIT-Variable.ttf> [--preview-dir <directory>]');
  options.set(args[i], resolve(args[i + 1]));
}
if (!options.has('--font')) throw new Error('--font requires the official SUIT variable TTF build input.');
const preview = options.get('--preview-dir') ?? null;
const fontBytes = await readFile(options.get('--font'));
const fontSha256 = createHash('sha256').update(fontBytes).digest('hex');
if (fontSha256 !== '12e1fea375d27869a686d7432c1e6a38154d394994f5d82ace24f36a7db68333') throw new Error('Font differs from the pinned official SUIT TTF.');
const font = fontkit.create(fontBytes);
const faces = new Map();
const c = { paper: '#f5f7fb', white: '#ffffff', ink: '#13233c', muted: '#4c617d', blue: '#245bd5', pale: '#e3eaf8', line: '#c7d3e5', light: '#95b6ff', darkLine: '#526b8f' };
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const metrics = [];
let id;
function type(x, y, value, size = 24, fill = c.ink, weight = 500, max = 1080) {
  if (!faces.has(weight)) faces.set(weight, font.getVariation({ wght: weight }));
  const face = faces.get(weight), run = face.layout(value);
  if (run.glyphs.some(g => g.id === 0)) throw new Error(`Missing glyph in ${id}`);
  const advance = run.positions.reduce((sum, pos) => sum + pos.xAdvance, 0);
  const scale = size / face.unitsPerEm;
  if (advance * scale > max) throw new Error(`Text exceeds its allotted width: ${id}/${value}`);
  let cursor = 0;
  const paths = run.glyphs.map((glyph, i) => {
    const pos = run.positions[i];
    const path = `<path d="${glyph.path.toSVG()}" transform="translate(${cursor + pos.xOffset} ${pos.yOffset})"/>`;
    cursor += pos.xAdvance;
    return path;
  }).join('');
  metrics.push({ id, text: value, size, width: advance * scale, x, y });
  return `<g aria-label="${esc(value)}" fill="${fill}" transform="translate(${x} ${y}) scale(${scale} ${-scale})">${paths}</g>`;
}
const line = (x1, y1, x2, y2, stroke = c.line, width = 2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const path = (d, stroke = c.blue, width = 4, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const circle = (x, y, r, fill = c.blue, stroke = 'none', width = 0) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const rect = (x, y, w, h, fill = 'none', stroke = c.line, width = 2, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const check = (x, y, s = 1, color = c.blue, width = 7) => path(`M${x - 23 * s} ${y}l${15 * s} ${16 * s} ${35 * s} ${-39 * s}`, color, width);

function intent() {
  return type(814, 173, 'ONE RETRY KEY', 22, c.muted, 650)
    + circle(852, 223, 23, 'none', c.ink, 5) + path('M875 223H1100M1054 223V239M1080 223V239', c.ink, 5)
    + path('M961 250V281', c.line, 3)
    + rect(826, 293, 280, 68, c.paper, c.line, 2, 0, 'stroke-dasharray="5 7"')
    + type(851, 337, 'record expired', 29, c.muted, 500, 230)
    + path('M965 374V395M965 395H860V425M965 395H1070V425', c.blue, 4)
    + circle(860, 444, 18) + circle(1070, 444, 18)
    + type(816, 497, 'TWO POSSIBLE EFFECTS', 22, c.muted, 650, 310);
}
function change() {
  return type(817, 174, 'CANDIDATE SETTINGS', 22, c.muted, 650, 320)
    + rect(814, 200, 302, 215, c.white, c.line, 2, 12)
    + type(840, 253, 'noCheck: true', 32, c.ink, 650, 255)
    + line(840, 279, 1090, 279)
    + circle(893, 345, 30, c.pale) + check(893, 346, .64, c.blue, 5)
    + type(943, 358, 'PASS', 37, c.blue, 750, 150)
    + line(966, 430, 966, 461, c.line, 3)
    + type(823, 499, 'WHO DEFINES PASS?', 25, c.muted, 650, 310);
}
function cancellation() {
  return type(811, 175, 'WAIT', 23, c.muted, 650) + type(1014, 175, 'WORK', 23, c.muted, 650)
    + path('M848 200V295', c.muted, 7)
    + circle(848, 302, 10, c.muted)
    + line(795, 302, 1114, 302, c.line, 2, 'stroke-dasharray="4 7"')
    + path('M1053 200V457', c.blue, 8)
    + path('M1040 444l13 14 13-14', c.blue, 5)
    + type(800, 354, 'deadline', 23, c.muted, 500, 180)
    + type(798, 498, 'STILL RUNNING', 28, c.blue, 700, 320);
}
function guards() {
  return type(817, 175, 'FINDINGS', 23, c.muted, 650)
    + type(862, 315, '0', 142, c.ink, 650, 210)
    + line(814, 348, 1116, 348, c.line, 2)
    + type(815, 402, 'CHECKED', 23, c.muted, 650)
    + type(1022, 454, '?', 104, c.blue, 650, 100)
    + type(814, 499, 'COVERAGE MATTERS', 24, c.muted, 650, 310);
}
function article() {
  return type(817, 175, 'CHECK PASSED', 24, c.light, 700, 265)
    + check(1095, 167, .46, c.light, 4)
    + line(821, 228, 821, 478, c.darkLine, 3)
    + circle(821, 246, 5, c.light) + type(843, 259, 'Which code?', 33, c.white, 550, 280)
    + circle(821, 333, 5, c.light) + type(843, 346, 'Which rules?', 33, c.white, 550, 280)
    + circle(821, 419, 5, c.light) + type(843, 431, 'What can it', 33, c.white, 550, 280)
    + type(843, 473, 'change?', 33, c.white, 550, 280);
}
function home() {
  return path('M844 181V460M968 181V460M1092 181V460', c.line, 2)
    + circle(844, 237, 16, c.ink) + circle(968, 326, 16, c.blue) + circle(1092, 410, 16, c.ink)
    + path('M844 237C922 237 891 326 968 326S1016 410 1092 410', c.blue, 5)
    + type(799, 500, 'EVIDENCE FIRST', 28, c.blue, 650, 330);
}
function consumer() {
  return type(812, 174, 'QUERY VALIDATION', 22, c.muted, 650, 320)
    + type(814, 239, 'new schema', 34, c.ink, 650, 255) + check(1094, 229, .65, c.blue, 5)
    + line(815, 276, 1115, 276, c.line)
    + type(812, 332, 'TYPE COMPILATION', 22, c.muted, 650, 320)
    + type(814, 396, 'old types', 34, c.ink, 650, 255) + check(1094, 386, .65, c.blue, 5)
    + type(813, 497, 'DIFFERENT INPUTS', 25, c.muted, 650, 320);
}
const cards = [
  { id: 'intent', label: '01 / INTENT & RECOVERY', title: ['Same key.', 'Twice?'], ko: '같은 키인데, 왜 두 번 처리됐을까?', diagram: intent,
    alt: 'Same key. Twice? A retained retry key passes an expired record and branches into two possible effects. Concept diagram for an independent retention experiment.' },
  { id: 'change', label: '02 / VERIFIED CHANGE', title: ['Green checks.', 'Wrong rules?'], ko: '검사도 통과 기준도 함께 바뀌었다면?', diagram: change,
    alt: 'Green checks. Wrong rules? A candidate setting says noCheck: true beside a passing check, asking who defines pass. Concept diagram for an independent Git verification experiment.' },
  { id: 'cancellation', label: '03 / CANCELLATION DEBT', title: ['The wait ended.', 'The work didn’t.'], ko: '대기가 끝나도 작업은 남을 수 있습니다.', diagram: cancellation,
    alt: 'The wait ended. The work did not. A caller wait ends at a deadline while a separate work line continues. Concept diagram, not a measured duration.' },
  { id: 'guards', label: '04 / EMPTY CHECK GUARDS', title: ['Nothing found.', 'Nothing checked?'], ko: '문제가 없었을까, 검사가 없었을까?', diagram: guards,
    alt: 'Nothing found. Nothing checked? Zero findings sits above an unknown checked count. Concept diagram showing why empty findings do not establish coverage.' },
  { id: 'consumer', label: '05 / GENERATED CONSUMER TYPES', title: ['Both passed.', 'Same contract?'], ko: '두 검사는 같은 변경을 봤을까?', diagram: consumer,
    alt: 'Both passed. Same contract? Query validation uses a new schema while type compilation uses old generated types. Concept diagram of two passing checks with different inputs.' },
  { id: 'article', label: 'ENGINEERING / A QUESTION OF EVIDENCE', title: ['Your AI agent', 'passed.', 'What did it prove?'], ko: '통과 결과에는 무엇이 빠져 있을까요?', diagram: article, dark: true,
    alt: 'Your AI agent passed. What did it prove? Below check passed, an audit list asks which code, which rules, and what it can change. Editorial illustration, not an actual run or model benchmark.' },
  { id: 'home', label: 'FRONTEND / COMMERCE / DEVELOPER TOOLS', title: ['Build the feature.', 'Question the proof.'], ko: '기능을 넘어, 믿을 수 있는 근거까지.', diagram: home,
    alt: 'Build the feature. Question the proof. Three connected observations illustrate independent engineering experiments on recovery, verification and cancellation.' },
];
await mkdir(target, { recursive: true });
if (preview) await mkdir(preview, { recursive: true });
const outputs = [];
for (const card of cards) {
  id = card.id;
  const dark = Boolean(card.dark), fg = dark ? c.white : c.ink, sub = dark ? '#bdcbe1' : c.muted;
  const title = card.title.map((text, index) => type(64, 214 + index * 88, text, index === 2 ? 64 : 76, index === card.title.length - 1 ? (dark ? c.light : c.blue) : fg, 720, 718)).join('');
  const koY = card.title.length === 3 ? 449 : 369;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc"><title id="title">${esc(card.title.join(' '))}</title><desc id="desc">${esc(card.alt)} ${esc(card.ko)}</desc>
<rect width="1200" height="630" fill="${dark ? c.ink : c.paper}"/>
${rect(64, 42, 8, 24, dark ? c.light : c.blue, 'none')}${type(87, 63, 'MINJAE LEE', 20, fg, 700, 300)}${type(917, 63, 'ENGINEERING NOTES', 18, sub, 600, 230)}
${line(64, 89, 1136, 89, dark ? c.darkLine : c.line)}
${type(64, 137, card.label, 18, sub, 650, 700)}
${title}${type(66, koY, card.ko, 30, sub, 500, 704)}
${card.diagram()}
${line(64, 553, 1136, 553, dark ? c.darkLine : c.line)}
${type(64, 594, card.id === 'home' ? 'Independent engineering experiments' : card.id === 'article' ? 'Engineering essay · conceptual illustration' : 'Independent lab · conceptual illustration', 21, sub, 450, 830)}
${type(1033, 594, 'M · L', 23, fg, 650, 103)}
</svg>\n`;
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  const info = await sharp(png).metadata();
  if (info.width !== 1200 || info.height !== 630) throw new Error('Unexpected image size');
  await writeFile(join(target, `${id}.svg`), svg);
  await writeFile(join(target, `${id}.png`), png);
  if (preview) await sharp(png).resize({ width: 390 }).png().toFile(join(preview, `${id}-390.png`));
  outputs.push({ id, title: card.title.join(' '), ko: card.ko, alt: card.alt, width: 1200, height: 630, pngBytes: png.length, svgSha256: createHash('sha256').update(svg).digest('hex'), pngSha256: createHash('sha256').update(png).digest('hex') });
}
const fontkitPackage = JSON.parse(await readFile(resolve(dirname(require.resolve('fontkit')), '../package.json'), 'utf8'));
const manifest = { renderer: { fontkit: fontkitPackage.version, sharp: sharp.versions.sharp }, font: { name: 'SUIT Variable', source: 'https://github.com/sun-typeface/SUIT/blob/main/fonts/variable/ttf/SUIT-Variable.ttf', gitBlob: '8082a4844fe9e8f385175859638e1b733b521d1b', license: 'docs/assets/fonts/SUIT-LICENSE.txt', sha256: fontSha256 }, palette: c, outputs, textMetrics: metrics };
if (preview) await writeFile(join(preview, 'cards-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ renderer: manifest.renderer, outputs }, null, 2));
