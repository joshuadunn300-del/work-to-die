// Registry of pre-built niche templates. getTemplate(niche) returns the
// matching content_json template, falling back to the generic one.
import plumbing from './plumbing.js'
import electricians from './electricians.js'
import roofers from './roofers.js'
import pestControl from './pest-control.js'
import hvac from './hvac.js'
import treeRemoval from './tree-removal.js'
import locksmiths from './locksmiths.js'
import garageDoor from './garage-door.js'
import landscapers from './landscapers.js'
import builders from './builders.js'
import bathroomRenovation from './bathroom-renovation.js'
import cleaning from './cleaning.js'
import painters from './painters.js'
import smashRepair from './smash-repair.js'
import scaffolding from './scaffolding.js'
import pressureWashing from './pressure-washing.js'
import solar from './solar.js'
import security from './security.js'
import fitness from './fitness.js'
import dentists from './dentists.js'
import fencing from './fencing.js'
import gutterCleaning from './gutter-cleaning.js'
import removalists from './removalists.js'
import catering from './catering.js'
import handyman from './handyman.js'
import carpetCleaning from './carpet-cleaning.js'
import generic from './_generic.js'

export const TEMPLATES = {
  plumbing,
  electricians,
  roofers,
  'pest-control': pestControl,
  hvac,
  'tree-removal': treeRemoval,
  locksmiths,
  'garage-door': garageDoor,
  landscapers,
  builders,
  'bathroom-renovation': bathroomRenovation,
  cleaning,
  painters,
  'smash-repair': smashRepair,
  scaffolding,
  'pressure-washing': pressureWashing,
  solar,
  security,
  fitness,
  dentists,
  fencing,
  'gutter-cleaning': gutterCleaning,
  removalists,
  catering,
  handyman,
  'carpet-cleaning': carpetCleaning,
  generic,
}

// Aliases so common lead-data niche strings still resolve.
const ALIASES = {
  plumber: 'plumbing',
  electrician: 'electricians',
  electrical: 'electricians',
  roofer: 'roofers',
  roofing: 'roofers',
  pest: 'pest-control',
  pestcontrol: 'pest-control',
  'air-conditioning': 'hvac',
  'heating-cooling': 'hvac',
  'tree-service': 'tree-removal',
  arborist: 'tree-removal',
  locksmith: 'locksmiths',
  garage: 'garage-door',
  'garage-doors': 'garage-door',
  landscaping: 'landscapers',
  landscaper: 'landscapers',
  gardener: 'landscapers',
  builder: 'builders',
  building: 'builders',
  construction: 'builders',
  bathroom: 'bathroom-renovation',
  bathrooms: 'bathroom-renovation',
  renovation: 'bathroom-renovation',
  cleaner: 'cleaning',
  'house-cleaning': 'cleaning',
  maid: 'cleaning',
  painter: 'painters',
  painting: 'painters',
  'panel-beater': 'smash-repair',
  'auto-body': 'smash-repair',
  'car-repair': 'smash-repair',
  scaffold: 'scaffolding',
  'pressure-cleaning': 'pressure-washing',
  'power-washing': 'pressure-washing',
  'solar-panels': 'solar',
  'solar-installer': 'solar',
  alarm: 'security',
  cctv: 'security',
  'personal-training': 'fitness',
  gym: 'fitness',
  'personal-trainer': 'fitness',
  dentist: 'dentists',
  dental: 'dentists',
  fence: 'fencing',
  gutters: 'gutter-cleaning',
  'gutter-clean': 'gutter-cleaning',
  removalist: 'removalists',
  movers: 'removalists',
  moving: 'removalists',
  caterer: 'catering',
  catered: 'catering',
  handymen: 'handyman',
  'odd-jobs': 'handyman',
  'carpet-clean': 'carpet-cleaning',
  'carpet-cleaner': 'carpet-cleaning',
  upholstery: 'carpet-cleaning',
}

export function normalizeNiche(niche) {
  const key = String(niche || '').trim().toLowerCase().replace(/\s+/g, '-')
  if (TEMPLATES[key]) return key
  if (ALIASES[key]) return ALIASES[key]
  return 'generic'
}

export function getTemplate(niche) {
  return TEMPLATES[normalizeNiche(niche)]
}

export const NICHES = Object.keys(TEMPLATES)
