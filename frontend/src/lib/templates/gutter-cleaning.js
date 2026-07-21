import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'gutter-cleaning',
  logoIcon: 'wind',
  hero: {
    eyebrow: 'Professional Gutter Cleaning',
    headline: 'Blocked gutters, cleared before the next storm.',
    subtext:
      'Full gutter clean, downpipe clearing and roof debris removal from a fully insured local crew. Photos before and after, every job.',
    trustBadges: ['Fully Insured', 'Photo Report', 'Same-Week Service'],
    formTitle: 'Get a Free Gutter Quote',
    formOptions: ['Gutter cleaning', 'Downpipe clearing', 'Gutter guard install', 'Roof debris removal', 'Gutter repairs', 'Commercial gutters'],
  },
  services: {
    heading: 'Gutter services that protect your roof',
    subheading: 'Clear gutters mean less water damage and fewer costly repairs.',
    items: [
      { icon: 'wind', title: 'Gutter cleaning', desc: 'Full clearance of leaves, debris and built-up sediment.' },
      { icon: 'droplets', title: 'Downpipe clearing', desc: 'Clear blockages so water flows away from your home.' },
      { icon: 'shield', title: 'Gutter guard install', desc: 'Keep leaves out for good with quality guard systems.' },
      { icon: 'triangle', title: 'Roof debris removal', desc: 'Clear moss, leaves and branches safely from your roof.' },
      { icon: 'wrench', title: 'Gutter repairs', desc: 'Fix sagging, leaking or damaged gutter sections.' },
      { icon: 'building', title: 'Commercial gutters', desc: 'Scheduled gutter maintenance for larger properties.' },
    ],
  },
  about: {
    heading: 'A clear gutter is cheap insurance',
    body: "Our {{LOCATION}} team clears gutters before they become a water-damage problem. Fully insured and equipped for any roof height, with a photo report so you can see exactly what we found.",
    stats: [
      { value: '7+', label: 'Years experience' },
      { value: '11k', label: 'Gutters cleared' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Found and fixed a blocked downpipe before it caused real damage.', name: 'Diane Ashford', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Before and after photos gave real peace of mind.', name: 'Colin Marsh', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Booked annually now — one less thing to worry about.', name: 'Fatima Haidari', role: 'Homeowner, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'How often should gutters be cleaned?', a: 'We recommend at least twice a year, more if you have overhanging trees.' },
    { q: 'Do you clean two-storey homes?', a: 'Yes, our team is fully equipped and insured for any roof height.' },
    { q: 'Do you install gutter guards?', a: 'Yes, we supply and install quality gutter guard systems.' },
  ],
  cta: {
    heading: 'Ready for clear gutters?',
    subtext: 'Get a free quote before the next storm hits.',
  },
  footerTagline: 'Reliable gutter cleaning that protects your home.',
})
