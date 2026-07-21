import { ArrowRight, Sparkles } from 'lucide-react'
import { DISCOVERY_NICHES } from '../lib/discoveryCatalog'

const DIFFICULTY_STYLE = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function Discovery() {
  return (
    <div>
      <p className="nova-eyebrow mb-1">STUDIO</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Choose a niche. Nova builds the angle.</h1>
      <p className="text-sm text-nova-text-muted mb-4">
        Every local business niche with its average client value, difficulty, and best offer angle.
      </p>

      {/* Real tenji.ai/app/discovery is a full "Coming Soon" gate — the niche grid renders
          dimmed/inert behind a glass overlay card, not a small dismissible banner above a
          working grid (T5 PORTAL PARITY, 2026-07-21: getComputedStyle confirmed radius:24px/
          padding:128px 24px/backdrop-blur:20px card, heading 60px/600 with the same 5-stop
          animated-gradient-text treatment used elsewhere in the app). */}
      <div className="relative">
        <div className="pointer-events-none opacity-30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISCOVERY_NICHES.map((n) => (
            <div key={n.niche} className="nova-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{n.niche}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLE[n.difficulty]}`}>{n.difficulty}</span>
              </div>
              <p className="text-sm text-nova-text-muted mb-2">{n.angle}</p>
              <p className="text-sm font-medium mb-3">${n.avgValue}/mo avg</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-nova-accent">
                Find Leads <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 py-32 px-6 flex flex-col items-center justify-center text-center rounded-3xl backdrop-blur-[20px]">
          <div className="w-10 h-10 rounded-xl bg-nova-accent/15 border border-nova-accent/30 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-nova-accent" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-semibold tracking-tight leading-[1.35] pb-2 animated-gradient-text">
            Coming Soon..
          </h2>
          <p className="text-sm text-nova-text-muted max-w-md">
            Niche Discovery is getting a major upgrade — live market data, opportunity scores, and AI-picked angles.
          </p>
        </div>
      </div>
    </div>
  )
}
