import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'electricians',
  logoIcon: 'zap',
  hero: {
    eyebrow: 'Licensed Local Electricians · 24/7',
    headline: 'Power problems? We fix them fast.',
    subtext:
      'From dead outlets to full rewires and switchboard upgrades, our licensed electricians get the job done safely and to code. Upfront pricing, same-day callouts.',
    trustBadges: ['Licensed & Insured', '24/7 Emergency', 'Upfront Pricing'],
    formTitle: 'Request an Electrician',
    formOptions: [
      'Fault finding & repairs',
      'Switchboard upgrades',
      'Lighting & power points',
      'Safety switches & inspections',
      'EV charger installation',
      'Rewiring',
    ],
  },
  services: {
    heading: 'Electrical work you can rely on',
    subheading: 'Every job done safely, to code, and backed by our workmanship guarantee.',
    items: [
      { icon: 'zap', title: 'Fault finding & repairs', desc: 'Fast diagnosis for outages, tripping circuits and dead points.' },
      { icon: 'layout-grid', title: 'Switchboard upgrades', desc: 'Modern, safe boards with proper circuit protection.' },
      { icon: 'lightbulb', title: 'Lighting & power', desc: 'New downlights, power points and smart lighting.' },
      { icon: 'shield', title: 'Safety inspections', desc: 'Safety switches, testing and compliance certificates.' },
      { icon: 'plug', title: 'EV charger installs', desc: 'Home and business EV charging done right.' },
      { icon: 'building', title: 'Commercial electrical', desc: 'Fit-outs and maintenance for businesses of any size.' },
    ],
  },
  about: {
    heading: 'Decades keeping the lights on',
    body: "We're a fully licensed local team that treats every home and business like our own. No shortcuts, no surprise fees — just safe, tidy electrical work across {{LOCATION}}.",
    stats: [
      { value: '18+', label: 'Years experience' },
      { value: '10k', label: 'Jobs completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homes & businesses across {{LOCATION}}',
    items: [
      { quote: 'Sorted a dangerous switchboard same day and explained everything clearly.', name: 'Emma Roberts', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Wired our whole cafe fit-out on time and on budget.', name: 'Tom Nguyen', role: 'Cafe owner, {{LOCATION}}' },
      { quote: 'Reliable, tidy and always on time. Our go-to sparky.', name: 'Priya Sharma', role: 'Property manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every quote is free, fast and obligation-free.' },
    { q: 'Are you available for emergencies?', a: 'We offer 24/7 emergency callouts for electrical faults and outages.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and compliant with all electrical safety standards.' },
  ],
  cta: {
    heading: 'Need an electrician today?',
    subtext: "Call now or request your free quote. We'll get back to you within the hour.",
  },
  footerTagline: 'Safe, reliable local electrical work, done right.',
})
