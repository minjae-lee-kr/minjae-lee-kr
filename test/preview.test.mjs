import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import { mkdir, mkdtemp, rename, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startPreview } from '../scripts/serve.mjs';

test('preview keeps captured bytes when a public directory is replaced by an outside junction', async () => {
  const fixtureRoot = fileURLToPath(new URL('../test-results/', import.meta.url));
  await mkdir(fixtureRoot, { recursive: true });
  const fixture = await mkdtemp(path.join(fixtureRoot, 'boundary-'));
  const publicRoot = path.join(fixture, 'public');
  const outside = path.join(fixture, 'outside');
  const recorded = path.join(publicRoot, 'recorded');
  await mkdir(recorded, { recursive: true });
  await mkdir(outside);
  await writeFile(path.join(recorded, 'evidence.json'), '{"where":"captured public bytes"}');
  await writeFile(path.join(outside, 'evidence.json'), '{"where":"synthetic outside bytes"}');
  const preview = await startPreview({ port: 0, root: publicRoot });
  let linked = false;
  try {
    await rename(recorded, path.join(publicRoot, 'original-recorded'));
    await symlink(outside, recorded, process.platform === 'win32' ? 'junction' : 'dir');
    linked = true;
    const response = await fetch(preview.url + '/recorded/evidence.json');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { where: 'captured public bytes' });
    assert.equal((await fetch(preview.url + '/original-recorded/evidence.json')).status, 404);
  } finally {
    await preview.stop();
    if (linked) await unlink(recorded);
    assert.equal(path.dirname(path.resolve(fixture)), path.resolve(fixtureRoot));
    await rm(fixture, { recursive: true, force: true });
  }
});

test('preview serves public assets, HEAD metadata and clear method errors', async () => {
  const preview = await startPreview({ port: 0 });
  try {
    const page = await fetch(preview.url);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Minjae Lee — Engineering Labs/);
    assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
    assert.match(page.headers.get('content-security-policy'), /object-src 'none'/);
    const head = await fetch(preview.url, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get('content-length'), page.headers.get('content-length'));
    assert.equal(await head.text(), '');
    for (const asset of ['styles.css', 'portfolio.js'])
      assert.equal((await fetch(`${preview.url}/${asset}`)).status, 200);
    const post = await fetch(preview.url, { method: 'POST', body: 'not accepted' });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get('allow'), 'GET, HEAD');
  } finally {
    await preview.stop();
  }
});

test('private source, hidden files and traversal are not exposed', async () => {
  const preview = await startPreview({ port: 0 });
  try {
    for (const route of [
      '/README.md',
      '/package.json',
      '/.git/config',
      '/../scripts/serve.mjs',
      '/%2e%2e/README.md',
      '/does-not-exist',
    ]) {
      assert.equal((await fetch(preview.url + route)).status, 404, route);
    }
    const response = await new Promise((resolve, reject) => {
      const request = http.get(preview.url, { headers: { host: 'unrelated.example' } }, resolve);
      request.on('error', reject);
    });
    assert.equal(response.statusCode, 403);
    response.resume();
  } finally {
    await preview.stop();
  }
});

test('shutdown is idempotent and bounded with an unfinished request', async () => {
  const preview = await startPreview({ port: 0 });
  const url = new URL(preview.url);
  const socket = net.createConnection({ host: url.hostname, port: Number(url.port) });
  await new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });
  socket.write(`GET / HTTP/1.1\r\nHost: ${url.host}\r\nX-Unfinished: `);
  try {
    const result = await Promise.race([
      Promise.all([preview.stop(), preview.stop()]).then(() => 'closed'),
      new Promise((resolve) => {
        const timer = setTimeout(() => resolve('stuck'), 2000);
        timer.unref();
      }),
    ]);
    assert.equal(result, 'closed');
    await preview.stop();
  } finally {
    socket.destroy();
  }
});
