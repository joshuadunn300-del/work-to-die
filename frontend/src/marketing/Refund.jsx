import Nav from './sections/Nav'
import SiteFooter from './sections/SiteFooter'

export default function Refund() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Nav />
      <main className="mx-auto max-w-3xl px-8 pt-40 pb-28">
        <span className="rounded-full border border-[#f2386f]/40 bg-[#f2386f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f2386f]">
          Draft — pending review
        </span>
        <h1 className="mt-5 text-4xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Refund Policy
        </h1>
        <p className="mt-2 text-sm text-white/40">Last updated: TBD</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/70">
          <p>
            This Refund Policy explains how refunds are handled for Nova subscriptions.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">1. Subscription Fees</h2>
            <p className="mt-2">
              Paid plans are billed in advance on a recurring basis. Fees already charged for the current billing
              period are non-refundable except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Free Trial</h2>
            <p className="mt-2">
              The free trial gives full access to Starter features for the trial period. Cancelling before the
              trial ends avoids being charged.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Cancellations</h2>
            <p className="mt-2">
              You can cancel at any time from your account settings. Cancelling stops future billing; access
              continues through the end of the current paid period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Exceptions</h2>
            <p className="mt-2">
              If you believe you were billed in error, contact support and we'll review it on a case-by-case
              basis.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
