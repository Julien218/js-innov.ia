import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const dist = join(process.cwd(), 'dist');
const port = Number.parseInt(process.env.PORT || '8080', 10);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = normalize(pathname).replace(/^([/\\])+/, '');
  let filePath = join(dist, relativePath);

  if (!filePath.startsWith(dist) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(dist, 'index.html');
  }

  response.setHeader('Content-Type', mime[extname(filePath).toLowerCase()] || 'application/octet-stream');
  response.setHeader('Cache-Control', filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable');
  createReadStream(filePath).pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`JS-Innov.IA listening on 0.0.0.0:${port}`);
});
