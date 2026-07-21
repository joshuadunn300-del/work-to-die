import { Link } from 'react-router-dom'
import { Sparkles, PlayCircle, ArrowRight } from 'lucide-react'
import samurai from '../../assets/samurai.png'

const HEADLINE_WORDS = [
  'The', 'AI', 'That', 'Finds', 'Local', 'Businesses', 'You', 'Can', 'Sell', 'To',
]
const ACCENT_WORDS = new Set(['Finds', 'Sell'])

const PETALS = [
  { top: '18%', left: '8%', size: 10, delay: '0s', duration: '9s' },
  { top: '32%', left: '22%', size: 6, delay: '1.2s', duration: '11s' },
  { top: '12%', left: '40%', size: 8, delay: '2.4s', duration: '8s' },
  { top: '55%', left: '12%', size: 7, delay: '0.6s', duration: '10s' },
  { top: '68%', left: '30%', size: 5, delay: '3s', duration: '12s' },
  { top: '22%', left: '85%', size: 9, delay: '1.6s', duration: '9.5s' },
  { top: '48%', left: '92%', size: 6, delay: '2.8s', duration: '10.5s' },
  { top: '38%', left: '6%', size: 7, delay: '4s', duration: '10s' },
  { top: '62%', left: '18%', size: 5, delay: '2s', duration: '9s' },
  { top: '8%', left: '92%', size: 6, delay: '3.6s', duration: '11.5s' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-40 md:pt-48">
      <style>{`
        @keyframes nova-word-in {
          from { opacity: 0; transform: translateY(0.6em); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes nova-petal-float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.55; }
          50% { transform: translateY(-26px) translateX(10px) rotate(180deg); }
          90% { opacity: 0.35; }
          100% { transform: translateY(-52px) translateX(-6px) rotate(360deg); opacity: 0; }
        }
        /* CRITICAL: no static opacity:0 base rule here. The entrance effect comes
           entirely from the keyframes (0% opacity:0 -> 100% opacity:1, fill-mode
           forwards). If the animation is ever skipped for any reason (reduced-motion,
           a stripped <style> tag, any animation:none override), the browser's default
           opacity (1) applies and the words are simply visible immediately instead of
           permanently stuck invisible — this is what broke on production before. */
        .nova-word {
          display: inline-block;
          animation: nova-word-in 0.6s ease-out forwards;
        }
        .nova-word-accent {
          background-image: linear-gradient(180deg, #ff5c99, #db2777);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .nova-petal {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #ff8fb0, #f2386f);
          animation: nova-petal-float ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nova-word { animation: none; }
          .nova-petal { animation: none; }
        }
      `}</style>

      {/* Petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="nova-petal"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Sword visual slot, top-right — live tenji.ai renders one continuous diagonal
          katana line, not lucide's crossed-blade Swords icon (which at low stroke width
          reads as an unrelated flag/antenna shape, not a sword) — a plain rotated bar
          plus a short crossguard tick reads correctly as a single blade. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 top-14 hidden rotate-[38deg] md:block"
      >
        <div className="h-[3px] w-40 rounded-full bg-gradient-to-r from-transparent via-nova-accent/60 to-nova-accent/25" />
        <div className="absolute left-6 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-nova-accent/40" />
      </div>

      {/* Samurai line-art, left third. Source PNG is a flat RGB raster (no alpha channel) —
          tried a mask-image recolor first but the browser rendered it as a solid block
          instead of the shape, so back to <img>+filter. Live tenji.ai's version reads as a
          vivid pink/magenta duotone; grayscale+sepia+hue-rotate pushes this art there
          (sepia's warm base rotates to pink around hue 300-320deg, unlike the previous
          hue-rotate(-15deg) off an unconverted sepia which only shifted brown to a
          slightly different brown). */}
      <img
        src={samurai}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden h-auto w-[480px] select-none lg:block"
        style={{
          filter:
            'grayscale(1) brightness(1.6) contrast(1.35) sepia(1) hue-rotate(300deg) saturate(4) drop-shadow(0 0 30px rgba(242,56,111,0.35))',
          opacity: 0.55,
          // Source PNG has no alpha channel, so its right edge is a visible hard rectangle
          // against the page background — fade it out with a plain gradient mask (this one
          // is CSS-generated, not image-sourced, so it doesn't hit the mask-image bug above.
          maskImage: 'linear-gradient(to right, black 55%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 92%)',
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-nova-border bg-white/5 px-3 py-1.5 text-xs font-medium text-nova-text-muted backdrop-blur-sm">
          <span className="flex items-center gap-1 rounded-full bg-nova-accent px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black">
            <Sparkles className="h-3 w-3" />
            New
          </span>
          AI Website Generator for Local Businesses
        </div>

        <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-nova-text sm:text-5xl md:text-6xl lg:text-7xl">
          {HEADLINE_WORDS.map((word, i) => (
            <span key={word + i}>
              <span
                className={`nova-word ${ACCENT_WORDS.has(word) ? 'nova-word-accent' : ''}`}
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                {word}
              </span>{' '}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base text-nova-text-muted md:text-lg">
          Nova scans Google to find local businesses with weak or missing websites, then helps you
          create websites &amp; close them faster.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-nova-accent-bright to-nova-accent-deep px-7 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_-6px_rgba(242,56,111,0.6)] transition-transform hover:scale-[1.03]"
          >
            Start Finding Clients
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#video"
            className="flex items-center gap-2 rounded-full border border-nova-border bg-white/5 px-6 py-3 text-sm font-semibold text-nova-text transition-colors hover:bg-white/10"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  )
}
