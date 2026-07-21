import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'builders',
  logoIcon: 'hammer',
  hero: {
    eyebrow: 'Licensed Local Builders · Free Quotes',
    headline: 'Build it right, the first time.',
    subtext:
      'From extensions and renovations to new homes and decks, our licensed builders deliver quality work on time and on budget. Clear communication and a fixed-price guarantee.',
    trustBadges: ['Licensed & Insured', 'Fixed-Price Quotes', 'On-Time Guarantee'],
    formTitle: 'Request a Build Quote',
    formOptions: [
      'Home extensions',
      'Renovations',
      'New home builds',
      'Decks & outdoor',
      'Structural repairs',
      'Commercial fit-outs',
    ],
  },
  services: {
    heading: 'Building services done properly',
    subheading: 'Craftsmanship, clear pricing and a project managed end to end.',
    items: [
      { icon: 'home', title: 'Extensions & additions', desc: 'Add space and value with a seamless extension.' },
      { icon: 'hammer', title: 'Renovations', desc: 'Kitchens, bathrooms and full-home renovations.' },
      { icon: 'building-2', title: 'New home builds', desc: 'Custom homes built to your brief and budget.' },
      { icon: 'layout-grid', title: 'Decks & outdoor', desc: 'Decks, pergolas and outdoor living areas.' },
      { icon: 'wrench', title: 'Structural work', desc: 'Repairs, underpinning and structural upgrades.' },
      { icon: 'briefcase', title: 'Commercial fit-outs', desc: 'Shop and office fit-outs finished on schedule.' },
    ],
  },
  about: {
    heading: 'Quality building, honest process',
    body: "We're a fully licensed local building team that treats your project like our own. Across {{LOCATION}} we're known for tidy sites, clear communication and finishing on time — no nasty surprises.",
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '600+', label: 'Projects delivered' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Our extension came in on budget and looks like it was always there.', name: 'Laura Simmons', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Kept us informed every step and finished ahead of schedule.', name: 'Chris Walker', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Fitted out our new store perfectly and on time for opening.', name: 'Natalie Ross', role: 'Business owner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you provide fixed-price quotes?', a: 'Yes, we provide detailed fixed-price quotes so you know the cost upfront.' },
    { q: 'Do you manage council approvals?', a: 'We handle plans, permits and approvals so you don’t have to.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and covered by home warranty insurance.' },
  ],
  cta: {
    heading: 'Planning a build or reno?',
    subtext: "Request your free quote today. We'll get back to you within the hour.",
  },
  footerTagline: 'Local builders you can trust, on time and on budget.',
})
