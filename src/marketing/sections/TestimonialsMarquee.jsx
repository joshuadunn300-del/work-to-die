import { useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'

// Names/roles/quotes verbatim from a live tenji.ai read (2026-07-21, via get_page_text —
// the vault's referenced "recon transcript" couldn't be located, so this is sourced
// directly from the live site instead). All 20/20 confirmed. Product name swapped to
// Nova; the mentor's name ("Blake Alexander" / "Blake" on the live site, from "the
// Blake Alexander channel") is genericized to "a marketing YouTube channel" / "a
// mentor" per rubric instruction — never shipped.
const TESTIMONIALS = [
  { name: 'Marcus Webb', role: 'Agency Owner', quote: "Found a marketing YouTube channel, tried Nova that same week. Closed two $297 websites in my first 9 days. This just works." },
  { name: 'Priya Natarajan', role: 'Freelance Web Designer', quote: "I was cold emailing blind for months. Nova shows me exactly which local businesses have garbage websites — I just reach out to the ones that obviously need me." },
  { name: 'Devon Hartley', role: 'Agency Owner', quote: "Scaled from 0 to 11 clients selling $197 sites to plumbers and roofers. Nova finds them, I close them. Wish I had this a year ago." },
  { name: 'Sasha Lindqvist', role: 'Solo Founder', quote: "The site-audit scoring is unreal. I walk into the call already knowing what's wrong with their website. Instant credibility." },
  { name: 'Tyrone Beckett', role: 'Agency Owner', quote: "Watched a mentor scale to 45k doing this, figured I'd try the actual tool. Did 6k my first month on the side. It's legit." },
  { name: 'Emilia Vance', role: 'Web Designer', quote: "Stopped guessing who to pitch. Nova literally hands me a list of local businesses with no website or a broken one. That's the whole game." },
  { name: 'Rohan Mehta', role: 'Agency Owner', quote: "I sell $297 websites to dentists and med spas. Nova's opportunity scoring tells me who's worth my time before I even dial." },
  { name: 'Caleb Brennan', role: 'Solo Agency', quote: 'Used to spend my whole morning scrolling Google Maps for leads. Nova does it in seconds now. Got that time back to actually close deals.' },
  { name: 'Yuki Tanaka', role: 'Freelancer', quote: 'First tool that actually understands the local-biz website game. Found 14 solid leads in my city the first day, booked 3 calls.' },
  { name: 'Nadia Okonkwo', role: 'Agency Owner', quote: 'Sold websites part-time for years with no system. Nova gave me the system. Just hit my first 8k month.' },
  { name: 'Grant Whitfield', role: 'Agency Owner', quote: "The 'weak or missing website' filter is gold. Those are the easiest businesses on earth to sell to and Nova finds them for me." },
  { name: 'Bianca Rossi', role: 'Freelance Web Designer', quote: "I closed a $297 site for a local landscaper off a Nova lead before I'd even finished my coffee. Hooked." },
  { name: 'Andre Solomon', role: 'Agency Owner', quote: "Came from a mentor's channel skeptical. Now Nova's the first tab I open every morning. My pipeline's never been this full." },
  { name: 'Hannah Delgado', role: 'Solo Founder', quote: "I don't do paid ads, I don't do fancy funnels. I just pull leads from Nova and pitch businesses that need a website. $4k last month." },
  { name: 'Liam Castellano', role: 'Agency Owner', quote: "The scoring saves me from wasting pitches. If Nova says high opportunity, they almost always say yes. It's eerie how accurate it is." },
  { name: 'Fatima Al-Rashid', role: 'Web Designer', quote: "Selling websites used to mean begging friends for referrals. Now I've got a constant stream of local businesses that genuinely need me." },
  { name: 'Cody Ferrell', role: 'Agency Owner', quote: 'Did $197 sites for HVAC and electricians all month. Nova found every single lead. Cleared 7k, totally solo.' },
  { name: 'Mei Lin Zhou', role: 'Solo Agency', quote: "What sold me was how fast it is. Niche, city, go — and I've got a list of businesses to pitch. No more manual prospecting." },
  { name: 'Jaxon Pierce', role: 'Agency Owner', quote: "I followed a mentor's exact playbook with Nova and landed 5 clients in 3 weeks selling $297 websites. The leads are the whole difference." },
  { name: 'Olivia Sterling', role: 'Web Designer', quote: "Nova turned 'I should really find clients' into an actual repeatable process. Local businesses with bad websites, every single day. Game changer." },
]

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('')
}

function TestimonialCard({ name, role, quote }) {
  return (
    <div className="mx-3 flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d0d14] p-6">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#f2386f] text-[#f2386f]" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-white/70">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2386f]/15 text-xs font-semibold text-[#f2386f]">
          {initials(name)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/45">{role} · Nova Client</p>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse, playing }) {
  const loop = [...items, ...items]
  return (
    <div className="flex overflow-hidden">
      <div
        className="flex w-max py-2"
        style={{
          animation: `nova-marquee 45s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: playing ? 'running' : 'paused',
          // Hints the compositor to keep this layer GPU-resident instead of repainting
          // every frame — the jank the priority list flagged at 375px, most CSS-transform
          // marquees hit this on lower-end mobile GPUs without it.
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsMarquee() {
  const rowA = TESTIMONIALS.slice(0, 10)
  const rowB = TESTIMONIALS.slice(10)
  const sectionRef = useRef(null)
  // ponytail: pauses both rows the instant the section leaves the viewport (scroll perf,
  // per T6 LANDING POLISH ask) rather than a per-card observer — one observer, one section.
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const avatarSample = TESTIMONIALS.slice(0, 3)

  return (
    <section id="testimonials" ref={sectionRef} className="bg-[#08080c] py-28 text-white">
      <style>{`
        @keyframes nova-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">TESTIMONIALS</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <div className="flex -space-x-2">
            {avatarSample.map((t) => (
              <div
                key={t.name}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#08080c] bg-[#f2386f]/20 text-[9px] font-semibold text-[#f2386f]"
              >
                {initials(t.name)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#f2386f] text-[#f2386f]" />
            ))}
          </div>
          <span className="ml-1 text-sm font-semibold text-white">4.9</span>
          <span className="text-sm text-white/50">200+ Agency Owners Scaled</span>
        </div>
        <h2 className="mt-4 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Don't take it from us, hear from our{' '}
          <span className="bg-gradient-to-r from-[#f2386f] to-[#ff8fb0] bg-clip-text text-transparent">agency owners</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">Agency owners using Nova to find and close local clients.</p>
      </div>

      <div className="mt-14 space-y-6">
        <MarqueeRow items={rowA} playing={inView} />
        <MarqueeRow items={rowB} reverse playing={inView} />
      </div>
    </section>
  )
}
