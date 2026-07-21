import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'security',
  logoIcon: 'shield',
  hero: {
    eyebrow: 'Licensed Security Installers',
    headline: 'Protect what matters, day and night.',
    subtext:
      'Alarm systems, CCTV and smart monitoring installed by licensed technicians. Real-time alerts to your phone, backed by 24/7 support.',
    trustBadges: ['Licensed & Insured', '24/7 Monitoring', 'Lifetime Support'],
    formTitle: 'Request a Security Quote',
    formOptions: ['Alarm system', 'CCTV installation', 'Smart monitoring', 'Access control', 'Commercial security', 'System upgrade'],
  },
  services: {
    heading: 'Security systems built around your property',
    subheading: 'From a single camera to a full commercial system, installed and supported.',
    items: [
      { icon: 'bell', title: 'Alarm systems', desc: 'Monitored alarms with instant alerts to your phone.' },
      { icon: 'video', title: 'CCTV installation', desc: 'High-definition cameras with remote viewing anywhere.' },
      { icon: 'smartphone', title: 'Smart monitoring', desc: 'Control and monitor your property from one simple app.' },
      { icon: 'key', title: 'Access control', desc: 'Keyless entry systems for homes and businesses.' },
      { icon: 'building', title: 'Commercial security', desc: 'Full-site security design for offices and warehouses.' },
      { icon: 'wrench', title: 'System upgrades', desc: 'Modernise an outdated system without a full rebuild.' },
    ],
  },
  about: {
    heading: 'Licensed protection you can rely on',
    body: "Our {{LOCATION}} technicians are fully licensed and trained on every major security platform. We design systems around how you actually use your property, then support them for life.",
    stats: [
      { value: '14+', label: 'Years experience' },
      { value: '8k', label: 'Systems installed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homes and businesses across {{LOCATION}}',
    items: [
      { quote: 'Caught a break-in attempt on camera within the first month. Worth every dollar.', name: 'Derek Simmons', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'The app makes checking on the shop from home so easy.', name: 'Yuki Tanaka', role: 'Business Owner, {{LOCATION}}' },
      { quote: 'Professional install, clear explanation, great ongoing support.', name: 'Carla Reyes', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Is the system monitored 24/7?', a: 'Yes, our monitoring centre operates around the clock, every day.' },
    { q: 'Can I view cameras remotely?', a: 'Yes, view live and recorded footage from anywhere via our app.' },
    { q: 'Do you install commercial systems?', a: 'We design and install security for properties of any size.' },
  ],
  cta: {
    heading: 'Ready to secure your property?',
    subtext: 'Get a free security assessment and quote today.',
  },
  footerTagline: 'Licensed security systems, monitored around the clock.',
})
