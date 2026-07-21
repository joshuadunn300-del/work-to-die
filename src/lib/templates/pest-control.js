import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'pest-control',
  logoIcon: 'bug',
  hero: {
    eyebrow: 'Licensed Local Pest Control · Same-Day',
    headline: 'Pests gone. Peace of mind guaranteed.',
    subtext:
      'From termites to rodents, cockroaches to spiders, our licensed technicians clear your home safely with family- and pet-friendly treatments. Same-day service, guaranteed results.',
    trustBadges: ['Licensed & Insured', 'Pet & Family Safe', 'Results Guaranteed'],
    formTitle: 'Request a Pest Inspection',
    formOptions: [
      'Termite inspection & treatment',
      'Cockroaches & ants',
      'Rodents & mice',
      'Spiders & wasps',
      'General pest treatment',
      'Commercial pest control',
    ],
  },
  services: {
    heading: 'Pest control that actually works',
    subheading: 'Safe, thorough treatments backed by a satisfaction guarantee.',
    items: [
      { icon: 'shield', title: 'Termite protection', desc: 'Inspections, barriers and treatment to protect your home.' },
      { icon: 'bug', title: 'Cockroaches & ants', desc: 'Targeted treatments that clear infestations for good.' },
      { icon: 'mouse', title: 'Rodents & mice', desc: 'Safe removal and proofing to keep them out.' },
      { icon: 'sparkles', title: 'Spiders & wasps', desc: 'Fast knockdown of webs, nests and hives.' },
      { icon: 'home', title: 'General pest treatment', desc: 'Seasonal protection around the whole property.' },
      { icon: 'building', title: 'Commercial pest control', desc: 'Discreet, compliant programs for businesses.' },
    ],
  },
  about: {
    heading: 'Protecting local homes for years',
    body: "We're a fully licensed local pest team using treatments that are tough on pests but safe around your family and pets. Every job across {{LOCATION}} comes with a results guarantee.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '14k', label: 'Homes treated' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Cleared a bad roach problem in one visit. Haven’t seen one since.', name: 'Karen White', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Caught early termite activity that saved us a fortune.', name: 'Steven Lee', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Professional, safe around the kids and dog, and it worked.', name: 'Amanda Cruz', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Are your treatments safe for pets and kids?', a: 'Yes, we use family- and pet-safe products and advise on any re-entry times.' },
    { q: 'Do you guarantee results?', a: 'Our treatments are backed by a satisfaction guarantee with free follow-ups.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and trained in the latest pest management methods.' },
  ],
  cta: {
    heading: 'Got a pest problem?',
    subtext: "Book same-day service today. We'll get back to you within the hour.",
  },
  footerTagline: 'Safe, guaranteed local pest control.',
})
