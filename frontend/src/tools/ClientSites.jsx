import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brush, Eye, Globe, Copy, Trash2 } from 'lucide-react'
import { listSites, duplicateSite, deleteSite } from './api'

// Parity target: 09 - Resources/UI-Reference/client-sites.md.
// Simplification: thumbnails are a themed placeholder block (business name +
// niche), not a live scaled render of the site — wiring a real content_json
// preview here depends on T2's renderer accepting an id/site lookup rather
// than only the 3 fixed fixtures. Noted in BUILD-LOG, not hidden.
// Recolored to T2's dojo/pink theme tokens (frontend/src/index.css `@theme`).

// Real GeneratedSite fields are business_name/industry/status('draft'|'published')/
// subdomain, not this file's original mock shape (title/niche/status:'live'/slug) —
// found live 2026-07-21 (Josh: sites exist and look great but nobody can find them,
// because this card was reading fields that don't exist on the real record, so
// business name showed blank and the live-site link never rendered at all).
const siteName = (s) => s.business_name || s.title || 'Untitled site'
const siteNiche = (s) => s.industry || s.niche || ''
const isPublished = (s) => s.status === 'published' || s.status === 'live'
// Real serve endpoint, confirmed working by T1 (BUILD-LOG 2026-07-21): the Base44 app
// proxies /functions/* on its own public domain, injecting the dispatcher secret
// automatically — no auth needed client-side, just the real public app URL.
const BASE44_APP_URL = 'https://icy-nova-growth-lab.base44.app'
const liveUrl = (s) => (isPublished(s) && s.subdomain ? `${BASE44_APP_URL}/functions/serveSite?subdomain=${s.subdomain}` : null)

// client-sites.md: meta line is `{niche} · {date} · {domain status}`. Real GeneratedSite
// entities carry updated_date/created_date (standard Base44 fields) but no dedicated
// domain-status field — inferring "Connected"/"Not connected" from `custom_domain` since
// that's the only signal available client-side; Domains.jsx (my other owned screen)
// already treats an unset custom_domain the same way.
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—')
const siteMeta = (s) => {
  const niche = siteNiche(s) || 'General'
  const date = formatDate(s.updated_date || s.created_date)
  const domain = s.custom_domain ? 'Connected' : 'Not connected'
  return `${niche} · ${date} · ${domain}`
}

function SiteCard({ site, onDuplicate, onDelete }) {
  const live = liveUrl(site)
  const published = isPublished(site)
  return (
    <div className="nova-card overflow-hidden">
      {/* Dots verified via getComputedStyle against a live tenji.ai site card: 8x8px,
          rgba(255,255,255,.15), rounded-full — plain white, NOT macOS red/amber/green. */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-black/20">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 text-xs text-nova-text-muted">draft preview</span>
      </div>
      <div className="relative h-32 bg-gradient-to-br from-nova-accent/20 to-nova-bg flex items-center justify-center">
        {/* Tried an iframe of the live serveSite URL — loads but renders blank (serveSite likely blocks framing). Reverted to placeholder, see BUILD-LOG. */}
        <span className="text-sm font-medium text-nova-text">{siteName(site)}</span>
        <span className={published ? 'absolute top-2 right-2 nova-pill-live' : 'absolute top-2 right-2 nova-pill-draft'}>
          {published ? 'Live' : 'Draft'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold font-nova-heading text-nova-text">{siteName(site)}</h3>
        <p className="mt-0.5 text-xs text-nova-text-muted">{siteMeta(site)}</p>

        {/* Button row verified via getComputedStyle against a live tenji.ai site card: ONE
            primary pill (134x32, pink gradient, text-xs/semibold, rounded-2xl) + 4 icon-only
            circular buttons (36x32, bg-white/[0.02], border-white/10, muted icon, rounded-2xl),
            all in a single row with a 6px gap — not a 3+2 labeled-button grid. */}
        <div className="mt-3 flex items-center gap-1.5">
          <Link
            to={`/app/designer?id=${site.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-nova-accent to-nova-accent-bright px-3.5 py-2 text-xs font-semibold text-white"
          >
            <Brush className="w-3.5 h-3.5" /> Open Designer
          </Link>
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              title="Preview"
              className="flex h-8 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-nova-text-muted hover:text-nova-text"
            >
              <Eye className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button type="button" disabled title="Preview" className="flex h-8 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-nova-text-muted opacity-50 cursor-not-allowed">
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          <Link
            to="/app/domains"
            title="Domain"
            className="flex h-8 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-nova-text-muted hover:text-nova-text"
          >
            <Globe className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => onDuplicate(site.id)}
            title="Duplicate"
            className="flex h-8 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-nova-text-muted hover:text-nova-text"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(site.id)}
            title="Delete"
            className="flex h-8 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-nova-text-muted hover:text-rose-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientSites() {
  const navigate = useNavigate()
  const [sites, setSites] = useState(null)
  const [error, setError] = useState('')

  const load = () => listSites().then(setSites).catch((err) => setError(err.message || 'Failed to load sites.'))
  useEffect(() => { load() }, [])

  const handleDuplicate = async (id) => {
    if (sites.length >= 3) return // conservative client-side mirror of the 3-site trial cap; server enforces the real gate
    await duplicateSite(id)
    load()
  }
  const handleDelete = async (id) => {
    await deleteSite(id)
    load()
  }

  const liveCount = sites?.filter(isPublished).length ?? 0

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-nova-accent mb-1">Designer</p>
          <h1 className="text-xl font-semibold font-nova-heading text-nova-text mb-1">Client Sites</h1>
          <p className="text-sm text-nova-text-muted">
            All generated and published websites for your leads and clients.
          </p>
        </div>
        <button type="button" onClick={() => navigate('/app/leads')} className="shrink-0 nova-btn-primary">
          Generate New Site
        </button>
      </div>

      {sites && (
        // Verified via getComputedStyle against a live tenji.ai site card: rounded-xl (not
        // full pill), bg-white/[0.04], border-white/[0.08], muted text, dot is white/25.
        <p className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-nova-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" /> {liveCount} of {sites.length} published
        </p>
      )}

      {error && (
        <div className="rounded-md bg-rose-900/30 px-3 py-2 text-sm text-rose-300">
          {error}
        </div>
      )}
      {!error && sites === null && <p className="text-sm text-nova-text-muted">Loading…</p>}
      {!error && sites && sites.length === 0 && (
        <p className="text-sm text-nova-text-muted">No sites yet — generate your first one.</p>
      )}
      {!error && sites && sites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
