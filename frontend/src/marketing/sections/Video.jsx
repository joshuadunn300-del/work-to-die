import { Search, Globe, CircleCheckBig, Play } from 'lucide-react'

// Richness fix (2026-07-21, directed by Josh after live side-by-side vs tenji.ai):
// the section was an empty grid box + a play button that plays nothing. No real
// video asset exists yet, so this replaces the blank frame with a looping
// lead -> site -> close micro-animation (the actual product workflow) instead of
// faking a video player around nothing. `ponytail:` pure-CSS keyframes, no video
// asset or animation library — swap in a real recording later and this becomes
// the poster-still fallback if opted into.
const STAGES = [
  { icon: Search, label: 'Find the lead' },
  { icon: Globe, label: 'Build the site' },
  { icon: CircleCheckBig, label: 'Close the deal' },
]

export default function Video() {
  return (
    <section id="video" className="mx-auto max-w-5xl px-6 py-28 text-center text-white scroll-mt-24">
      <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f2386f]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#f2386f]" />
        HOW IT WORKS
      </p>
      <h2 className="mt-5 text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        How Nova <span className="text-[#f2386f]">Works</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-white/50">
        Watch the full workflow in ninety seconds. Find the lead, build the site, close the deal.
      </p>

      <div className="relative mx-auto mt-12 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d14]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(242,56,111,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,56,111,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 60% at 50% 45%, rgba(242,56,113,0.14), transparent 70%)' }}
        />

        <div className="relative flex h-full items-center justify-center px-6 sm:px-14">
          <div className="flex w-full max-w-xl items-center justify-between">
            {STAGES.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-3 last:flex-none">
                <div
                  className="workflow-stage flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{
                    background: 'linear-gradient(155deg, rgba(242,56,113,0.38), rgba(242,56,113,0.12))',
                    borderColor: 'rgba(242,56,113,0.3)',
                    animationDelay: `${i * 1.3}s`,
                  }}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                </div>
                <p className="whitespace-nowrap text-xs font-medium text-white/60">{label}</p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute left-[18%] right-[18%] top-[calc(50%-40px)] h-px bg-white/10 sm:left-[22%] sm:right-[22%]">
            <span className="workflow-dot absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-[#f2386f] shadow-[0_0_10px_2px_rgba(242,56,113,0.7)]" />
          </div>
        </div>

        <button
          type="button"
          aria-label="Watch the full walkthrough"
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
        >
          <Play className="h-3.5 w-3.5" fill="currentColor" />
          Watch full walkthrough
        </button>
      </div>

      <style>{`
        @keyframes workflow-pulse {
          0%, 15% { box-shadow: 0 0 0 0 rgba(242,56,113,0); }
          20% { box-shadow: 0 0 0 6px rgba(242,56,113,0.25); }
          35%, 100% { box-shadow: 0 0 0 0 rgba(242,56,113,0); }
        }
        @keyframes workflow-dot-move {
          0% { left: 0%; opacity: 0; }
          5% { opacity: 1; }
          45% { left: calc(50% - 3px); opacity: 1; }
          50% { opacity: 1; }
          95% { left: calc(100% - 6px); opacity: 1; }
          100% { left: calc(100% - 6px); opacity: 0; }
        }
        .workflow-stage { animation: workflow-pulse 3.9s ease-in-out infinite; }
        .workflow-dot { animation: workflow-dot-move 3.9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .workflow-stage, .workflow-dot { animation: none; }
        }
      `}</style>
    </section>
  )
}
