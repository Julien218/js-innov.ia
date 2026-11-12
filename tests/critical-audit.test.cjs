const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('legacy checkout and confirmation routes cannot collect cards or assert a browser-only payment', () => {
  for (const page of ['Checkout', 'PaymentSuccess', 'OrderConfirmation']) {
    const source = fs.readFileSync(path.join(root, 'src/pages', `${page}.jsx`), 'utf8');
    assert.match(source, /PurchaseUnavailable/);
    assert.doesNotMatch(source, /cardNumber|cardCvc|lastOrder|Paiement réussi|Commande confirmée/);
  }
});

test('canonical URLs and parent-frame navigation messages exclude tokens and query parameters', () => {
  const source = fs.readFileSync(path.join(root,'src/lib/NavigationTracker.jsx'),'utf8');
  assert.doesNotMatch(source,/window\.location\.href/);
  assert.match(source,/canonical\.href = canonicalUrl/);
  assert.match(source,/window\.location\.origin \+ window\.location\.pathname/);
});

test('HTTP discovery returns truthful statuses, private noindex, canonical metadata and proper robots formats', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsinnovia-audit-'));
  fs.mkdirSync(path.join(dir, 'dist'));
  fs.writeFileSync(path.join(dir, 'dist/index.html'), fs.readFileSync(path.join(root, 'index.html')));
  fs.writeFileSync(path.join(dir, 'dist/logo.png'), 'fixture');
  const net = require('node:net');
  const reservation = net.createServer();
  await new Promise(r => reservation.listen(0, '127.0.0.1', r));
  const port = reservation.address().port;
  await new Promise(r => reservation.close(r));
  const server = spawn(process.execPath, [path.join(root, 'server.mjs')], { cwd: dir, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(async () => { server.kill(); await new Promise(r => server.exitCode !== null ? r() : server.once('exit', r)); fs.rmSync(dir, {recursive:true,force:true}); });
  await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error('server readiness timeout')), 5000); server.stdout.on('data', chunk => { if (chunk.toString().includes('listening')) { clearTimeout(timer); resolve(); } }); server.once('error', reject); });
  const base = `http://127.0.0.1:${port}`;
  const get = (p, options) => fetch(base + p, options);
  for (const p of ['/audit-absent', '/missing.js']) { const r = await get(p); assert.equal(r.status,404); assert.match(r.headers.get('x-robots-tag'),/noindex/); }
  for (const p of ['/api/video/catalog','/api/not-implemented']) { const r = await get(p); assert.equal(r.status,404); assert.match(r.headers.get('content-type'),/application\/json/); }
  for (const p of ['/robots.txt','/sitemap.xml']) { const r = await get(p); assert.equal(r.status,200); assert.doesNotMatch(await r.text(), /<!doctype html>/i); }
  const sitemap = await (await get('/sitemap.xml')).text();
  assert.doesNotMatch(sitemap,/Checkout|Payment|admin|commander-video/);
  for (const p of ['/Checkout','/PaymentSuccess','/OrderConfirmation','/saas-admin']) { const r = await get(p); assert.equal(r.status,200); assert.match(r.headers.get('x-robots-tag'),/noindex/); }
  const contact = await get('/saas-contact?token=secret');
  const html = await contact.text();
  assert.match(html, /rel="canonical" href="https:\/\/jsinnovia.com\/saas-contact"/);
  assert.match(html, /<title>Contact \| JS-Innov.IA<\/title>/);
  assert.doesNotMatch(html,/token=secret/);
  assert.equal((await get('/contact')).status,200);
  const redirect = await new Promise((resolve,reject) => {
    require('node:http').get(base+'/saas-contact?source=audit',{headers:{Host:'www.jsinnovia.com'}},res=>{res.resume();resolve(res)}).on('error',reject);
  });
  assert.equal(redirect.statusCode,308);assert.equal(redirect.headers.location,'https://jsinnovia.com/saas-contact?source=audit');
  const head = await get('/saas-contact',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal((await get('/saas-contact',{method:'POST'})).status,405);
  assert.equal((await get('/.env')).status,404);
  assert.equal((await get('/logo.png')).headers.get('cache-control'),'no-cache');
});
