import { useState, useEffect } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { Zap, Globe, Shield, Users, Lock, CornerUpLeft, Check } from 'lucide-react'
import { PLANS, planOf } from '../lib/entitlements'
import { startCheckout } from '../lib/api'

// Order: PLANS values, icon-name string resolved to the matching lucide-react component here
// (entitlements.js deliberately doesn't import lucide-react — it's shared with non-UI code).
const PLAN_ICONS = { Zap, Globe, Shield, Users }

const LOCKED_FEATURES = ['Custom Domains', 'Script Generator', 'Full Proposals', 'Per-Client Analytics', 'Team Members', 'Priority Support']

export default function Billing() {
  const { entitlements, refreshEntitlements } = useOutletContext()
  const plan = planOf(entitlements)
  const [annual, setAnnual] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [pendingPlan, setPendingPlan] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const credits = entitlements?.credits ?? 0

  // Returning from Stripe Checkout: refresh plan/credits on success, clear the param.
  const checkoutResult = searchParams.get('checkout')
  useEffect(() => {
    if (checkoutResult === 'success') refreshEntitlements?.()
    if (checkoutResult) {
      const next = new URLSearchParams(searchParams)
      next.delete('checkout')
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutResult])

  async function handleUpgrade(planKey) {
    // Only paid plans go through Stripe; 'trial' isn't a paid upgrade target here.
    if (planKey === 'trial') return
    setCheckoutError('')
    setPendingPlan(planKey)
    try {
      const { url } = await startCheckout({ plan: planKey, interval: annual ? 'annual' : 'monthly' })
      if (url) window.location.href = url
      else throw new Error('No checkout URL returned.')
    } catch (err) {
      setCheckoutError(err.message || 'Could not start checkout.')
      setPendingPlan(null)
    }
  }

  return (
    <div>
      <p className="nova-eyebrow mb-1">ACCOUNT</p>
      <h1 className="text-xl font-semibold mb-1">Billing</h1>
      <p className="text-sm text-nova-text-muted mb-6">You're on the {plan.label} plan. Upgrade anytime.</p>

      {checkoutResult === 'success' && (
        <div className="nova-card mb-6 border-emerald-800 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          Payment received — your plan and credits are updating now.
        </div>
      )}
      {checkoutResult === 'cancel' && (
        <div className="nova-card mb-6 border-nova-border p-4 text-sm text-nova-text-muted">
          Checkout canceled. No charge was made.
        </div>
      )}
      {checkoutError && (
        <div className="nova-card mb-6 border-rose-800 bg-rose-500/10 p-4 text-sm text-rose-300">
          {checkoutError}
        </div>
      )}

      <div className="nova-card p-5 mb-8">
        <p className="nova-eyebrow mb-1">CURRENT PLAN</p>
        <p className="text-lg font-semibold mb-2">{plan.label}</p>
        <p className="text-sm text-nova-text-muted mb-4">
          {credits} Credits left · {plan.monthlyCredits} Monthly limit · "{credits} of {plan.monthlyCredits} remaining"
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LOCKED_FEATURES.map((f) => (
            <div key={f} className="text-sm text-nova-text-muted flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Toggle + plan cards: exact values from a live getComputedStyle probe of
          tenji.ai/app/billing (PORTAL PARITY, 2026-07-21). Real toggle is a switch control
          (Monthly / [pill knob] / Annual), not two separate filled/outlined buttons — and
          "Save 20%" is its own pink pill next to the label, not embedded in the Yearly
          button. PRICING NOTE: this live page shows $31/$63/$119, not the $39/$79/$149
          Josh separately locked in for the activation wall (UI-PARITY-ORDERS §NEW-2,
          2026-07-21, "supersedes $31/$63/$119 everywhere"). That's a direct contradiction
          with what I'm looking at right now on Tenji's real, current Billing page — flagging
          it rather than silently picking one; entitlements.js's PLANS prices are UNCHANGED
          in this commit (still $39/$79/$149) per the standing lock-in. Only the plan-card
          chrome (badge/glow/checks/toggle) below is from this pass. */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-nova-text-muted'}`}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((a) => !a)}
          className="relative w-10 h-6 rounded-full transition-colors shrink-0"
          style={{ background: annual ? 'var(--color-nova-accent)' : 'rgba(255,255,255,0.15)' }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
            style={{ transform: annual ? 'translateX(16px)' : 'translateX(0)' }}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-nova-text-muted'}`}>Annual</span>
        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(244,42,126,0.15)', color: 'rgb(255,143,165)' }}>
          Save 20%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {Object.entries(PLANS).map(([key, p]) => {
          const isCurrent = key === entitlements?.plan
          const Icon = PLAN_ICONS[p.icon]
          const priceLabel = annual && p.price !== 'Free' ? `$${Math.round(parseInt(p.price.slice(1)) * 0.8)}` : p.price
          const highlighted = isCurrent || p.badge === 'Most Popular'
          return (
            <div
              key={key}
              className="relative overflow-hidden p-6 flex flex-col"
              style={{
                borderRadius: '16px',
                border: highlighted ? '1px solid rgba(244,42,126,0.4)' : '1px solid rgba(255,255,255,0.09)',
                background: 'linear-gradient(160deg, rgb(17,17,22) 0%, rgb(11,11,15) 100%)',
                boxShadow: highlighted
                  ? 'rgba(246,85,152,0.2) 0px 1px 0px 0px inset, rgba(244,42,126,0.2) 0px 0px 40px -8px, rgba(0,0,0,0.5) 0px 16px 40px -12px'
                  : 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 16px 40px -12px, rgba(0,0,0,0.35) 0px 4px 12px 0px',
              }}
            >
              {(isCurrent || p.badge) && (
                <span
                  className="absolute top-3.5 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(244,42,126,0.15)', color: 'rgb(255,143,165)', border: '1px solid rgba(244,42,126,0.3)' }}
                >
                  {isCurrent ? 'Current' : p.badge}
                </span>
              )}
              <div className="w-9 h-9 rounded-lg bg-nova-accent/15 border border-nova-accent/30 flex items-center justify-center mb-2">
                {Icon && <Icon className="w-4 h-4 text-nova-accent" />}
              </div>
              <p className="nova-eyebrow mb-1">{p.label.toUpperCase()}</p>
              <p className="text-xl font-semibold mb-1">
                {priceLabel}
                {p.price !== 'Free' && <span className="text-xs font-normal text-nova-text-muted">/mo</span>}
              </p>
              <p className="text-xs text-nova-text-muted mb-3">{p.blurb}</p>
              <ul className="space-y-1 mb-4">
                {p.checks.map((c) => (
                  <li key={c} className="text-xs text-nova-text-muted flex items-center gap-1.5">
                    <Check size={12} className="text-nova-accent shrink-0" /> {c}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || key === 'trial' || pendingPlan === key}
                onClick={() => handleUpgrade(key)}
                className={`w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrent ? 'nova-btn-primary' : p.badge === 'Most Popular' ? 'nova-btn-primary' : 'nova-btn-secondary'
                }`}
              >
                {isCurrent ? 'Active Plan' : pendingPlan === key ? 'Redirecting…' : p.cta}
              </button>
            </div>
          )
        })}
      </div>

      <h2 className="text-sm font-semibold mb-3">Billing History</h2>
      <div className="nova-card border-dashed p-10 text-center mb-8">
        <p className="text-sm text-nova-text-muted">
          No billing history yet. Your invoices will appear here once payments are connected.
        </p>
      </div>

      <button type="button" className="w-full flex items-center justify-center gap-2 rounded-md border border-rose-800 px-4 py-2 text-sm font-medium text-rose-400">
        <CornerUpLeft className="w-4 h-4" /> Cancel Plan
      </button>
    </div>
  )
}
