// One-off operational script: seeds the SiteTemplate entity in Nova's live Base44 DB from
// the 24 real niche templates in frontend/src/lib/templates/ (excludes the 'generic'
// fallback — that's not a real business niche to show on the Templates page).
// Idempotent: skips any niche that already has a SiteTemplate row.
// Run: node scripts/seed-templates.mjs
import { readFileSync } from 'node:fs';
import { TEMPLATES } from '../frontend/src/lib/templates/index.js';

const envText = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const API_KEY = envText.match(/^BASE44_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) throw new Error('BASE44_API_KEY not found in .env');

const BASE_URL = 'https://icy-nova-growth-lab.base44.app/api';

async function base44Fetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', api_key: API_KEY, ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

async function main() {
  const niches = Object.keys(TEMPLATES).filter((n) => n !== 'generic');
  console.log(`Seeding ${niches.length} niche templates...`);

  const existing = await base44Fetch('/entities/SiteTemplate?limit=200');
  const existingList = Array.isArray(existing) ? existing : existing.data || existing.results || [];
  const existingNiches = new Set(existingList.map((r) => r.niche));
  console.log(`Existing SiteTemplate rows: ${existingList.length} (${[...existingNiches].join(', ') || 'none'})`);

  let created = 0, skipped = 0, failed = 0;
  for (const niche of niches) {
    if (existingNiches.has(niche)) {
      console.log(`  skip  ${niche} (already exists)`);
      skipped++;
      continue;
    }
    try {
      const record = await base44Fetch('/entities/SiteTemplate', {
        method: 'POST',
        body: JSON.stringify({ niche, content_json: TEMPLATES[niche] }),
      });
      console.log(`  ok    ${niche} -> id ${record.id || record._id || '(no id in response)'}`);
      created++;
    } catch (err) {
      console.error(`  FAIL  ${niche}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed} total_target=${niches.length}`);

  const after = await base44Fetch('/entities/SiteTemplate?limit=200');
  const afterList = Array.isArray(after) ? after : after.data || after.results || [];
  console.log(`SiteTemplate rows now in DB: ${afterList.length}`);
  console.log(afterList.map((r) => r.niche).sort().join(', '));
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
