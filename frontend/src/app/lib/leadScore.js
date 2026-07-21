// Real Lead entity already has `opportunity_score` (0-100, T1 confirmed live 2026-07-20:
// no-website leads score highest). Use it when present; fall back to a client-side
// estimate for any lead that predates the field or comes from mock data, so the ranked
// UI works today regardless of which leads have a real score yet.
export function leadScore(l) {
  if (typeof l.opportunity_score === 'number') return l.opportunity_score
  const base = { none: 95, poor: 60, decent: 25 }[l.website_status] ?? 40
  // Small tie-breaker only — website_status dominates, matching the real scoring's
  // stated priority ("no-website leads score highest") rather than rating.
  const rating = l.rating ?? l.google_rating
  const nudge = typeof rating === 'number' ? Math.round((5 - rating) * 2) : 0
  return Math.max(0, Math.min(100, base + nudge))
}

export function sortByScoreDesc(leads) {
  return [...leads].sort((a, b) => leadScore(b) - leadScore(a))
}

export function isHottest(l) {
  return l.website_status === 'none'
}
