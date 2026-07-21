import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'smash-repair',
  logoIcon: 'car',
  hero: {
    eyebrow: 'Certified Smash Repairs · Insurance Approved',
    headline: "Panel damage? We'll make it disappear.",
    subtext:
      'From minor dents to full insurance write-off repairs, our certified technicians restore your car to factory finish. Direct billing with all major insurers.',
    trustBadges: ['Insurance Approved', 'Lifetime Guarantee', 'Free Courtesy Car'],
    formTitle: 'Book a Free Repair Quote',
    formOptions: ['Panel & dent repair', 'Insurance claim', 'Paint matching', 'Bumper repair', 'Hail damage', 'Windscreen replacement'],
  },
  services: {
    heading: 'Smash repairs done to factory standard',
    subheading: 'Certified technicians, genuine parts, and a guarantee that lasts.',
    items: [
      { icon: 'car', title: 'Panel & dent repair', desc: 'Precision panel beating that restores original shape and finish.' },
      { icon: 'file-text', title: 'Insurance claims', desc: 'We manage the paperwork and deal directly with your insurer.' },
      { icon: 'palette', title: 'Paint matching', desc: 'Computer colour-matched paint for a seamless finish.' },
      { icon: 'shield', title: 'Bumper repair', desc: 'Fast, affordable fixes for scrapes, cracks and bumper damage.' },
      { icon: 'cloud-hail', title: 'Hail damage repair', desc: 'Paintless dent removal that leaves no trace of the storm.' },
      { icon: 'square', title: 'Windscreen replacement', desc: 'Same-day glass replacement using OEM-spec screens.' },
    ],
  },
  about: {
    heading: 'Certified repairers you can trust',
    body: "Our workshop in {{LOCATION}} is fully certified and approved by every major insurer. Every repair is backed by a lifetime workmanship guarantee, and we'll organise a courtesy car so you're never without wheels.",
    stats: [
      { value: '15+', label: 'Years experience' },
      { value: '9k', label: 'Cars repaired' },
      { value: '4.8★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by drivers across {{LOCATION}}',
    items: [
      { quote: "You can't even tell there was damage. Perfect paint match.", name: 'Chris Nolan', role: 'Customer, {{LOCATION}}' },
      { quote: 'Handled the whole insurance claim for me — so easy.', name: 'Lauren Diaz', role: 'Customer, {{LOCATION}}' },
      { quote: 'Free courtesy car meant zero disruption to my week.', name: 'Marcus Bell', role: 'Customer, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you work with my insurer?', a: 'We are an approved repairer for all major insurance companies.' },
    { q: 'Will the paint match exactly?', a: 'Yes, we use computer colour-matching for a seamless finish every time.' },
    { q: 'Do you provide a courtesy car?', a: 'A free courtesy car is available for the duration of your repair.' },
  ],
  cta: {
    heading: 'Get your car back to new',
    subtext: 'Book a free assessment and quote today.',
  },
  footerTagline: 'Certified smash repairs, factory-finish results.',
})
