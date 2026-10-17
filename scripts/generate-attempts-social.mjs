// Editorial social cards: vector type and diagrams, never screenshots of results.
// Tool-only requirements: fontkit 2.0.4 and sharp 0.35.5. They may be supplied
// through NODE_PATH; neither package is a dependency of the published website.
// node scripts/generate-attempts-social.mjs --font <SUIT-Variable.ttf>
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

id = 'react-attempts';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc"><title id="title">The state is guarded. Is the cache?</title><desc id="desc">Concept illustration comparing an application-state guard after automatic cache writes with acceptance before a manual write. Not a runtime trace.</desc>
<rect width="1200" height="630" fill="${c.paper}"/>
${type(64,64,'MINJAE LEE / ENGINEERING NOTES',20,c.ink,650)}
${line(64,92,1136,92)}
${type(64,145,'REACT · APOLLO CLIENT · CONTROLLED RESPONSE ORDER',18,c.muted,650)}
${type(64,238,'The state is guarded.',66,c.ink,720,1080)}
${type(64,322,'Is the cache?',66,c.blue,720,1080)}
${type(67,383,'요청 상태를 보호하면 캐시도 안전할까요?',29,c.muted,500,1060)}
${rect(64,426,516,76,c.white,c.line,1,9)}
${rect(600,426,536,76,c.pale,c.line,1,9)}
${type(88,474,'response > cache > guard',25,c.ink,650,470)}
${type(626,474,'response > guard > cache',25,c.blue,650,480)}
${line(64,548,1136,548)}
${type(64,592,'Independent experiment / Concept illustration, not a recording',20,c.muted,500,1040)}
</svg>\n`;
await mkdir(target,{recursive:true});
const png = await sharp(Buffer.from(svg)).png({compressionLevel:9}).toBuffer();
await writeFile(join(target,'react-attempts.svg'),svg);
await writeFile(join(target,'react-attempts.png'),png);
console.log(JSON.stringify({width:1200,height:630,fontSha256,svgSha256:createHash('sha256').update(svg).digest('hex'),pngSha256:createHash('sha256').update(png).digest('hex')}));
