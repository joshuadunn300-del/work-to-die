import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'landscapers',
  logoIcon: 'sprout',
  hero: {
    eyebrow: 'Local Landscaping · Free Design Quotes',
    headline: 'Love your yard again.',
    subtext:
      'From lush lawns and gardens to paving, decks and full backyard transformations, our landscapers design and build outdoor spaces you’ll actually use. Free quotes and honest pricing.',
    trustBadges: ['Licensed & Insured', 'Free Design Quotes', 'Satisfaction Guaranteed'],
    formTitle: 'Request a Landscaping Quote',
    formOptions: [
      'Lawn & turf',
      'Garden design & planting',
      'Paving & retaining walls',
      'Decking & pergolas',
      'Irrigation & drainage',
      'Full backyard makeover',
    ],
  },
  services: {
    heading: 'Outdoor spaces, beautifully built',
    subheading: 'Design, build and maintenance from a team that sweats the details.',
    items: [
      { icon: 'sprout', title: 'Lawns & turf', desc: 'New turf, lush lawns and ongoing lawn care.' },
      { icon: 'flower-2', title: 'Garden design', desc: 'Planting plans that thrive and look great year-round.' },
      { icon: 'grid-3x3', title: 'Paving & retaining', desc: 'Patios, paths and retaining walls built to last.' },
      { icon: 'home', title: 'Decks & pergolas', desc: 'Timber and composite structures for outdoor living.' },
      { icon: 'droplets', title: 'Irrigation & drainage', desc: 'Smart watering and drainage that protects your yard.' },
      { icon: 'building', title: 'Commercial grounds', desc: 'Landscaping and upkeep for businesses and strata.' },
    ],
  },
  about: {
    heading: 'Transforming yards across the area',
    body: "We're a local, fully insured landscaping team that designs and builds outdoor spaces to suit how you live. Every project across {{LOCATION}} is finished to a standard we're proud to put our name on.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '2k', label: 'Yards transformed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Loved by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Turned a patch of dirt into the backyard of our dreams.', name: 'Claire Hughes', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'New lawn and paving completely lifted the whole property.', name: 'Ben Carter', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'They maintain our strata gardens beautifully all year.', name: 'Diana Flores', role: 'Strata manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every design consultation and quote is free and obligation-free.' },
    { q: 'Do you do both design and construction?', a: 'We handle the full journey — design, build and ongoing maintenance.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and backed by a satisfaction guarantee.' },
  ],
  cta: {
    heading: 'Ready to transform your yard?',
    subtext: "Book a free design quote today. We'll get back to you within the hour.",
  },
  footerTagline: 'Local landscaping and gardens, beautifully built.',
})
