import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'bathroom-renovation',
  logoIcon: 'bath',
  hero: {
    eyebrow: 'Bathroom Renovation Specialists · Free Quotes',
    headline: 'The bathroom you’ve been putting off.',
    subtext:
      'From simple refreshes to full custom renovations, we design and build beautiful, waterproof bathrooms on time and on budget. One team, fixed-price quotes, no stress.',
    trustBadges: ['Licensed & Insured', 'Fixed-Price Quotes', 'Fully Waterproofed'],
    formTitle: 'Request a Bathroom Quote',
    formOptions: [
      'Full bathroom renovation',
      'Ensuite renovation',
      'Waterproofing & tiling',
      'Vanity & fixture upgrade',
      'Laundry renovation',
      'Accessible bathrooms',
    ],
  },
  services: {
    heading: 'Bathrooms designed and built to last',
    subheading: 'One team handles design, waterproofing, tiling and finishing.',
    items: [
      { icon: 'bath', title: 'Full renovations', desc: 'Complete bathroom makeovers managed end to end.' },
      { icon: 'droplets', title: 'Waterproofing', desc: 'Certified waterproofing that protects your home.' },
      { icon: 'grid-3x3', title: 'Tiling', desc: 'Precision floor and wall tiling with a flawless finish.' },
      { icon: 'showerhead', title: 'Fixtures & fit-out', desc: 'Vanities, showers, toilets and tapware installed.' },
      { icon: 'accessibility', title: 'Accessible bathrooms', desc: 'Safe, stylish designs for ageing in place.' },
      { icon: 'home', title: 'Ensuites & laundries', desc: 'Small-space renovations that feel brand new.' },
    ],
  },
  about: {
    heading: 'Bathroom renovations without the stress',
    body: "We're a licensed local team specialising in bathrooms across {{LOCATION}}. One point of contact, certified waterproofing and a fixed-price quote — so your renovation runs on time and on budget.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '1.5k', label: 'Bathrooms built' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Loved by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Finished in three weeks exactly as promised. We love it every morning.', name: 'Megan Bailey', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Turned a tiny dated ensuite into a spa. Faultless tiling.', name: 'Ryan Cox', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Renovated bathrooms in two of our rentals — great work, on budget.', name: 'Vanessa Ng', role: 'Property manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'How long does a bathroom renovation take?', a: 'Most full bathrooms are completed in two to three weeks once we start.' },
    { q: 'Do you provide fixed-price quotes?', a: 'Yes — a detailed fixed-price quote with no hidden extras.' },
    { q: 'Is the waterproofing certified?', a: 'Always. All waterproofing is done by licensed applicators and certified.' },
  ],
  cta: {
    heading: 'Ready for a new bathroom?',
    subtext: "Book a free design quote today. We'll get back to you within the hour.",
  },
  footerTagline: 'Beautiful, waterproof bathroom renovations, done right.',
})
