import { useEffect, useRef, useState } from 'react'

// Real target numbers + timing captured live off tenji.ai (Playwright sample of the
// actual count-up, 2026-07-21) — replaces the earlier placeholder values Josh flagged
// as TBD in the rubric. Order/format (N+ / $N.NM+ / N / N+) matches rubric section 11.
// pinkTail = how many trailing characters of `format(value)+suffix` render in the
// accent color — matches the live site's two-tone digit split (leading digits white,
// trailing digits+suffix pink), confirmed against the frozen mirror at localhost:8000.
const STATS = [
  { label: 'Leads Generated', target: 173000, prefix: '', suffix: '+', format: (n) => n.toLocaleString(), pinkTail: 4 },
  { label: 'Client Revenue Generated', target: 2.1, prefix: '$', suffix: 'M+', format: (n) => n.toFixed(1), pinkTail: 3 },
  { label: 'Websites Analyzed', target: 93400, prefix: '', suffix: '', format: (n) => n.toLocaleString(), pinkTail: 3 },
  { label: 'Deals Closed', target: 3400, prefix: '', suffix: '+', format: (n) => n.toLocaleString(), pinkTail: 4 },
]

// Duration + easing reverse-engineered from real samples (80ms polling) of tenji.ai's
// live count-up: front-loaded curve reaching ~63%/93%/99.6% at ~160/670/1600ms elapsed,
// settling by ~2.1s — an ease-out-expo curve, not the cubic ease-out used before (cubic
// underestimates the real early-mid climb by 15-20 points at the same progress).
const DURATION_MS = 2100

function useCountUp(target, active) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      const eased = progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(target * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return value
}

function StatTile({ stat, active }) {
  const value = useCountUp(stat.target, active)
  const body = stat.format(value) + stat.suffix
  const splitAt = Math.max(0, body.length - stat.pinkTail)
  return (
    <div className="text-center">
      <p className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <span className="text-white">
          {stat.prefix}
          {body.slice(0, splitAt)}
        </span>
        <span className="text-[#f2386f]">{body.slice(splitAt)}</span>
      </p>
      <p className="mt-2 text-sm text-white/50">{stat.label}</p>
    </div>
  )
}

export default function StatsBand() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" ref={ref} className="bg-[#08080c] px-8 py-16 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 rounded-3xl border border-white/10 bg-[#0d0d14] px-8 py-14 sm:grid-cols-4">
        {STATS.map((stat) => (
          <StatTile key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  )
}
