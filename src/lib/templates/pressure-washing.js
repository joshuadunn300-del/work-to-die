import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'pressure-washing',
  logoIcon: 'droplets',
  hero: {
    eyebrow: 'Professional Pressure Washing',
    headline: 'Blast away years of grime, instantly.',
    subtext:
      'Driveways, roofs, decks and building exteriors restored to like-new condition. Eco-friendly methods, fully insured, satisfaction guaranteed.',
    trustBadges: ['Eco-Friendly', 'Fully Insured', 'Satisfaction Guarantee'],
    formTitle: 'Get a Free Wash Quote',
    formOptions: ['Driveway & paths', 'House wash', 'Roof cleaning', 'Deck & patio', 'Commercial exteriors', 'Gutter wash'],
  },
  services: {
    heading: 'Pressure washing for every surface',
    subheading: 'Safe, effective cleaning that protects the surface underneath.',
    items: [
      { icon: 'droplets', title: 'Driveway & paths', desc: 'Lift oil stains, moss and grime from concrete and pavers.' },
      { icon: 'home', title: 'House wash', desc: 'Soft-wash exterior cleaning that\'s safe for every surface.' },
      { icon: 'triangle', title: 'Roof cleaning', desc: 'Remove moss and lichen without damaging tiles or shingles.' },
      { icon: 'sofa', title: 'Deck & patio', desc: 'Restore timber and pavers ready for sealing or staining.' },
      { icon: 'building', title: 'Commercial exteriors', desc: 'Storefronts and building facades cleaned on schedule.' },
      { icon: 'wind', title: 'Gutter wash', desc: 'Clear debris and buildup to keep water flowing freely.' },
    ],
  },
  about: {
    heading: 'Careful cleaning, remarkable results',
    body: "We've been restoring homes and businesses across {{LOCATION}} for years, using pressure and technique matched to every surface — so you get a deep clean without any damage.",
    stats: [
      { value: '9+', label: 'Years experience' },
      { value: '7k', label: 'Properties cleaned' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Loved by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Our driveway looks brand new. Incredible difference.', name: 'Helen Carter', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Roof clean removed years of moss without a single broken tile.', name: 'Owen Bright', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Booked for our storefront monthly now — always spotless.', name: 'Nadia Farouk', role: 'Business Owner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Is pressure washing safe for my roof?', a: 'We use a soft-wash technique specifically safe for roofing materials.' },
    { q: 'Are your products eco-friendly?', a: 'Yes, all our cleaning solutions are biodegradable and plant-safe.' },
    { q: 'Do you offer recurring service?', a: 'Yes, we offer scheduled cleans for commercial properties.' },
  ],
  cta: {
    heading: 'Ready to restore your property?',
    subtext: 'Get a free quote and see the difference today.',
  },
  footerTagline: 'Professional pressure washing, remarkable results.',
})
