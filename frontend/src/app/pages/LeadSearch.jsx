import { useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { Briefcase, MapPin, Search, Sparkles, Swords, Trophy } from 'lucide-react'
import { generateSite, searchLeads } from '../lib/api'
import { hasCredits } from '../lib/entitlements'
import { isHottest, leadScore, sortByScoreDesc } from '../lib/leadScore'
import WebsiteStatusBadge from '../components/StatusBadge'

const SUGGESTIONS = [
  { niche: 'emergency plumber', location: 'Bondi, Sydney' },
  { niche: 'web designer', location: 'Melbourne, AU' },
  { niche: 'HVAC contractor', location: 'Sydney, NSW' },
]

const RESULT_COUNTS = [10, 25, 50, 100]

const FEATURES = [
  { Icon: Search, title: 'Fresh Local Leads', desc: 'Real-style local businesses pulled for any niche and city.' },
  { Icon: Swords, title: 'Instant Site Audit', desc: 'We check website quality, weaknesses, and missing presence.' },
  { Icon: Trophy, title: 'Opportunity Scoring', desc: 'Know exactly who to call first based on how easy they are to pitch.' },
]

// Real Base44 Lead entity fields are `name`/`google_rating`/`google_maps_url`, not
// `business_name`/`rating`/`maps_url` (my mock's naming) — found live 2026-07-21 when a
// real Google Places search rendered "—" for every business name and "undefined★" for
// every rating. Guard both shapes rather than picking one, so mock mode keeps working.
const leadName = (l) => l.business_name || l.name || ''
const leadRating = (l) => l.rating ?? l.google_rating
const leadMapsUrl = (l) => l.maps_url || l.google_maps_url || '#'
// No explicit weakness field on the real Lead entity — derive one of the rubric's
// verbatim weakness values from website_status, the closest real signal we have.
const leadWeakness = (l) => ({ none: 'No website', poor: 'Outdated design', decent: null }[l.website_status] ?? null)

function OppRing({ score, hot }) {
  const pct = Math.max(0, Math.min(100, score))
  return (
    <div
      className="relative shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        background: `conic-gradient(${hot ? '#f2386f' : '#ff8fb0'} calc(${pct} * 1%), rgba(255,255,255,0.08) 0)`,
      }}
    >
      <div className="rounded-full bg-nova-bg flex items-center justify-center text-[11px] font-semibold" style={{ width: 32, height: 32 }}>
        {score}
      </div>
    </div>
  )
}

