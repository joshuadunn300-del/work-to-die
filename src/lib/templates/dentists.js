import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'dentists',
  logoIcon: 'smile',
  hero: {
    eyebrow: 'Family & Cosmetic Dentistry',
    headline: 'A healthy, confident smile starts here.',
    subtext:
      'Gentle, modern dentistry for the whole family — from routine checkups to cosmetic transformations. New patients welcome, same-week appointments available.',
    trustBadges: ['Gentle Care', 'Same-Week Appointments', 'All Insurance Accepted'],
    formTitle: 'Book an Appointment',
    formOptions: ['General checkup', 'Cosmetic dentistry', 'Emergency dental', 'Teeth whitening', 'Orthodontics', 'Children\'s dentistry'],
  },
  services: {
    heading: 'Complete dental care, one practice',
    subheading: 'Modern equipment and a genuinely gentle approach, for every age.',
    items: [
      { icon: 'stethoscope', title: 'General checkups', desc: 'Routine exams, cleans and preventive care for the whole family.' },
      { icon: 'sparkles', title: 'Cosmetic dentistry', desc: 'Veneers, bonding and smile makeovers done beautifully.' },
      { icon: 'clock', title: 'Emergency dental', desc: 'Same-day appointments for pain, breaks and urgent care.' },
      { icon: 'sun', title: 'Teeth whitening', desc: 'Safe, effective whitening for a brighter smile fast.' },
      { icon: 'move', title: 'Orthodontics', desc: 'Braces and clear aligners for straighter teeth at any age.' },
      { icon: 'baby', title: 'Children\'s dentistry', desc: 'A friendly, fear-free first dental experience for kids.' },
    ],
  },
  about: {
    heading: 'Dentistry that puts you at ease',
    body: "Our {{LOCATION}} practice has cared for local families for years, combining modern technology with a genuinely gentle chairside manner — because we know a dentist visit shouldn't be something you dread.",
    stats: [
      { value: '16+', label: 'Years in practice' },
      { value: '20k', label: 'Patients cared for' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Trusted by families across {{LOCATION}}',
    items: [
      { quote: 'First dentist that made my kids actually excited to go.', name: 'Monica Reyes', role: 'Patient, {{LOCATION}}' },
      { quote: 'Emergency appointment same day, pain-free and so kind.', name: 'Liam O\'Brien', role: 'Patient, {{LOCATION}}' },
      { quote: 'My smile makeover exceeded every expectation.', name: 'Jasmine Cole', role: 'Patient, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do you accept new patients?', a: 'Yes, we welcome new patients of every age with same-week appointments.' },
    { q: 'Do you accept my insurance?', a: 'We accept all major dental insurance plans and offer payment options.' },
    { q: 'Do you handle emergencies?', a: 'Yes, we offer same-day emergency appointments for urgent dental pain.' },
  ],
  cta: {
    heading: 'Ready for a healthier smile?',
    subtext: 'Book your appointment online in minutes.',
  },
  footerTagline: 'Gentle, modern dentistry for the whole family.',
})
