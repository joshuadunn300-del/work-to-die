import { Lock, Sparkles } from 'lucide-react'

// Exact literal values pulled via getComputedStyle against live tenji.ai/app/analytics
// (T5 PORTAL PARITY, 2026-07-21) — real wall card is its own component with its own CTA
// button variant, distinct from `.nova-btn-primary`. Contracts.jsx and Team.jsx previously
// each hand-rolled a slightly-wrong bespoke gate; consolidated onto this one component so
// the fix (and any future one) lands in a single place instead of three.
export default function ProFeatureGate({ eyebrow = 'Pro Feature', heading, body, bullets = [], ctaLabel = 'Upgrade to Pro →' }) {
  return (
    <div className="relative rounded-3xl overflow-hidden p-10 text-center mt-4 max-w-md mx-auto border border-white/[0.09] shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_16px_40px_-12px_rgba(0,0,0,0.6)]">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-nova-accent/30"
        style={{ backgroundImage: 'linear-gradient(145deg, rgba(244,42,126,0.2), rgba(244,42,126,0.05))' }}
      >
        <Lock className="w-5 h-5 text-nova-accent" />
      </div>
      <p className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: 'rgb(246,85,152)' }}>
        {eyebrow}
      </p>
      <h2 className="font-display text-2xl font-bold text-white mb-3">{heading}</h2>
      <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto mb-7">{body}</p>
      {bullets.length > 0 && (
        <ul className="space-y-2.5 text-left max-w-xs mx-auto mb-7">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-white/70">
              <Sparkles size={14} style={{ color: 'rgb(246,85,152)' }} className="shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-white shadow-[0_0_18px_0_rgba(244,42,126,0.25)]"
        style={{ backgroundImage: 'linear-gradient(135deg, rgb(243,22,114), rgb(255,82,116))' }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}
