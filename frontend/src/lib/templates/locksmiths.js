import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'locksmiths',
  logoIcon: 'key',
  hero: {
    eyebrow: 'Licensed Local Locksmiths · 24/7',
    headline: 'Locked out? We’ll get you back in fast.',
    subtext:
      'From lockouts to rekeys, new locks to full security upgrades, our licensed locksmiths get you sorted quickly and without damage. 24/7 mobile service, upfront pricing.',
    trustBadges: ['Licensed & Insured', '24/7 Mobile', 'Upfront Pricing'],
    formTitle: 'Request a Locksmith',
    formOptions: [
      'Emergency lockout',
      'Lock repair & replacement',
      'Rekeying',
      'Keys cut & duplicated',
      'Security upgrades',
      'Commercial locksmithing',
    ],
  },
  services: {
    heading: 'Fast, damage-free locksmithing',
    subheading: 'Mobile service that gets you secure again, day or night.',
    items: [
      { icon: 'key', title: 'Emergency lockouts', desc: 'Back into your home, car or business without damage.' },
      { icon: 'lock', title: 'Locks repaired & replaced', desc: 'Fix sticking locks or upgrade to modern hardware.' },
      { icon: 'refresh-cw', title: 'Rekeying', desc: 'One key for every lock — perfect after moving in.' },
      { icon: 'copy', title: 'Keys cut & duplicated', desc: 'Precision keys cut on the spot, including restricted keys.' },
      { icon: 'shield', title: 'Security upgrades', desc: 'Deadbolts, smart locks and full security assessments.' },
      { icon: 'building', title: 'Commercial locksmithing', desc: 'Master key systems and access control for business.' },
    ],
  },
  about: {
    heading: 'Local locksmiths on call around the clock',
    body: "We're a fully licensed, insured mobile locksmith team covering {{LOCATION}} 24/7. Fast response, honest pricing and a promise to get you secure without damaging your doors.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '20k', label: 'Callouts completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted across {{LOCATION}}',
    items: [
      { quote: 'Locked out at midnight with a baby inside — here in 20 minutes, no damage.', name: 'Hannah Scott', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Rekeyed the whole house the day we moved in. Great peace of mind.', name: 'Jason Miller', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Set up a master key system for our office. Professional and fast.', name: 'Sophie Bennett', role: 'Office manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Will you damage my lock or door?', a: 'Almost never — we use non-destructive entry techniques wherever possible.' },
    { q: 'Are you available 24/7?', a: 'Yes, our mobile locksmiths respond day and night, including holidays.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and police-checked for your security.' },
  ],
  cta: {
    heading: 'Need a locksmith now?',
    subtext: "Call our 24/7 line or request help online. We'll get back to you fast.",
  },
  footerTagline: 'Fast, trusted local locksmiths, 24/7.',
})
