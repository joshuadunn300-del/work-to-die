import Nav from './sections/Nav'
import Hero from './sections/Hero'
import HowItWorks from './sections/HowItWorks'
import PricingSection from './sections/PricingSection'
import TestimonialsMarquee from './sections/TestimonialsMarquee'
import FaqSection from './sections/FaqSection'
import FinalCta from './sections/FinalCta'
import SiteFooter from './sections/SiteFooter'

export default function Landing() {
  return (
    <div className="dark min-h-screen bg-[#08080c] text-white overflow-x-clip">
      {/* Scoped, not global index.css — smooth anchor scroll for Nav/Footer #id links.
          Each section owns its own #id + scroll-mt-24 directly (HowItWorks/PricingSection/
          FaqSection) — no wrapper divs here, that caused duplicate-id churn against the
          sections' own ids. */}
      <style>{'html { scroll-behavior: smooth; }'}</style>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <PricingSection />
        <TestimonialsMarquee />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
