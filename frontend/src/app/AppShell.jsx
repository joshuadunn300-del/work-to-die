import { Suspense, useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  Sparkles, LayoutGrid, Search, Kanban, CalendarClock, LayoutTemplate, Globe, Link2,
  ChartColumn, Paintbrush, MessageSquare, FileText, Users, UserRound, SquareCheck,
  TrendingUp, UsersRound, Coins, CreditCard, Settings, GraduationCap, LifeBuoy,
  Lock, Bell, MessageCircle, ArrowRight, Menu, X,
} from 'lucide-react'
import { getSession, logout } from './lib/auth'
import { getEntitlements, listNotifications } from './lib/api'
import { canUseFeature } from './lib/entitlements'
import CreditBadge from './components/CreditBadge'

// Exact sidebar spec from Josh's production Tenji bundle (2026-07-20) — group order,
// routes, and lock/badge placement are verbatim, not a recon approximation. Icons added
// 2026-07-21 from a zoomed crop of a live Tenji screenshot (reference/tenji-Dashboard.png
// sidebar) — the decompiled reference/tenji-frontend-components.js has no sidebar
// component to grep (Dashboard/LeadSearch/Tracker/etc only), so these are matched by eye
// against the real icon shapes, not guessed cold.
const NAV_GROUPS = [
  { label: 'COMMAND', items: [{ to: '/app', label: 'Dashboard', Icon: LayoutGrid }] },
  {
    label: 'LEADS',
    items: [
      { to: '/app/leads', label: 'Lead Search', Icon: Search },
      { to: '/app/tracker', label: 'Tracker', Icon: Kanban },
      { to: '/app/followups', label: 'Follow-Ups', Icon: CalendarClock },
    ],
  },
  {
    label: 'STUDIO',
    items: [
      { to: '/app/templates', label: 'Public Templates', Icon: LayoutTemplate },
      { to: '/app/sites', label: 'Client Sites', Icon: Globe },
      { to: '/app/domains', label: 'Domains', Icon: Link2 },
      { to: '/app/analytics', label: 'Analytics', Icon: ChartColumn, gate: 'fullAnalytics', gatePlan: 'Pro' },
      { to: '/app/designer', label: 'Site Creator', Icon: Paintbrush, badge: 'LIVE EDITOR' },
    ],
  },
  {
    label: 'OUTREACH',
    items: [
      { to: '/app/scripts', label: 'Scripts', Icon: MessageSquare, gate: 'scripts', gatePlan: 'Pro' },
      { to: '/app/contracts', label: 'Contracts', Icon: FileText },
    ],
  },
  {
    label: 'AGENCY',
    items: [
      { to: '/app/crm', label: 'CRM', Icon: Users },
      { to: '/app/clients', label: 'Clients', Icon: UserRound },
      { to: '/app/tasks', label: 'Tasks', Icon: SquareCheck },
      { to: '/app/revenue', label: 'Revenue', Icon: TrendingUp },
      { to: '/app/team', label: 'Team Members', Icon: UsersRound, gate: 'team', gatePlan: 'Agency' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { to: '/app/credits', label: 'Credits', Icon: Coins },
      { to: '/app/billing', label: 'Billing', Icon: CreditCard },
      { to: '/app/settings', label: 'Settings', Icon: Settings },
    ],
  },
  {
    label: 'LEARN',
    items: [
      { to: '/app/tutorials', label: 'Tutorials', Icon: GraduationCap },
      { to: '/app/support', label: 'Support', Icon: LifeBuoy, unreadBadge: true },
    ],
  },
]

// Real Tenji greets by first name only ("Welcome back, Josh") even when the account's
// full name is "Josh Dunn" — verified live against tenji.ai/app/crm.
const firstName = (name) => (name || '').split(' ')[0] || name

export default function AppShell() {
  const session = getSession()
  const navigate = useNavigate()
  const [entitlements, setEntitlements] = useState(null)
  const [entitlementsError, setEntitlementsError] = useState('')
  const [unreadSupport, setUnreadSupport] = useState(0)
  const [upgradeModal, setUpgradeModal] = useState(null) // { feature, plan } | null
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const refreshEntitlements = () =>
    getEntitlements()
      .then((data) => {
        setEntitlementsError('')
        setEntitlements(data)
      })
      .catch((err) => {
        // A failed getEntitlements() (401/403/network) must never be silently
        // swallowed — null entitlements reads as "0 credits" everywhere else in
        // the app (hasCredits/canUseFeature), which shows a misleading "not
        // enough credits" message instead of the real auth/platform error.
        setEntitlementsError(err?.message || 'Could not load your plan/credits.')
      })

  useEffect(() => {
    refreshEntitlements()
    listNotifications()
      .then((rows) => setUnreadSupport(rows.filter((n) => !n.read).length))
      .catch(() => {})
  }, [])

  if (!session) return <Navigate to="/login" replace />

  // Loading state (UI-PARITY-ORDERS §Terminal 2.3) — never flash the app while
  // entitlements are still resolving; a null vs. loaded-but-empty entitlements
  // object are different states (entitlementsError set = a real fetch failure,
  // not "still loading").
  if (!entitlements && !entitlementsError) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
        <div className="nova-icon-tile animate-spin" style={{ width: '3.5rem', height: '3.5rem', animationDuration: '1.1s' }}>
          <Sparkles size={22} />
        </div>
        <p className="text-sm text-nova-text-muted tracking-wide">Entering Nova...</p>
      </div>
    )
  }

  const creditsPct = entitlements ? Math.max(0, Math.min(100, Math.round((entitlements.credits / (entitlements.monthlyCredits || 500)) * 100))) : 0
  const planCode = (entitlements?.plan || 'trial').toUpperCase().replace(/\s+/g, '_')

  // Shared between the desktop <aside> and the mobile drawer (PORTAL PARITY, 2026-07-21) —
  // real Tenji's sidebar is `hidden lg:block` (hides below 1024px, not 768px — verified via
  // getComputedStyle, the aside's own wrapper is literally `hidden lg:block fixed inset-y-0
  // left-0 z-40`) with a `lg:hidden` hamburger button driving a drawer below that. `onNavigate`
  // closes the drawer after a link is clicked (mobile only; no-op on desktop).
  const sidebarContent = (onNavigate) => (
    <>
      <div className="p-5 border-b border-nova-border">
        <div className="flex items-center gap-2.5">
          <div className="nova-icon-tile shrink-0" style={{ width: '2.25rem', height: '2.25rem' }}>
            <Sparkles size={18} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">nova</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-nova-text-muted">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const locked = item.gate && !canUseFeature(entitlements, item.gate)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/app'}
                    onClick={(e) => {
                      if (locked) {
                        e.preventDefault()
                        setUpgradeModal({ feature: item.label, plan: item.gatePlan })
                        return
                      }
                      onNavigate?.()
                    }}
                    className={({ isActive }) =>
                      `nova-nav-pill justify-between ${isActive ? 'nova-nav-pill-active' : ''} ${locked ? 'opacity-45' : ''}`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <item.Icon size={18} className="shrink-0" strokeWidth={1.75} />
                      {item.label}
                      {item.badge && (
                        <span className="nova-badge-pill-outline">{item.badge}</span>
                      )}
                    </span>
                    {locked ? (
                      <Lock size={13} className="shrink-0 text-nova-accent" aria-label="Locked" />
                    ) : (
                      item.unreadBadge &&
                      unreadSupport > 0 && (
                        <span className="rounded-full bg-nova-accent px-1.5 text-[10px] font-semibold text-white">
                          {unreadSupport}
                        </span>
                      )
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-nova-border space-y-2">
        {entitlements && (
          <div className="flex items-center gap-2.5 px-1">
            <div className="nova-credit-ring shrink-0" style={{ '--pct': creditsPct }}>
              <div className="nova-credit-ring-inner">{creditsPct}%</div>
            </div>
            <div className="text-xs text-nova-text-muted leading-tight">
              <div className="font-semibold text-nova-accent tracking-wide">{planCode}</div>
              <div>
                <span className="text-nova-text font-medium">{entitlements.credits.toLocaleString()}</span>
                {' / '}
                {(entitlements.monthlyCredits ?? 500).toLocaleString()} credits left →
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
          className="w-full text-left text-sm text-nova-text-muted hover:text-nova-text"
        >
          Sign out ({session.email})
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-nova-bg text-nova-text">
      {/* Desktop sidebar — hidden below 1024px (lg), exact breakpoint verified live against
          Tenji's own aside wrapper (`hidden lg:block fixed inset-y-0 left-0 z-40`). */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-nova-border flex-col">
        {sidebarContent()}
      </aside>

      {/* Mobile drawer — below 1024px only. Backdrop + slide-in panel, closes on backdrop
          click, X button, or navigating to a route. */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative w-60 shrink-0 bg-nova-bg border-r border-nova-border flex flex-col z-50">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-3 p-1.5 rounded-lg text-nova-text-muted hover:bg-white/10"
            >
              <X size={18} />
            </button>
            {sidebarContent(() => setMobileNavOpen(false))}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Exact values from a live getComputedStyle probe of tenji.ai/app, 2026-07-21:
            sticky + translucent-blur header (was a flat opaque bar), py-3 px-8 padding
            (was a fixed h-14), border-bottom white/[0.06]. */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 py-3 bg-nova-bg/70 backdrop-blur-xl border-b border-nova-border">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-lg text-nova-text-muted hover:bg-white/[0.05] transition shrink-0"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-medium truncate">Welcome back, {firstName(session.name)}</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <CreditBadge entitlements={entitlements} />
            <NavLink
              to="/app/notifications"
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl text-nova-text-muted hover:bg-white/[0.05] transition"
            >
              <Bell size={18} strokeWidth={1.75} />
              {unreadSupport > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nova-accent" />
              )}
            </NavLink>
            {/* Exact values, live probe: 36px, 12px radius (NOT rounded-full), 2-stop
                diagonal gradient at 40% opacity, 1px white/10 border, 14px/600 text. */}
            <div
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ background: 'linear-gradient(to bottom right, rgba(244,42,126,0.4), rgba(240,66,176,0.4))' }}
            >
              {session.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {entitlementsError && (
            <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              Couldn't load your plan/credits: {entitlementsError}
            </div>
          )}
          {/* BUNDLE DIET (2026-07-21): app pages are React.lazy() now (routes.jsx) — this
              Suspense boundary is their nearest fallback, reusing the same "Entering
              Nova..." treatment as the shell's own entitlements-loading state above so a
              page-to-page navigation reads as one continuous style, not two different
              spinners. */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <div className="nova-icon-tile animate-spin" style={{ width: '3.5rem', height: '3.5rem', animationDuration: '1.1s' }} />
                <p className="text-sm text-nova-text-muted tracking-wide">Entering Nova...</p>
              </div>
            }
          >
            <Outlet context={{ entitlements, refreshEntitlements }} />
          </Suspense>
        </main>
      </div>

      {/* Floating support bubble — every /app screen (UI-PARITY-ORDERS §Terminal 2.4). */}
      <button
        type="button"
        onClick={() => navigate('/app/support')}
        aria-label="Support"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full nova-btn-primary nova-glow-soft flex items-center justify-center"
      >
        <MessageCircle size={22} />
      </button>

      {upgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setUpgradeModal(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-nova border border-nova-border bg-nova-surface p-6 max-w-sm text-center"
          >
            <div className="nova-icon-tile mx-auto mb-3">
              <Lock size={18} />
            </div>
            <p className="font-medium mb-1">
              {upgradeModal.feature} is {/^[aeiou]/i.test(upgradeModal.plan) ? 'an' : 'a'} {upgradeModal.plan} feature
            </p>
            <p className="text-sm text-nova-text-muted mb-4">Upgrade your plan to unlock it.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setUpgradeModal(null)
                  navigate('/app/billing')
                }}
                className="nova-btn-primary px-4 py-2 inline-flex items-center gap-1.5"
              >
                Upgrade to {upgradeModal.plan} <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => setUpgradeModal(null)} className="text-sm text-nova-text-muted">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
