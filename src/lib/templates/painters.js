import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'painters',
  logoIcon: 'paintbrush',
  hero: {
    eyebrow: 'Licensed Painting Contractors',
    headline: 'A flawless finish, inside and out.',
    subtext:
      'Interior, exterior and commercial painting from a crew that preps properly, protects your space, and cleans up after itself. Free colour consult included.',
    trustBadges: ['Licensed & Insured', 'Free Colour Consult', '5-Year Workmanship'],
    formTitle: 'Request a Painting Quote',
    formOptions: ['Interior painting', 'Exterior painting', 'Commercial painting', 'Fence & deck staining', 'Feature walls', 'Roof painting'],
  },
  services: {
    heading: 'Painting done right, room to roof',
    subheading: 'Full prep, premium paint, and a clean job site every time.',
    items: [
      { icon: 'paintbrush', title: 'Interior painting', desc: 'Walls, ceilings and trim finished to a flawless standard.' },
      { icon: 'home', title: 'Exterior painting', desc: 'Weatherproof finishes that protect and refresh your home.' },
      { icon: 'building', title: 'Commercial painting', desc: 'Minimal-disruption painting for offices and retail spaces.' },
      { icon: 'trees', title: 'Fence & deck staining', desc: 'Restore and protect outdoor timber against the elements.' },
      { icon: 'palette', title: 'Feature walls', desc: 'Bold colour and texture work that makes a room pop.' },
      { icon: 'triangle', title: 'Roof painting', desc: 'Protective coatings that extend the life of your roof.' },
    ],
  },
  about: {
    heading: 'Precision painting, honest pricing',
    body: "We've been painting homes and businesses across {{LOCATION}} for over a decade. Every job starts with proper prep — sanding, filling and priming — because a great paint job is 80% preparation.",
    stats: [
      { value: '12+', label: 'Years experience' },
      { value: '3k', label: 'Projects completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'The prep work alone was worth it — the finish is immaculate.', name: 'Tom Reilly', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Repainted our whole office over a weekend, zero disruption.', name: 'Angela Wu', role: 'Business Owner, {{LOCATION}}' },
      { quote: 'Colour consult saved us from a huge mistake. Highly recommend.', name: 'Ben Foster', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you help choose colours?', a: 'Yes, every quote includes a free colour consultation.' },
    { q: 'What paint brands do you use?', a: 'Premium, low-VOC paints from trusted major brands.' },
    { q: 'Do you offer a workmanship guarantee?', a: 'Yes — a 5-year guarantee on all workmanship.' },
  ],
  cta: {
    heading: 'Ready to transform your space?',
    subtext: 'Get a free, no-obligation quote today.',
  },
  footerTagline: 'Professional painting, flawless results, every time.',
})
