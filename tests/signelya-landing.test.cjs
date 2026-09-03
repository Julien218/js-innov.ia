const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
test('la landing Signelya reste limitée à son domaine et Pixelium demeure la page par défaut', () => {
  const app = read('src/App.jsx');
  const server = read('server.mjs');
  assert.match(app, /hostname === 'signelya\.jsinnovia\.com'/);
  assert.match(app, /isSignelyaDomain \? <SignelyaLanding \/> : <EcranLed \/>/);
  assert.match(server, /isSignelyaHost \? 'signelya\.html' : 'index\.html'/);
  assert.match(server, /response\.setHeader\('Vary', 'Host'\)/);
});
test('la landing ouvre l\'application existante sans embarquer ni remplacer son code', () => {
  const landing = read('src/pages/signelya/SignelyaLanding.jsx');
  // APP_URL officiel
  assert.match(landing, /const APP_URL = 'https:\/\/app\.signelya\.jsinnovia\.com\/ecran-geant'/);
  // OFFICIAL_LOCKUP versionné PNG
  assert.match(landing, /const OFFICIAL_LOCKUP = '\/branding\/signelya-officiel-jsinnovia\.png\?v=20260903-official-2'/);
  // OFFICIAL_ICON versionné PNG
  assert.match(landing, /const OFFICIAL_ICON = '\/branding\/signelya-logo-carre\.png\?v=20260903-official-2'/);
  // OFFICIAL_SOCIAL complet
  assert.match(landing, /const OFFICIAL_SOCIAL = 'https:\/\/signelya\.jsinnovia\.com\/branding\/signelya-officiel-jsinnovia\.png\?v=20260903-official-2'/);
  // BrandLogo utilise les constantes
  assert.match(landing, /src=\{OFFICIAL_LOCKUP\}/);
  assert.match(landing, /alt="SIGNELYA by JS-Innov\.IA — Vos écrans prennent vie\."/);
  // updateMeta favicon avec lien et attributs
  assert.match(landing, /updateMeta\('link\[rel="icon"\]'[^)]*href: OFFICIAL_ICON/);
  // og:image et twitter:image utilisent OFFICIAL_SOCIAL
  assert.match(landing, /property: 'og:image'[^}]*content: OFFICIAL_SOCIAL/);
  assert.match(landing, /name: 'twitter:image'[^}]*content: OFFICIAL_SOCIAL/);
  // Aucun ancien SVG en src JSX
  assert(!landing.match(/src="\/signelya-symbol\.svg"/), 'signelya-symbol.svg must not appear in src attributes');
  // Pas d'ancienne URL Railway
  assert(!landing.includes('olivier-signage-cockpit-production.up.railway.app'), 'old Railway URL must not exist');
  // Pas de updateMeta('favicon' ancien style
  assert(!landing.includes("updateMeta('favicon'"), 'old favicon updateMeta pattern must not exist');
  // Branding images présents
  assert.match(landing, /signelya-officiel-jsinnovia\.png\?v=20260903-official-2/);
  assert.match(landing, /signelya-logo-carre\.png\?v=20260903-official-2/);
  // Service Worker et manifest absents
  assert.doesNotMatch(landing, /serviceWorker\.register/);
  assert.doesNotMatch(landing, /manifest\.json/);
});
test('les coques HTML Signelya et Pixelium sont compilées séparément', () => {
  const vite = read('vite.config.js');
  const signelyaShell = read('signelya.html');
  assert.match(vite, /main:.*index\.html/);
  assert.match(vite, /signelya:.*signelya\.html/);
  assert.match(signelyaShell, /SIGNELYA by JS-Innov\.IA/);
  assert.doesNotMatch(signelyaShell, /rel="manifest"/);
  // Vérifier signelya.html contient les métadonnées officielles
  assert.match(signelyaShell, /property="og:image" content="https:\/\/signelya\.jsinnovia\.com\/branding\/signelya-officiel-jsinnovia\.png\?v=20260903-official-2"/);
  assert.match(signelyaShell, /property="og:image:type" content="image\/png"/);
  assert.match(signelyaShell, /property="og:image:width" content="1416"/);
  assert.match(signelyaShell, /property="og:image:height" content="685"/);
  assert.match(signelyaShell, /rel="icon" type="image\/png" href="\/branding\/signelya-logo-carre\.png\?v=20260903-official-2"/);
  assert.match(signelyaShell, /name="twitter:image" content="https:\/\/signelya\.jsinnovia\.com\/branding\/signelya-officiel-jsinnovia\.png\?v=20260903-official-2"/);
});
test('chaque bouton tarifaire présélectionne la bonne offre dans le configurateur', () => {
  const landing = read('src/pages/signelya/SignelyaLanding.jsx');
  const configurator = read('src/pages/saas/SignageProduct.jsx');
  assert.match(landing, /package=\$\{packageId\}#configuration/);
  assert.match(configurator, /new URLSearchParams\(window\.location\.search\)\.get\('package'\)/);
  assert.match(configurator, /PACKS\.some\(\(pack\) => pack\.id === requestedPackage\)/);
  assert.match(configurator, /id="configuration"/);
  assert.match(configurator, /aria-pressed=\{active\}/);
});
