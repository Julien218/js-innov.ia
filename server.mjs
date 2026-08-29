import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { extname, join, normalize } from 'node:path';

const dist = join(process.cwd(), 'dist');
const port = Number.parseInt(process.env.PORT || '8080', 10);
const agentUrl = (process.env.JSINNOVIA_AGENT_URL || 'https://jsinnovia-agent-production.up.railway.app').replace(/\/$/, '');
const elyneaUrl = (process.env.ELYNEA_NOVA_URL || 'https://cockpit.jsinnovia.com/api/public/elynea/chat').trim();
const elyneaSubmitUrl = (process.env.ELYNEA_SUBMIT_URL || elyneaUrl.replace(/\/chat\/?$/, '/submit')).trim();
const elyneaSiteKey = process.env.ELYNEA_SITE_KEY || '';
const playerDownloadUrl = (process.env.PIXELIUM_PLAYER_DOWNLOAD_URL || 'https://olivier-signage-cockpit-production.up.railway.app/api/player-download/latest').trim();
const agentKey = process.env.AGENT_API_KEY || process.env.JSINNOVIA_AGENT_KEY || '';
const rateLimits = new Map();
const MAX_RATE_LIMIT_CLIENTS = 5_000;
const AGENT_TIMEOUT_MS = 20_000;
const publicReadTables = new Set(['Application', 'Automation', 'BlogPost', 'DynamicPage', 'Event', 'Innovation', 'MusicProduct', 'News', 'Showcase', 'Template']);
const publicWriteTables = new Set(['Contact', 'EventTicket', 'FormSubmission', 'Lead', 'LogoSubmission', 'ProjectRequest']);
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
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

const isSensitiveProbePath = (pathname) => {
  const lower = pathname.toLowerCase();
  return /(^|\/)\.(env|git|svn|hg)(\/|$)/.test(lower)
    || lower.includes('/.vscode/')
    || lower.endsWith('/.ds_store')
    || lower === '/env'
    || lower === '/config.json'
    || lower === '/info.php'
    || lower === '/server-status'
    || lower.startsWith('/actuator/')
    || lower.startsWith('/telescope/')
    || lower.startsWith('/debug/')
    || lower.startsWith('/@vite/')
    || lower.startsWith('/___proxy_subdomain_')
    || lower === '/v2/_catalog';
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
      for (const [client, entry] of rateLimits) if (entry.resetAt <= now) rateLimits.delete(client);
      while (rateLimits.size >= MAX_RATE_LIMIT_CLIENTS) rateLimits.delete(rateLimits.keys().next().value);
    }
    rateLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 30;
};

const agentFetch = async (path, options = {}) => fetch(`${agentUrl}${path}`, {
  ...options,
  signal: options.signal || AbortSignal.timeout(AGENT_TIMEOUT_MS),
  headers: { 'Content-Type': 'application/json', 'x-agent-key': agentKey, ...(options.headers || {}) },
});

const proxyAgent = async (request, response, path) => {
  const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? await readJson(request) : undefined;
  const upstream = await agentFetch(path, { method: request.method, body: body ? JSON.stringify(body) : undefined });
  const text = await upstream.text();
  response.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' });
  response.end(text);
};

