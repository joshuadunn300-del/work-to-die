// Verbatim niche/category list from UI-Reference/templates.md.
export const CATEGORIES = {
  TRADES: ['Plumbing', 'Electricians', 'Roofers', 'HVAC / Air Conditioning', 'Scaffolding', 'Builders / Construction', 'Home Renovation', 'Bathroom Renovators', 'Kitchen Renovators', 'Painters', 'Tilers', 'Flooring Installers', 'Solar Panel Installers', 'Concrete Contractors', 'Driveway Installers', 'Bricklayers', 'Excavation', 'Demolition'],
  'HOME SERVICES': ['Pest Control', 'Locksmiths', 'Garage Door Repair', 'Security Camera Installers', 'Carpet Cleaners', 'Pressure Washing', 'Gutter Cleaning', 'Skip Bin Hire', 'Rubbish Removal', 'Removalists', 'Window Cleaners', 'Storage Facilities'],
  OUTDOOR: ['Tree Removal', 'Landscapers', 'Fencing', 'Lawn Care', 'Pool Cleaners'],
  AUTOMOTIVE: ['Smash Repair', 'Car Detailing', 'Mechanics', 'Tyre Shops', 'Car Wash'],
  HEALTH: ['Dentists', 'Physiotherapists', 'Chiropractors', 'Podiatrists', 'Optometrists', 'Veterinarians'],
  'HEALTH & FITNESS': ['Gyms', 'Personal Trainers', 'Martial Arts Gyms', 'Massage Clinics'],
  BEAUTY: ['Hair Salons', 'Barbers', 'Beauty Salons', 'Nail Salons', 'Tattoo Studios'],
  HOSPITALITY: ['Cafes', 'Restaurants', 'Takeaway Shops', 'Bakeries', 'Catering Companies'],
}

export const TEMPLATES = Object.entries(CATEGORIES).flatMap(([category, niches]) =>
  niches.map((niche) => ({
    niche,
    category,
    desc: `Premium ${niche.toLowerCase()} website, ready to customise in seconds.`,
  }))
)
