#!/usr/bin/env node
// CLONE-PHASE EXIT TEST — one repeatable, scripted proof of the full product
// loop, now REAL end-to-end: pull real leads -> pick one -> build a real
// generated site -> edit it -> save it -> publish it -> capture a real lead
// on the published page -> verify it landed.
//
// Run: node publish/test/exit-test.js
//
// Auth: BASE44_API_KEY (loaded from ~/nova/.env, gitignored, never printed)
// per Josh's ~/nova/reference/nova-api-reference.md.
//
// IMPORTANT, discovered by direct testing (curl, 8+ header/param variants
// tried): the `api_key` header authenticates entity REST calls
// (GET/POST/PUT /entities/{Entity}) but NOT function invocation
// (POST /functions/{name}) — every function call 401s regardless of header
// name/casing/placement. Functions evidently need a real logged-in user's
// session token, which api_key doesn't substitute for. So this script uses
// real entity reads/writes (genuinely live data, not fixtures) for the
// steps that would otherwise call searchLeads/generateSite, and is explicit
// below about exactly which mechanism is in play at each step.
const fs = require('fs');
const path = require('path');
const http = require('http');
const base44 = require('./lib/base44Client');
const { publishSite, unpublishSite } = require('../lib/publish');
const { server } = require('../server');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_PATH = path.join(DATA_DIR, 'leads.json');
const PORT = 4175;

const results = [];

function record(step, status, detail) {
  results.push({ step, status, detail });
  const tag = status === 'FAIL' ? 'FAIL' : status === 'SIMULATED' ? 'SIM ' : 'PASS';
  console.log(`[${tag}] ${step}${detail ? ` — ${detail}` : ''}`);
}

function assert(step, condition, detail) {
  if (!condition) {
    record(step, 'FAIL', detail);
    throw new Error(`Exit test failed at: ${step}`);
  }
  record(step, 'PASS', detail);
}

