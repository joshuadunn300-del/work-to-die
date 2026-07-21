// Mirrors real Tenji's activation-wall logic (§NEW-2, UI-PARITY-ORDERS.md): a
// user with a valid session but no active plan gets a full-screen wall instead
// of the app. Matches the real getEntitlements() response shape (probed live,
// 2026-07-21): { plan, credits, features: {...}, credit_costs: {...}, trial_ends_at }.
export function needsActivation(entitlements) {
  if (!entitlements) return false // still loading — AppShell shows its own loading state, not the wall
  const plan = entitlements.plan
  if (!plan || plan === 'none') return true
  if (entitlements.status === 'expired') return true
  if (entitlements.trial_ends_at) {
    const expires = new Date(entitlements.trial_ends_at).getTime()
    if (!Number.isNaN(expires) && expires < Date.now()) return true
  }
  return false
}

// Idempotent — safe to call even if the user already has an active plan (the
// backend function no-ops in that case). Kept in this file rather than added
// to api.js (shared, not mine this pass) to avoid touching a file outside my
// lane; same base44.functions.invoke pattern api.js already uses elsewhere.
export async function activateTrial() {
  if (typeof window === 'undefined' || !window.base44) {
    throw new Error('activateTrial requires a live Base44 session.')
  }
  const { data } = await window.base44.functions.invoke('activateTrial')
  return data
}
