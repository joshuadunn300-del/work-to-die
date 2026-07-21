import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Zap } from 'lucide-react'

// Live tenji.ai renders checks as a circular pink-ring badge, not an inline glyph.
function CheckBadge() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#f2386f]/50 text-[#f2386f]">
      <Check className="h-2.5 w-2.5" strokeWidth={3} />
    </span>
  )
}

// Matches the live tenji.ai eyebrow chip (dot + pill border) used identically across
// every other marketing section — was plain uppercase text here, confirmed delta.
function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
      {children}
    </p>
  )
}

// Single source of truth for plan pricing — Billing.jsx should import this
// once it converges (see BUILD-LOG). Annual monthly-equivalent + yearly total
// are copied verbatim from the tenji.ai recon, not recomputed.
export const PRICING_PLANS = {
  trial: {
    id: 'trial',
    name: 'FREE TRIAL',
    badge: null,
    description: 'Full Starter access for 3 days. Card required, cancel anytime.',
    monthly: 0,
    annualMonthly: 0,
    annualCaption: '3-day trial · card required',
    cta: 'Start Free Trial',
    checks: ['500 lead credits/mo', '3 published sites', 'Custom domains', 'Basic proposals', 'Nova branding shown'],
  },
  starter: {
    id: 'starter',
    name: 'STARTER',
    badge: null,
    description: 'For beginners launching their agency and scaling to $5K/month.',
    monthly: 39,
    annualMonthly: 31,
    annualYear: 374,
    cta: 'Choose Starter',
    checks: ['500 lead credits/mo', '3 published sites', 'Custom domains', 'Basic proposals', 'Remove Nova branding'],
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    badge: 'Most Popular',
    description: 'For agencies scaling past $10K/month. Built for winners.',
    monthly: 79,
    annualMonthly: 63,
    annualYear: 758,
    cta: 'Choose Pro',
    checks: ['2,500 lead credits/mo', '15 published sites', 'Custom domains', 'Script generator', 'Full proposals', 'Remove Nova branding'],
  },
  agency: {
    id: 'agency',
    name: 'AGENCY',
    badge: 'Best Value',
    description: 'Unlimited scale. Team seats. Per-client analytics. Priority support.',
    monthly: 149,
    annualMonthly: 119,
    annualYear: 1430,
    cta: 'Choose Agency',
    checks: [
      '15,000 lead credits/mo',
      'Unlimited published sites',
      'Custom domains',
      'Script generator',
      'Full proposals',
      'Remove Nova branding',
      'Team members & sub-accounts',
      'Per-client analytics',
      'Priority support',
    ],
  },
}

const PLAN_ORDER = ['trial', 'starter', 'pro', 'agency']

function PriceCard({ plan, annual }) {
  const highlighted = plan.badge === 'Most Popular'
  const price = annual ? plan.annualMonthly : plan.monthly
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? 'border-[#f2386f]/60 bg-[#140d13] shadow-[0_0_50px_-12px_rgba(242,56,111,0.55)] hover:shadow-[0_0_65px_-10px_rgba(242,56,111,0.7)]'
          : 'border-white/10 bg-[#0d0d14] hover:border-white/25'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-[#f2386f] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          <Zap className="h-3 w-3" fill="currentColor" />
          {plan.badge}
        </span>
      )}
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{plan.name}</p>
        {plan.id === 'trial' && (
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium text-white/50">= Starter</span>
        )}
      </div>

      <p className="mt-3 h-10 text-sm leading-relaxed text-white/60">{plan.description}</p>

      <div className="mt-4 flex items-baseline gap-1">
        {annual && plan.monthly > 0 && <span className="text-lg text-white/35 line-through">${plan.monthly}</span>}
        <span className="text-4xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {price === 0 ? 'Free' : `$${price}`}
        </span>
        {price > 0 && <span className="text-sm text-white/50">/mo</span>}
      </div>
      <p className="mt-1 h-4 text-xs text-[#f2386f]">
        {plan.id === 'trial' ? (
          <span className="text-white/40">{plan.annualCaption}</span>
        ) : annual ? (
          `$${plan.annualYear}/yr · Save 20%`
        ) : (
          ' '
        )}
      </p>

      <Link
        to="/signup"
        className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
          highlighted
            ? 'bg-gradient-to-b from-[#f2386f] to-[#db2777] text-white shadow-[0_10px_30px_-8px_rgba(242,56,111,0.6)] hover:shadow-[0_14px_36px_-6px_rgba(242,56,111,0.75)] hover:brightness-110'
            : 'border border-white/15 text-white hover:border-white/30 hover:bg-white/5'
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/40">
        <span className="font-semibold uppercase tracking-wide text-white/50">Every plan includes</span> Website
        Generator · Lead Scraper · Template Library · Site Designer · CRM
      </div>

      <ul className="mt-6 space-y-2.5 text-sm text-white/70">
        {plan.checks.map((check) => (
          <li key={check} className="flex items-start gap-2">
            <CheckBadge />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Live tenji.ai uses different H2 copy for the homepage's inline pricing teaser
// ("Simple pricing that scales with your agency") vs. the standalone /pricing
// page ("Simple, transparent pricing") — same component, context-driven heading.
export default function PricingSection({ heading = 'Simple pricing that scales with your agency' }) {
  const [annual, setAnnual] = useState(true) // live tenji.ai/pricing opens with Annual active

  return (
    <section id="pricing" className="relative scroll-mt-24 bg-[#08080c] px-8 py-28 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <Eyebrow>PRICING</Eyebrow>
        <h2 className="mt-3 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">Start free, scale when ready. No hidden fees, no surprises.</p>

        {/* iOS-style switch — matches the real tenji.ai toggle (label / knob-switch / label
            / separate "Save 20%" badge), not the segmented two-button control this used to be. */}
        <div className="mt-8 inline-flex items-center gap-3">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-white/50'}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${annual ? 'bg-[#f2386f]' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${annual ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-white/50'}`}>Annual</span>
          <span className="rounded-full bg-[#f2386f]/20 px-2 py-0.5 text-[10px] font-semibold text-[#f2386f]">Save 20%</span>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLAN_ORDER.map((id) => (
          <PriceCard key={id} plan={PRICING_PLANS[id]} annual={annual} />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-white/40">
        <Link to="/pricing" className="underline hover:text-white/70">
          Compare all features
        </Link>
      </p>
    </section>
  )
}
