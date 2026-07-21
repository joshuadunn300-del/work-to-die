const fs = require('fs');
const path = require('path');
const assert = require('assert');
const http = require('http');
const { publishSite, unpublishSite, republishSite, getPublishedEntry } = require('../lib/publish');
const { server } = require('../server');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_PATH = path.join(DATA_DIR, 'leads.json');
const MANIFEST_PATH = path.join(DATA_DIR, 'published.json');

function resetData() {
  fs.rmSync(LEADS_PATH, { force: true });
  fs.rmSync(MANIFEST_PATH, { force: true });
  fs.rmSync(path.join(__dirname, '..', 'output'), { recursive: true, force: true });
}

function httpGet(pathname) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4173${pathname}`, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

function httpPost(pathname, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(`http://localhost:4173${pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let resBody = '';
      res.on('data', c => resBody += c);
      res.on('end', () => resolve({ status: res.statusCode, body: resBody }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  resetData();
  const contentJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixture-plumber.json'), 'utf8'));
  let failures = 0;
  const check = (cond, msg) => { if (!cond) { console.error(`FAIL: ${msg}`); failures++; } else { console.log(`PASS: ${msg}`); } };

  const published = publishSite({ siteId: contentJson.site_id, contentJson, requestedSlug: 'rapid-flow-plumbing' });
  check(published.slug === 'rapid-flow-plumbing', 'publish assigns requested slug');
  check(getPublishedEntry(published.slug).status === 'published', 'manifest marks site published');

  await new Promise(resolve => server.listen(4173, resolve));

  const page = await httpGet(`/preview/${published.slug}/`);
  check(page.status === 200 && page.body.includes('Rapid Flow Plumbing'), 'published site is servable end-to-end');

  const lead = await httpPost('/__lead', { site_id: contentJson.site_id, name: 'Test Lead', phone: '555-0100', email: 'lead@example.com' });
  check(lead.status === 200, 'lead capture accepts valid submission');
  const leads = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
  check(leads.length === 1 && leads[0].site_id === contentJson.site_id, 'lead persisted with correct site_id');

  const dupe = await httpPost('/__lead', { site_id: contentJson.site_id, name: 'Test Lead', phone: '555-0100', email: 'lead@example.com' });
  const leadsAfterDupe = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
  check(dupe.status === 200 && leadsAfterDupe.length === 1, 'double-submit within window is deduped, not double-recorded');

  const badLead = await httpPost('/__lead', { site_id: '' });
  check(badLead.status === 400, 'lead capture rejects missing site_id');

  unpublishSite(published.slug);
  const afterUnpublish = await httpGet(`/preview/${published.slug}/`);
  check(afterUnpublish.status === 404, 'unpublished site is no longer servable');

  republishSite({ siteId: contentJson.site_id, contentJson });
  const afterRepublish = await httpGet(`/preview/${published.slug}/`);
  check(afterRepublish.status === 200, 'republish restores the same slug');

  server.close();
  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exitCode = 1;
  } else {
    console.log('\nAll e2e checks passed.');
  }
}

main().catch(e => { console.error(e); process.exitCode = 1; });
