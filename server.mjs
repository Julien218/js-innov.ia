import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { extname, join, normalize } from 'node:path';

const dist = join(process.cwd(), 'dist');
const port = Number.parseInt(process.env.PORT || '8080', 10);
const agentUrl = (process.env.JSINNOVIA_AGENT_URL || 'https://jsinnovia-agent-production.up.railway.app').replace(/\/$/, '');
const agentKey = process.env.AGENT_API_KEY || process.env.JSINNOVIA_AGENT_KEY || '';
const rateLimits = new Map();
const MAX_RATE_LIMIT_CLIENTS = 5_000;
const AGENT_TIMEOUT_MS = 20_000;
const publicReadTables = new Set(['Application', 'Automation', 'BlogPost', 'DynamicPage', 'Event', 'Innovation', 'MusicProduct', 'News', 'Showcase', 'Template']);
const publicWriteTables = new Set(['Contact', 'EventTicket', 'FormSubmission', 'Lead', 'LogoSubmission', 'ProjectRequest']);
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

const json = (response, status, value) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
};

const setSecurityHeaders = (response) => {
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
};

const readJson = async (request) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error('payload-too-large');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
};

const allow = (request) => {
  const key = request.headers['x-forwarded-for']?.split(',')[0]?.trim() || request.socket.remoteAddress || 'anonymous';
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    if (rateLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
      for (const [client, entry] of rateLimits) {
        if (entry.resetAt <= now) rateLimits.delete(client);
      }
      while (rateLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
        rateLimits.delete(rateLimits.keys().next().value);
      }
    }
    rateLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 30;
};

const agentFetch = async (path, options = {}) => {
  if (!agentKey) throw new Error('Agent API key missing');
  return fetch(`${agentUrl}${path}`, {
    ...options,
    signal: options.signal || AbortSignal.timeout(AGENT_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json', 'x-agent-key': agentKey, ...(options.headers || {}) },
  });
};

const proxyAgent = async (request, response, path) => {
  const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await readJson(request) : undefined;
  const upstream = await agentFetch(path, { method: request.method, body: body ? JSON.stringify(body) : undefined });
  const text = await upstream.text();
  response.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' });
  response.end(text);
};

const systemPrompt = `Tu es le compagnon public officiel de JS-Innov.IA. Réponds uniquement en français, de façon chaleureuse, claire et concise. Présente les solutions IA, automatisations, applications sur mesure, création web, SEO, contenus et musiques libres de droits sans inventer de prix ni de garanties. Oriente vers Contact ou une demande de devis lorsque pertinent. Ne révèle aucune donnée interne et refuse les actions administratives.`;

createServer(async (request, response) => {
  setSecurityHeaders(response);
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    return json(response, 400, { error: 'URL invalide' });
  }
  if (pathname === '/api/health') return json(response, 200, { status: 'ok', service: 'js-innovia-site', backend: 'nova' });
  if (pathname.startsWith('/api/platform/')) {
    if (!allow(request)) return json(response, 429, { error: 'Trop de requêtes. Réessayez dans une minute.' });
    try {
      const url = new URL(request.url, 'http://localhost');
      if (pathname.startsWith('/api/platform/data/')) {
        const suffix = pathname.slice('/api/platform/data/'.length);
        if (!/^[A-Za-z][A-Za-z0-9_]*(\/[A-Za-z0-9_-]+)?$/.test(suffix)) return json(response, 400, { error: 'Ressource invalide' });
        const table = suffix.split('/')[0];
        const canRead = request.method === 'GET' && publicReadTables.has(table);
        const canWrite = request.method === 'POST' && publicWriteTables.has(table) && !suffix.includes('/');
        if (!canRead && !canWrite) return json(response, 403, { error: 'Cette opération est réservée au cockpit NOVA' });
        const upstreamSuffix = request.method === 'POST' && table === 'Lead' ? 'Contact' : suffix;
        return await proxyAgent(request, response, `/data/${upstreamSuffix}${url.search}`);
      }

      if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return json(response, 405, { error: 'Méthode non autorisée' });
      }
      const body = await readJson(request);
      if (pathname === '/api/platform/functions/publicChat') {
        const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
        const transcript = messages.map(({ role, content }) => `${role === 'assistant' ? 'Compagnon' : 'Visiteur'}: ${String(content || '').slice(0, 1000)}`).join('\n');
        if (!transcript) return json(response, 400, { error: 'Message requis' });
        const upstream = await agentFetch('/chat', { method: 'POST', body: JSON.stringify({ message: `${systemPrompt}\n\n${transcript}`, session_id: `public-${randomUUID()}`, security: { assistant: 'public', actions: false } }) });
        const data = await upstream.json().catch(() => ({}));
        if (!upstream.ok) return json(response, 502, { error: 'Compagnon momentanément indisponible' });
        return json(response, 200, { message: data.response || data.reply || data.message });
      }
      if (pathname === '/api/platform/functions/receiveLead') {
        const upstream = await agentFetch('/data/Contact', { method: 'POST', body: JSON.stringify(body) });
        return json(response, upstream.ok ? 200 : 502, await upstream.json().catch(() => ({})));
      }
      if (pathname === '/api/platform/llm') {
        const upstream = await agentFetch('/chat', { method: 'POST', body: JSON.stringify({ message: String(body.prompt || ''), session_id: `site-${randomUUID()}` }) });
        const data = await upstream.json().catch(() => ({}));
        return json(response, upstream.ok ? 200 : 502, data.response || data.reply || data.message ? { response: data.response || data.reply || data.message } : data);
      }
      return json(response, 501, { error: 'Fonction disponible uniquement dans NOVA' });
    } catch (error) {
      console.error('[platform]', error.message);
      return json(response, error.message === 'payload-too-large' ? 413 : 502, { error: 'Service NOVA momentanément indisponible' });
    }
  }
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
