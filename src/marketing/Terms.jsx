import Nav from './sections/Nav'
import SiteFooter from './sections/SiteFooter'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Nav />
      <main className="mx-auto max-w-3xl px-8 pt-40 pb-28">
        <span className="rounded-full border border-[#f2386f]/40 bg-[#f2386f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f2386f]">
          Draft — pending review
        </span>
        <h1 className="mt-5 text-4xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-white/40">Last updated: TBD</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/70">
          <p>
            These Terms of Service ("Terms") govern access to and use of Nova (the "Service"), operated by Nova
            ("we", "us", "our"). By creating an account or using the Service, you agree to these Terms.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">1. Accounts</h2>
            <p className="mt-2">
              You must provide accurate information when creating an account and are responsible for all activity
              under it. You must be at least 18 years old to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Subscriptions &amp; Billing</h2>
            <p className="mt-2">
              Paid plans are billed in advance on a recurring basis. You may cancel at any time; access continues
              through the end of the current billing period. Fees are non-refundable except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Acceptable Use</h2>
            <p className="mt-2">
              You agree not to misuse the Service, including scraping it outside of intended features, attempting to
              disrupt its operation, or using it to send unlawful or unsolicited communications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data &amp; Lead Information</h2>
            <p className="mt-2">
              Business data surfaced by the Service is sourced from publicly available information. You are
              responsible for complying with applicable outreach and communication laws when contacting leads.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate access for violation of these Terms. You may stop using the Service and
              close your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Disclaimers &amp; Limitation of Liability</h2>
            <p className="mt-2">
              The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law,
              Nova is not liable for indirect, incidental, or consequential damages arising from use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Changes to These Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of the Service after changes take effect
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Contact</h2>
            <p className="mt-2">Questions about these Terms can be sent to our support team.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
