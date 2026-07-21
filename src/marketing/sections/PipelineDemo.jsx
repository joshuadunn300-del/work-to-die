import { Phone, Globe, Rocket, MessageSquare, Trash2, Check } from 'lucide-react'

const STATS = [
  { label: 'PIPELINE VALUE', value: '$1,185/mo', note: 'open deals' },
  { label: 'MRR CLOSED', value: '$297/mo', note: 'recurring' },
  { label: 'CLOSED THIS MONTH', value: '1', note: 'deals won' },
]

// Column accent is a uniform pink top bar + pink label across every column on
// live tenji.ai — not a distinct color per column (verified live 2026-07-21).
const COLUMNS = [
  {
    key: 'new',
    title: 'NEW',
    deals: [
      { name: 'Miami Electrical', category: 'Electrical', location: 'Miami, FL', value: '$197/mo' },
      { name: 'Summit Roofing', category: 'Roofing', location: 'Denver, CO', value: '$297/mo' },
    ],
  },
  {
    key: 'called',
    title: 'CALLED',
    deals: [{ name: 'BrightSmile Dental', category: 'Dental', location: 'Denver, CO', value: '$297/mo' }],
  },
  {
    key: 'interested',
    title: 'INTERESTED',
    deals: [{ name: 'Reyes & Sons Plumbing', category: 'Plumbing', location: 'Austin, TX', value: '$197/mo' }],
  },
  {
    key: 'follow-up',
    title: 'FOLLOW UP',
    deals: [{ name: 'Coastal Landscaping', category: 'Landscaping', location: 'Tampa, FL', value: '$197/mo' }],
  },
  {
    key: 'closed',
    title: 'CLOSED',
    deals: [{ name: 'Oakline Dental', category: 'Dental', location: 'Phoenix, AZ', value: '$297/mo', score: 90 }],
  },
]

function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
      {children}
    </p>
  )
}

function initials(name) {
  return name
    .split(' ')
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

// Live tenji.ai renders the lead score as a pill badge (check icon + number),
// not a ring/donut — corrected after live comparison (2026-07-21).
function ScoreBadge({ score }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#f2386f]/40 bg-[#f2386f]/15 px-2 py-0.5 text-[11px] font-semibold text-[#f2386f]">
      <Check className="h-3 w-3" strokeWidth={3} />
      {score}
    </span>
  )
}

function DealCard({ deal }) {
  const isClosed = Boolean(deal.score)
  return (
    <div
      className="rounded-xl border bg-[#0d0d14] p-3.5"
      style={{ borderColor: isClosed ? 'rgba(242,56,113,0.4)' : 'rgba(255,255,255,0.1)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/80">
            {initials(deal.name)}
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">{deal.name}</p>
            <p className="text-xs text-white/50">
              {deal.category} · {deal.location}
            </p>
          </div>
        </div>
        {isClosed && <ScoreBadge score={deal.score} />}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f2386f]/15 text-[#f2386f]">
          <span className="text-[10px] font-bold">$</span>
        </span>
        <p className="text-xs font-semibold text-white">{deal.value}</p>
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-2.5 text-white/35">
        <Phone className="h-3.5 w-3.5" />
        <Globe className="h-3.5 w-3.5" />
        <Rocket className="h-3.5 w-3.5" />
        <MessageSquare className="h-3.5 w-3.5" />
        <Trash2 className="ml-auto h-3.5 w-3.5" />
      </div>
    </div>
  )
}

export default function PipelineDemo() {
  return (
    <section className="bg-[#08080c] px-8 py-28 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>CLOSE THE DEAL</Eyebrow>
        <h2 className="mt-5 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Tracking &amp; <span className="text-[#f2386f]">closing</span> leads has never been this easy.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Drag every client from first call to closed, and watch your recurring revenue track itself in real time.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-white/40">{stat.note}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 text-center text-sm text-white/50">Closed MRR: $297/mo · 5 leads in pipeline</p>

      <div className="relative mx-auto mt-14 max-w-6xl">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:hidden"
          style={{ background: 'linear-gradient(to left, #08080c, transparent)' }}
        />
        <div className="overflow-x-auto">
          <div className="grid min-w-[900px] grid-cols-5 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10]">
              <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #f2386f, transparent)' }} />
              <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f2386f]">{col.title}</p>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[11px] text-white/50">
                  {col.deals.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5 px-3.5 pb-3.5">
                {col.deals.map((deal) => (
                  <DealCard key={deal.name} deal={deal} />
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
