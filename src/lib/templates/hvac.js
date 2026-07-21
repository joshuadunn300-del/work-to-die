import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'hvac',
  logoIcon: 'wind',
  hero: {
    eyebrow: 'Licensed Heating & Cooling · 24/7',
    headline: 'Too hot? Too cold? We fix it fast.',
    subtext:
      'From air-con repairs to full heating and cooling installs, our licensed technicians keep your home comfortable year-round. Upfront pricing and same-day callouts.',
    trustBadges: ['Licensed & Insured', '24/7 Emergency', 'Upfront Pricing'],
    formTitle: 'Request an HVAC Tech',
    formOptions: [
      'Air conditioning repair',
      'AC installation',
      'Heating repair & install',
      'Ducted systems',
      'Servicing & maintenance',
      'Commercial HVAC',
    ],
  },
  services: {
    heading: 'Comfort in every season',
    subheading: 'Efficient systems, expert installs and servicing that keeps them running.',
    items: [
      { icon: 'snowflake', title: 'Air conditioning', desc: 'Repairs and installs for split and multi-head systems.' },
      { icon: 'flame', title: 'Heating', desc: 'Gas, electric and reverse-cycle heating done right.' },
      { icon: 'wind', title: 'Ducted systems', desc: 'Whole-home ducted heating and cooling design.' },
      { icon: 'wrench', title: 'Servicing & tune-ups', desc: 'Regular servicing to keep bills and breakdowns down.' },
      { icon: 'thermometer', title: 'Diagnostics & repair', desc: 'Fast fault finding for any make or model.' },
      { icon: 'building', title: 'Commercial HVAC', desc: 'Reliable climate control for offices and shops.' },
    ],
  },
  about: {
    heading: 'Keeping homes comfortable for two decades',
    body: "We're a fully licensed local heating and cooling team. We size and install systems properly the first time and service them for the long haul — comfort you can count on across {{LOCATION}}.",
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '11k', label: 'Systems installed' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by homeowners across {{LOCATION}}',
    items: [
      { quote: 'Got our air-con running again on the hottest day of the year. Lifesavers.', name: 'Grace Turner', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'Ducted install was neat, quiet and exactly on quote.', name: 'Daniel Cooper', role: 'Homeowner, {{LOCATION}}' },
      { quote: 'They service all our office units — never a breakdown since.', name: 'Olivia Reed', role: 'Office manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you offer free quotes?', a: 'Yes, every install quote is free and obligation-free.' },
    { q: 'Do you handle emergency breakdowns?', a: 'We offer 24/7 emergency callouts for heating and cooling failures.' },
    { q: 'Are you licensed and insured?', a: 'Fully licensed, insured and refrigerant-handling certified.' },
  ],
  cta: {
    heading: 'Need heating or cooling sorted?',
    subtext: "Call now or request your free quote. We'll get back to you within the hour.",
  },
  footerTagline: 'Year-round comfort from your local HVAC experts.',
})
