import { buildTemplate } from './_base.js'

export default buildTemplate({
  niche: 'fitness',
  logoIcon: 'dumbbell',
  hero: {
    eyebrow: 'Personal Training & Group Fitness',
    headline: 'Real results, from coaches who care.',
    subtext:
      'Personal training, small-group classes and nutrition coaching tailored to your goals. First session free — no pressure, just progress.',
    trustBadges: ['Certified Trainers', 'Free First Session', 'Flexible Scheduling'],
    formTitle: 'Book a Free Session',
    formOptions: ['Personal training', 'Group classes', 'Nutrition coaching', 'Online coaching', 'Corporate wellness', 'Sports-specific training'],
  },
  services: {
    heading: 'Training built around your goals',
    subheading: 'Whether it\'s strength, weight loss or performance, we build the plan around you.',
    items: [
      { icon: 'dumbbell', title: 'Personal training', desc: 'One-on-one coaching with a program built just for you.' },
      { icon: 'users', title: 'Group classes', desc: 'High-energy small-group sessions that keep you accountable.' },
      { icon: 'apple', title: 'Nutrition coaching', desc: 'Simple, sustainable nutrition guidance to match your training.' },
      { icon: 'monitor', title: 'Online coaching', desc: 'Custom programming and check-ins wherever you train.' },
      { icon: 'building', title: 'Corporate wellness', desc: 'On-site fitness programs that boost team health and morale.' },
      { icon: 'trophy', title: 'Sports-specific training', desc: 'Performance programs tailored to your sport.' },
    ],
  },
  about: {
    heading: 'Coaching that actually fits your life',
    body: "Our {{LOCATION}} coaches are certified and genuinely invested in your progress — no cookie-cutter programs, no judgment, just a plan you can stick to.",
    stats: [
      { value: '8+', label: 'Years coaching' },
      { value: '2k', label: 'Clients trained' },
      { value: '4.9★', label: 'Average rating' },
    ],
  },
  testimonials: {
    heading: 'Real results from real clients in {{LOCATION}}',
    items: [
      { quote: 'Lost 15kg and actually enjoy training now. Life-changing.', name: 'Michelle Tran', role: 'Client, {{LOCATION}}' },
      { quote: 'My coach adjusts every session to how I\'m feeling. Never felt pushed too hard.', name: 'Aiden Walsh', role: 'Client, {{LOCATION}}' },
      { quote: 'Corporate wellness program transformed our team\'s energy at work.', name: 'Renee Osei', role: 'HR Manager, {{LOCATION}}' },
    ],
  },
  faq: [
    { q: 'Do I need experience to start?', a: 'Not at all — programs are built for every fitness level, from beginner up.' },
    { q: 'Is the first session really free?', a: 'Yes, your first session is completely free with no obligation.' },
    { q: 'Can I train online?', a: 'Yes, we offer fully remote coaching with regular video check-ins.' },
  ],
  cta: {
    heading: 'Ready to start your transformation?',
    subtext: 'Book your free first session today.',
  },
  footerTagline: 'Personal training and coaching that gets real results.',
})
