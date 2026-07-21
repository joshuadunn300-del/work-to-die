import Nav from './sections/Nav'
import SiteFooter from './sections/SiteFooter'

export default function RequestFeature() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Nav />
      <main className="mx-auto max-w-2xl px-8 pt-40 pb-28 text-center">
        <span className="rounded-full border border-[#f2386f]/40 bg-[#f2386f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f2386f]">
          Draft — pending review
        </span>
        <h1 className="mt-5 text-4xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Request a feature
        </h1>
        <p className="mt-4 text-white/60">
          Tell us what would make Nova more useful for your agency. We read every request and use them to
          prioritize the roadmap.
        </p>
        <a
          href="mailto:support@nova.ai?subject=Feature%20request"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#f2386f] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(242,56,111,0.6)] hover:brightness-110"
        >
          Email us a request
        </a>
      </main>
      <SiteFooter />
    </div>
  )
}
