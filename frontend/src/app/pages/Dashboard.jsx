import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Search, Globe, MessageSquare, SquarePen, LayoutTemplate, Kanban,
  Users, Phone, Flame, Trophy, Briefcase, SquareCheck, DollarSign, Coins,
  Calendar, ArrowRight, Sparkles,
} from 'lucide-react'
import { getSession } from '../lib/auth'
import { listLeads, listClients, listTasks } from '../lib/api'
import { listSites } from '../../tools/api'
import { planOf } from '../lib/entitlements'
import samurai from '../../assets/samurai.png'

// Real Tenji greets by first name only ("Good afternoon, Josh") even with a full name set.
// When the stored name is email-ish (no space — e.g. "joshua.dunn300+novaqa", the local-part
// of a test account's email with no real full_name set), take the substring before the first
// '@' or '.' and capitalize it instead of printing the whole email-like string verbatim.
const firstName = (name) => {
  if (!name) return name
  if (name.includes(' ')) return name.split(' ')[0]
  const base = name.split('@')[0].split('.')[0].split('+')[0]
  return base.charAt(0).toUpperCase() + base.slice(1)
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

// Petal positions/timing from the real decompiled Dashboard (reference/tenji-frontend-components.js).
const PETALS = [
  { l: '62%', s: 7, d: 11, delay: 0 },
  { l: '74%', s: 5, d: 14, delay: 2.5 },
  { l: '84%', s: 8, d: 12, delay: 1.2 },
  { l: '92%', s: 5, d: 15, delay: 4 },
  { l: '68%', s: 6, d: 13, delay: 5.5 },
]

// Matches the live Tenji dashboard exactly (reference/tenji-Dashboard.png, verified 2026-07-21
// against the reactivated real account) — 6 actions, 2 rows of 3, same labels/order/costs/icons.
const QUICK_ACTIONS = [
  { to: '/app/leads', label: 'Generate Leads', desc: 'Find local businesses to pitch', cost: '10 credits', Icon: Search },
  { to: '/app/templates', label: 'Website Mockup', desc: 'Generate a premium client site', cost: '20 credits', Icon: Globe },
  { to: '/app/scripts', label: 'Create Script', desc: 'Cold call, DM, or email scripts', cost: '3 credits', Icon: MessageSquare },
  { to: '/app/contracts', label: 'Create Contract', desc: 'Lock clients into a monthly retainer', cost: 'Free', Icon: SquarePen },
  { to: '/app/templates', label: 'Browse Templates', desc: 'Niche-ready website designs', cost: 'Free', Icon: LayoutTemplate },
  { to: '/app/tracker', label: 'Open Tracker', desc: 'Manage your pipeline', cost: 'Free', Icon: Kanban },
]

export default function Dashboard() {
  const session = getSession()
  const navigate = useNavigate()
  const { entitlements } = useOutletContext()
  const [leads, setLeads] = useState([])
  const [clients, setClients] = useState([])
  const [tasks, setTasks] = useState([])
  const [sites, setSites] = useState([])

  useEffect(() => {
    listLeads().then(setLeads).catch(() => {})
    listClients().then(setClients).catch(() => {})
    listTasks().then(setTasks).catch(() => {})
    listSites().then(setSites).catch(() => {})
  }, [])

  // Real Lead field is `status` (enum new/contacted/demo_sent/closed/lost), not `stage`.
  // Real Client field is `monthly_value`, not `mrr`.
  const byStatus = (status) => leads.filter((l) => l && l.status === status).length
  const activeClients = clients.filter((c) => c.status === 'active')
  const mrr = activeClients.reduce((sum, c) => sum + (c.monthly_value ?? c.mrr ?? 0), 0)
  const openTasks = tasks.filter((t) => t.status !== 'done').length
  const todaysFollowUps = tasks.filter((t) => t.status !== 'done' && t.due_date === new Date().toISOString().slice(0, 10))
  const plan = planOf(entitlements)
  const creditsLeft = entitlements?.credits ?? 0
  const creditsPct = plan.monthlyCredits ? Math.round((creditsLeft / plan.monthlyCredits) * 100) : 0

  // 8 stats in the exact real Tenji layout (reference/tenji-Dashboard.png): 2 large cards
  // (Recurring Revenue, Credits Left with a % ring) then 2 rows of 3 smaller cards — not a
  // flat 7-col row, and "Contacted" was missing from the flat version entirely.
  const SMALL_STATS = [
    { label: 'Total Leads', value: leads.length, Icon: Users },
    { label: 'Contacted', value: byStatus('contacted'), Icon: Phone },
    { label: 'Interested', value: byStatus('demo_sent'), Icon: Flame },
    { label: 'Closed', value: byStatus('closed'), Icon: Trophy },
    { label: 'Active Clients', value: activeClients.length, Icon: Briefcase },
    { label: 'Open Tasks', value: openTasks, Icon: SquareCheck },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero — from the real decompiled Dashboard component (reference/tenji-frontend-components.js).
          framer-motion entrance/shimmer animations aren't ported (library isn't installed here),
          everything else — glass-panel, grid-drift, falling petals, kanji watermark, badge pill,
          the real samurai illustration with its exact blend/filter/mask recipe — is. */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-primary/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -inset-[60px] opacity-[0.04] animate-grid-drift-slow will-change-transform"
            style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {PETALS.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-[50%_0_50%_0] bg-[radial-gradient(ellipse_at_30%_30%,hsl(335_85%_60%),transparent)]"
              style={{
                left: p.l,
                top: '-14px',
                width: p.s,
                height: p.s,
                opacity: 0.5,
                animation: `dash-petal ${p.d}s linear ${p.delay}s infinite`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        {/* Real Tenji samurai illustration — exact blend/filter/mask from the decompiled JSX. */}
        <img
          src={samurai}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-0 w-[280px] md:w-[360px] h-auto pointer-events-none select-none mix-blend-screen"
          style={{
            filter: 'saturate(0.55) brightness(0.85)',
            maskImage: 'radial-gradient(ellipse 62% 68% at 45% 48%, black 38%, transparent 74%)',
            WebkitMaskImage: 'radial-gradient(ellipse 62% 68% at 45% 48%, black 38%, transparent 74%)',
          }}
        />

        {/* Kanji watermark slot kept, glyph swapped for a lucide icon — UI-PARITY-ORDERS
            global rule 3: keep Tenji's layout slots, never ship the literal 天/探/刀/勝
            kanji in Nova chrome (D3 will re-skin this brand mark later). */}
        <Sparkles
          className="absolute top-6 right-8 text-primary/10 select-none hidden md:block z-[2]"
          style={{ width: '7rem', height: '7rem' }}
          strokeWidth={1}
        />

        <div className="relative">
          <span className="relative z-10 inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs text-accent font-medium">
            <Sparkles size={12} /> Nova
          </span>
          <h1 className="relative z-10 font-display text-3xl md:text-5xl font-semibold tracking-tight">
            {greeting()}, <span className="animated-gradient-text">{firstName(session?.name) || 'there'}</span>
          </h1>
          <p className="relative z-10 mt-3 text-muted-foreground max-w-xl">
            Your agency command center is ready. Search a niche, generate a mockup, write the pitch, and track the deal.
          </p>
          <div className="relative z-10 mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate('/app/leads')} className="nova-btn-primary nova-btn-sheen h-12 px-6 inline-flex items-center gap-2">
              Find New Clients <ArrowRight size={16} />
            </button>
            <button type="button" onClick={() => navigate('/app/sites')} className="inline-flex items-center justify-center px-6 py-3 rounded-xl glass-panel font-medium hover:border-primary/40 transition-colors h-12">
              Create Client Site
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Performance</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="nova-stat-card nova-card-active flex items-center justify-between">
            <div>
              <div className="nova-icon-tile mb-3"><DollarSign size={18} /></div>
              <p className="nova-stat-label-lg">Recurring Revenue</p>
              <p className="nova-stat-value-lg">${mrr}</p>
            </div>
            <span className="nova-badge-pill">↗ MONTHLY</span>
          </div>
          <div className="nova-stat-card flex items-center justify-between">
            <div>
              <div className="nova-icon-tile nova-icon-tile-muted mb-3"><Coins size={18} /></div>
              <p className="nova-stat-label mb-1">Credits Left</p>
              <p className="nova-stat-value-plain">{creditsLeft.toLocaleString()}</p>
              <p className="text-xs text-nova-text-muted mt-1">of {plan.monthlyCredits.toLocaleString()} · {plan.name || 'Free Trial'}</p>
            </div>
            <div className="nova-credit-ring shrink-0" style={{ '--pct': creditsPct }}>
              <span className="nova-credit-ring-inner">{creditsPct}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {SMALL_STATS.map((s) => (
            <div key={s.label} className="nova-stat-card">
              <div className="nova-icon-tile nova-icon-tile-muted mb-3"><s.Icon size={16} /></div>
              <p className="nova-stat-label mb-1">{s.label}</p>
              <p className="nova-stat-value">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Studio</p>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Recent Client Sites</h2>
          <button type="button" onClick={() => navigate('/app/sites')} className="text-sm font-medium text-nova-accent">
            View all →
          </button>
        </div>
        {sites.length === 0 ? (
          <div className="nova-action-card text-center" style={{ padding: '40px' }}>
            <div className="nova-icon-tile mx-auto mb-4"><Globe size={20} /></div>
            <p className="font-display font-semibold mb-1">No sites yet</p>
            <p className="text-sm text-nova-text-muted mb-5">
              Create your first client site and it'll show up here, ready to edit and publish.
            </p>
            <button type="button" onClick={() => navigate('/app/templates')} className="nova-btn-primary px-5 py-2.5 inline-flex items-center gap-1.5">
              + Create your first site
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.slice(0, 3).map((s) => (
              <div key={s.id} className="nova-card p-4">
                <p className="font-medium mb-2">{s.business_name || s.name || 'Untitled site'}</p>
                <span className={s.status === 'published' ? 'nova-pill-live' : 'nova-pill-draft'}>
                  {s.status === 'published' ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Tools</p>
        <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={`${a.to}-${i}`} type="button" onClick={() => navigate(a.to)} className="text-left nova-action-card hover:border-nova-accent/30 transition-colors relative">
              <span className="absolute top-4 right-4 nova-action-cost-pill">{a.cost}</span>
              <div className="nova-icon-tile-action"><a.Icon size={18} /></div>
              <p className="nova-action-card-title">{a.label}</p>
              <p className="nova-action-card-desc">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl" style={{ padding: '24px' }}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Leads</p>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Pipeline</h2>
            <button type="button" onClick={() => navigate('/app/tracker')} className="text-sm font-medium text-nova-accent">
              Open Tracker →
            </button>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-nova-text-muted">No leads yet. Run your first lead search to fill the pipeline.</p>
          ) : (
            <p className="text-sm text-nova-text-muted">{leads.length} lead{leads.length === 1 ? '' : 's'} in your pipeline.</p>
          )}
        </div>
        <div className="glass-panel rounded-2xl" style={{ padding: '24px' }}>
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1">Schedule</p>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Today's Follow-Ups</h2>
            <button type="button" onClick={() => navigate('/app/followups')} className="text-sm font-medium text-nova-accent">
              View all →
            </button>
          </div>
          {todaysFollowUps.length === 0 ? (
            <div className="text-center py-2">
              <Calendar size={22} className="mx-auto mb-2 text-nova-text-muted" />
              <p className="text-sm text-nova-text-muted">No follow-ups due today. Stay ahead of your pipeline.</p>
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {todaysFollowUps.slice(0, 4).map((t) => (
                <li key={t.id} className="text-nova-text-muted">{t.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
