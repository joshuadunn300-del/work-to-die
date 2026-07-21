// Fallback template for any niche without a dedicated file. Copy is
// trade-agnostic so it reads sensibly for any local service business.
import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'generic',
  logoIcon: 'wrench',
  hero: {
    eyebrow: 'Trusted Local Service · Fast & Reliable',
    headline: 'Local experts you can count on.',
    subtext:
      'Whatever you need done, our experienced local team gets it done right the first time. Honest, upfront pricing and fast, friendly service.',
    trustBadges: ['Licensed & Insured', 'Fast Response', 'Upfront Pricing'],
    formTitle: 'Request a Quote',
    formOptions: [
      'General enquiry',
      'Book a service',
      'Request a quote',
      'Emergency callout',
      'Ongoing maintenance',
    ],
  },
  services: {
    heading: 'Services built around you',
    subheading: 'Whatever the job, we handle it with care and a workmanship guarantee.',
    items: [
      { icon: 'check-circle', title: 'Expert service', desc: 'Experienced, qualified professionals on every job.' },
      { icon: 'clock', title: 'Fast response', desc: 'Prompt callouts and quick turnaround times.' },
      { icon: 'wallet', title: 'Upfront pricing', desc: 'Clear, honest quotes with no hidden fees.' },
      { icon: 'shield', title: 'Fully insured', desc: 'Licensed and insured for complete peace of mind.' },
      { icon: 'sparkles', title: 'Quality guaranteed', desc: 'Backed by our satisfaction guarantee.' },
      { icon: 'building', title: 'Homes & business', desc: 'Reliable service for both homes and businesses.' },
    ],
  },
  about: {
    heading: 'Your trusted local team',
    body: "We're a local, fully insured team that treats every customer like a neighbour. Across {{LOCATION}} we're known for honest advice, quality work and finishing what we start.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '10k', label: 'Jobs completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by locals across {{LOCATION}}',
    items: [
      { quote: 'Prompt, professional and great value. Couldn’t ask for more.', name: 'Alex Morgan', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Turned up on time, did exactly what was quoted. Highly recommend.', name: 'Jamie Lee', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Our go-to team now. Reliable every single time.', name: 'Sam Patel', role: 'Business owner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every quote is free, fast and obligation-free.' },
    { q: 'How quickly can you help?', a: 'We aim to respond fast and can often help same day.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and backed by a workmanship guarantee.' },
  ],
  cta: {
    heading: 'Need a hand today?',
    subtext: "Call now or request your free quote. We'll get back to you within the hour.",
  },
  footerTagline: 'Trusted local service, done right the first time.',
})
