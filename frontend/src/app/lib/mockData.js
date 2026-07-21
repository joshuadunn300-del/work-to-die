// TEMPORARY mock data — replaces Terminal 1's Base44 entities until they're live.
// Every export here mirrors the entity fields in Tenji-Full-Breakdown.md §DATABASE ENTITIES.

let idSeq = 1
export const nextId = () => String(idSeq++)

export const mockEntitlements = {
  plan: 'pro',
  credits: 1840,
  monthly_credits: 2500,
  credits_reset_at: '2026-08-01',
  trial_ends_at: null,
}

export const mockLeads = [
  { id: nextId(), business_name: "Riverside Plumbing Co", phone: '(555) 011-2234', website: null, address: '482 Elm St, Austin, TX', rating: 4.6, review_count: 87, maps_url: '#', place_id: 'p1', website_status: 'none', niche: 'plumber', created_date: '2026-07-18' },
  { id: nextId(), business_name: "Summit Roofing & Restoration", phone: '(555) 018-9931', website: 'summitroofing.example', address: '19 Ridge Rd, Denver, CO', rating: 4.2, review_count: 143, maps_url: '#', place_id: 'p2', website_status: 'poor', niche: 'roofer', created_date: '2026-07-18' },
  { id: nextId(), business_name: "Bright Spark Electrical", phone: '(555) 044-1120', website: 'brightsparkelectric.example', address: '7 Watt Ave, Phoenix, AZ', rating: 4.9, review_count: 62, maps_url: '#', place_id: 'p3', website_status: 'decent', niche: 'electrician', created_date: '2026-07-19' },
]

export const mockClients = [
  { id: nextId(), business_name: 'Bright Spark Electrical', contact_name: 'Dana Ruiz', email: 'dana@brightspark.example', phone: '(555) 044-1120', status: 'active', mrr: 149, created_date: '2026-06-02' },
  { id: nextId(), business_name: "Coastal Cleaning Services", contact_name: 'Marcus Lee', email: 'marcus@coastalclean.example', phone: '(555) 077-4410', status: 'onboarding', mrr: 99, created_date: '2026-07-10' },
]

export const mockTasks = [
  { id: nextId(), title: 'Follow up with Riverside Plumbing', related_to: 'Riverside Plumbing Co', due_date: '2026-07-22', status: 'open', priority: 'high' },
  { id: nextId(), title: 'Send Summit Roofing proposal', related_to: 'Summit Roofing & Restoration', due_date: '2026-07-21', status: 'open', priority: 'medium' },
  { id: nextId(), title: 'Renew Bright Spark contract', related_to: 'Bright Spark Electrical', due_date: '2026-08-01', status: 'done', priority: 'low' },
]

export const mockNotifications = [
  { id: nextId(), title: 'Site published', body: 'Demo site for Riverside Plumbing Co is live.', read: false, created_date: '2026-07-19T10:00:00' },
  { id: nextId(), title: 'Credits running low', body: '18% of your monthly credits remain.', read: false, created_date: '2026-07-18T09:00:00' },
  { id: nextId(), title: 'New lead capture', body: 'A lead submitted the form on Bright Spark Electrical demo.', read: true, created_date: '2026-07-15T14:22:00' },
]

export const mockContracts = [
  { id: nextId(), client: 'Bright Spark Electrical', value: 1788, status: 'signed', start_date: '2026-06-05' },
]

export const mockProposals = [
  { id: nextId(), business_name: 'Summit Roofing & Restoration', status: 'sent', value_estimate: 1200, sent_date: '2026-07-19' },
]

export const mockSupportTickets = [
  { id: nextId(), subject: "Can't republish a site", status: 'open', priority: 'normal', created_date: '2026-07-17' },
]

export const mockSettings = {
  full_name: 'Josh Dunn',
  agency_name: '',
  agency_bio: '',
  brand_name: 'Nova',
  brand_description: 'AI-powered lead-to-client agency toolkit.',
  logo_url: null,
  // Real Tenji's default brand colour is its own accent pink (#F2386F) — verified
  // against settings.md's literal spec ("Default brand colour ... hex #F2386F"),
  // not an arbitrary indigo default.
  palette_preset: 'nova',
  custom_primary: null,
  custom_secondary: null,
  theme: 'dark',
  discord_connected: false,
  email_notifications: { product_updates: true, billing_credits: true, tips_playbooks: false },
}

export const PALETTE_PRESETS = {
  nova: { primary: '#F2386F', secondary: '#15171f' },
  indigo: { primary: '#4f46e5', secondary: '#111827' },
  crimson: { primary: '#9D174D', secondary: '#15171f' },
  emerald: { primary: '#047857', secondary: '#0f172a' },
  amber: { primary: '#b45309', secondary: '#1c1917' },
  slate: { primary: '#334155', secondary: '#0f172a' },
  ocean: { primary: '#0369a1', secondary: '#082f49' },
}
