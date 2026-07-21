import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'cleaning',
  logoIcon: 'sparkles',
  hero: {
    eyebrow: 'Trusted Local Cleaners · Fully Insured',
    headline: 'A spotless home, without lifting a finger.',
    subtext:
      'Regular, deep and move-out cleans from a vetted, background-checked team. Book online in minutes, love the result or we come back free.',
    trustBadges: ['Insured & Bonded', 'Satisfaction Guarantee', 'Same-Week Booking'],
    formTitle: 'Get a Free Cleaning Quote',
    formOptions: ['Regular cleaning', 'Deep clean', 'Move-in/move-out', 'Office cleaning', 'One-off clean', 'Carpet & upholstery'],
  },
  services: {
    heading: 'Cleaning services for every space',
    subheading: 'Book once or set a recurring schedule — same great team every time.',
    items: [
      { icon: 'sparkles', title: 'Regular cleaning', desc: 'Weekly, fortnightly or monthly visits that keep your home spotless.' },
      { icon: 'home', title: 'Deep cleaning', desc: 'A top-to-bottom reset for kitchens, bathrooms and every corner.' },
      { icon: 'truck', title: 'Move-in/move-out', desc: 'Bond-back guaranteed cleans for renters and landlords.' },
      { icon: 'building', title: 'Office cleaning', desc: 'After-hours commercial cleans that keep your workplace fresh.' },
      { icon: 'sofa', title: 'Carpet & upholstery', desc: 'Steam cleaning that lifts stains and odours for good.' },
      { icon: 'calendar', title: 'One-off cleans', desc: 'No contracts — book a single clean whenever you need it.' },
    ],
  },
  about: {
    heading: 'A cleaning team you can actually trust',
    body: "Every cleaner is background-checked, insured and trained to our checklist standard. We started in {{LOCATION}} and grew through referrals — because when a cleaner does a great job, people talk.",
    stats: [
      { value: '10+', label: 'Years experience' },
      { value: '18k', label: 'Homes cleaned' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Loved by homes and businesses across {{LOCATION}}',
    items: [
      { quote: 'Same two cleaners every fortnight and the house has never looked better.', name: 'Priya Anand', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Our move-out clean got us our full bond back. Worth every cent.', name: 'Jake Sullivan', role: 'Tenant, {{LOCATION}}' },
      { quote: 'Reliable, professional, and our office always smells amazing after.', name: 'Fiona Marsh', role: 'Office Manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you bring your own supplies?', a: 'Yes — we bring all equipment and eco-friendly products at no extra cost.' },
    { q: 'Is there a contract?', a: 'No lock-in contracts. Cancel or reschedule any time.' },
    { q: 'Are your cleaners insured?', a: 'Every cleaner is background-checked and covered by full insurance.' },
  ],
  cta: {
    heading: 'Ready for a spotless space?',
    subtext: 'Get an instant quote and book your first clean today.',
  },
  footerTagline: 'Reliable, insured cleaning for homes and offices.',
})
