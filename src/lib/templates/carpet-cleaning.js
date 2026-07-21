import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'carpet-cleaning',
  logoIcon: 'sparkles',
  hero: {
    eyebrow: 'Professional Carpet & Upholstery Cleaning',
    headline: 'Deep clean carpets, fresh and stain-free.',
    subtext:
      'Hot water extraction and eco-friendly treatments that lift dirt, allergens and stains other cleans leave behind. Fast-dry, pet and family safe.',
    trustBadges: ['Eco-Friendly Products', 'Fast Dry Time', 'Pet & Family Safe'],
    formTitle: 'Get a Free Cleaning Quote',
    formOptions: ['Carpet cleaning', 'Upholstery cleaning', 'Rug cleaning', 'Stain removal', 'Pet odor treatment', 'End of lease clean'],
  },
  services: {
    heading: 'Carpet & upholstery cleaning done right',
    subheading: 'Hot water extraction that lifts dirt and allergens deep from the fibres.',
    items: [
      { icon: 'sparkles', title: 'Carpet cleaning', desc: 'Deep hot water extraction for a genuinely fresh clean.' },
      { icon: 'sofa', title: 'Upholstery cleaning', desc: 'Sofas, chairs and fabric furniture cleaned safely.' },
      { icon: 'square', title: 'Rug cleaning', desc: 'Specialist care for delicate and area rugs.' },
      { icon: 'droplet', title: 'Stain removal', desc: 'Targeted treatment for stubborn, set-in stains.' },
      { icon: 'paw-print', title: 'Pet odor treatment', desc: 'Odor and stain treatment that gets to the source.' },
      { icon: 'key', title: 'End of lease clean', desc: 'Carpet cleans that meet real estate standards.' },
    ],
  },
  about: {
    heading: 'Deep clean, fast dry, no residue',
    body: "Our {{LOCATION}} team uses hot water extraction and eco-friendly solutions to lift dirt and allergens other methods leave behind — with fast dry times so your home is back to normal quickly.",
    stats: [
      { value: '11+', label: 'Years experience' },
      { value: '17k', label: 'Carpets cleaned' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Got a wine stain out that I thought was permanent. Incredible.', name: 'Harriet Lowe', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Carpets dry within a few hours, not the two days we expected.', name: 'Dominic Reyes', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Got our full bond back thanks to their end of lease clean.', name: 'Priya Nair', role: 'Tenant, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'How long does carpet take to dry?', a: 'Most carpets are dry to walk on within 2-4 hours with our fast-dry method.' },
    { q: 'Are your products pet safe?', a: 'Yes, all our products are eco-friendly and safe for pets and kids.' },
    { q: 'Can you remove old stains?', a: 'We treat most stains, including set-in ones, with targeted specialist solutions.' },
  ],
  cta: {
    heading: 'Ready for fresh, clean carpets?',
    subtext: 'Get a free quote for your home or office today.',
  },
  footerTagline: 'Deep clean carpets, fresh and stain-free.',
})
