import { Link } from 'react-router-dom'
import Nav from './sections/Nav'
import SiteFooter from './sections/SiteFooter'

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Nav />
      <main className="mx-auto max-w-2xl px-8 pt-40 pb-28 text-center">
        <span className="rounded-full border border-[#f2386f]/40 bg-[#f2386f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f2386f]">
          Draft — pending review
        </span>
        <h1 className="mt-5 text-4xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Get in touch
        </h1>
        <p className="mt-4 text-white/60">
          Questions about Nova, a partnership idea, or something broken? We'd like to hear about it — email{' '}
          <a href="mailto:support@nova.ai" className="text-[#f2386f] hover:underline">support@nova.ai</a>, or start a
          free trial and reach us directly from your dashboard.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#f2386f] to-[#db2777] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(242,56,111,0.6)] transition hover:brightness-110"
        >
          Start Free Trial
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
