import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'solar',
  logoIcon: 'sun',
  hero: {
    eyebrow: 'Certified Solar Installers · CEC Accredited',
    headline: 'Cut your power bills with solar that pays for itself.',
    subtext:
      'Premium panels, expert installation, and honest advice on rebates. Our accredited team designs systems sized right for your home or business.',
    trustBadges: ['CEC Accredited', '25-Year Panel Warranty', 'Rebate Experts'],
    formTitle: 'Get a Free Solar Quote',
    formOptions: ['Home solar system', 'Battery storage', 'Commercial solar', 'System upgrade', 'Solar maintenance', 'EV charger install'],
  },
  services: {
    heading: 'Solar solutions built around your usage',
    subheading: 'From design to installation to aftercare, all handled in-house.',
    items: [
      { icon: 'sun', title: 'Home solar systems', desc: 'Custom-sized systems designed to maximise your savings.' },
      { icon: 'battery', title: 'Battery storage', desc: 'Store excess power and use it when you need it most.' },
      { icon: 'building', title: 'Commercial solar', desc: 'Large-scale systems that slash business energy costs.' },
      { icon: 'trending-up', title: 'System upgrades', desc: 'Add panels or batteries to your existing setup.' },
      { icon: 'wrench', title: 'Solar maintenance', desc: 'Cleaning, inspection and repairs to keep output high.' },
      { icon: 'zap', title: 'EV charger install', desc: 'Fast home charging powered by your own solar.' },
    ],
  },
  about: {
    heading: 'Straight answers on solar, no pushy sales',
    body: "Our {{LOCATION}} team is fully CEC accredited and installs premium-tier panels only. We size every system to your actual usage — not the biggest number we can sell you.",
    stats: [
      { value: '11+', label: 'Years experience' },
      { value: '6k', label: 'Systems installed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Our power bill dropped by 80% in the first quarter.', name: 'Grace Liu', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Explained everything clearly, no upselling, just honest advice.', name: 'Patrick Doyle', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Battery install was seamless and support has been excellent since.', name: 'Sam Okafor', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'What rebates am I eligible for?', a: 'We handle all rebate paperwork and will confirm exactly what you qualify for.' },
    { q: 'How long does installation take?', a: 'Most residential installs are completed in a single day.' },
    { q: 'What warranty do panels come with?', a: 'Our premium panels carry a 25-year performance warranty.' },
  ],
  cta: {
    heading: 'Ready to go solar?',
    subtext: 'Get a free, no-obligation quote and rebate check today.',
  },
  footerTagline: 'Accredited solar installers, honest advice.',
})
