import { useOutletContext } from 'react-router-dom'
import { Calendar, Coins, TrendingDown } from 'lucide-react'
import { planOf } from '../lib/entitlements'

const COSTS = [
  { label: 'Lead Search', cost: '10 credits' },
  { label: 'Website Generation', cost: '20 credits' },
  { label: 'Script Generation', cost: '3 credits' },
  { label: 'Proposal Generation', cost: '5 credits' },
  { label: 'AI Rewrite (Designer)', cost: '1 credit' },
  { label: 'Email/DM Sequence', cost: '3 credits' },
]

export default function Credits() {
  const { entitlements } = useOutletContext()
  const plan = planOf(entitlements)
  const used = entitlements ? plan.monthlyCredits - entitlements.credits : 0
  const usedPct = plan.monthlyCredits ? Math.max(0, Math.min(100, Math.round((used / plan.monthlyCredits) * 100))) : 0
  // Real Tenji shows the raw plan key (e.g. "Free_trial Plan"), not a humanized label —
  // confirmed via tenji-Credits.png ("Free_trial Plan" under Monthly Allowance).
  const rawPlanKey = entitlements?.plan || 'trial'
  const rawPlanLabel = rawPlanKey.charAt(0).toUpperCase() + rawPlanKey.slice(1)

  return (
    <div>
      <p className="nova-eyebrow mb-1">ACCOUNT</p>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Credits</h1>
        <button type="button" className="nova-btn-primary">
          Upgrade Plan
        </button>
      </div>
      <p className="text-sm text-nova-text-muted mb-6">
        Credits power lead searches, website generation, and all AI tools.
      </p>

      {/* Exact values from a live getComputedStyle probe of tenji.ai/app/credits (PORTAL
          PARITY, 2026-07-21): 24px padding (was p-4/16px), 16px radius, the same 160deg
          dark-gradient background + 3-layer shadow recipe confirmed on Dashboard's/Billing's
          highlighted cards (pink-tinted glow) vs. their non-highlighted siblings
          (white-tinted) — this is one shared card-surface token across the whole app, not
          three separate looks. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div
          className="relative overflow-hidden p-6"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(244,42,126,0.35)',
            background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
            boxShadow: 'rgba(246,85,152,0.2) 0px 1px 0px 0px inset, rgba(244,42,126,0.2) 0px 0px 40px -8px, rgba(0,0,0,0.6) 0px 16px 40px -12px',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="nova-icon-tile" style={{ width: 36, height: 36, borderRadius: 12 }}>
              <Coins className="h-4 w-4" />
            </div>
            <p className="text-xs text-nova-text-muted" style={{ letterSpacing: '0.3px' }}>Credits Remaining</p>
          </div>
          <p className="font-display text-4xl font-bold leading-none mb-2">{entitlements?.credits.toLocaleString() ?? '—'}</p>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-1.5">
            <div className="h-full rounded-full bg-nova-accent" style={{ width: `${usedPct}%` }} />
          </div>
          <p className="text-xs text-nova-text-muted">
            {used} of {plan.monthlyCredits} credits used
          </p>
        </div>
        <div
          className="relative overflow-hidden p-6"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
            boxShadow: 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 16px 40px -12px, rgba(0,0,0,0.35) 0px 4px 12px 0px',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="nova-icon-tile-muted">
              <Calendar className="h-4 w-4" />
            </div>
            <p className="text-xs text-nova-text-muted" style={{ letterSpacing: '0.3px' }}>Monthly Allowance</p>
          </div>
          <p className="font-display text-4xl font-bold leading-none mb-2">{plan.monthlyCredits.toLocaleString()}</p>
          <p className="text-xs text-nova-text-muted">{rawPlanLabel} Plan</p>
        </div>
        <div
          className="relative overflow-hidden p-6"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
            boxShadow: 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 16px 40px -12px, rgba(0,0,0,0.35) 0px 4px 12px 0px',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="nova-icon-tile-muted">
              <TrendingDown className="h-4 w-4" />
            </div>
            <p className="text-xs text-nova-text-muted" style={{ letterSpacing: '0.3px' }}>Used This Month</p>
          </div>
          <p className="font-display text-4xl font-bold leading-none">{used}</p>
        </div>
      </div>

      {/* Exact values, live probe: outer panels use the same 24px/16px/gradient card
          recipe as the stat cards above; rows are 12px/16px padding, 12px radius, a
          near-opaque dark fill (rgba(5,5,7,0.85), not a barely-visible white tint). */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="p-6"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
            boxShadow: 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 16px 40px -12px, rgba(0,0,0,0.35) 0px 4px 12px 0px',
          }}
        >
          <h2 className="text-sm font-semibold mb-3">Credit Costs</h2>
          <div className="space-y-2">
            {COSTS.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between text-sm"
                style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(5,5,7,0.85)' }}
              >
                <span className="text-nova-text-muted" style={{ fontSize: '13px' }}>{c.label}</span>
                <span className="font-semibold" style={{ color: 'rgb(246,85,152)' }}>{c.cost}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
            boxShadow: 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 16px 40px -12px, rgba(0,0,0,0.35) 0px 4px 12px 0px',
          }}
        >
          <h2 className="text-sm font-semibold mb-3">Transaction History</h2>
          <div className="border-dashed border rounded-lg border-nova-border p-10 text-center">
            <p className="text-sm text-nova-text-muted">
              No transactions yet. Run your first lead search to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