export default function LeadSearch() {
  const { entitlements, refreshEntitlements } = useOutletContext()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [niche, setNiche] = useState(state?.niche || '')
  const [location, setLocation] = useState('')
  const [resultCount, setResultCount] = useState(10)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [searched, setSearched] = useState(false)
  const [generatingId, setGeneratingId] = useState(null)

  const affordable = hasCredits(entitlements, 'search')
  const canGenerate = hasCredits(entitlements, 'generateSite')

  function applySuggestion(s) {
    setNiche(s.niche)
    setLocation(s.location)
  }

  async function handleGenerate(lead) {
    const key = lead.place_id || leadMapsUrl(lead)
    setGeneratingId(key)
    setError('')
    try {
      const site = await generateSite({ business_name: leadName(lead), industry: niche, location, phone: lead.phone })
      refreshEntitlements()
      navigate(`/app/designer?id=${site.id}`)
    } catch (err) {
      setError(err.message || 'Site generation failed.')
    } finally {
      setGeneratingId(null)
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    setError('')
    if (!niche.trim() || !location.trim()) {
      setError('Enter both a niche and a location.')
      return
    }
    setBusy(true)
    try {
      const rows = await searchLeads({ niche: niche.trim(), location: location.trim(), limit: resultCount })
      setResults(rows)
      setSearched(true)
      refreshEntitlements()
    } catch (err) {
      setError(err.message || 'Search failed.')
    } finally {
      setBusy(false)
    }
  }

  const sorted = sortByScoreDesc(results || [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        {/* Real Tenji: plain uppercase eyebrow text here, NOT the pill/kanji badge —
            that treatment is Dashboard-hero-only (verified against tenji-LeadSearch.png,
            a real live capture, 2026-07-21). */}
        <p className="nova-eyebrow mb-1">AI Lead Discovery</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight leading-[1.3] mb-2">Find your next client.</h1>
        <p className="text-sm text-nova-text-muted max-w-2xl">
          Search local businesses by niche and location. Nova audits their site, scores the opportunity, and shows you who to pitch first.
        </p>
      </div>

      {/* Real Tenji keeps a large low-opacity watermark glyph on this card (verified
          against tenji-LeadSearch.png). CLEANUP SWEEP (2026-07-21): was rendering the
          literal 天 kanji via .nova-kanji-watermark's CSS content — global rule 3 forbids
          shipping Tenji's literal kanji marks in Nova chrome, swapped for a lucide icon in
          the same watermark slot (matches the same fix already applied to Dashboard.jsx). */}
      <form onSubmit={handleSearch} className="relative overflow-hidden nova-card p-6 md:p-8 mb-8">
        <Sparkles
          className="absolute -right-4 -top-4 text-primary/10 select-none hidden md:block pointer-events-none"
          style={{ width: '9rem', height: '9rem' }}
          strokeWidth={1}
        />
        <div className="relative">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="nova-search-label mb-1.5 block">Niche / Business Type</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-text-muted" />
                <input
                  placeholder="e.g. plumber, HVAC, pest control"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="nova-search-input nova-input-focus w-full"
                />
              </div>
            </div>
            <div>
              <label className="nova-search-label mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-text-muted" />
                <input
                  placeholder="e.g. Sydney, AU"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="nova-search-input nova-input-focus w-full"
                />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs text-nova-text-muted mb-2">Try a suggestion:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s.niche} type="button" onClick={() => applySuggestion(s)} className="nova-suggestion-chip hover:text-nova-text transition-colors">
                  {s.niche} · {s.location}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="nova-search-label mb-1.5 block">Results to Scrape</label>
            {/* Real Tenji: individual full-pill buttons with gaps, NOT a fused
                bordered segmented bar (verified against tenji-LeadSearch.png). */}
            <div className="flex flex-wrap gap-2">
              {RESULT_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setResultCount(n)}
                  className={n === resultCount ? 'nova-toggle-pill nova-toggle-pill-active' : 'nova-toggle-pill'}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={busy || !affordable} className="nova-btn-primary w-full !py-3 gap-2">
            <Sparkles className="h-4 w-4" />
            {busy ? 'Generating…' : `Generate ${resultCount} Leads · ${resultCount} credits`}
          </button>
          <p className="mt-2 text-center text-xs text-nova-text-muted">
            1 credit per result returned · charged only on success
          </p>

          {!affordable && (
            <div className="mt-4 rounded-md bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
              Not enough credits for a search.
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}
        </div>
      </form>

      {!searched && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="nova-card p-5">
              <div className="nova-icon-tile mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-sm text-nova-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      )}

      {searched && (
        <div className="space-y-3">
          {sorted.length === 0 ? (
            <div className="nova-card border-dashed p-10 text-center text-sm text-nova-text-muted">
              No businesses matched that search — try a broader niche or location.
            </div>
          ) : (
            sorted.map((r) => {
              const key = r.place_id || leadMapsUrl(r)
              const weakness = leadWeakness(r)
              return (
                <div key={key} className="nova-card p-4 flex items-center gap-4">
                  <OppRing score={leadScore(r)} hot={isHottest(r)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{leadName(r) || '—'}</p>
                    <p className="text-xs text-nova-text-muted">
                      {leadRating(r) ?? '—'} ★ · {r.review_count ?? 0} reviews · {r.phone || '—'}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <WebsiteStatusBadge status={r.website_status} />
                      {weakness && (
                        <span className="rounded-full bg-white/[0.04] border border-nova-border px-2 py-0.5 text-[11px] text-nova-text-muted">
                          {weakness}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!canGenerate || generatingId === key}
                    onClick={() => handleGenerate(r)}
                    className="nova-btn-secondary shrink-0 disabled:opacity-50"
                  >
                    {generatingId === key ? 'Generating…' : 'Generate Site'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
