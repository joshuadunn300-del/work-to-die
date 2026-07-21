// Base44 auth adapter. Real SDK shape verified against
// node_modules/@base44/sdk/dist/modules/auth.types.d.ts (per T1's integration findings
// 2026-07-20): loginViaEmailPassword(email, password) is positional and returns
// {access_token, user}; there is no one-step signup — register() sends an email OTP,
// then verifyOtp() confirms it, then loginViaEmailPassword() logs in. Falls back to a
// local mock session (no OTP step) when window.base44 isn't present yet.
const KEY = 'nova_session'

export function getSession() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

function cacheSession(user) {
  const session = { email: user.email, name: user.full_name || user.email.split('@')[0] }
  localStorage.setItem(KEY, JSON.stringify(session))
  return session
}

// Google is a built-in Base44 OAuth provider, enabled by default — no extra dashboard
// config needed (verified against node_modules/@base44/sdk/dist/modules/auth.types.d.ts,
// 2026-07-21). Redirects the browser away; there's no return value to await.
export function loginWithGoogle() {
  if (typeof window === 'undefined' || !window.base44?.auth) {
    throw new Error('Google sign-in requires a live Base44 session.')
  }
  window.base44.auth.loginWithProvider('google', '/app')
}

export async function login({ email, password }) {
  if (typeof window !== 'undefined' && window.base44?.auth) {
    const { user } = await window.base44.auth.loginViaEmailPassword(email, password)
    return cacheSession(user)
  }
  if (!email || !password) throw new Error('Email and password are required.')
  return cacheSession({ email })
}

// Step 1 of signup: sends the OTP email. Signup.jsx then shows an OTP field and
// calls verifySignupOtp() to finish.
export async function startSignup({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required.')
  if (typeof window !== 'undefined' && window.base44?.auth) {
    await window.base44.auth.register({ email, password })
    return { otpRequired: true }
  }
  return { otpRequired: false }
}

export async function verifySignupOtp({ email, password, otpCode, agencyName }) {
  if (typeof window !== 'undefined' && window.base44?.auth) {
    await window.base44.auth.verifyOtp({ email, otpCode })
    const { user } = await window.base44.auth.loginViaEmailPassword(email, password)
    if (agencyName) await window.base44.auth.updateMe({ agency_brand_name: agencyName })
    return cacheSession(user)
  }
  return cacheSession({ email, full_name: agencyName })
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY)
    if (window.base44?.auth) window.base44.auth.logout()
  }
}
