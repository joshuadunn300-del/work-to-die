import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, LayoutGrid, TrendingUp, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { login, loginWithGoogle } from '../lib/auth'
import samurai from '../../assets/samurai.png'

// 1:1 layout/component replica of tenji.ai/login (screenshotted + inspected live
// 2026-07-21 — card is `rounded-[28px]` `p-8 sm:p-10`, heading is `font-display
// text-2xl font-semibold tracking-tight` at -0.6px letter-spacing, sub is
// `text-sm text-white/50` — those exact classes come straight from Tenji's own
// DOM). Copy/eyebrow/feature rows are the real Tenji copy verbatim (it's also
// literally accurate to Nova's own product); only "tenji.ai"/"Tenji" swapped
// for "Nova" where the brand name itself is named.
const FEATURES = [
  { icon: Search, label: 'Find local businesses worth pitching' },
  { icon: LayoutGrid, label: 'Build premium client sites in minutes' },
  { icon: TrendingUp, label: 'Track every lead from cold to closed' },
]

// Irregular bokeh-dot scatter for the right panel (matches the reference's
// varied-size, non-grid speckle) — fixed positions so it's stable across renders.
const DOTS = [
  { l: '6%', t: '10%', s: 5 }, { l: '92%', t: '8%', s: 3 }, { l: '75%', t: '18%', s: 4 },
  { l: '15%', t: '35%', s: 3 }, { l: '55%', t: '5%', s: 3 }, { l: '88%', t: '40%', s: 7 },
  { l: '8%', t: '55%', s: 4 }, { l: '48%', t: '60%', s: 3 }, { l: '78%', t: '62%', s: 5 },
  { l: '25%', t: '78%', s: 3 }, { l: '95%', t: '75%', s: 4 }, { l: '38%', t: '90%', s: 3 },
  { l: '65%', t: '92%', s: 6 }, { l: '5%', t: '88%', s: 4 },
]

// Real Tenji's logo mark is a thin minimal blade (tapered vertical line + small
// crossbar near the base), not a full hilt-and-guard sword — a custom SVG
// matches the reference far more closely than any stock icon-set glyph.
function BladeIcon() {
  return (
    <svg width="14" height="30" viewBox="0 0 14 30" fill="none" aria-hidden="true">
      <path d="M7 0L9 20H5L7 0Z" fill="currentColor" />
      <rect x="6" y="20" width="2" height="9" fill="currentColor" />
      <rect x="2.5" y="21.5" width="9" height="1.6" rx="0.8" fill="currentColor" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4c-7.5 0-14 4.2-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.5-4.6 2.5-7.5 2.5-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.9 39.8 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.5C41.5 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login({ email, password })
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#020203] text-white">
      {/* LEFT — the sign-in card */}
      <div className="relative flex items-center justify-center px-4 py-16">
        <span className="pointer-events-none absolute left-[8%] top-[48%] h-2 w-2 rounded-full bg-nova-accent/40" />
        <span className="pointer-events-none absolute left-[16%] top-[72%] h-1.5 w-1.5 rounded-full bg-nova-accent/30" />
        <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-xs text-white/25">
          Built for agencies who close. © Nova
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[418px] rounded-[28px] border border-white/10 bg-[#0a0a0f] p-8 sm:p-10"
        >
          <div className="flex justify-center items-center gap-2.5">
            <span className="text-white drop-shadow-[0_0_12px_hsl(335_90%_56%/0.35)]">
              <BladeIcon />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">nova</span>
          </div>

          <div className="mt-8 text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight" style={{ letterSpacing: '-0.6px', lineHeight: '32px' }}>
              Enter the dojo
            </h1>
            <p className="mt-2 text-sm text-white/50">Sign in to find leads, build sites, and close clients.</p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="mt-8 w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs tracking-wide text-white/40">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="relative mb-3">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="email"
              type="email"
              required
              placeholder="you@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-nova-accent/60"
            />
          </div>

          <div className="relative mb-2">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-nova-accent/60"
            />
          </div>

          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-xs text-white/50 hover:text-white">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{
              background: 'linear-gradient(180deg, #ff5c99 0%, #f2386f 100%)',
              boxShadow: '0 10px 30px -8px rgba(242,56,113,0.55)',
            }}
          >
            {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} />
          </button>

          <p className="mt-6 text-center text-sm text-white/50">
            New to Nova? <Link to="/signup" className="font-medium text-white">Create an account</Link>
          </p>
          <p className="mt-4 text-center text-xs text-white/30">
            By continuing you agree to our <a href="#" className="text-white/45 hover:text-white/60">Terms</a> and{' '}
            <a href="#" className="text-white/45 hover:text-white/60">Privacy Policy</a>.
          </p>
        </form>
      </div>

      {/* RIGHT — the dojo panel */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: 'linear-gradient(165deg, #3a1420 0%, #200b12 45%, #12080b 100%)' }}>
        {/* soft spotlight glow, upper-left of panel, like the reference's blurred highlight */}
        <div
          className="pointer-events-none absolute -left-[10%] -top-[10%] h-[520px] w-[520px] rounded-full opacity-30 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #f2386f, transparent 70%)' }}
        />
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full bg-nova-accent"
            style={{ left: d.l, top: d.t, width: d.s, height: d.s, opacity: 0.35, filter: 'blur(0.5px)' }}
          />
        ))}
        <img
          src={samurai}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-auto w-[440px] select-none"
          style={{
            filter: 'saturate(0.9) sepia(0.35) hue-rotate(-15deg) brightness(0.75)',
            maskImage: 'linear-gradient(to left, black 50%, transparent 92%)',
            WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 92%)',
            opacity: 0.4,
          }}
        />

        <div className="relative flex h-full max-w-xl flex-col justify-center px-16">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-nova-accent">
            <Sparkles size={12} /> THE AGENCY DOJO
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.15] tracking-tight">
            Master the art of <span className="animated-gradient-text">winning clients.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Nova is where agencies find local businesses, build their websites, and close the deal. One disciplined workflow.
          </p>

          <div className="mt-10 space-y-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-nova-accent/40 bg-nova-accent/10 text-nova-accent">
                  <f.icon size={18} strokeWidth={2} />
                </div>
                <span className="text-sm text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
