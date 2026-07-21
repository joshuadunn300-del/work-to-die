import { Link } from 'react-router-dom'

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#08080c] px-8 py-28 text-center text-white">
      {/* Live tenji.ai fills this band with a photo (torii gate / cherry blossoms) —
          no matching asset in the repo, so this is a CSS-only dojo-glow treatment
          instead of a flat panel, consistent with Hero's petal/samurai motif. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 70% at 50% 40%, rgba(242,56,113,0.16), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(242,56,111,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,56,111,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Scale Your AI Agency By Acquiring Effortless Leads
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Join thousands of agency owners closing deals with businesses that genuinely need their services.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#f2386f] to-[#db2777] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(242,56,111,0.6)] transition hover:brightness-110"
        >
          Start Today
        </Link>
      </div>
    </section>
  )
}
