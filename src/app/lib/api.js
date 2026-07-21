// TEMPORARY adapter: calls Terminal 1's Base44 functions when available (window.base44),
// else falls back to in-memory mock data. Replace the `live` branch check once T1 logs
// its functions as deployed — this file is the ONLY place that needs to change.
import * as mock from './mockData'
import { CREDIT_COSTS } from './entitlements'

const live = () => typeof window !== 'undefined' && !!window.base44

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

// base44.functions is a single generic invoker, not one method per function
// (verified against T1's SDK findings 2026-07-20) — invoke(name, args) returns
// { data: <the function's return value> }.
async function invokeFn(name, args) {
  const { data } = await window.base44.functions.invoke(name, args)
  return data
}

// in-memory mutable copies so list screens can toggle/create without a backend
const state = {
  leads: [...mock.mockLeads],
  clients: [...mock.mockClients],
  tasks: [...mock.mockTasks],
  notifications: [...mock.mockNotifications],
  contracts: [...mock.mockContracts],
  proposals: [...mock.mockProposals],
  tickets: [...mock.mockSupportTickets],
  settings: { ...mock.mockSettings },
  entitlements: { ...mock.mockEntitlements },
}

export async function getEntitlements() {
  if (live()) return invokeFn('getEntitlements')
  await delay(150)
  return { ...state.entitlements }
}

// Starts a real Stripe Checkout for a paid plan (starter|pro|agency) and returns
// { url } for the caller to redirect to. interval: 'monthly' | 'annual'. Needs the
// live backend (the createCheckout Base44 function holds the Stripe secret key) —
// mock mode has no Stripe, so it throws a clear message instead of faking a URL.
export async function startCheckout({ plan, interval = 'monthly' }) {
  if (live()) {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return invokeFn('createCheckout', { plan, interval, origin })
  }
  await delay(200)
  throw new Error('Checkout needs the live backend — connect Stripe to enable payments.')
}

export async function listSiteTemplates() {
  if (live()) return window.base44.entities.SiteTemplate.list()
  await delay(150)
  return []
}

export async function createSiteFromTemplate({ niche, business_name, phone, location }) {
  if (live()) return invokeFn('createSiteFromTemplate', { niche, business_name, phone, location })
  await delay(300)
  return { id: mock.nextId(), niche, business_name, status: 'draft' }
}

export async function generateSite({ business_name, industry, location, phone, services, cta_text, brand_color }) {
  // Real generateSite requires all 7 fields (found live 2026-07-21 via a 400: "business_name,
  // industry, location, phone, services, cta_text, and brand_color are required") — apply
  // sensible defaults for whichever the caller doesn't have (e.g. a lead with no services
  // list yet), rather than making every call site build all 7 itself.
  const payload = {
    business_name,
    industry,
    location,
    phone: phone || '',
    services: services && services.length ? services : [industry || 'General services'],
    cta_text: cta_text || 'Get a Free Quote',
    brand_color: brand_color || '#f2386f',
  }
  if (live()) return invokeFn('generateSite', payload)
  await delay(600)
  return { id: mock.nextId(), business_name, industry, status: 'draft' }
}

export async function searchLeads({ niche, location, limit }) {
  if (live()) {
    // Real searchLeads returns { leads, credits_used, balance_after }, not a bare
    // array — crashed DataTable's rows.map() until this unwrap (found live 2026-07-21).
    const { leads } = await invokeFn('searchLeads', { niche, location, limit })
    return leads || []
  }
  await delay(600)
  if (state.entitlements.credits < CREDIT_COSTS.search) {
    throw new Error('Not enough credits to run a search.')
  }
  state.entitlements.credits -= CREDIT_COSTS.search
  if (!niche || !location) return []
  // deterministic mock results seeded by input so repeated searches feel real
  const results = state.leads.filter((l) =>
    l.niche.toLowerCase().includes(niche.toLowerCase().slice(0, 4)) || true
  )
  return results
}

export async function listLeads() {
  if (live()) return window.base44.entities.Lead.list()
  await delay(200)
  return [...state.leads]
}

export async function updateLead(id, patch) {
  if (live()) return window.base44.entities.Lead.update(id, patch)
  await delay(150)
  const l = state.leads.find((x) => x.id === id)
  if (l) Object.assign(l, patch)
  return l
}

export async function listClients() {
  if (live()) return window.base44.entities.Client.list()
  await delay(200)
  return [...state.clients]
}

