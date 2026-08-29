const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const modulePromise = import(pathToFileURL(path.join(root, 'server-seo-audit.mjs')).href);

const completeHtml = `<!doctype html>
<html lang="fr"><head>
  <title>Audit SEO réel et transparent pour les entreprises locales</title>
  <meta name="description" content="Une description complète et mesurée qui présente clairement le contenu de cette page aux visiteurs et aux moteurs de recherche sans inventer de résultat.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="Audit réel"><meta property="og:description" content="Description">
  <meta property="og:image" content="/cover.jpg"><meta property="og:url" content="https://example.com/">
  <link rel="canonical" href="https://example.com/">
  <script type="application/ld+json">{"@context":"https://schema.org"}</script>
</head><body>
  <h1>Un audit SEO vérifiable</h1><h2>Mesures</h2>
  <img src="one.jpg" alt="Illustration"><img src="two.jpg" alt="Tableau">
  ${Array.from({ length: 610 }, (_, index) => `mot${index}`).join(' ')}
  ${Array.from({ length: 10 }, (_, index) => `<a href="/page-${index}">Page ${index}</a>`).join('')}
</body></html>`;

test('SEO measurements are deterministic and derived from HTML evidence', async () => {
  const { analyzeHtml, calculateScores } = await modulePromise;
  const measurements = analyzeHtml(completeHtml, {
    finalUrl: 'https://example.com/', status: 200, durationMs: 320,
    robotsStatus: 200, sitemapStatus: 200,
  });
  assert.equal(measurements.title_length, 58);
  assert.equal(measurements.h1_count, 1);
  assert.equal(measurements.image_alt_ratio, 100);
  assert.equal(measurements.internal_links, 10);
  assert.equal(measurements.json_ld_count, 1);
  assert.ok(measurements.word_count >= 600);
  const first = calculateScores(measurements);
  const second = calculateScores(measurements);
  assert.deepEqual(first, second);
  assert.equal(first.globalScore, 100);
});

test('missing SEO elements produce measured deductions instead of invented findings', async () => {
  const { analyzeHtml, calculateScores } = await modulePromise;
  const measurements = analyzeHtml('<html><body><img src="x.jpg"><p>court</p></body></html>', {
    finalUrl: 'http://example.com/', status: 200, durationMs: 3_500,
  });
  const result = calculateScores(measurements);
  assert.equal(measurements.title_length, 0);
  assert.equal(measurements.h1_count, 0);
  assert.equal(measurements.image_alt_ratio, 0);
  assert.ok(result.globalScore < 30);
});

test('SEO target validation rejects private networks and unsafe protocols', async () => {
  const { auditSeo, isPrivateAddress, normalizePublicUrl } = await modulePromise;
  assert.equal(isPrivateAddress('127.0.0.1'), true);
  assert.equal(isPrivateAddress('192.168.1.15'), true);
  assert.equal(isPrivateAddress('::1'), true);
  assert.equal(isPrivateAddress('8.8.8.8'), false);
  assert.throws(() => normalizePublicUrl('file:///etc/passwd'), /HTTP et HTTPS/);
  assert.throws(() => normalizePublicUrl('https://example.com:8080'), /ports web publics/);
  await assert.rejects(() => auditSeo({ url: 'http://127.0.0.1' }), /locales ou privées/);
});

test('the public SEO screens call the live server and make no false email promise', () => {
  const home = read('src/pages/Home.jsx');
  const audit = read('src/pages/SEOAudit.jsx');
  const server = read('server.mjs');
  const homeHandler = home.slice(home.indexOf('const handleAnalyze'), home.indexOf('return (', home.indexOf('const handleAnalyze')));
  assert.match(homeHandler, /platform\.functions\.invoke\('analyzeSEO'/);
  assert.match(homeHandler, /response\.data\.global_score/);
  assert.doesNotMatch(homeHandler, /Math\.random|setTimeout|setScore/);
  assert.doesNotMatch(home, /Mots-clés cibles manquants|Score SEO complet en 30 secondes/);
  assert.match(server, /\/api\/platform\/functions\/analyzeSEO/);
  assert.match(server, /await auditSeo/);
  assert.match(audit, /source === 'live_server_measurement'/);
  assert.match(audit, /Aucun e-mail n’est envoyé automatiquement/);
  assert.doesNotMatch(audit, /Rapport envoyé à|Analyser et recevoir le rapport|setEmailSent/);
});

test('the production image includes the SEO audit runtime module', () => {
  const dockerfile = read('Dockerfile');
  assert.match(dockerfile, /COPY --from=build \/app\/server-seo-audit\.mjs \.\/server-seo-audit\.mjs/);
});

test('downloaded SEO report escapes remote text before creating HTML', () => {
  const audit = read('src/pages/SEOAudit.jsx');
  assert.match(audit, /const escapeHtml/);
  assert.match(audit, /escapeHtml\(rec\.title\)/);
  assert.match(audit, /escapeHtml\(rec\.description\)/);
  assert.match(audit, /report\.strengths\.map\(s => `<li>• \$\{escapeHtml\(s\)\}/);
});
