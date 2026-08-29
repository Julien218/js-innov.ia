const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const config = fs.readFileSync('src/config/portfolio.js', 'utf8');
const showcase = fs.readFileSync('src/pages/Showcase.jsx', 'utf8');
const server = fs.readFileSync('server.mjs', 'utf8');

test('publishes exactly the eight approved NOVA videos', () => {
  const hashes = ['dc6586c6c5', '7964a15b8e', '11085f6421', '0bd3b42d6f', '1b7eed25a8', 'f079526e02', '74bc2bb8fe', '959b6ba0c8'];
  for (const hash of hashes) assert.match(config, new RegExp(`integrity_hash: '${hash}'`));
  assert.equal((config.match(/portfolio_approved: true/g) || []).length, 8);
  assert.doesNotMatch(config, /eaefa7b014/);
});

test('deduplicates media by integrity hash and rejects unsafe drafts', () => {
  assert.match(config, /record\.integrity_hash \|\| record\.id/);
  assert.match(config, /non\[ -\]\?videos\?/);
  assert.match(config, /portfolio_status/);
  assert.match(config, /portfolio_approved/);
});

test('loads videos only after a visitor click', () => {
  assert.match(showcase, /videoActive \? \(/);
  assert.match(showcase, /onClick=\{\(\) => setVideoActive\(true\)\}/);
  assert.match(showcase, /preload="metadata"/);
});

test('keeps Showcase read-only on the public server', () => {
  assert.match(server, /publicReadTables[^\n]+Showcase/);
  const writeLine = server.split('\n').find((line) => line.includes('publicWriteTables')) || '';
  assert.doesNotMatch(writeLine, /Showcase/);
});
