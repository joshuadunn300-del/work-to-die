import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'roofers',
  logoIcon: 'home',
  hero: {
    eyebrow: 'Licensed Local Roofers · Free Inspections',
    headline: 'Leaky roof? We seal it for good.',
    subtext:
      'From storm-damage repairs to full re-roofs, our licensed roofers protect your home with quality workmanship and a solid guarantee. Free inspections, honest quotes.',
    trustBadges: ['Licensed & Insured', 'Storm Damage Experts', 'Workmanship Guarantee'],
    formTitle: 'Request a Roof Inspection',
    formOptions: [
      'Leak & storm repairs',
      'Roof replacement',
      'Gutter & downpipes',
      'Roof restoration',
      'Metal & tile roofing',
      'Commercial roofing',
    ],
  },
  services: {
    heading: 'Roofing services that protect your home',
    subheading: 'Quality materials, meticulous workmanship and a guarantee that lasts.',
    items: [
      { icon: 'cloud-rain', title: 'Leak & storm repairs', desc: 'Fast, lasting fixes for leaks and storm damage.' },
      { icon: 'home', title: 'Roof replacement', desc: 'Full re-roofs in metal, tile and Colorbond.' },
      { icon: 'droplets', title: 'Gutters & downpipes', desc: 'Repair, replace and guard against blockages.' },
      { icon: 'sparkles', title: 'Roof restoration', desc: 'Clean, repair and re-coat to add years of life.' },
      { icon: 'shield', title: 'Roof inspections', desc: 'Detailed reports so you know exactly where you stand.' },
      { icon: 'building', title: 'Commercial roofing', desc: 'Reliable roofing for warehouses and businesses.' },
    ],
  },
  about: {
    heading: 'Roofs built to weather anything',
    body: "We're a local, fully licensed roofing team that's protected homes across {{LOCATION}} for two decades. Every job is done with premium materials and finished spotless — no shortcuts.",
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '8k', label: 'Roofs completed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Found and fixed a leak three others missed. No more water damage.', name: 'Rachel Adams', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Re-roofed the whole house in two days and cleaned up perfectly.', name: 'Michael Brown', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Handled the insurance storm claim start to finish. Stress-free.', name: 'Linda Park', role: 'Property manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free inspections?', a: 'Yes, every roof inspection and quote is free and obligation-free.' },
    { q: 'Can you help with insurance claims?', a: 'We document storm damage thoroughly and work directly with your insurer.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and backed by a workmanship guarantee.' },
  ],
  cta: {
    heading: 'Worried about your roof?',
    subtext: "Book a free inspection today. We'll get back to you within the hour.",
  },
  footerTagline: 'Local roofing done right, rain or shine.',
})
