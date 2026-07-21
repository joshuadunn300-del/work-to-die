import { useEffect, useRef, useState } from 'react'
import { MessageSquare, ScanLine, Target, Loader2, Phone, Star, Search } from 'lucide-react'

const CHIPS = ['Plumbers', 'Roofers', 'Dentists']
const TYPED_TEXT = 'plumbers in Austin'
const TYPE_MS_PER_CHAR = 45

const FAKE_RESULTS = [
  { name: 'Reyes & Sons Plumbing', rating: 4.6, phone: '(512) 555-0148', score: 92, flag: 'No website' },
  { name: 'Austin Rapid Plumbing', rating: 4.2, phone: '(512) 555-0173', score: 81, flag: 'Site is broken' },
  { name: 'Hill Country Plumbing Co.', rating: 4.8, phone: '(512) 555-0119', score: 74, flag: 'Slow, outdated site' },
]

const STEP_MS = { analyzing: 1800, done: 5200 }

export default function HowItWorks() {
  // idle -> typing -> analyzing -> done -> idle
  const [step, setStep] = useState('idle')
  const [typedLength, setTypedLength] = useState(TYPED_TEXT.length)
  const timers = useRef([])
  const typeInterval = useRef(null)

  function runDemo() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (typeInterval.current) clearInterval(typeInterval.current)

    setStep('typing')
    setTypedLength(0)
    let i = 0
    typeInterval.current = setInterval(() => {
      i += 1
      setTypedLength(i)
      if (i >= TYPED_TEXT.length) {
        clearInterval(typeInterval.current)
        setStep('analyzing')
        timers.current = [
          setTimeout(() => setStep('done'), STEP_MS.analyzing),
          setTimeout(() => {
            setStep('idle')
            setTypedLength(TYPED_TEXT.length)
          }, STEP_MS.analyzing + STEP_MS.done),
        ]
      }
    }, TYPE_MS_PER_CHAR)
  }

  useEffect(() => {
    const initial = setTimeout(runDemo, 900)
    return () => {
      clearTimeout(initial)
      timers.current.forEach(clearTimeout)
      if (typeInterval.current) clearInterval(typeInterval.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const busy = step === 'typing' || step === 'analyzing'

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nova-accent">
          How It Works
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-nova-text md:text-4xl">
          Describe the leads you want
        </h2>
        <p className="mt-4 text-nova-text-muted">
          Try it — pick a niche, hit Find Leads, and watch Nova turn a search into a ranked pipeline
          of businesses that need a new website.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {/* 01 Describe */}
        <StepCard n="01" icon={MessageSquare}>
          <h3 className="mt-4 font-display text-lg font-semibold text-nova-text">Describe</h3>
          <p className="mt-2 text-sm text-nova-text-muted">
            Tell Nova exactly who you want to sell to — plumbers in Austin, roofers in Miami, any
            niche, any city.
          </p>

          <div className="mt-5 rounded-xl border border-nova-border bg-black/30 p-3">
            <div className="flex items-center gap-2 rounded-lg border border-nova-border bg-white/5 px-3 py-2 text-sm text-nova-text">
              <Search className="h-3.5 w-3.5 shrink-0 text-nova-text-muted" />
              {TYPED_TEXT.slice(0, typedLength)}
              {step === 'typing' && <span className="animate-pulse text-nova-accent">|</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className={
                    chip === 'Plumbers'
                      ? 'rounded-full bg-nova-accent/20 px-2.5 py-1 text-xs font-medium text-nova-accent'
                      : 'rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-nova-text-muted'
                  }
                >
                  {chip}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={runDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-nova-accent-bright to-nova-accent-deep py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.01]"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanLine className="h-3.5 w-3.5" />}
              Find Leads
            </button>
          </div>
        </StepCard>

        {/* 02 Analyze */}
        <StepCard n="02" icon={ScanLine}>
          <h3 className="mt-4 font-display text-lg font-semibold text-nova-text">Analyze</h3>
          <p className="mt-2 text-sm text-nova-text-muted">
            Nova scans Google and audits every business&rsquo;s website — flagging the ones that are
            slow, broken, or missing entirely.
          </p>

          <div className="mt-5 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-nova-border bg-black/30 text-sm text-nova-text-muted">
            {step === 'analyzing' ? (
              <>
                <ScanLine className="h-5 w-5 animate-pulse text-nova-accent" />
                <span className="text-nova-text">Scanning Google &amp; auditing sites…</span>
              </>
            ) : (
              <span>Awaiting search…</span>
            )}
          </div>
        </StepCard>

        {/* 03 Discover */}
        <StepCard n="03" icon={Target}>
          <h3 className="mt-4 font-display text-lg font-semibold text-nova-text">Discover</h3>
          <p className="mt-2 text-sm text-nova-text-muted">
            Get a ranked hit-list of businesses that need a new site — with phones, ratings, and
            close-opportunity scores.
          </p>

          <div className="mt-5 rounded-xl border border-nova-border bg-black/30 p-3">
            {step === 'done' ? (
              <ul className="space-y-2">
                {FAKE_RESULTS.map((r) => (
                  <li
                    key={r.name}
                    className="rounded-lg border border-nova-border bg-white/5 px-2.5 py-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-nova-text">{r.name}</span>
                      <span className="rounded-full bg-nova-accent/20 px-1.5 py-0.5 font-semibold text-nova-accent">
                        {r.score}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-nova-text-muted">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {r.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {r.phone}
                      </span>
                      <span>{r.flag}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : step === 'analyzing' ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-nova-text-muted">
                <Target className="h-5 w-5 animate-pulse text-nova-accent" />
                <span className="text-nova-text">Ranking opportunities…</span>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-nova-text-muted">
                Results appear here
              </div>
            )}
          </div>
        </StepCard>
      </div>
    </section>
  )
}

// T6 QA fix: real cards carry a giant ghost numeral watermark + a pink-outlined
// (not filled) icon tile — ours had neither, just a small inline number.
function StepCard({ n, icon: Icon, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-nova-border bg-white/[0.03] p-6">
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none text-nova-accent/10"
      >
        {n}
      </span>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border-2 border-nova-accent/50 bg-transparent text-nova-accent">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
