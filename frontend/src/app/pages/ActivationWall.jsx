import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Globe, Shield, Users, Check, Sparkles } from 'lucide-react'
import { activateTrial } from '../lib/activation'
import { startCheckout } from '../lib/api'

// Full-screen takeover per §NEW-2, UI-PARITY-ORDERS.md — no sidebar/topbar, blocks every
// /app/* route until a plan is activated. AppShell (T2's file) is responsible for calling
// needsActivation() and rendering this component in place of the app when it's true.
//
// PLANS_LOCAL mirrors the price/blurb/checks fields I've proposed adding to entitlements.js's
// shared PLANS constant (posted as an INTEGRATION REQUEST in BUILD-LOG — T2 owns that merge,
// not edited here). Kept local for now so this component works standalone; swap to the
// shared constant once T2 merges it, same field names so the swap is a one-line import change.
const PLANS_LOCAL = [
  {
    key: 'trial',
    icon: Zap,
    name: 'Free Trial',
    price: 'Free',
    priceSub: '500 credits/mo',
    desc: 'Full Starter access for 3 days. Card required, cancel anytime.',
    checks: ['500 credits', '3 sites', 'Custom domains'],
    cta: 'Start Free Trial',
    variant: 'dark',
  },
  {
    key: 'starter',
    icon: Globe,
    name: 'Starter',
    price: '$39',
    priceSub: '500 credits/mo',
    desc: 'For beginners launching their agency and scaling to $5K/month.',
    checks: ['500 credits', '3 sites', 'Custom domains'],
    cta: 'Choose Starter',
    variant: 'dark',
  },
  {
    key: 'pro',
    icon: Shield,
    name: 'Pro',
    price: '$79',
    priceSub: '2,500 credits/mo',
    desc: 'For agencies scaling past $10K/month. Built for winners.',
    checks: ['2,500 credits', '15 sites', 'Custom domains', 'Scripts'],
    cta: 'Choose Pro',
    variant: 'pink',
    badge: 'Most Popular',
  },
  {
    key: 'agency',
    icon: Users,
    name: 'Agency',
    price: '$149',
    priceSub: '15,000 credits/mo',
    desc: 'Unlimited scale. Team seats. Per-client analytics. Priority support.',
    checks: ['15,000 credits', '∞ sites', 'Custom domains', 'Scripts'],
    cta: 'Choose Agency',
    variant: 'dark',
    badge: 'Best Value',
  },
]

const TRUST_ROW = ['Cancel anytime', 'Secure checkout', 'Instant activation']

function BladeIcon() {
  return (
    <svg width="14" height="30" viewBox="0 0 14 30" fill="none" aria-hidden="true">
      <path d="M7 0L9 20H5L7 0Z" fill="currentColor" />
      <rect x="6" y="20" width="2" height="9" fill="currentColor" />
      <rect x="2.5" y="21.5" width="9" height="1.6" rx="0.8" fill="currentColor" />
    </svg>
  )
}

// Minimal self-contained toast — no shared toast infra exists yet in this codebase
// (checked before building this), and adding one is out of this task's scope.
function useSimpleToast() {
  const [message, setMessage] = useState(null)
  function show(text) {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }
  return { message, show }
}

export default function ActivationWall({ onActivated }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [activating, setActivating] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useSimpleToast()

  async function handleStartTrial() {
    setError('')
    setActivating(true)
    try {
      await activateTrial()
      onActivated?.()
    } catch (err) {
      setError(err.message || 'Could not activate trial.')
    } finally {
      setActivating(false)
    }
  }

  async function handlePaidPlan(planKey) {
    setError('')
    setActivating(true)
    try {
      const interval = billingCycle === 'yearly' ? 'annual' : 'monthly'
      const { url } = await startCheckout({ plan: planKey, interval })
      if (url) window.location.href = url
      else throw new Error('No checkout URL returned.')
    } catch (err) {
      setError(err.message || 'Could not start checkout.')
      setActivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white px-4 py-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <Sparkles
        className="pointer-events-none fixed top-10 right-10 text-nova-accent/10 select-none hidden md:block"
        style={{ width: '9rem', height: '9rem' }}
        strokeWidth={1}
      />

      {toast.message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 text-sm shadow-lg">
          {toast.message}
        </div>
      )}

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="flex justify-center items-center gap-2.5">
          <span className="text-white drop-shadow-[0_0_12px_hsl(335_90%_56%/0.35)]">
            <BladeIcon />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">nova</span>
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-nova-accent">Access Locked</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Activate your account</h1>
        <p className="mt-3 text-white/50">Choose a plan to activate your account and enter the dojo.</p>

        {error && (
          <div className="mt-6 inline-block rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="relative mt-12 rounded-[28px] border border-white/10 bg-[#0a0a0f] p-8 sm:p-10 text-left">
          <h2 className="font-display text-xl font-semibold tracking-tight">Choose your plan</h2>
          <p className="mt-1 text-sm text-white/50">Select a plan to activate your account</p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              style={billingCycle === 'monthly' ? { background: 'var(--color-nova-accent)', color: '#fff' } : { color: 'rgba(255,255,255,0.6)' }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              style={billingCycle === 'yearly' ? { background: 'var(--color-nova-accent)', color: '#fff' } : { color: 'rgba(255,255,255,0.6)' }}
            >
              Yearly
              <span className="rounded-full bg-nova-accent/20 px-2 py-0.5 text-[11px] font-semibold text-nova-accent">Save 20%</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS_LOCAL.map((plan) => {
              const Icon = plan.icon
              const isPro = plan.variant === 'pink'
              return (
                <div
                  key={plan.key}
                  className="relative flex flex-col rounded-2xl border p-5"
                  style={
                    isPro
                      ? { borderColor: 'rgba(242,56,111,0.5)', background: 'rgba(242,56,111,0.06)', boxShadow: '0 0 30px rgba(242,56,111,0.25)' }
                      : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }
                  }
                >
                  {plan.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap"
                      style={isPro ? { background: 'var(--color-nova-accent)', color: '#fff' } : { background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-nova-accent">
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold">{plan.name}</p>
                  <p className="mt-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    {plan.price !== 'Free' && <span className="text-sm text-white/40">/mo</span>}
                  </p>
                  <p className="text-xs text-white/40">{plan.priceSub}</p>
                  <p className="mt-3 text-xs text-white/50 leading-relaxed min-h-[3rem]">{plan.desc}</p>
                  <div className="mt-4 space-y-2 flex-1">
                    {plan.checks.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-xs text-white/70">
                        <Check size={13} className="text-nova-accent shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={activating}
                    onClick={() => (plan.key === 'trial' ? handleStartTrial() : handlePaidPlan(plan.key))}
                    className="mt-5 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
                    style={
                      isPro
                        ? { background: 'linear-gradient(180deg, #ff5c99 0%, #f2386f 100%)', color: '#fff' }
                        : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }
                    }
                  >
                    {plan.key === 'trial' && activating ? 'Activating…' : plan.cta}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => navigate('/app/billing')} className="text-sm font-medium text-nova-accent hover:text-nova-accent-bright">
              Compare all features →
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/50">
          {TRUST_ROW.map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={14} className="text-nova-accent" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
