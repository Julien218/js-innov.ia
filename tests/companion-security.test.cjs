const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'src/components/chatbot/AIChatbot.jsx'), 'utf8');
const voice = fs.readFileSync(path.join(root, 'src/components/chatbot/VoiceCompanion.jsx'), 'utf8');
const avatar = fs.readFileSync(path.join(root, 'src/components/chatbot/AIAvatar.jsx'), 'utf8');
const renderer3d = fs.readFileSync(path.join(root, 'src/components/chatbot/ElynaAvatar3D.jsx'), 'utf8');
const validator3d = fs.readFileSync(path.join(root, 'scripts/validate-elyna-vrm.mjs'), 'utf8');
const endpoint = fs.readFileSync(path.join(root, 'server.mjs'), 'utf8');
const platformClient = fs.readFileSync(path.join(root, 'src/api/platformClient.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'src/Layout.jsx'), 'utf8');
const saasLayout = fs.readFileSync(path.join(root, 'src/components/saas/SaasLayout.jsx'), 'utf8');
const packageJson = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/brand/companion/manifest.json'), 'utf8'));

test('the browser delegates AI requests to the server function', () => {
  assert.match(client, /functions\.invoke\('publicChat'/);
  assert.doesNotMatch(client, /integrations\.Core\.InvokeLLM/);
  assert.match(platformClient, /\/api\/platform\/functions/);
});

test('the branded chat companion is mounted on the active SaaS landing routes', () => {
  assert.match(app, /SaasChatbot from '.\/components\/chatbot\/AIChatbot'/);
  assert.match(app, /<SaasChatbot\s*\/>/);
});

test('the Realtime voice companion is mounted once globally inside the router', () => {
  assert.match(app, /VoiceCompanion from '.\/components\/chatbot\/VoiceCompanion'/);
  assert.match(app, /<VoiceCompanion\s*\/>/);
  assert.doesNotMatch(layout, /VoiceCompanion/);
  assert.doesNotMatch(saasLayout, /VoiceButton/);
});

test('the voice navigation bridge uses an explicit allowlist and never arbitrary URLs', () => {
  assert.match(voice, /const SITE_DESTINATIONS = Object\.freeze/);
  for (const destination of ['home', 'creative_studio', 'agents', 'automations', 'packs', 'pricing', 'showcase', 'seo', 'contact']) {
    assert.match(voice, new RegExp(`${destination}:`));
  }
  assert.match(voice, /response\.function_call_arguments\.done/);
  assert.match(voice, /type: 'function_call_output'/);
  assert.match(voice, /destination_not_allowed/);
  assert.match(voice, /handledToolCallsRef/);
  assert.match(voice, /useNavigate/);
  assert.doesNotMatch(voice, /window\.location\s*=/);
  assert.doesNotMatch(voice, /args\.(url|href|path)/);
});

test('the voice companion remains public-site only and sends bounded navigation context', () => {
  assert.match(voice, /isMainPublicHost/);
  assert.match(voice, /www\.jsinnovia\.com/);
  assert.match(voice, /PRIVATE_PATH_PREFIXES/);
  assert.match(voice, /interestHint: inferInterest\(history\)/);
  assert.match(voice, /recentPaths: history/);
  assert.match(voice, /visitSeconds:/);
});

test('the public endpoint bounds input and rate limits requests', () => {
  assert.match(endpoint, /slice\(-10\)/);
  assert.match(endpoint, /slice\(0, 1000\)/);
  assert.match(endpoint, /current\.count <= 30/);
  assert.match(endpoint, /response, 429/);
  assert.match(endpoint, /MAX_RATE_LIMIT_CLIENTS/);
  assert.match(endpoint, /AbortSignal\.timeout\(AGENT_TIMEOUT_MS\)/);
});

test('the public server applies baseline security headers and rejects unsupported methods', () => {
  assert.match(endpoint, /X-Content-Type-Options', 'nosniff/);
  assert.match(endpoint, /X-Frame-Options', 'DENY/);
  assert.match(endpoint, /Strict-Transport-Security/);
  assert.match(endpoint, /response, 405/);
});

test('the public assistant is explicitly isolated from the cockpit', () => {
  assert.match(endpoint, /cockpit\.jsinnovia\.com\/api\/public\/elynea\/chat/);
  assert.match(endpoint, /INTERNAL_DETAILS/);
  assert.match(endpoint, /commercialFallback/);
  assert.doesNotMatch(endpoint, /fetch\(elyneaUrl[^]*x-agent-key/);
});

test('the application has no runtime dependency on Base44', () => {
  const viteConfig = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8');
  assert.doesNotMatch(packageJson, /@base44/);
  assert.doesNotMatch(viteConfig, /base44/i);
  assert.equal(fs.existsSync(path.join(root, 'src/api/base44Client.js')), false);
});

test('Elyna keeps the premium local visual pack as a production fallback', () => {
  assert.match(client, /\/brand\/companion\/companion-avatar-256\.webp/);
  assert.match(avatar, /\/brand\/companion\/companion-launcher-256\.webp/);
  assert.equal(manifest.assistant, 'Elyna');
  assert.equal(manifest.role, 'Compagnon JS-Innov.IA');
  assert.equal(manifest.version, '1.2.0');
  assert.equal(manifest.threeD.enabled, false);
  assert.equal(manifest.threeD.format, 'vrm');
  assert.equal(manifest.threeD.model, '/brand/companion/elyna/elyna.vrm');
  assert.equal(manifest.threeD.runtime, '@pixiv/three-vrm@3.5.5');
  assert.equal(manifest.threeD.activationPolicy, 'validated-model-only');
  assert.equal(manifest.threeD.fallbackRequired, true);
  assert.equal(manifest.threeD.maxModelBytes, 15728640);
  assert.deepEqual(manifest.threeD.requiredExpressions, ['blink', 'aa']);
  assert.deepEqual(manifest.threeD.states, ['idle', 'listening', 'thinking', 'speaking', 'success', 'error']);
  assert.match(avatar, /ElynaAvatar3D/);
});

test('the Elyna 3D runtime is lazy, stateful and fails safely to the 2D asset', () => {
  assert.match(packageJson, /"@pixiv\/three-vrm": "3\.5\.5"/);
  assert.match(renderer3d, /import\('@pixiv\/three-vrm'\)/);
  assert.match(renderer3d, /VRMLoaderPlugin/);
  assert.match(renderer3d, /threeD\?\.enabled/);
  assert.match(renderer3d, /fallback 2D conservé/);
  assert.match(renderer3d, /currentState === 'listening'/);
  assert.match(renderer3d, /currentState === 'thinking'/);
  assert.match(renderer3d, /currentState === 'speaking'/);
  assert.match(renderer3d, /currentState === 'success'/);
  assert.match(renderer3d, /currentState === 'error'/);
  assert.match(renderer3d, /prefers-reduced-motion: reduce/);
});

test('the public chat drives the 3D header state without spawning extra WebGL avatars per message', () => {
  assert.match(client, /import ElynaAvatar3D from '.\/ElynaAvatar3D'/);
  assert.match(client, /status === 'loading' \? 'thinking'/);
  assert.match(client, /status === 'error' \? 'error'/);
  assert.match(client, /state=\{avatarState\}/);
  assert.match(client, /<img src=\{AVATAR\} alt="" width="256" height="256"/);
});

test('the Elyna production validator passes while 3D is disabled and the master model is absent', () => {
  assert.match(packageJson, /"validate:elyna": "node scripts\/validate-elyna-vrm\.mjs"/);
  assert.match(validator3d, /GLB_MAGIC/);
  assert.match(validator3d, /VRMC_vrm/);
  assert.match(validator3d, /legacy VRM/);
  assert.match(validator3d, /requiredExpressions/);
  assert.match(validator3d, /3D is enabled but model is missing/);
  const output = execFileSync(process.execPath, ['scripts/validate-elyna-vrm.mjs'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.match(output, /OK — 3D disabled/);
});

test('the chat remains accessible and respects reduced motion', () => {
  assert.match(client, /aria-modal="true"/);
  assert.match(client, /event\.key === 'Escape'/);
  assert.match(client, /useReducedMotion/);
  assert.match(avatar, /useReducedMotion/);
});
