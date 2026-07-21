import Nav from './sections/Nav'
import PricingSection from './sections/PricingSection'
import FaqSection from './sections/FaqSection'
import FinalCta from './sections/FinalCta'
import SiteFooter from './sections/SiteFooter'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#08080c]">
      <Nav />
      <main>
        {/* PricingSection already renders its own eyebrow + H2 — a duplicate H1 here
            (removed 2026-07-21) had no equivalent on live tenji.ai's /pricing. */}
        <div className="pt-24" />
        <PricingSection heading="Simple, transparent pricing" />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
