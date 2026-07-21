import Nav from './sections/Nav'
import SiteFooter from './sections/SiteFooter'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Nav />
      <main className="mx-auto max-w-3xl px-8 pt-40 pb-28">
        <span className="rounded-full border border-[#f2386f]/40 bg-[#f2386f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#f2386f]">
          Draft — pending review
        </span>
        <h1 className="mt-5 text-4xl font-bold" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-white/40">Last updated: TBD</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/70">
          <p>
            This Privacy Policy explains how Nova ("we", "us", "our") collects, uses, and protects information when
            you use the Service.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-2">
              Account information you provide (name, email, billing details), usage data (searches, generated sites,
              pipeline activity), and technical data (device, browser, IP address) collected automatically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. How We Use Information</h2>
            <p className="mt-2">
              To operate and improve the Service, process payments, provide support, and communicate important
              account or product updates. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Business Lead Data</h2>
            <p className="mt-2">
              Local business information surfaced by the Service is sourced from publicly available sources and is
              not personal data about you or your customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data Sharing</h2>
            <p className="mt-2">
              We share data only with service providers necessary to run the platform (e.g. payment processing,
              hosting), each bound by confidentiality obligations, or when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Data Retention &amp; Security</h2>
            <p className="mt-2">
              We retain account data for as long as your account is active and apply reasonable technical and
              organizational measures to protect it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Your Rights</h2>
            <p className="mt-2">
              You may access, correct, or delete your account data at any time by contacting support or through your
              account settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy periodically. Material changes will be communicated before they take
              effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Contact</h2>
            <p className="mt-2">Questions about this policy can be sent to our support team.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
