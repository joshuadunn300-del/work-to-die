// TEMPORARY local stand-in for Base44 hosting + the /__lead webhook.
// Serves published sites from output/<slug>/ and accepts lead captures into
// data/leads.json. Wire real deploy + Base44 Lead entity writes when
// Terminal 1's backend functions are live (see INTEGRATION REQUEST in BUILD-LOG).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadManifest } = require('./lib/manifest');
const { getPublishedEntry } = require('./lib/publish');

const OUTPUT_DIR = path.join(__dirname, 'output');
const LEADS_PATH = path.join(__dirname, 'data', 'leads.json');
const PORT = process.env.PORT || 4173;

const recentSubmissions = new Map(); // dedupe key -> timestamp
const DEDUPE_WINDOW_MS = 10_000;

function loadLeads() {
  if (!fs.existsSync(LEADS_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8')); } catch { return []; }
}

function saveLeads(leads) {
  fs.mkdirSync(path.dirname(LEADS_PATH), { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2));
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function handleLead(req, res) {
  let body = '';
  let size = 0;
  const MAX_BYTES = 10_000;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BYTES) {
      req.destroy();
      return;
    }
    body += chunk;
  });
  req.on('end', () => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return sendJson(res, 400, { error: 'invalid JSON' });
    }
    const siteId = String(data.site_id || '').slice(0, 200);
    const name = String(data.name || '').slice(0, 200);
    const phone = String(data.phone || '').slice(0, 50);
    const email = String(data.email || '').slice(0, 200);
    const message = String(data.message || '').slice(0, 2000);

    if (!siteId) return sendJson(res, 400, { error: 'site_id is required' });
    if (!phone && !email) return sendJson(res, 400, { error: 'phone or email is required' });

    const dedupeKey = `${siteId}:${phone}:${email}`;
    const now = Date.now();
    const last = recentSubmissions.get(dedupeKey);
    if (last && now - last < DEDUPE_WINDOW_MS) {
      // treat as success to the client (avoid leaking timing info / confusing UX)
      // but don't write a duplicate row
      return sendJson(res, 200, { ok: true, deduped: true });
    }
    recentSubmissions.set(dedupeKey, now);

    const leads = loadLeads();
    leads.push({ site_id: siteId, name, phone, email, message, submitted_at: new Date().toISOString() });
    saveLeads(leads);
    return sendJson(res, 200, { ok: true });
  });
}

function servePreview(req, res, slug) {
  const entry = getPublishedEntry(slug);
  if (!entry || entry.status !== 'published') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }
  const filePath = path.join(OUTPUT_DIR, slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }
  const html = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/__lead') {
    return handleLead(req, res);
  }
  const previewMatch = url.pathname.match(/^\/preview\/([a-z0-9-]+)\/?$/);
  if (req.method === 'GET' && previewMatch) {
    return servePreview(req, res, previewMatch[1]);
  }
  if (req.method === 'GET' && url.pathname === '/__manifest') {
    return sendJson(res, 200, loadManifest());
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Nova publish preview server on http://localhost:${PORT}`));
}

module.exports = { server };
