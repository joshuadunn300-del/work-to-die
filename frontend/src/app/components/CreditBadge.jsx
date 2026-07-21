import { Link } from 'react-router-dom'

// Real Tenji top-bar badge is a minimal dark pill: bold credit number + muted "credits"
// label, nothing else — no percent/plan tag/arrow (that detail lives in the sidebar's
// credit ring widget instead, see AppShell.jsx). Verified via getComputedStyle against a
// live tenji.ai element: font-size 12px, padding 8px 12px, border-radius 16px (rounded-lg,
// NOT a full pill), background rgba(255,255,255,.05).
export default function CreditBadge({ entitlements }) {
  if (!entitlements) return null
  const credits = entitlements.credits ?? 0

  return (
    <Link
      to="/app/credits"
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition-colors"
    >
      <span className="font-semibold text-nova-text">{credits.toLocaleString()}</span>
      <span className="text-nova-text-muted">credits</span>
    </Link>
  )
}
