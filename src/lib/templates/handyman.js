import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'handyman',
  logoIcon: 'hammer',
  hero: {
    eyebrow: 'Reliable Local Handyman Services',
    headline: 'No job too small, done right the first time.',
    subtext:
      'From a leaky tap to a full to-do list, our skilled handyman team gets it done fast, tidy and fairly priced. One call for everything on your list.',
    trustBadges: ['Fully Insured', 'One Call, Any Job', 'Upfront Pricing'],
    formTitle: 'Get a Free Handyman Quote',
    formOptions: ['General repairs', 'Furniture assembly', 'Shelving & mounting', 'Minor plumbing', 'Minor electrical', 'To-do list day'],
  },
  services: {
    heading: 'Handyman services for the whole list',
    subheading: 'Skilled, reliable and fully equipped for almost anything around the house.',
    items: [
      { icon: 'hammer', title: 'General repairs', desc: 'Doors, hinges, walls and everyday fixes handled fast.' },
      { icon: 'package', title: 'Furniture assembly', desc: 'Flat-pack furniture built properly, first time.' },
      { icon: 'layout-grid', title: 'Shelving & mounting', desc: 'TVs, shelves and artwork mounted safely and level.' },
      { icon: 'droplets', title: 'Minor plumbing', desc: 'Tap washers, drain clears and small plumbing fixes.' },
      { icon: 'zap', title: 'Minor electrical', desc: 'Light fittings, switches and small electrical jobs.' },
      { icon: 'list-checks', title: 'To-do list day', desc: 'Book a full day and knock out your whole list at once.' },
    ],
  },
  about: {
    heading: 'One reliable call for the whole to-do list',
    body: "Our {{LOCATION}} handyman team is skilled across trades and fully insured for peace of mind — so instead of juggling five tradespeople, you make one call.",
    stats: [
      { value: '9+', label: 'Years experience' },
      { value: '13k', label: 'Jobs completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Knocked out our entire to-do list in one afternoon.', name: 'Nicole Farrow', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Finally found a handyman who actually shows up on time.', name: 'Reggie Blackwood', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Tidy work, fair price, no upsell. Will call again.', name: 'Anya Petrova', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'What jobs do you handle?', a: 'From small repairs to a full day of tasks — if it\'s on your list, ask us.' },
    { q: 'Do you charge a call-out fee?', a: 'No hidden call-out fees — every quote is transparent upfront.' },
    { q: 'Are you insured?', a: 'Yes, fully insured for your peace of mind on every job.' },
  ],
  cta: {
    heading: 'Got a list of jobs piling up?',
    subtext: 'Get a free quote and get it all done in one visit.',
  },
  footerTagline: 'Reliable handyman services, no job too small.',
})
