import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'public/brand/companion/manifest.json');
const REQUIRED_STATES = ['idle', 'listening', 'thinking', 'speaking', 'success', 'error'];
const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;

function fail(message) {
  throw new Error(`[Elyna VRM] ${message}`);
}

function publicAssetPath(assetUrl) {
  if (typeof assetUrl !== 'string' || !assetUrl.startsWith('/')) {
    fail(`invalid public asset path: ${String(assetUrl)}`);
  }
  const resolved = path.resolve(root, 'public', `.${assetUrl}`);
  const publicRoot = path.resolve(root, 'public');
  if (!resolved.startsWith(`${publicRoot}${path.sep}`)) {
    fail(`asset escapes public/: ${assetUrl}`);
  }
  return resolved;
}

function assertFile(assetUrl, label) {
  const filePath = publicAssetPath(assetUrl);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    fail(`${label} is missing: ${assetUrl}`);
  }
  return filePath;
}

function parseGlbJson(buffer) {
  if (buffer.length < 20) fail('model is too small to be a GLB/VRM file');
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);

  if (magic !== GLB_MAGIC) fail('model does not have the glTF binary magic header');
  if (version !== 2) fail(`unsupported glTF version ${version}; expected glTF 2.0`);
  if (declaredLength !== buffer.length) {
    fail(`GLB length mismatch: header=${declaredLength}, actual=${buffer.length}`);
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + chunkLength;
    if (end > buffer.length) fail('GLB chunk exceeds file length');

    if (chunkType === JSON_CHUNK) {
      const jsonText = buffer.subarray(start, end).toString('utf8').replace(/\u0000+$/g, '').trim();
      try {
        return JSON.parse(jsonText);
      } catch (error) {
        fail(`invalid GLB JSON chunk: ${error.message}`);
      }
    }
    offset = end;
  }

  fail('GLB JSON chunk not found');
}

function validateVrmJson(gltf, manifest) {
  if (gltf?.asset?.version !== '2.0') fail('glTF asset.version must be 2.0');
  if (!Array.isArray(gltf.nodes) || gltf.nodes.length === 0) fail('model contains no nodes');
  if (!Array.isArray(gltf.scenes) || gltf.scenes.length === 0) fail('model contains no scenes');

  const used = new Set([...(gltf.extensionsUsed || []), ...(gltf.extensionsRequired || [])]);
  const hasVrm1 = used.has('VRMC_vrm') || Boolean(gltf.extensions?.VRMC_vrm);
  const hasVrm0 = used.has('VRM') || Boolean(gltf.extensions?.VRM);
  if (!hasVrm1 && !hasVrm0) fail('model has no VRM extension (VRMC_vrm or legacy VRM)');

  const humanoid = hasVrm1 ? gltf.extensions?.VRMC_vrm?.humanoid : gltf.extensions?.VRM?.humanoid;
  if (!humanoid) fail('VRM humanoid definition is missing');

  const requiredExpressions = manifest.threeD?.requiredExpressions || [];
  if (requiredExpressions.length > 0 && hasVrm1) {
    const presets = gltf.extensions?.VRMC_vrm?.expressions?.preset || {};
    const missing = requiredExpressions.filter((name) => !Object.prototype.hasOwnProperty.call(presets, name));
    if (missing.length > 0) fail(`VRM expressions missing: ${missing.join(', ')}`);
  }

  return { vrmVersion: hasVrm1 ? '1.x' : '0.x', nodeCount: gltf.nodes.length };
}

function main() {
  if (!fs.existsSync(manifestPath)) fail('manifest.json is missing');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (manifest.assistant !== 'Elyna') fail('manifest assistant must be Elyna');
  if (manifest.role !== 'Compagnon JS-Innov.IA') fail('manifest role is incorrect');
  if (manifest.threeD?.format !== 'vrm') fail('threeD.format must be vrm');
  if (manifest.threeD?.fallbackRequired !== true) fail('3D fallback must remain mandatory');

  const states = manifest.threeD?.states || [];
  const missingStates = REQUIRED_STATES.filter((state) => !states.includes(state));
  if (missingStates.length > 0) fail(`manifest states missing: ${missingStates.join(', ')}`);

  assertFile(manifest.primaryAvatar, 'primary avatar fallback');
  assertFile(manifest.launcher, 'launcher fallback');

  const modelPath = publicAssetPath(manifest.threeD.model);
  const modelExists = fs.existsSync(modelPath) && fs.statSync(modelPath).isFile();

  if (!modelExists) {
    if (manifest.threeD.enabled) fail(`3D is enabled but model is missing: ${manifest.threeD.model}`);
    console.log('[Elyna VRM] OK — 3D disabled; validated 2D fallbacks; master model not delivered yet.');
    return;
  }

  const maxBytes = Number(manifest.threeD.maxModelBytes || 15 * 1024 * 1024);
  const stat = fs.statSync(modelPath);
  if (stat.size <= 0) fail('model file is empty');
  if (stat.size > maxBytes) fail(`model is too large: ${stat.size} bytes > ${maxBytes} bytes`);

  const buffer = fs.readFileSync(modelPath);
  const gltf = parseGlbJson(buffer);
  const result = validateVrmJson(gltf, manifest);

  console.log(`[Elyna VRM] OK — ${result.vrmVersion}, ${result.nodeCount} nodes, ${(stat.size / 1024 / 1024).toFixed(2)} MiB, enabled=${Boolean(manifest.threeD.enabled)}.`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
}
