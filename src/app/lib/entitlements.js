// Plan pricing-tier metadata (label/credit allowance/site cap) is static per
// Tenji-Full-Breakdown.md — safe to hardcode. Feature GATES are dynamic authorization
// data and must come from the real getEntitlements() response's `features` object when
// live (bug found + fixed 2026-07-20 during live integration testing: this file used to
// hardcode scripts/proposals/etc per plan, silently ignoring the real backend's
// `features` — so a real trial user with `features.scripts: true` still saw Scripts
// locked in the UI because the local PLANS.trial.scripts was hardcoded false).
// Pricing/site-caps below are Josh's live capture of Tenji's real activation wall
// (UI-PARITY-ORDERS §NEW-2, 2026-07-21) — supersedes the earlier $31/$63/$119 guess and
// the old null (=unlimited-looking) site caps on starter/pro. `icon` is a lucide-react
// export name (resolved by whichever component renders the plan card, e.g. ActivationWall)
// so this file doesn't need to import lucide-react itself.
export const PLANS = {
  trial: {
    label: 'Free Trial', monthlyCredits: 500, siteCap: 3,
    price: 'Free', priceNote: '500 credits/mo', icon: 'Zap', cta: 'Start Free Trial',
    blurb: 'Full Starter access for 3 days. Card required, cancel anytime.',
    checks: ['500 credits', '3 sites', 'Custom domains'],
  },
  starter: {
    label: 'Starter', monthlyCredits: 500, siteCap: 3,
    price: '$39', priceNote: '500 credits/mo', icon: 'Globe', cta: 'Choose Starter',
    blurb: 'For beginners launching their agency and scaling to $5K/month.',
    checks: ['500 credits', '3 sites', 'Custom domains'],
  },
  pro: {
    label: 'Pro', monthlyCredits: 2500, siteCap: 15,
    price: '$79', priceNote: '2,500 credits/mo', icon: 'Shield', cta: 'Choose Pro', badge: 'Most Popular',
    blurb: 'For agencies scaling past $10K/month. Built for winners.',
    checks: ['2,500 credits', '15 sites', 'Custom domains', 'Scripts'],
  },
  agency: {
    label: 'Agency', monthlyCredits: 15000, siteCap: null,
    price: '$149', priceNote: '15,000 credits/mo', icon: 'Users', cta: 'Choose Agency', badge: 'Best Value',
    blurb: 'Unlimited scale. Team seats. Per-client analytics. Priority support.',
    checks: ['15,000 credits', '∞ sites', 'Custom domains', 'Scripts'],
  },
}

// Mock-mode fallback only — used when entitlements.features isn't present (i.e. the
// in-memory mock, which doesn't model per-feature gating this granularly).
const MOCK_FEATURES_BY_PLAN = {
  trial: { scripts: false, proposals: false, contracts: false, fullAnalytics: false, team: false, prioritySupport: false },
  starter: { scripts: false, proposals: false, contracts: false, fullAnalytics: false, team: false, prioritySupport: false },
  pro: { scripts: true, proposals: true, contracts: true, fullAnalytics: true, team: false, prioritySupport: false },
  agency: { scripts: true, proposals: true, contracts: true, fullAnalytics: true, team: true, prioritySupport: true },
}

// Local gate name -> real backend `features` key. Contracts has no dedicated backend
// flag — Contracts+Proposals are one merged Pro wall per UI-Reference/contracts.md, so
// it reuses the `proposals` flag.
const FEATURE_KEY_MAP = {
  scripts: 'scripts',
  proposals: 'proposals',
  contracts: 'proposals',
  fullAnalytics: 'full_analytics',
  team: 'team_members',
  prioritySupport: 'priority_support',
}

export const CREDIT_COSTS = { search: 10, generateSite: 20, script: 3, publish: 0 }

export function planOf(entitlements) {
  return PLANS[entitlements?.plan] || PLANS.trial
}

export function canUseFeature(entitlements, feature) {
  if (entitlements?.features) {
    return !!entitlements.features[FEATURE_KEY_MAP[feature] || feature]
  }
  const mock = MOCK_FEATURES_BY_PLAN[entitlements?.plan] || MOCK_FEATURES_BY_PLAN.trial
  return !!mock[feature]
}

export function hasCredits(entitlements, action) {
  const cost = CREDIT_COSTS[action] ?? 0
  return (entitlements?.credits ?? 0) >= cost
}
