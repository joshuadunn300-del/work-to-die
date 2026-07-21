import { useState } from 'react'
import { ExternalLink, Link2 } from 'lucide-react'

// Verified via getComputedStyle against live tenji.ai/app/domains. Primary buttons:
// 3-stop 135deg gradient rgb(243,22,114)→rgb(245,61,138) 50%→rgb(255,82,116), 12px radius,
// 14px/600 text, 10px/20px padding. Outline buttons: border-white/10, 12px radius, 12px/500
// muted text, 10px/16px padding.
const GRADIENT_BTN = 'rounded-xl bg-[linear-gradient(135deg,#f31672,#f53d8a_50%,#ff5274)] px-5 py-2.5 text-sm font-semibold text-white'
const OUTLINE_BTN = 'rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-nova-text-muted hover:bg-white/5'

// Parity target: 09 - Resources/UI-Reference/domains.md. Free feature (not
// gated) — empty state only, since no domain-purchase flow exists yet
// (hard constraint: no public DNS / domain purchases in v1).
// Recolored to T2's dojo/pink theme tokens (frontend/src/index.css `@theme`).
export default function Domains() {
  const [domains] = useState([])

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="nova-eyebrow mb-1">Designer</p>
          <h1 className="text-xl font-semibold font-nova-heading text-nova-text mb-1">Domains</h1>
          <p className="text-sm text-nova-text-muted">
            Connect custom domains to your published client sites.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" className={`${OUTLINE_BTN} inline-flex items-center gap-1.5`}>
            <ExternalLink size={14} /> Purchase Domain
          </button>
          <button type="button" className={GRADIENT_BTN}>
            Add Domain
          </button>
        </div>
      </div>

      {domains.length === 0 && (
        <div className="max-w-md mx-auto text-center rounded-xl border border-nova-border bg-nova-surface p-10 mt-8">
          {/* Verified via getComputedStyle: 56x56px (w-14 h-14), rounded-2xl (not a circle),
              bg-accent/10, border-accent/20 — a translucent tint tile, not a solid gradient. */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-nova-accent/10 border border-nova-accent/20 text-nova-accent">
            <Link2 size={24} />
          </div>
          <h2 className="text-lg font-semibold font-nova-heading text-nova-text">No domains connected</h2>
          <p className="mt-2 text-sm text-nova-text-muted">
            Add a custom domain and point it to a published client site. We'll walk you through the DNS records.
          </p>
          <button type="button" className={`${GRADIENT_BTN} mt-6 w-full`}>
            Add Your First Domain
          </button>
          <button type="button" className="mt-3 text-sm text-nova-accent hover:text-nova-accent-deep inline-flex items-center gap-1.5">
            <ExternalLink size={13} /> Don't have a domain? Purchase one →
          </button>
        </div>
      )}
    </div>
  )
}
