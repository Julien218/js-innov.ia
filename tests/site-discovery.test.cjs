const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
test('public discovery: crawlable content, schema, real sitemap and noindex on private pages', async () => {
  const { siteSeo } = await import('../server-site-seo.mjs');
  const dir = fs.mkdtempSync(join(tmpdir(), 'site-discovery-'));
  fs.writeFileSync(
    join(dir, 'index.html'),
    '<html><head><title>Old</title><meta name="description" content="old"/><meta name="robots" content="index"/><link rel="canonical" href="https://jsinnovia.com/"/></head><body><div id="root"></div></body></html>',
  );
  function request(path) {
    const out = {
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      writeHead(code, headers) {
        this.code = code;
        Object.assign(this.headers, headers);
      },
      end(body) {
        this.body = body;
      },
    };
    assert.equal(siteSeo({ method: 'GET' }, out, path, dir), true);
    return out;
  }
  const guide = request('/guides/preparer-sa-video');
  assert.match(guide.body, /Privilégiez les originaux/);
  assert.match(guide.body, /100 €/);
  assert.match(guide.body, /villeconnecteos/);
  const graph = JSON.parse(
    guide.body.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/s,
    )[1],
  );
  assert.equal(
    graph['@graph'].find((n) => n['@type'] === 'Article').dateModified,
    '2026-11-12',
  );
  const sitemap = request('/sitemap.xml');
  assert.match(sitemap.headers['Content-Type'], /application\/xml/);
  assert.match(sitemap.body, /guides\/preparer-sa-video/);
  assert.doesNotMatch(
    sitemap.body,
    /espace-video|studio-review|commander-video/,
  );
  const robots = request('/robots.txt');
  assert.match(robots.headers['Content-Type'], /text\/plain/);
  assert.match(robots.body, /Disallow: \/api\//);
  const privatePage = request('/espace-video');
  assert.match(privatePage.body, /noindex,nofollow,noarchive/);
  assert.doesNotMatch(privatePage.body, /site-content|<main/);
  assert.equal(privatePage.headers['Referrer-Policy'], 'no-referrer');
  fs.rmSync(dir, { recursive: true, force: true });
});
test('brand and demo assets have actual image headers', () => {
  for (const file of [
    'companion-avatar-256.webp',
    'companion-launcher-256.webp',
  ]) {
    const bytes = fs.readFileSync(
      join(__dirname, '../public/brand/companion', file),
    );
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  }
  for (const file of ['atelier-photo.webp', 'aura-photo.webp']) {
    const bytes = fs.readFileSync(join(__dirname, '../public/concepts', file));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  }
});

test('public network links use verified channels and distinct product identities', async () => {
 const {SOCIALS,NETWORK,EDITORIAL}=await import('../site-content.mjs');
 assert.equal(SOCIALS.find(s=>s.brand==='VilleConnect OS').url,'https://www.tiktok.com/@villeconnecteos');
 assert.equal(SOCIALS.find(s=>s.brand==='JS-Innov.IA').url,'https://www.youtube.com/@Js-innovia');
 assert.equal(new Set(NETWORK.map(n=>n.url)).size,NETWORK.length);
 assert.ok(Object.values(EDITORIAL).every(p=>p.sections.length>=5));
});
