import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'scaffolding',
  logoIcon: 'construction',
  hero: {
    eyebrow: 'Certified Scaffolders · Fully Insured',
    headline: 'Safe access, built to spec, on time.',
    subtext:
      'Residential and commercial scaffold hire and erection from a certified crew. Compliant, insured, and ready when your job needs it.',
    trustBadges: ['Fully Certified', 'Compliant & Insured', 'Fast Turnaround'],
    formTitle: 'Request a Scaffold Quote',
    formOptions: ['Residential scaffold', 'Commercial scaffold', 'Scaffold hire', 'Roof access', 'Edge protection', 'Mobile towers'],
  },
  services: {
    heading: 'Scaffolding for every site',
    subheading: 'Certified erection, inspection and dismantling, done to code.',
    items: [
      { icon: 'construction', title: 'Residential scaffold', desc: 'Safe, compliant access for renovations and repaints.' },
      { icon: 'building', title: 'Commercial scaffold', desc: 'Large-scale scaffold systems for commercial builds.' },
      { icon: 'calendar', title: 'Scaffold hire', desc: 'Flexible hire periods with delivery and pickup included.' },
      { icon: 'triangle', title: 'Roof access', desc: 'Safe platforms for roofing, guttering and chimney work.' },
      { icon: 'shield', title: 'Edge protection', desc: 'Compliant fall-protection systems for every site.' },
      { icon: 'move', title: 'Mobile towers', desc: 'Quick-assembly towers for short jobs and tight spaces.' },
    ],
  },
  about: {
    heading: 'Certified access, zero compromises on safety',
    body: "Every scaffolder on our {{LOCATION}} team is fully certified and safety-trained. We erect, inspect and dismantle to code, so your crew can focus on the job, not the access.",
    stats: [
      { value: '18+', label: 'Years experience' },
      { value: '5k', label: 'Sites completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by builders across {{LOCATION}}',
    items: [
      { quote: 'On site early, built to spec, passed inspection first time.', name: 'Nathan Cole', role: 'Site Manager, {{LOCATION}}' },
      { quote: 'Great communication and always safety-first.', name: 'Ivy Robertson', role: 'Builder, {{LOCATION}}' },
      { quote: 'Reliable hire company — scaffold up within a day of calling.', name: 'Ray Thompson', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Are you fully certified?', a: 'Yes, all scaffolders hold current certification and safety training.' },
    { q: 'How quickly can you erect scaffold?', a: 'Most residential jobs are up within 24-48 hours of booking.' },
    { q: 'Do you handle inspections?', a: 'We handle erection, regular inspection and compliant dismantling.' },
  ],
  cta: {
    heading: 'Need safe access, fast?',
    subtext: 'Get a scaffold quote for your next project today.',
  },
  footerTagline: 'Certified scaffold access, built to code.',
})