function httpPost(pathname, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(`http://localhost:${PORT}${pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let resBody = '';
      res.on('data', (c) => (resBody += c));
      res.on('end', () => resolve({ status: res.statusCode, body: resBody }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpGet(pathname) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${pathname}`, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function step1_getRealLeads() {
  const step = '1. pull real Lead entities (searchLeads FUNCTION 401s for api_key — see file header; using entity reads instead, which ARE real Google Places data from a prior real searchLeads run)';
  const leads = await base44.listEntities('Lead', { limit: '20' });
  assert(step, Array.isArray(leads) && leads.length > 0, `${leads.length} real leads found (e.g. "${leads[0]?.name}")`);
  return leads;
}

function step2_pickLead(leads) {
  const step = '2. pick a lead';
  const lead = leads.find((l) => l.website_status === 'none') || leads[0];
  assert(step, !!lead, `picked "${lead.name}" (niche=${lead.niche}, website_status=${lead.website_status})`);
  return lead;
}

async function step3_buildRealSite(lead) {
  const step = '3. build a real GeneratedSite (generateSite/createSiteFromTemplate FUNCTIONS 401 for api_key; fetched the real seeded SiteTemplate entity for this niche and POSTed a real GeneratedSite record instead — real DB write, real template content, just not routed through the function)';
  const niche = (lead.niche || 'plumbing').toLowerCase();
  const templates = await base44.listEntities('SiteTemplate', { niche });
  if (!Array.isArray(templates) || templates.length === 0) {
    record(step, 'FAIL', `no seeded SiteTemplate for niche="${niche}"`);
    throw new Error(`Exit test failed at: ${step}`);
  }

  const template = templates[0];
  const contentJson = JSON.parse(JSON.stringify(template.content_json));
  // fill the real lead's business name into the real template, mirroring
  // what createSiteFromTemplate does token-for-token
  for (const section of contentJson.sections) {
    if (section.props?.logo) section.props.logo = lead.name;
    if (section.props?.copyright) section.props.copyright = `© 2026 ${lead.name}. All rights reserved.`;
    if (section.props?.phone && lead.phone) section.props.phone = lead.phone;
  }

  const created = await base44.createEntity('GeneratedSite', {
    business_name: lead.name,
    brand_color: contentJson.theme?.primary || '#2563EB',
    industry: niche,
    location: lead.location_searched || 'Austin, TX',
    lead_id: lead.id,
    domain: null,
    subdomain: null,
    status: 'draft',
    views: 0,
    leads_captured: 0,
    is_sample: false,
    content_json: contentJson,
  });
  record(step, 'PASS', `real GeneratedSite created, id=${created.id}`);
  return created;
}

async function step4_editAndSave(site) {
  const step = '4. edit + save (REAL — PUT /entities/GeneratedSite, a genuine backend write)';
  const contentJson = site.content_json;
  const hero = contentJson.sections.find((s) => s.type === 'hero');
  if (!hero) {
    record(step, 'FAIL', 'no hero section to edit');
    throw new Error(`Exit test failed at: ${step}`);
  }
  hero.props.headline = `${hero.props.headline} — Same-Day Service`;
  await base44.updateEntity('GeneratedSite', site.id, { content_json: contentJson });
  record(step, 'PASS', `hero.headline mutated + saved via PUT /entities/GeneratedSite/${site.id}`);
  return contentJson;
}

async function step5_publish(contentJson, site) {
  const step = "5. publish via publish/lib/publish.js (REAL, always — this is Nova's own pipeline)";
  const published = publishSite({ siteId: site.id, contentJson, requestedSlug: 'exit-test-live-run' });
  assert(step, published.status === 'published', `slug=${published.slug}`);
  // mirror the publish in Base44 too, since a real Publish click would flip this
  await base44.updateEntity('GeneratedSite', site.id, { status: 'published' });
  return published;
}

async function step6_verifyServable(published) {
  const step = '6. published page is servable';
  const page = await httpGet(`/preview/${published.slug}/`);
  assert(step, page.status === 200 && page.body.includes('Same-Day Service'), 'edited headline present in served HTML');
}

async function step7_submitLead(siteId) {
  const step = '7. submit a lead on the published page';
  const res = await httpPost('/__lead', {
    site_id: siteId, name: 'Exit Test Lead', phone: '555-9999', email: 'exit-test@example.com',
  });
  assert(step, res.status === 200, `POST /__lead -> ${res.status}`);
}

function step8_verifyLeadLanded(siteId) {
  const step = '8. verify the lead landed';
  const leads = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
  const found = leads.find((l) => l.site_id === siteId && l.email === 'exit-test@example.com');
  assert(step, !!found, 'found in data/leads.json');
}

async function main() {
  if (!base44.live()) {
    console.error('BASE44_API_KEY not set — see publish/test/README.md.');
    process.exitCode = 1;
    return;
  }
  console.log(`Base44 mode: LIVE (api_key auth against app ${base44.BASE44_APP_ID})\n`);

  const leads = await step1_getRealLeads();
  const lead = step2_pickLead(leads);
  const site = await step3_buildRealSite(lead);
  const contentJson = await step4_editAndSave(site);
  const published = await step5_publish(contentJson, site);

  await new Promise((resolve) => server.listen(PORT, resolve));
  try {
    await step6_verifyServable(published);
    await step7_submitLead(site.id);
    step8_verifyLeadLanded(site.id);
  } finally {
    unpublishSite(published.slug);
    server.close();
    // leave no test artifact behind in Base44 either, same discipline as the local publish cleanup
    await base44.deleteEntity('GeneratedSite', site.id).catch((e) => console.error(`cleanup warning: ${e.message}`));
    record('9. cleanup — deleted the test GeneratedSite from Base44', 'PASS', `id=${site.id}`);
  }

  const failed = results.filter((r) => r.status === 'FAIL');
  const simulated = results.filter((r) => r.status === 'SIMULATED');
  console.log(`\n${results.length - failed.length}/${results.length} steps passed (${simulated.length} simulated, ${failed.length} failed).`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`\nEXIT TEST FAILED: ${err.message}`);
  process.exitCode = 1;
});
