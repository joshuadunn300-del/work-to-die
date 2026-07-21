import { Grid3x3, Mail, MapPin, PenLine, ArrowRight } from 'lucide-react'

const INTEGRATIONS = [
  { icon: Grid3x3, name: 'Framer', description: 'Automatically generate Framer websites with Nova.' },
  { icon: Mail, name: 'Gmail', description: 'Write emails, sort your inbox, and summarize conversations.' },
  { icon: MapPin, name: 'Google Maps', description: 'Scrape local businesses directly inside of Nova.' },
  { icon: PenLine, name: 'Script Writer (OpenAI)', description: 'Write cold-call and closing scripts directly inside of Nova.' },
]

// Matches the live tenji.ai eyebrow chip (dot + pill border) used identically across
// every other marketing section — was plain uppercase text here, same delta as Pricing.
function Eyebrow({ children }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
      {children}
    </p>
  )
}

export default function Integrations() {
  return (
    <section id="integrations" className="scroll-mt-24 bg-[#08080c] px-8 py-28 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <Eyebrow>AI INTEGRATIONS</Eyebrow>
        <h2 className="mt-3 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Works with your entire AI stack
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Nova brings lead-gen, site building, outreach, and revenue into one platform, so you run and scale your
          agency without juggling ten tools.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INTEGRATIONS.map(({ icon: Icon, name, description }) => (
          <div
            key={name}
            className="group rounded-2xl border border-white/10 bg-[#0d0d14] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#f2386f]/40 hover:shadow-[0_16px_40px_-16px_rgba(242,56,111,0.45)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2386f]/10 transition-colors duration-300 group-hover:bg-[#f2386f]/20">
              <Icon className="h-6 w-6 text-[#f2386f]" />
            </div>
            <p className="mt-4 font-semibold">{name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6 text-sm">
        <a href="/request-feature" className="flex items-center gap-1 text-white/60 transition hover:text-white">
          Request a feature <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <a href="/#features" className="flex items-center gap-1 text-white/60 transition hover:text-white">
          See all features <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  )
}
