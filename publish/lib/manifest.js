const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'data', 'published.json');

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

module.exports = { loadManifest, saveManifest, MANIFEST_PATH };