const INTERNAL_DETAILS = /(?:\brailway\b|\bsupabase\b|\bbase44\b|\bgithub\b|\bcomfyui\b|\bopenai\b|\bgrok\b|\bsora\b|\bclé(?:s)? api\b|\bapi key\b|\btoken(?:s)?\b|\bjeton(?:s)?\b|\bprompt(?:s)?(?: système)?\b|\bagent(?:s)? interne(?:s)?\b|\borchestration interne\b|\bmode(?:s)? de production\b|\bpipeline(?:s)? interne(?:s)?\b|\bdépôt(?:s)? (?:git|de code)\b|\brepositor(?:y|ies)\b|\bvariable(?:s)? d'environnement\b)/i;

const commercialFallback = (messages = []) => {
  const request = String(messages.at(-1)?.content || '').toLowerCase();
  if (/site|seo|référencement/.test(request)) return "Nous pouvons vous accompagner pour créer un site ou améliorer l’existant, avec une attention particulière portée à l’image, aux conversions et au référencement. Souhaitez-vous créer un nouveau site ou optimiser celui que vous avez déjà ?";
  if (/automat|tâche|workflow|processus/.test(request)) return "Nous pouvons identifier et automatiser les tâches répétitives afin de vous faire gagner du temps. Quelle opération vous prend aujourd’hui le plus de temps ?";
  if (/assistant|chatbot|agent ia|intelligence artificielle/.test(request)) return "Nous pouvons concevoir un assistant adapté à votre activité pour informer, qualifier les demandes ou faciliter le suivi client. Votre priorité concerne-t-elle l’accueil, la vente ou le support ?";
  return "Merci pour votre message. Je peux vous orienter vers la solution JS-Innov.IA la plus adaptée : quel résultat souhaitez-vous obtenir en priorité pour votre entreprise ?";
};

const safeCommercialMessage = (value, messages) => {
  const answer = String(value || '').trim().slice(0, 4000);
  return answer && !INTERNAL_DETAILS.test(answer) ? answer : commercialFallback(messages);
};

const serveStaticFile = (request, response, filePath) => {
  const size = statSync(filePath).size;
  const contentType = mime[extname(filePath).toLowerCase()] || 'application/octet-stream';
  const cacheControl = filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable';
  const range = request.headers.range;

  response.setHeader('Accept-Ranges', 'bytes');
  response.setHeader('Cache-Control', cacheControl);
  response.setHeader('Content-Type', contentType);

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match || (!match[1] && !match[2])) {
      response.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return response.end();
    }

    const suffixLength = match[1] ? null : Number.parseInt(match[2], 10);
    const start = suffixLength === null ? Number.parseInt(match[1], 10) : Math.max(size - suffixLength, 0);
    const requestedEnd = match[2] && suffixLength === null ? Number.parseInt(match[2], 10) : size - 1;
    const end = Math.min(requestedEnd, size - 1);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= size) {
      response.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return response.end();
    }

    response.writeHead(206, {
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${size}`,
    });
    if (request.method === 'HEAD') return response.end();
    return createReadStream(filePath, { start, end }).pipe(response);
  }

  response.writeHead(200, { 'Content-Length': size });
  if (request.method === 'HEAD') return response.end();
  return createReadStream(filePath).pipe(response);
};

createServer(async (request, response) => {
  setSecurityHeaders(response);
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { return json(response, 400, { error: 'URL invalide' }); }

  if (isSensitiveProbePath(pathname)) return json(response, 404, { error: 'Not found' });

  if (pathname === '/p' || pathname === '/player') {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return json(response, 405, { error: 'Méthode non autorisée' });
    }
    response.writeHead(302, { Location: playerDownloadUrl, 'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', 'X-Robots-Tag': 'noindex, nofollow, noarchive' });
    return response.end();
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
      if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return json(response, 405, { error: 'Méthode non autorisée' }); }
      const body = await readJson(request);
      if (pathname === '/api/platform/functions/publicChat') {
        const messages = Array.isArray(body.messages) ? body.messages.slice(-10).map(({ role, content }) => ({
          role: role === 'assistant' ? 'assistant' : 'user',
          content: String(content || '').slice(0, 1000),
        })).filter(({ content }) => content.trim()) : [];
        if (!messages.length) return json(response, 400, { error: 'Message requis' });
        try {
          const upstream = await fetch(elyneaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
            signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
          });
          const data = await upstream.json().catch(() => ({}));
          return json(response, 200, {
            message: safeCommercialMessage(upstream.ok ? data.message : '', messages),
            source: upstream.ok ? 'nova' : 'guided-fallback',
            qualification: upstream.ok && data.qualification ? data.qualification : { can_submit: false, handoff_suggested: false },
          });
        } catch (_error) {
          return json(response, 200, { message: commercialFallback(messages), source: 'guided-fallback', qualification: { can_submit: false, handoff_suggested: false } });
        }
      }
      if (pathname === '/api/platform/functions/submitElyneaRequest') {
        if (!elyneaSiteKey || elyneaSiteKey.length < 32) {
          console.error('[elynea] ELYNEA_SITE_KEY is missing or too short');
          return json(response, 503, { error: 'La demande n’a pas été transmise. Merci de réessayer plus tard.' });
        }
        try {
          const upstream = await fetch(elyneaSubmitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-elynea-site-key': elyneaSiteKey },
            body: JSON.stringify({
              messages: Array.isArray(body.messages) ? body.messages.slice(-10) : [],
              contact: body.contact || {},
              consent: body.consent === true,
              idempotency_key: String(body.idempotency_key || ''),
            }),
            signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
          });
          const data = await upstream.json().catch(() => ({}));
          if (!upstream.ok || data.transmitted !== true || data.verified !== true || !data.request_id || !data.journal_id) {
            console.error('[elynea] Cockpit handoff rejected:', upstream.status, data.error || 'missing proof');
            return json(response, 502, { error: 'La demande n’a pas été transmise. Vérifiez vos informations puis réessayez.' });
          }
          return json(response, 201, {
            transmitted: true,
            verified: true,
            request_id: data.request_id,
            journal_id: data.journal_id,
            status: data.status,
          });
        } catch (error) {
          console.error('[elynea] Cockpit handoff failed:', error.message);
          return json(response, 502, { error: 'La demande n’a pas été transmise. Merci de réessayer.' });
        }
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
  if (!filePath.startsWith(dist) || !existsSync(filePath) || !statSync(filePath).isFile()) filePath = join(dist, 'index.html');

  if (pathname === '/hainoflow' || pathname === '/catalogue-tarifs-brouillon') {
    response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return serveStaticFile(request, response, filePath);
}).listen(port, '0.0.0.0', () => console.log(`JS-Innov.IA listening on 0.0.0.0:${port}`));
