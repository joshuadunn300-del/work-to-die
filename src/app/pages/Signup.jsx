import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, LayoutGrid, TrendingUp, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { startSignup, verifySignupOtp } from '../lib/auth'
import samurai from '../../assets/samurai.png'

// Same split-screen shell as Login.jsx (§NEW-1, UI-PARITY-ORDERS.md) — heading/fields/CTA/
// footer link swapped for signup, right panel identical. Real Base44 signup is a 2-step
// OTP flow (register() emails a code, then verifyOtp()+login) — the spec doc only shows
// the initial form, so the OTP step is a second state of the same card rather than a
// separate route or a faked one-step signup.
const FEATURES = [
  { icon: Search, label: 'Find local businesses worth pitching' },
  { icon: LayoutGrid, label: 'Build premium client sites in minutes' },
  { icon: TrendingUp, label: 'Track every lead from cold to closed' },
]

const DOTS = [
  { l: '6%', t: '10%', s: 5 }, { l: '92%', t: '8%', s: 3 }, { l: '75%', t: '18%', s: 4 },
  { l: '15%', t: '35%', s: 3 }, { l: '55%', t: '5%', s: 3 }, { l: '88%', t: '40%', s: 7 },
  { l: '8%', t: '55%', s: 4 }, { l: '48%', t: '60%', s: 3 }, { l: '78%', t: '62%', s: 5 },
  { l: '25%', t: '78%', s: 3 }, { l: '95%', t: '75%', s: 4 }, { l: '38%', t: '90%', s: 3 },
  { l: '65%', t: '92%', s: 6 }, { l: '5%', t: '88%', s: 4 },
]

function BladeIcon() {
  return (
    <svg width="14" height="30" viewBox="0 0 14 30" fill="none" aria-hidden="true">
      <path d="M7 0L9 20H5L7 0Z" fill="currentColor" />
      <rect x="6" y="20" width="2" height="9" fill="currentColor" />
      <rect x="2.5" y="21.5" width="9" height="1.6" rx="0.8" fill="currentColor" />
    </svg>
  )
}

export default function Signup() {
  const [agencyName, setAgencyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpRequired, setOtpRequired] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleStart(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { otpRequired: needsOtp } = await startSignup({ email, password })
      if (needsOtp) {
        setOtpRequired(true)
      } else {
        await verifySignupOtp({ email, password, agencyName })
        navigate('/app', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await verifySignupOtp({ email, password, otpCode, agencyName })
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid code.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#020203] text-white">
      {/* LEFT — the sign-up card */}
      <div className="relative flex items-center justify-center px-4 py-16">
        <span className="pointer-events-none absolute left-[8%] top-[48%] h-2 w-2 rounded-full bg-nova-accent/40" />
        <span className="pointer-events-none absolute left-[16%] top-[72%] h-1.5 w-1.5 rounded-full bg-nova-accent/30" />
        <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-xs text-white/25">
          Built for agencies who close. © Nova
        </p>

        <form
          onSubmit={otpRequired ? handleVerify : handleStart}
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
              {otpRequired ? 'Check your email' : 'Create an account'}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {otpRequired ? `Enter the code we sent to ${email}.` : 'Start finding leads, building sites, and closing clients.'}
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          {otpRequired ? (
            <div className="relative mt-8 mb-2">
              <input
                type="text"
                required
                autoFocus
                inputMode="numeric"
                placeholder="6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-3.5 text-center text-lg tracking-[0.3em] text-white placeholder:text-white/30 placeholder:tracking-normal outline-none transition-colors focus:border-nova-accent/60"
              />
            </div>
          ) : (
            <>
              <div className="relative mt-8 mb-3">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-nova-accent/60"
                />
              </div>
              <div className="relative mb-3">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
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
                  type="password"
                  required
                  minLength={8}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-nova-accent/60"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{
              background: 'linear-gradient(180deg, #ff5c99 0%, #f2386f 100%)',
              boxShadow: '0 10px 30px -8px rgba(242,56,113,0.55)',
            }}
          >
            {busy ? 'Please wait…' : otpRequired ? 'Verify code' : 'Create account'} <ArrowRight size={16} />
          </button>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account? <Link to="/login" className="font-medium text-white">Sign in</Link>
          </p>
          <p className="mt-4 text-center text-xs text-white/30">
            By continuing you agree to our <a href="#" className="text-white/45 hover:text-white/60">Terms</a> and{' '}
            <a href="#" className="text-white/45 hover:text-white/60">Privacy Policy</a>.
          </p>
        </form>
      </div>

      {/* RIGHT — the dojo panel (identical to Login.jsx) */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: 'linear-gradient(165deg, #3a1420 0%, #200b12 45%, #12080b 100%)' }}>
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
