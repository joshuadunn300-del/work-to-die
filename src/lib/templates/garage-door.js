import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'garage-door',
  logoIcon: 'door-open',
  hero: {
    eyebrow: 'Garage Door Specialists · Same-Day',
    headline: 'Garage door stuck? We’ll fix it today.',
    subtext:
      'From broken springs and motors to full door replacements, our technicians get your garage working again fast and safely. Upfront pricing and same-day service.',
    trustBadges: ['Licensed & Insured', 'Same-Day Repairs', 'Upfront Pricing'],
    formTitle: 'Request a Garage Door Tech',
    formOptions: [
      'Spring & cable repair',
      'Motor & opener repair',
      'Off-track & roller repair',
      'New door installation',
      'Servicing & tune-ups',
      'Commercial doors',
    ],
  },
  services: {
    heading: 'Garage door repairs & installs',
    subheading: 'Fast, safe fixes and quality new doors, all guaranteed.',
    items: [
      { icon: 'wrench', title: 'Spring & cable repair', desc: 'Safe replacement of broken springs and cables.' },
      { icon: 'settings', title: 'Motor & opener repair', desc: 'Fix or upgrade openers and remotes of any brand.' },
      { icon: 'move', title: 'Off-track & rollers', desc: 'Get jammed and derailed doors gliding again.' },
      { icon: 'door-open', title: 'New door installation', desc: 'Sectional, roller and tilt doors professionally fitted.' },
      { icon: 'shield', title: 'Servicing & safety', desc: 'Tune-ups and safety checks to prevent breakdowns.' },
      { icon: 'building', title: 'Commercial doors', desc: 'Roller shutters and industrial doors serviced fast.' },
    ],
  },
  about: {
    heading: 'Your local garage door experts',
    body: "We're a licensed, insured local team that repairs and installs every type of garage door across {{LOCATION}}. Fast response, quality parts and a workmanship guarantee on every job.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '13k', label: 'Doors serviced' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Snapped spring fixed within hours of calling. Car freed, day saved.', name: 'Mark Davis', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'New sectional door looks fantastic and runs whisper quiet.', name: 'Julia Foster', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'They service our warehouse roller doors — always quick and reliable.', name: 'Andrew Price', role: 'Warehouse manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Can you repair my door the same day?', a: 'Most repairs, including broken springs, are completed same day.' },
    { q: 'Do you work on all brands?', a: 'Yes, we repair and service every major door and opener brand.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and backed by a workmanship guarantee.' },
  ],
  cta: {
    heading: 'Garage door playing up?',
    subtext: "Call now or request a quote. We'll get back to you within the hour.",
  },
  footerTagline: 'Fast, reliable local garage door repairs and installs.',
})
