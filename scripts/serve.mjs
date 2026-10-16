import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const documentRoot = fileURLToPath(new URL('../docs/', import.meta.url));
const mediaTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
]);
const commonHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
};

// Capture one public directory at startup. Later requests never reopen a path.
// The local tree is trusted while capture runs; this is not a filesystem sandbox.
async function publicFiles(root, relative = '') {
  const result = new Map();
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      for (const [route, file] of await publicFiles(root, child)) result.set(route, file);
    } else if (entry.isFile() && mediaTypes.has(path.extname(child))) {
      const route = '/' + child.split(path.sep).join('/');
      result.set(route, {
        body: await readFile(path.join(root, child)),
        type: mediaTypes.get(path.extname(child)),
      });
      if (entry.name === 'index.html') result.set(route.slice(0, -10), result.get(route));
    }
  }
  return result;
}

export async function startPreview({ port = 4173, root = documentRoot } = {}) {
  if (!Number.isSafeInteger(port) || port < 0 || port > 65535)
    throw new RangeError('port must be an integer from 0 to 65535');
  const files = await publicFiles(root);
  const server = http.createServer(
    { requestTimeout: 5000, headersTimeout: 5000 },
    async (request, response) => {
      const reply = (status, text, headers = {}) => {
        response.writeHead(status, {
          ...commonHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
          ...headers,
        });
        response.end(request.method === 'HEAD' ? undefined : text);
      };
      const address = server.address();
      const expectedHosts = [`127.0.0.1:${address.port}`, `localhost:${address.port}`];
      if (!expectedHosts.includes(request.headers.host)) return reply(403, 'Host is not allowed');
      if (!['GET', 'HEAD'].includes(request.method))
        return reply(405, 'Method not allowed', { Allow: 'GET, HEAD' });
      if (!request.url?.startsWith('/') || request.url.startsWith('//'))
        return reply(400, 'Invalid request target');
      let route;
      try {
        route = new URL(request.url, 'http://127.0.0.1').pathname;
      } catch {
        return reply(400, 'Invalid request target');
      }
      const entry = files.get(route);
      if (!entry) return reply(404, 'Not found');
      try {
        const body = entry.body;
        response.writeHead(200, {
          ...commonHeaders,
          'Content-Type': entry.type,
          'Content-Length': body.length,
        });
        response.end(request.method === 'HEAD' ? undefined : body);
      } catch {
        reply(500, 'Unable to read portfolio file');
      }
    },
  );
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
  let stopping;
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    stop() {
      stopping ??= new Promise((resolve, reject) => {
        const timer = setTimeout(() => server.closeAllConnections(), 500);
        timer.unref();
        server.close((error) => {
          clearTimeout(timer);
          error ? reject(error) : resolve();
        });
        server.closeIdleConnections();
      });
      return stopping;
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isSafeInteger(port) || port < 1024 || port > 65535)
    throw new RangeError('PORT must be an integer from 1024 to 65535');
  const preview = await startPreview({ port });
  console.log(`Portfolio preview: ${preview.url}`);
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.once(signal, () => {
      void preview.stop().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
    });
}
