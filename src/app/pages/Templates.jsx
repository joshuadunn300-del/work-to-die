import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Wand2 } from 'lucide-react'
import { CATEGORIES, TEMPLATES as FALLBACK_TEMPLATES } from '../lib/templateCatalog'
import { createSiteFromTemplate, listSiteTemplates } from '../lib/api'
import { getNicheImages } from '../../lib/imageLibrary'

// Real Tenji per-category accent bar color (verified against tenji-Templates.png: blue
// under Plumbing/TRADES, amber under Electricians/TRADES... same category → same color).
const ACCENTS = {
  TRADES: '#3b82f6', 'HOME SERVICES': '#0ea5e9', OUTDOOR: '#10b981',
  AUTOMOTIVE: '#64748b', HEALTH: '#f43f5e', 'HEALTH & FITNESS': '#84cc16',
  BEAUTY: '#d946ef', HOSPITALITY: '#f97316', CUSTOM: '#f2386f',
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
// Reverse lookup: real seeded SiteTemplate rows only carry a `niche` slug, not a
// category — resolve it back via the catalog's own human-readable niche list.
const CATEGORY_BY_SLUG = Object.fromEntries(
  Object.entries(CATEGORIES).flatMap(([category, niches]) => niches.map((n) => [slugify(n), category]))
)
// The real seeded SiteTemplate niche slugs don't always textually match the catalog's
// human-readable names (e.g. "carpet-cleaning" vs catalog's "Carpet Cleaners", or
// "handyman"/"cleaning"/"fitness"/"security"/"solar" which aren't literal catalog
// entries at all) — explicit overrides for the 26 real seeded niches, confirmed via
// direct API query 2026-07-21.
const CATEGORY_SLUG_OVERRIDES = {
  'carpet-cleaning': 'HOME SERVICES', handyman: 'TRADES', cleaning: 'HOME SERVICES',
  security: 'HOME SERVICES', solar: 'TRADES', fitness: 'HEALTH & FITNESS',
  'garage-door': 'HOME SERVICES', 'bathroom-renovation': 'TRADES', 'smash-repair': 'AUTOMOTIVE',
  hvac: 'TRADES', builders: 'TRADES', catering: 'HOSPITALITY',
}

// Real seeded SiteTemplate rows only have `niche` (a slug, e.g. "carpet-cleaning") +
// `content_json` — no display name/category/desc fields. Derive a label from the slug
// and pull a description straight out of the real hero copy, so the card shows real
// seeded content rather than invented text.
const label = (t) => (t.category ? t.niche : t.niche.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
const categoryOf = (t) => {
  const slug = slugify(t.niche)
  return t.category || CATEGORY_BY_SLUG[slug] || CATEGORY_SLUG_OVERRIDES[slug] || null
}
const desc = (t) => {
  if (t.desc) return t.desc
  const hero = t.content_json?.sections?.find((s) => s.type === 'hero')?.props
  return hero?.subtext || hero?.headline || `Premium ${label(t).toLowerCase()} website, ready to customise in seconds.`
}

export default function Templates() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES)
  const [search, setSearch] = useState('')
  const [activeNiche, setActiveNiche] = useState(null)
  const [form, setForm] = useState({ business_name: '', phone: '', location: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listSiteTemplates().then((rows) => {
      if (rows && rows.length) setTemplates(rows)
    })
  }, [])

  const filtered = templates.filter((t) => label(t).toLowerCase().includes(search.toLowerCase()))

  async function handleUseTemplate(e) {
    e.preventDefault()
    if (!form.business_name.trim()) return
    setBusy(true)
    setError('')
    try {
      const site = await createSiteFromTemplate({ niche: activeNiche, ...form })
      navigate(`/app/designer?id=${site.id}`)
    } catch (err) {
      setError(err.message || 'Failed to create site from template.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="nova-eyebrow mb-1">Studio</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight leading-[1.3]">Templates</h1>
      <p className="mt-2 text-sm text-nova-text-muted max-w-2xl mb-6">
        Conversion-focused website templates for every local business niche. Pick one and import a lead to auto-fill it.
      </p>
      <div className="relative mb-6 w-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-xl bg-white/[0.04] border border-white/10 focus:border-primary/50 focus:outline-none pl-9 pr-4 py-2.5 text-sm transition-colors"
        />
      </div>

      {activeNiche && (
        <form onSubmit={handleUseTemplate} className="mb-6 nova-card p-4">
          <p className="text-sm font-medium mb-3">
            New {activeNiche.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} site — free, no credits used
          </p>
          {error && (
            <div className="mb-3 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              placeholder="Business name"
              value={form.business_name}
              onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
              className="flex-1 min-w-[160px] nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="flex-1 min-w-[160px] nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="flex-1 min-w-[160px] nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy} className="nova-btn-primary disabled:opacity-50">
              {busy ? 'Creating…' : 'Create site'}
            </button>
            <button type="button" onClick={() => setActiveNiche(null)} className="text-sm text-nova-text-muted">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="nova-card overflow-hidden flex flex-col">
          <div className="aspect-[16/10] bg-nova-accent/10 flex items-center justify-center">
            <div className="nova-icon-tile" style={{ width: 64, height: 64 }}>
              <Wand2 className="h-7 w-7" strokeWidth={1.5} />
            </div>
          </div>
          <div className="h-1 w-16 rounded-full ml-4 mt-3" style={{ backgroundColor: ACCENTS.CUSTOM }} />
          <div className="p-4 pt-3 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium">Create Your Own</h3>
              <span className="nova-pill-label shrink-0">CUSTOM</span>
            </div>
            <p className="text-sm text-nova-text-muted mb-3 flex-1">
              Start from a fully editable blank template, perfect for any niche we don't list yet. Customize every section.
            </p>
            <button type="button" onClick={() => setActiveNiche('custom')} className="text-sm font-medium text-nova-accent">
              Use Template ↗
            </button>
          </div>
        </div>

        {filtered.map((t) => {
          const category = categoryOf(t)
          return (
            <div key={t.id || t.niche} className="nova-card overflow-hidden flex flex-col">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={getNicheImages(t.niche).hero} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="h-1 w-16 rounded-full ml-4 mt-3" style={{ backgroundColor: ACCENTS[category] || ACCENTS.CUSTOM }} />
              <div className="p-4 pt-3 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium">{label(t)}</h3>
                  {category && <span className="nova-pill-label shrink-0">{category}</span>}
                </div>
                <p className="text-sm text-nova-text-muted mb-3 line-clamp-2 flex-1">{desc(t)}</p>
                <button type="button" onClick={() => setActiveNiche(t.niche)} className="text-sm font-medium text-nova-accent">
                  Use Template ↗
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
