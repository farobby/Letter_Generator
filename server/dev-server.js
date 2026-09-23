import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { handleGenerate } from './routes/generate.js';

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png',
};

// Local development server, not a production/authentication backend.
const server = createServer(async (request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Bad request'); return; }
  if (pathname === '/generate' && request.method === 'POST') {
    handleGenerate(request, response);
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405); response.end('Method not allowed'); return;
  }
  const target = resolve(publicRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(resolve(publicRoot) + sep)) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  try {
    const contents = await readFile(target);
    response.writeHead(200, {
      'Content-Type': mime[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.on('error', error => { console.error(`Server gagal: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`SPPG Modular: http://localhost:${port}`));
