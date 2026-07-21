import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'catering',
  logoIcon: 'utensils',
  hero: {
    eyebrow: 'Event & Corporate Catering',
    headline: 'Unforgettable food, for every event.',
    subtext:
      'Weddings, corporate events and private functions catered with fresh, locally-sourced menus. Custom menus, professional service, zero stress.',
    trustBadges: ['Custom Menus', 'Fully Licensed', '5-Star Service'],
    formTitle: 'Request a Catering Quote',
    formOptions: ['Wedding catering', 'Corporate catering', 'Private events', 'Canapés & cocktail', 'Dietary requirements', 'Drop-off catering'],
  },
  services: {
    heading: 'Catering for every occasion',
    subheading: 'Custom menus and professional service, from intimate dinners to large events.',
    items: [
      { icon: 'heart', title: 'Wedding catering', desc: 'Beautifully presented menus tailored to your big day.' },
      { icon: 'briefcase', title: 'Corporate catering', desc: 'Reliable, professional catering for meetings and events.' },
      { icon: 'party-popper', title: 'Private events', desc: 'Birthdays, celebrations and private functions catered with care.' },
      { icon: 'wine', title: 'Canapés & cocktail', desc: 'Elegant grazing and canapé menus for any gathering.' },
      { icon: 'leaf', title: 'Dietary requirements', desc: 'Vegan, gluten-free and allergy-safe menus, no compromise on flavour.' },
      { icon: 'package', title: 'Drop-off catering', desc: 'Fresh, ready-to-serve platters delivered to your door.' },
    ],
  },
  about: {
    heading: 'Fresh, local, made with care',
    body: "Our {{LOCATION}} kitchen sources fresh, local ingredients for every event — from a boardroom lunch to a 200-guest wedding. Every menu is custom-built around your event and your guests.",
    stats: [
      { value: '12+', label: 'Years catering' },
      { value: '3k', label: 'Events catered' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by hosts across {{LOCATION}}',
    items: [
      { quote: 'Our wedding guests are still talking about the food. Absolutely stunning.', name: 'Isabelle Cross', role: 'Bride, {{LOCATION}}' },
      { quote: 'Handled our 150-person conference lunch flawlessly.', name: 'George Papadopoulos', role: 'Event Coordinator, {{LOCATION}}' },
      { quote: 'Allergy-friendly menu that didn\'t compromise on taste at all.', name: 'Sasha Klein', role: 'Host, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Can you cater dietary requirements?', a: 'Yes, we accommodate vegan, gluten-free and allergy-specific menus.' },
    { q: 'How far in advance should I book?', a: 'We recommend booking at least 4-6 weeks ahead for larger events.' },
    { q: 'Do you provide staff for the event?', a: 'Yes, professional serving staff are available for full-service events.' },
  ],
  cta: {
    heading: 'Ready to plan your menu?',
    subtext: 'Get a custom catering quote for your event today.',
  },
  footerTagline: 'Fresh, custom catering for every occasion.',
})
