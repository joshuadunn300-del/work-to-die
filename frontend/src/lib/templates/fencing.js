import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'fencing',
  logoIcon: 'fence',
  hero: {
    eyebrow: 'Licensed Fencing Contractors',
    headline: 'Fences built to last, installed right.',
    subtext:
      'Timber, colorbond and pool-compliant fencing installed by a licensed local crew. Straight lines, solid posts, and a guarantee you can trust.',
    trustBadges: ['Licensed & Insured', 'Pool-Compliant', '10-Year Guarantee'],
    formTitle: 'Get a Free Fencing Quote',
    formOptions: ['Timber fencing', 'Colorbond fencing', 'Pool fencing', 'Gates & automation', 'Retaining walls', 'Repairs'],
  },
  services: {
    heading: 'Fencing for every property',
    subheading: 'Quality materials and proper installation that stands the test of time.',
    items: [
      { icon: 'fence', title: 'Timber fencing', desc: 'Classic, durable timber fencing built to your boundary.' },
      { icon: 'square', title: 'Colorbond fencing', desc: 'Low-maintenance steel fencing in a range of colours.' },
      { icon: 'shield', title: 'Pool fencing', desc: 'Fully compliant glass and steel pool fencing, certified.' },
      { icon: 'door-open', title: 'Gates & automation', desc: 'Manual and automated gates fitted to match your fence.' },
      { icon: 'layers', title: 'Retaining walls', desc: 'Sleeper and block retaining walls built to hold.' },
      { icon: 'wrench', title: 'Fence repairs', desc: 'Fast fixes for storm damage, rot and broken panels.' },
    ],
  },
  about: {
    heading: 'Straight fences, honest pricing',
    body: "We've been fencing properties across {{LOCATION}} for years, using quality materials and proper post footings so your fence stands up to weather and time — not just the photos.",
    stats: [
      { value: '13+', label: 'Years experience' },
      { value: '4k', label: 'Fences installed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Dead straight fence line and finished a day early.', name: 'Warren Ellis', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Pool fence passed compliance inspection first go.', name: 'Bianca Ford', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Great communication from quote through to the final walkthrough.', name: 'Trent Nguyen', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Is your pool fencing compliant?', a: 'Yes, all pool fencing meets current safety compliance standards.' },
    { q: 'How long does installation take?', a: 'Most residential fences are completed within 1-3 days.' },
    { q: 'Do you offer a guarantee?', a: 'Yes, all fencing work is backed by a 10-year guarantee.' },
  ],
  cta: {
    heading: 'Ready for a new fence?',
    subtext: 'Get a free, obligation-free quote today.',
  },
  footerTagline: 'Licensed fencing, built to last.',
})
