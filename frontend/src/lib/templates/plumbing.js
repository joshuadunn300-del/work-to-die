// Ported from Tenji's real plumbing template (tenji-plumbing-template.json).
import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'plumbing',
  logoIcon: 'droplets',
  hero: {
    eyebrow: 'Licensed Local Plumbers · 24/7',
    headline: "Burst pipe? We'll be there fast.",
    subtext:
      'From emergency leaks to full bathroom installs, our licensed plumbers fix it right the first time. Honest, upfront pricing and same-day callouts.',
    trustBadges: ['Licensed & Insured', '24/7 Emergency', 'Upfront Pricing'],
    formTitle: 'Request a Plumber',
    formOptions: [
      'Leak & pipe repair',
      'Bathroom & kitchen',
      '24/7 emergency',
      'Hot water systems',
      'Drain cleaning',
      'Commercial plumbing',
    ],
  },
  services: {
    heading: 'Plumbing services built around you',
    subheading: 'Whatever the job, we handle it with care, precision and a workmanship guarantee.',
    items: [
      { icon: 'droplets', title: 'Leak & pipe repair', desc: 'Fast detection and lasting fixes for leaks of any size.' },
      { icon: 'home', title: 'Bathroom & kitchen', desc: 'Renovations, installs and fixture upgrades.' },
      { icon: 'clock', title: '24/7 emergency', desc: 'Burst pipes and blockages handled day or night.' },
      { icon: 'flame', title: 'Hot water systems', desc: 'Repair, replace and service all hot water units.' },
      { icon: 'wrench', title: 'Drain cleaning', desc: 'High-pressure clearing that keeps water flowing.' },
      { icon: 'building', title: 'Commercial plumbing', desc: 'Reliable solutions for businesses of every size.' },
    ],
  },
  about: {
    heading: 'Two decades of trusted craftsmanship',
    body: "We started as a small family business and grew into {{LOCATION}}'s most trusted plumbing team. Every technician is licensed, insured and trained to treat your home like their own. No hidden fees, no shortcuts.",
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '12k', label: 'Jobs completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'They fixed a burst pipe at 2am and saved our basement. Unbelievable service.', name: 'Maria Gonzalez', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Fair pricing, showed up on time, and left the place spotless.', name: 'David Chen', role: 'Restaurant owner, {{LOCATION}}' },
      { quote: 'We use them for all our rentals. Reliable every single time.', name: 'Sarah Mitchell', role: 'Property manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every quote is free, fast and obligation-free.' },
    { q: 'Are you available for emergencies?', a: 'We offer 24/7 emergency callouts, including weekends and holidays.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and background-checked.' },
  ],
  cta: {
    heading: 'Need a plumber today?',
    subtext: "Call now or request your free quote. We'll get back to you within the hour.",
  },
  footerTagline: 'Trusted local plumbing, done right the first time.',
})
