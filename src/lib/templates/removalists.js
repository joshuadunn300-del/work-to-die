import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'removalists',
  logoIcon: 'truck',
  hero: {
    eyebrow: 'Local & Interstate Removalists',
    headline: 'Moving day, handled with care.',
    subtext:
      'Local, interstate and office moves from a fully insured team that treats your belongings like their own. Transparent pricing, no surprise fees.',
    trustBadges: ['Fully Insured', 'Transparent Pricing', 'No Hidden Fees'],
    formTitle: 'Get a Free Moving Quote',
    formOptions: ['Local move', 'Interstate move', 'Office relocation', 'Packing service', 'Furniture removal', 'Storage'],
  },
  services: {
    heading: 'Moving services for every job',
    subheading: 'From a single item to a full house, we\'ve got the crew and trucks for it.',
    items: [
      { icon: 'truck', title: 'Local moving', desc: 'Fast, careful moves anywhere across {{LOCATION}}.' },
      { icon: 'map', title: 'Interstate moving', desc: 'Reliable long-distance moves with real-time tracking.' },
      { icon: 'building', title: 'Office relocation', desc: 'Minimal-downtime moves for businesses of any size.' },
      { icon: 'package', title: 'Packing service', desc: 'Full or partial packing using quality materials.' },
      { icon: 'sofa', title: 'Furniture removal', desc: 'Careful handling and disposal of unwanted furniture.' },
      { icon: 'warehouse', title: 'Storage solutions', desc: 'Secure short and long-term storage options.' },
    ],
  },
  about: {
    heading: 'Movers who actually care about your stuff',
    body: "Our {{LOCATION}} crew has completed thousands of moves, big and small. Every truck is fully insured and every mover trained to handle your belongings properly — no rushing, no damage.",
    stats: [
      { value: '10+', label: 'Years experience' },
      { value: '14k', label: 'Moves completed' },
      { value: '4.8★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by families and businesses across {{LOCATION}}',
    items: [
      { quote: 'Fastest, most careful move we\'ve ever had. Nothing damaged.', name: 'Olivia Marsh', role: 'Customer, {{LOCATION}}' },
      { quote: 'Office move happened over a weekend, zero downtime Monday.', name: 'Rajesh Kumar', role: 'Business Owner, {{LOCATION}}' },
      { quote: 'Upfront quote, no surprise charges at the end. Refreshing.', name: 'Ella Whitfield', role: 'Customer, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Are you insured?', a: 'Yes, every move is covered by full transit insurance.' },
    { q: 'Do you offer packing services?', a: 'Yes, we offer full and partial packing with quality materials.' },
    { q: 'Can you do interstate moves?', a: 'Yes, we handle interstate moves with real-time tracking.' },
  ],
  cta: {
    heading: 'Ready to book your move?',
    subtext: 'Get a free, transparent quote today.',
  },
  footerTagline: 'Careful, reliable moving, local and interstate.',
})
