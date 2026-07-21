import { useEffect, useState } from 'react'
import { Lock, Rocket, Check, CircleCheck } from 'lucide-react'
import SiteRenderer from '../../renderer/SiteRenderer.jsx'

// Reuses the real generated-site renderer (Navbar + Hero w/ lead form + Services)
// inside the browser mock — same components a client's actual site is built from.
// Content mirrors the live tenji.ai mock (plumbing niche, "Reyes & Sons Plumbing")
// so it also lines up with the same lead in PipelineDemo's kanban.
const SWATCHES = ['#f2386f', '#7c3aed', '#16a34a', '#d97706']

const MOCK_CONTENT = {
  sections: [
    {
      id: 'navbar',
      type: 'navbar',
      visible: true,
      props: {
        logo: 'Reyes & Sons Plumbing',
        links: ['Services', 'About', 'Contact'],
        ctaText: 'Call Us',
        logoIcon: 'wrench',
      },
    },
    {
      id: 'hero',
      type: 'hero',
      visible: true,
      props: {
        headline: "Austin's #1 Plumber",
        subtext: 'Licensed, Insured, 24/7 Emergency Service',
        ctaText: 'Get a Free Quote',
        ratingText: '4.9 from 220+ reviews',
        form: {
          title: 'Get a Free Quote',
          buttonText: 'Request a Quote',
          fields: [
            { id: 'name', label: 'Jane Smith', type: 'text' },
            { id: 'email', label: 'jane@email.com', type: 'email' },
            { id: 'service', label: 'Select a service...', type: 'select', options: ['Leak repair', 'Drain cleaning', 'Emergency'] },
          ],
        },
      },
    },
    {
      id: 'services',
      type: 'services',
      visible: true,
      props: {
        heading: 'Our Services',
        items: [
          { icon: 'droplets', title: 'Drain Repair', desc: 'Fast, clean, guaranteed.' },
          { icon: 'wrench', title: 'Pipe Fitting', desc: 'Precision installs, done right.' },
          { icon: 'flame', title: 'Emergency', desc: '24/7 rapid response.' },
        ],
      },
    },
  ],
}

function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
      {children}
    </p>
  )
}

function BrowserChrome() {
  return (
    <div className="flex items-center gap-3 rounded-t-2xl border-b border-white/10 bg-[#0d0d14] px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2386f]" />
      </div>
      <div className="flex flex-1 items-center gap-1.5 truncate rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/40">
        <Lock className="h-3 w-3 shrink-0" />
        nova.co/preview/untitled
      </div>
    </div>
  )
}

// Richness fix (2026-07-21): live tenji.ai layers a floating "Succeeded" payments
// card over its hero mockup rather than shipping a flat single panel — this is
// that same layered-mockup treatment, applied here per Josh's direct instruction.
const PAYMENTS = [
  { amount: '$2,850', currency: 'USD' },
  { amount: '$4,600', currency: 'USD' },
  { amount: '$3,300', currency: 'USD' },
]

function PaymentsCard() {
  return (
    <div
      className="absolute -top-6 right-4 hidden w-52 -rotate-2 rounded-2xl bg-white p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] sm:block sm:right-8"
      style={{ color: '#111827' }}
    >
      <p className="text-sm font-bold">Payments</p>
      <div className="mt-3 space-y-2.5">
        {PAYMENTS.map((p) => (
          <div key={p.amount} className="flex items-center justify-between text-xs">
            <span className="font-semibold">
              {p.amount} <span className="font-normal text-gray-400">{p.currency}</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-600">
              <CircleCheck className="h-3 w-3" />
              Succeeded
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10" />
          <div className="h-3.5 w-32 rounded bg-white/10" />
        </div>
        <div className="hidden gap-2 sm:flex">
          <div className="h-6 w-14 rounded-full bg-white/10" />
          <div className="h-6 w-14 rounded-full bg-white/10" />
          <div className="h-6 w-16 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-8 w-3/4 rounded-lg bg-white/10" />
          <div className="h-3.5 w-1/2 rounded bg-white/10" />
          <div className="flex gap-2 pt-1">
            <div className="h-9 w-32 rounded-full bg-white/10" />
            <div className="h-9 w-28 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mx-auto h-3 w-28 rounded bg-white/10" />
          <div className="h-8 w-full rounded bg-white/10" />
          <div className="h-8 w-full rounded bg-white/10" />
          <div className="h-8 w-full rounded bg-white/10" />
          <div className="h-9 w-full rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export default function CreatorShowcase() {
  const [brand, setBrand] = useState(SWATCHES[0])
  const [phase, setPhase] = useState('skeleton') // skeleton -> built

  useEffect(() => {
    const t = setTimeout(() => setPhase('built'), 1200)
    return () => clearTimeout(t)
  }, [])

  const replay = () => {
    setPhase('skeleton')
    setTimeout(() => setPhase('built'), 900)
  }

  const content = { ...MOCK_CONTENT, theme: { primary: brand } }

  return (
    <section className="bg-[#0a0a10] px-8 py-28 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>THE WEBSITE CREATOR</Eyebrow>
        <h2 className="mt-5 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          From lead to <span className="text-[#f2386f]">live site</span>, in one click.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          This is the product you sell. Build a polished site for any local business in seconds, recolour it to
          their brand, connect a domain, and publish. One operator. A full pipeline of clients.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080c] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
          <BrowserChrome />
          <div className="relative h-[680px] overflow-hidden bg-[#08080c]">
            {phase === 'built' ? (
              <div style={{ width: '1000px', transform: 'scale(0.56)', transformOrigin: 'top left' }}>
                <SiteRenderer content={content} />
              </div>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <PaymentsCard />
      </div>

      <div className="mx-auto mt-5 flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={replay}
          className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-black"
          style={{ background: 'linear-gradient(180deg,#ff5c99,#f2386f)' }}
        >
          <Rocket className="h-4 w-4" />
          Publish
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Brand colour</span>
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Brand color ${c}`}
              onClick={() => setBrand(c)}
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: c }}
            >
              {brand === c && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