// Real Client entity is `name`/`company`/`email`/`phone`/`status`[active|paused|churned]/
// `monthly_value`/`notes` — no `business_name`/`contact_name`/`mrr` and no 'onboarding'
// status value exist on the real schema (checked nova-api-reference.md's Client Schema
// section). A real .create() with the old fields would either silently drop unknown keys
// or 400 on the invalid enum value. Params kept as business_name/contact_name at the
// call site (Clients.jsx form labels) but mapped to the real field names here.
export async function createClient({ business_name, contact_name, email, mrr = 0 }) {
  if (live()) return window.base44.entities.Client.create({ company: business_name, name: contact_name, email, monthly_value: mrr, status: 'active' })
  await delay(150)
  const client = { id: mock.nextId(), business_name, contact_name, email, mrr, status: 'active', created_date: new Date().toISOString().slice(0, 10) }
  state.clients.unshift(client)
  return client
}

export async function listTasks() {
  if (live()) return window.base44.entities.Task.list()
  await delay(200)
  return [...state.tasks]
}

export async function updateTask(id, patch) {
  if (live()) return window.base44.entities.Task.update(id, patch)
  await delay(150)
  const t = state.tasks.find((x) => x.id === id)
  if (t) Object.assign(t, patch)
  return t
}

export async function createTask({ title, due_date, priority = 'medium' }) {
  if (live()) return window.base44.entities.Task.create({ title, due_date, priority, status: 'open' })
  await delay(150)
  const task = { id: mock.nextId(), title, due_date, priority, status: 'open', related_to: '' }
  state.tasks.unshift(task)
  return task
}

export async function listNotifications() {
  if (live()) return window.base44.entities.Notification.list()
  await delay(200)
  return [...state.notifications]
}

export async function markNotificationRead(id) {
  if (live()) return window.base44.entities.Notification.update(id, { read: true })
  await delay(100)
  const n = state.notifications.find((x) => x.id === id)
  if (n) n.read = true
  return n
}

export async function listContracts() {
  if (live()) return window.base44.entities.Contract.list()
  await delay(200)
  return [...state.contracts]
}

export async function listProposals() {
  if (live()) return window.base44.entities.Proposal.list()
  await delay(200)
  return [...state.proposals]
}

export async function listSupportTickets() {
  if (live()) return window.base44.entities.SupportTicket.list()
  await delay(200)
  return [...state.tickets]
}

// Real SupportTicket priority enum is low/medium/high — 'normal' isn't a valid value
// (checked nova-api-reference.md's SupportTicket Schema section) and would 400 on create.
export async function createSupportTicket({ subject, priority = 'medium' }) {
  if (live()) return window.base44.entities.SupportTicket.create({ subject, message: subject, priority, status: 'open' })
  await delay(150)
  const ticket = { id: mock.nextId(), subject, priority, status: 'open', created_date: new Date().toISOString().slice(0, 10) }
  state.tickets.unshift(ticket)
  return ticket
}

// Real User entity's agency/branding fields are agency_brand_name/agency_description/
// agency_logo_url/agency_brand_colors (checked nova-api-reference.md's User Schema) — none
// of Settings.jsx's field names (agency_name/agency_bio/logo_url/palette_preset/
// custom_primary/custom_secondary) exist on the real entity, so raw auth.me()/updateMe()
// silently dropped every branding edit. Map at this single choke point instead of touching
// every read site in Settings.jsx. `theme`/`discord_connected`/`email_notifications` have
// no real backing field at all (not in the documented User schema) — kept as session-only
// UI state; they won't persist across a reload or another device until a real field exists.
export async function getSettings() {
  if (live()) {
    const u = await window.base44.auth.me()
    const colors = u.agency_brand_colors || {}
    return {
      full_name: u.full_name || '',
      agency_name: u.agency_brand_name || '',
      agency_bio: u.agency_description || '',
      logo_url: u.agency_logo_url || null,
      // Real Tenji's default brand colour is its own accent pink (#F2386F/'nova' preset),
      // not indigo — confirmed against settings.md's literal spec.
      palette_preset: colors.preset || 'nova',
      custom_primary: colors.primary || null,
      custom_secondary: colors.secondary || null,
      theme: 'dark',
      discord_connected: false,
      email_notifications: { product_updates: true, billing_credits: true, tips_playbooks: false },
    }
  }
  await delay(150)
  return { ...state.settings }
}

export async function updateSettings(patch) {
  if (live()) {
    return window.base44.auth.updateMe({
      full_name: patch.full_name,
      agency_brand_name: patch.agency_name,
      agency_description: patch.agency_bio,
      agency_logo_url: patch.logo_url,
      agency_brand_colors: { preset: patch.palette_preset, primary: patch.custom_primary, secondary: patch.custom_secondary },
    })
  }
  await delay(200)
  Object.assign(state.settings, patch)
  return { ...state.settings }
}
