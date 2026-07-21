import { Target, Globe, Building2, Kanban, LayoutGrid, FileText, BarChart3, TrendingUp, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Target,
    title: 'Lead Scraper',
    description: 'Pull local businesses with weak or missing websites in any niche and city, ready to pitch.',
  },
  {
    icon: Globe,
    title: 'Website Creator',
    description: 'Build a polished, client-ready site in seconds, recolour it to their brand, and publish.',
  },
  {
    icon: Building2,
    title: 'Built for Agencies',
    description: 'One dashboard to run a full pipeline of clients, from first contact to recurring revenue.',
  },
  {
    icon: Kanban,
    title: 'Revenue CRM',
    description: 'Drag every client from lead to closed and watch your MRR track itself in real time.',
  },
  {
    icon: LayoutGrid,
    title: 'Optimised Templates',
    description: 'A library of conversion-focused templates designed for local service businesses.',
  },
  {
    icon: FileText,
    title: 'Script Generator',
    description: 'Instantly generate outreach and sales scripts proven to book and close local clients.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track your pipeline, conversions, and revenue so you always know what’s working.',
  },
  {
    icon: TrendingUp,
    title: 'Scale Your Agency',
    description: 'Systemise lead-gen, builds, and follow-up so you can grow without the bottleneck.',
  },
]

// Matches the live tenji.ai eyebrow chip (dot + pill border), used identically
// across every marketing section — not a bare uppercase label.
function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
      {children}
    </p>
  )
}

export default function Toolkit() {
  return (
    <section id="features" className="scroll-mt-24 bg-[#0a0a10] px-8 py-28 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>THE FULL TOOLKIT</Eyebrow>
        <h2 className="mt-5 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Every tool you need to <span className="text-[#f2386f]">scale</span> your agency.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Nova is the full operating system for selling websites to local businesses. Find the leads, build the
          sites, close the deals, and grow your recurring revenue, all from one dashboard.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-white/10 bg-[#0d0d14] p-6 transition-colors hover:border-[#f2386f]/40 hover:bg-[#12121a]"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-shadow group-hover:shadow-[0_8px_24px_-6px_rgba(242,56,113,0.5)]"
              style={{
                background: 'linear-gradient(155deg, rgba(242,56,113,0.38), rgba(242,56,113,0.12))',
                borderColor: 'rgba(242,56,113,0.3)',
                boxShadow: '0 8px 20px -8px rgba(242,56,113,0.4)',
              }}
            >
              <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a href="/pricing" className="flex items-center gap-1 text-sm font-medium text-[#f2386f] hover:brightness-110">
          Explore all features <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  )
}
