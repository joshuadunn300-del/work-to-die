// Script + Proposal generation, following the same window.base44-live /
// mock-fallback convention as ../app/lib/api.js (Terminal 4). Swap the
// `live()` branch for the real Base44 SDK call once Terminal 1 logs these
// functions as deployed.
import { CREDIT_COSTS } from '../app/lib/entitlements'

// `value` is the real Script.website_weakness enum (checked nova-api-reference.md's
// Script Schema: no_website|slow_website|outdated_design|not_mobile_friendly|
// hard_to_find_no_seo|unprofessional) — the old export was the human label used AS the
// raw value sent to the backend, which never matched the real enum on a live call.
export const WEBSITE_WEAKNESSES = [
  { label: 'No website', value: 'no_website' },
  { label: 'Slow website', value: 'slow_website' },
  { label: 'Outdated design', value: 'outdated_design' },
  { label: "Doesn't load on mobile", value: 'not_mobile_friendly' },
  { label: 'Hard to find/no SEO', value: 'hard_to_find_no_seo' },
  { label: 'Looks unprofessional', value: 'unprofessional' },
]

const live = () => typeof window !== 'undefined' && !!window.base44

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

let mockProposalSeq = 1
const mockProposals = []

// Seeded to match the two example rows in UI-Reference/client-sites.md exactly,
// so a side-by-side grading pass lines up with the real screen.
const mockSites = [
  { id: 's1', title: 'Catering Companies Site', niche: 'Catering Companies', status: 'live', slug: 'catering-companies-site', domain_status: 'Not connected', edited_date: 'Jul 17' },
  { id: 's2', title: 'Test', niche: 'plumbing', status: 'draft', slug: 'test', domain_status: 'Not connected', edited_date: 'Jul 17' },
]

export async function listSites() {
  if (live()) return window.base44.entities.GeneratedSite.list()
  await delay(200)
  return [...mockSites]
}

export async function duplicateSite(id) {
  if (live()) {
    // Base44's entity handler has no `.duplicate()` method (checked the SDK's own
    // .d.ts: get/create/update/delete/bulkCreate/etc only) — this threw on every
    // real click. Fetch + create a fresh draft copy instead, unpublished so the
    // duplicate never accidentally serves live at the source site's subdomain.
    const source = await window.base44.entities.GeneratedSite.get(id)
    const { id: _id, created_date, updated_date, created_by_id, ...rest } = source
    return window.base44.entities.GeneratedSite.create({
      ...rest,
      business_name: `${source.business_name} (copy)`,
      status: 'draft',
      subdomain: null,
    })
  }
  await delay(200)
  const source = mockSites.find((s) => s.id === id)
  if (!source) throw new Error('Site not found.')
  const copy = { ...source, id: `s${mockSites.length + 1}`, title: `${source.title} (copy)`, status: 'draft' }
  mockSites.push(copy)
  return copy
}

export async function deleteSite(id) {
  if (live()) return window.base44.entities.GeneratedSite.delete(id)
  await delay(200)
  const idx = mockSites.findIndex((s) => s.id === id)
  if (idx !== -1) mockSites.splice(idx, 1)
  return { ok: true }
}

function mockScript({ businessName, niche, yourName, tone, websiteWeakness, convictionPoints }) {
  const label = WEBSITE_WEAKNESSES.find((w) => w.value === websiteWeakness)?.label || websiteWeakness;
  const intro = yourName ? `Hey, this is ${yourName}` : 'Hey there';
  return [
    `${intro} calling for ${businessName || 'your business'}.`,
    `I help ${niche || 'local businesses'} fix one specific problem: "${label}."`,
    `Right now that's probably costing you calls you never even see.`,
    convictionPoints ? `Specifically — ${convictionPoints}.` : '',
    `Tone: ${tone}. I put together a free demo site already — want me to send it over?`,
  ].filter(Boolean).join('\n\n');
}

// `functions.generateScript(payload)` was never a real SDK method — base44.functions only
// exposes `.invoke(name, args)`/`.fetch(path, init)` (checked the SDK's own functions.js),
// so this threw `... is not a function` on every real click.
export async function generateScript({ businessName, niche, yourName, tone, websiteWeakness, convictionPoints }) {
  if (!businessName || !businessName.trim()) throw new Error('Business name is required.');
  if (!websiteWeakness || !WEBSITE_WEAKNESSES.some((w) => w.value === websiteWeakness)) {
    throw new Error('Website weakness must be one of the preset options.');
  }
  const payload = { businessName, niche, yourName, tone, websiteWeakness, convictionPoints };
  if (live()) return window.base44.functions.invoke('generateScript', payload).then((r) => r.data);
  await delay(500);
  return { script_text: mockScript(payload), credits_remaining: 1840 - CREDIT_COSTS.script };
}

// Real Proposal entity is client_id/lead_id/title/content/value/status — no business_name/
// value_estimate/sent_date/project_summary/scope/terms/tiers field exists (checked
// nova-api-reference.md's Proposal Schema). The real schema has no structured place for
// scope/terms/tiers, so fold them into `content` as formatted text instead of silently
// dropping them on a real .create() call (unknown fields are ignored, not saved).
export async function createProposal({ businessName, valueEstimate, projectSummary, scope, terms, tiers }) {
  if (!businessName || !businessName.trim()) throw new Error('Business name is required.');
  const tierLines = (tiers || []).filter((t) => t.name?.trim()).map((t) => `- ${t.name}${t.price ? ` — ${t.price}` : ''}${t.description ? `: ${t.description}` : ''}`);
  const content = [
    projectSummary && `Summary:\n${projectSummary}`,
    scope && `Scope of work:\n${scope}`,
    tierLines.length && `Pricing tiers:\n${tierLines.join('\n')}`,
    terms && `Terms:\n${terms}`,
  ].filter(Boolean).join('\n\n');
  const payload = {
    title: businessName,
    status: 'draft',
    value: Number(valueEstimate) || 0,
    content,
  };
  if (live()) return window.base44.entities.Proposal.create(payload);
  await delay(300);
  // Mock mode keeps the old flat shape so Contracts.jsx's mock-fallback columns still work.
  const record = { id: String(mockProposalSeq++), business_name: businessName, status: 'draft', value_estimate: payload.value, title: businessName, value: payload.value, content };
  mockProposals.push(record);
  return record;
}
