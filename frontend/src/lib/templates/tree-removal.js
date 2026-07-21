import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'tree-removal',
  logoIcon: 'trees',
  hero: {
    eyebrow: 'Licensed Arborists · Fully Insured',
    headline: 'Dangerous tree? We take it down safely.',
    subtext:
      'From risky removals to pruning and stump grinding, our qualified arborists get it done safely with full insurance and a spotless clean-up. Free quotes, fast callouts.',
    trustBadges: ['Qualified Arborists', 'Fully Insured', 'Free Quotes'],
    formTitle: 'Request a Tree Quote',
    formOptions: [
      'Tree removal',
      'Pruning & trimming',
      'Stump grinding',
      'Emergency & storm work',
      'Land & block clearing',
      'Mulching & clean-up',
    ],
  },
  services: {
    heading: 'Tree work done safely and clean',
    subheading: 'Qualified arborists, proper gear and a tidy site every time.',
    items: [
      { icon: 'axe', title: 'Tree removal', desc: 'Safe removal of trees of any size, even tight access.' },
      { icon: 'scissors', title: 'Pruning & trimming', desc: 'Healthy shaping that protects your trees and property.' },
      { icon: 'circle-dot', title: 'Stump grinding', desc: 'Grind stumps below ground so you can reclaim the space.' },
      { icon: 'cloud-rain', title: 'Storm & emergency', desc: 'Rapid response for fallen and hazardous trees.' },
      { icon: 'trees', title: 'Land clearing', desc: 'Clear blocks and overgrowth ready for your next project.' },
      { icon: 'building', title: 'Commercial & council', desc: 'Compliant tree work for businesses and larger sites.' },
    ],
  },
  about: {
    heading: 'Local arborists you can trust',
    body: "We're fully insured, qualified arborists who put safety first on every job across {{LOCATION}}. We leave your property cleaner than we found it — no mess, no risk, no fuss.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '9k', label: 'Trees managed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Removed a huge gum next to the house without a scratch on anything.', name: 'Peter Hall', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Came out same day after a storm dropped a branch on our shed.', name: 'Nicole Ward', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Cleared the whole back block and left it spotless. Great value.', name: 'Robert King', role: 'Property developer, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every quote is free and obligation-free, usually same or next day.' },
    { q: 'Are you fully insured?', a: 'Yes, we carry full public liability insurance for total peace of mind.' },
    { q: 'Do you clean up afterwards?', a: 'Always — we chip, mulch and remove all debris and leave the site tidy.' },
  ],
  cta: {
    heading: 'Got a tree that needs sorting?',
    subtext: "Get a free quote today. We'll get back to you within the hour.",
  },
  footerTagline: 'Safe, insured local tree removal and arborist work.',
})
