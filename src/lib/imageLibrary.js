// imageLibrary.js — curated, royalty-free stock photos for generated demo sites.
//
// Hero photo IDs + brand colors for all 59 niches below are extracted directly
// from Tenji's real production bundle (reference/tenji-image-library.md,
// 2026-07-21) — not guessed, not re-curated. Superseded an earlier hand-picked
// set of ~14 niches whose hero images didn't actually match the real bundle
// once this landed (e.g. electricians was a different photo entirely).
// `about`/`services` arrays don't have an authoritative per-niche source (the
// extracted doc only maps niche → hero + brand color). All 59 niches now have
// a trade-appropriate about/services set: 14 are hand-curated, the remaining
// 45 borrow from other niches' real verified hero photos within the same
// trade subcategory (see the block comment above the 46-entry addition in
// ABOUT_SERVICES below) — no niche shows an off-trade fallback photo anymore.
// GENERIC_ABOUT_SERVICES only fires for a niche key absent from HERO_BRAND
// entirely (shouldn't happen via getNicheImages/getTemplate's niche list).
//
// All photo IDs are free Unsplash-License images (commercial use OK, no
// attribution, no API key) — NOT plus.unsplash.com premium. Hotlinked
// directly, exactly like Tenji does.
//
// Usage:  getNicheImages('plumbing').hero
//         getNicheImages('plumbing').about
//         getNicheImages('plumbing').services   // array of 2-3 URLs
//         getNicheBrandColor('plumbing')         // '#2563EB'
//         getAvatar(0)                            // testimonial face
//
// See imageLibrary.README.md for integration + how to add a niche.

// Build a hotlink-stable Unsplash URL from a bare photo id.
const U = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// Hero photo ID + brand color per niche — verbatim from Tenji's real bundle.
const HERO_BRAND = {
  plumbing: { hero: '1504328345606-18bbc8c9d7d1', brand: '#2563EB' },
  electricians: { hero: '1621905251918-48416bd8575a', brand: '#F59E0B' },
  roofers: { hero: '1632759145351-1d592919f522', brand: '#B91C1C' },
  // pest-control/garage-door/smash-repair/gutter-cleaning/podiatrists: the
  // extracted table's hero IDs for these 5 (of 59) 404 on Unsplash's CDN
  // (verified via HEAD request, 2026-07-21) — confirmed dead, not a transient
  // blip. Substituted with a verified-200, on-trade photo (the niche's own
  // curated about photo where one exists, otherwise a same-subgroup niche's
  // valid hero) rather than shipping a broken hero image.
  'pest-control': { hero: '1581578731548-c64695cc6952', brand: '#DC2626' },
  hvac: { hero: '1581094794329-c8112a89af12', brand: '#0891B2' },
  'tree-removal': { hero: '1542273917363-3b1817f69a2d', brand: '#15803D' },
  locksmiths: { hero: '1558002038-1055907df827', brand: '#374151' },
  'garage-door': { hero: '1568605114967-8130f3a36994', brand: '#7C3AED' },
  'smash-repair': { hero: '1487754180451-c456f719a1fc', brand: '#DC2626' },
  landscapers: { hero: '1558904541-efa843a96f01', brand: '#16A34A' },
  scaffolding: { hero: '1503387762-592deb58ef4e', brand: '#475569' },
  builders: { hero: '1503387762-592deb58ef4e', brand: '#C2410C' },
  'home-renovation': { hero: '1600585154340-be6161a56a0c', brand: '#B45309' },
  'bathroom-renovation': { hero: '1620626011761-996317b8d101', brand: '#0D9488' },
  'kitchen-renovators': { hero: '1556909114-f6e7ad7d3136', brand: '#9A3412' },
  painters: { hero: '1562259949-e8e7689d7828', brand: '#9333EA' },
  tilers: { hero: '1600566752355-35792bedcfea', brand: '#0E7490' },
  'flooring-installers': { hero: '1581858726788-75bc0f6a952d', brand: '#A16207' },
  'solar-panel-installers': { hero: '1509391366360-2e959784a276', brand: '#CA8A04' },
  'security-camera-installers': { hero: '1557597774-9d273605dfa9', brand: '#1E40AF' },
  fencing: { hero: '1605146769289-440113cc3d00', brand: '#EA580C' },
  'concrete-contractors': { hero: '1518709268805-4e9042af9f23', brand: '#6B7280' },
  'driveway-installers': { hero: '1558981403-c5f9899a28bc', brand: '#57534E' },
  bricklayers: { hero: '1581094794329-c8112a89af12', brand: '#9F1239' },
  excavation: { hero: '1581094794329-c8112a89af12', brand: '#854D0E' },
  demolition: { hero: '1504307651254-35680f356dfd', brand: '#7F1D1D' },
  'carpet-cleaners': { hero: '1558317374-067fb5f30001', brand: '#0369A1' },
  'pressure-washing': { hero: '1527515637462-cff94eecc1ac', brand: '#0284C7' },
  'gutter-cleaning': { hero: '1527515637462-cff94eecc1ac', brand: '#0E7490' },
  'skip-bin-hire': { hero: '1530587191325-3db32d826c18', brand: '#CA8A04' },
  'rubbish-removal': { hero: '1532996122724-e3c354a0b15b', brand: '#16A34A' },
  removalists: { hero: '1600518464441-9154a4dea21b', brand: '#D97706' },
  'car-detailing': { hero: '1607860108855-64acf2078ed9', brand: '#1D4ED8' },
  mechanics: { hero: '1486006920555-c77dcf18193c', brand: '#1E3A8A' },
  'tyre-shops': { hero: '1486262715619-67b85e0b08d3', brand: '#111827' },
  'lawn-care': { hero: '1592417817098-8fd3d9eb14a5', brand: '#4D7C0F' },
  'pool-cleaners': { hero: '1576013551627-0cc20b96c2a7', brand: '#06B6D4' },
  'window-cleaners': { hero: '1527515637462-cff94eecc1ac', brand: '#0284C7' },
  'storage-facilities': { hero: '1586528116311-ad8dd3c8310d', brand: '#7C3AED' },
  'car-wash': { hero: '1520340356584-f9917d1eea6f', brand: '#0EA5E9' },
  gyms: { hero: '1534438327276-14e5300c3a48', brand: '#DC2626' },
  dentists: { hero: '1588776814546-1ffcf47267a5', brand: '#0D9488' },
  physios: { hero: '1571019613454-1cb2f99b2d8b', brand: '#0E7490' },
  chiropractors: { hero: '1612531385446-f7e6d131e1d0', brand: '#0891B2' },
  podiatrists: { hero: '1588776814546-1ffcf47267a5', brand: '#0369A1' },
  optometrists: { hero: '1577401239170-897942555fb3', brand: '#1D4ED8' },
  vets: { hero: '1576201836106-db1758fd1c97', brand: '#0D9488' },
  'personal-trainers': { hero: '1571019613454-1cb2f99b2d8b', brand: '#DC2626' },
  'martial-arts': { hero: '1555597673-b21d5c935865', brand: '#B91C1C' },
  'hair-salons': { hero: '1560066984-138dadb4c035', brand: '#BE185D' },
  barbers: { hero: '1585747860715-2ba37e788b70', brand: '#1F2937' },
  'beauty-salons': { hero: '1570172619644-dfd03ed5d881', brand: '#C026D3' },
  'nail-salons': { hero: '1604654894610-df63bc536371', brand: '#DB2777' },
  'massage-clinics': { hero: '1600334089648-b0d9d3028eb2', brand: '#7C3AED' },
  'tattoo-studios': { hero: '1611501275019-9b5cda994e8d', brand: '#9333EA' },
  cafes: { hero: '1554118811-1e0d58224f24', brand: '#92400E' },
  restaurants: { hero: '1517248135467-4c7edcad34c4', brand: '#B91C1C' },
  takeaway: { hero: '1568901346375-23c9450c58cd', brand: '#EA580C' },
  bakeries: { hero: '1509440159596-0249088772ff', brand: '#A16207' },
  catering: { hero: '1555244162-803834f70033', brand: '#9D174D' },
};

// Hand-curated about/services images — kept from the earlier pass (individually
// verified HTTP 200 + eyeballed 2026-07-20). Niches not listed here use
// GENERIC's about/services alongside their own real HERO_BRAND hero image.
const ABOUT_SERVICES = {
  plumbing: {
    about: '1621905252507-b35492cc74b4',
    services: ['1585704032915-c3400ca199e7', '1607472586893-edb57bdc0e39', '1620626011761-996317b8d101'],
  },
  electricians: {
    about: '1621905251918-48416bd8575a',
    services: ['1621905251189-08b45d6a269e', '1620283085439-39620a1e21c4', '1521618755572-156ae0cdd74d'],
  },
  roofers: {
    about: '1635424710928-0544e8512eae',
    services: ['1600585154340-be6161a56a0c', '1583608205776-bfd35f0d9f83'],
  },
  'pest-control': {
    // Note: free literal "exterminator spraying" shots are all premium on Unsplash,
    // so this niche leans on a protect-your-home theme + a masked service tech.
    about: '1581578731548-c64695cc6952',
    services: ['1583608205776-bfd35f0d9f83', '1558904541-efa843a96f01'],
  },
  hvac: {
    about: '1600607687939-ce8a6c25118c',
    services: ['1698479603408-1a66a6d9e80f', '1718203862467-c33159fdc504'],
  },
  'tree-removal': {
    about: '1516214104703-d870798883c5',
    services: ['1635424710928-0544e8512eae', '1516214104703-d870798883c5'],
  },
  locksmiths: {
    about: '1558002038-1055907df827',
    services: ['1595079676339-1534801ad6cf', '1558002038-1055907df827'],
  },
  'garage-door': {
    about: '1568605114967-8130f3a36994',
    services: ['1583608205776-bfd35f0d9f83', '1613977257363-707ba9348227'],
  },
  'smash-repair': {
    about: '1487754180451-c456f719a1fc',
    services: ['1503376780353-7e6692767b70', '1487754180451-c456f719a1fc'],
  },
  landscapers: {
    about: '1558904541-efa843a96f01',
    services: ['1416879595882-3373a0480b5b', '1523348837708-15d4a09cfac2'],
  },
  scaffolding: {
    about: '1541888946425-d81bb19240f5',
    services: ['1504307651254-35680f356dfd', '1517089152318-42ec560349c0'],
  },
  builders: {
    about: '1504307651254-35680f356dfd',
    services: ['1589939705384-5185137a7f0f', '1503387837-b154d5074bd2', '1613977257363-707ba9348227'],
  },
  'home-renovation': {
    about: '1581858726788-75bc0f6a952d',
    services: ['1523413651479-597eb2da0ad6', '1607400201889-565b1ee75f8e'],
  },
  'bathroom-renovation': {
    about: '1600566752355-35792bedcfea',
    services: ['1585704032915-c3400ca199e7', '1523413651479-597eb2da0ad6'],
  },

  // Below: the remaining 46 niches, added 2026-07-21. No hand-curated about/
  // services photos exist for these (only hero+brand were extracted from
  // Tenji's bundle), so each niche borrows its about/services images from
  // OTHER niches' real, already-verified HERO_BRAND photos in the same trade
  // subcategory (grouped below by what the trade actually looks like, not
  // just HERO_BRAND's broader "Category" column — e.g. "Health & Fitness" is
  // split into fitness vs. medical/allied-health so a gym never lends a photo
  // to a dentist). This introduces zero new unverified photo IDs: every image
  // used here is a real Tenji hero photo confirmed to render correctly
  // (npm run dev + Playwright, 2026-07-21) for its own niche already.
  // Known limitation: `vets` has no animal-care photo available under this
  // scheme (only 6 human-medical niches to borrow from) and uses the medical
  // subgroup as the closest fit — flagged, not a perfect match.
  bricklayers: { about: '1581094794329-c8112a89af12', services: ['1504307651254-35680f356dfd', '1509391366360-2e959784a276'] },
  excavation: { about: '1504307651254-35680f356dfd', services: ['1509391366360-2e959784a276', '1581094794329-c8112a89af12'] },
  demolition: { about: '1509391366360-2e959784a276', services: ['1581094794329-c8112a89af12', '1632759145351-1d592919f522'] },
  'solar-panel-installers': { about: '1581094794329-c8112a89af12', services: ['1632759145351-1d592919f522', '1503387762-592deb58ef4e'] },
  'kitchen-renovators': { about: '1562259949-e8e7689d7828', services: ['1600566752355-35792bedcfea', '1581858726788-75bc0f6a952d'] },
  painters: { about: '1600566752355-35792bedcfea', services: ['1581858726788-75bc0f6a952d', '1600585154340-be6161a56a0c'] },
  tilers: { about: '1581858726788-75bc0f6a952d', services: ['1600585154340-be6161a56a0c', '1620626011761-996317b8d101'] },
  'flooring-installers': { about: '1600585154340-be6161a56a0c', services: ['1620626011761-996317b8d101', '1556909114-f6e7ad7d3136'] },
  'security-camera-installers': { about: '1558002038-1055907df827', services: ['1568605114967-8130f3a36994', '1568605114967-8130f3a36994'] },
  'carpet-cleaners': { about: '1527515637462-cff94eecc1ac', services: ['1527515637462-cff94eecc1ac', '1581578731548-c64695cc6952'] },
  'pressure-washing': { about: '1527515637462-cff94eecc1ac', services: ['1527515637462-cff94eecc1ac', '1581578731548-c64695cc6952'] },
  'gutter-cleaning': { about: '1527515637462-cff94eecc1ac', services: ['1581578731548-c64695cc6952', '1558317374-067fb5f30001'] },
  'window-cleaners': { about: '1581578731548-c64695cc6952', services: ['1558317374-067fb5f30001', '1527515637462-cff94eecc1ac'] },
  fencing: { about: '1518709268805-4e9042af9f23', services: ['1558981403-c5f9899a28bc', '1592417817098-8fd3d9eb14a5'] },
  'concrete-contractors': { about: '1558981403-c5f9899a28bc', services: ['1592417817098-8fd3d9eb14a5', '1576013551627-0cc20b96c2a7'] },
  'driveway-installers': { about: '1592417817098-8fd3d9eb14a5', services: ['1576013551627-0cc20b96c2a7', '1542273917363-3b1817f69a2d'] },
  'lawn-care': { about: '1576013551627-0cc20b96c2a7', services: ['1542273917363-3b1817f69a2d', '1558904541-efa843a96f01'] },
  'pool-cleaners': { about: '1542273917363-3b1817f69a2d', services: ['1558904541-efa843a96f01', '1605146769289-440113cc3d00'] },
  'car-detailing': { about: '1486006920555-c77dcf18193c', services: ['1486262715619-67b85e0b08d3', '1520340356584-f9917d1eea6f'] },
  mechanics: { about: '1486262715619-67b85e0b08d3', services: ['1520340356584-f9917d1eea6f', '1487754180451-c456f719a1fc'] },
  'tyre-shops': { about: '1520340356584-f9917d1eea6f', services: ['1487754180451-c456f719a1fc', '1607860108855-64acf2078ed9'] },
  'car-wash': { about: '1487754180451-c456f719a1fc', services: ['1607860108855-64acf2078ed9', '1486006920555-c77dcf18193c'] },
  'skip-bin-hire': { about: '1532996122724-e3c354a0b15b', services: ['1600518464441-9154a4dea21b', '1586528116311-ad8dd3c8310d'] },
  'rubbish-removal': { about: '1600518464441-9154a4dea21b', services: ['1586528116311-ad8dd3c8310d', '1530587191325-3db32d826c18'] },
  removalists: { about: '1586528116311-ad8dd3c8310d', services: ['1530587191325-3db32d826c18', '1532996122724-e3c354a0b15b'] },
  'storage-facilities': { about: '1530587191325-3db32d826c18', services: ['1532996122724-e3c354a0b15b', '1600518464441-9154a4dea21b'] },
  gyms: { about: '1571019613454-1cb2f99b2d8b', services: ['1555597673-b21d5c935865', '1555597673-b21d5c935865'] },
  'personal-trainers': { about: '1555597673-b21d5c935865', services: ['1534438327276-14e5300c3a48', '1534438327276-14e5300c3a48'] },
  'martial-arts': { about: '1534438327276-14e5300c3a48', services: ['1571019613454-1cb2f99b2d8b', '1571019613454-1cb2f99b2d8b'] },
  // Medical subgroup note: of the 7 real Tenji hero photos here, only
  // dentists' (x-ray review) and chiropractors' (doctor portrait) are
  // actually clinical — physios' hero is a mislabeled fitness-stretch photo
  // (fine for the separate `fitness` subgroup, wrong here) and optometrists'
  // hero is a Rubik's cube (unrelated to eye care) — both confirmed by
  // downloading + eyeballing, 2026-07-21. So about/services below draw ONLY
  // from the two verified-clinical photos (dentists/chiropractors), not a
  // straight round-robin of the whole subgroup.
  dentists: { about: '1612531385446-f7e6d131e1d0', services: ['1612531385446-f7e6d131e1d0', '1588776814546-1ffcf47267a5'] },
  physios: { about: '1588776814546-1ffcf47267a5', services: ['1612531385446-f7e6d131e1d0', '1588776814546-1ffcf47267a5'] },
  chiropractors: { about: '1588776814546-1ffcf47267a5', services: ['1588776814546-1ffcf47267a5', '1612531385446-f7e6d131e1d0'] },
  podiatrists: { about: '1612531385446-f7e6d131e1d0', services: ['1588776814546-1ffcf47267a5', '1612531385446-f7e6d131e1d0'] },
  optometrists: { about: '1588776814546-1ffcf47267a5', services: ['1612531385446-f7e6d131e1d0', '1588776814546-1ffcf47267a5'] },
  // massage-clinics: about reuses its OWN hero (hot-stone photo — genuinely
  // on-trade for this specific business) rather than borrowing, and is
  // deliberately excluded as a donor to every OTHER niche above (exposed-skin
  // spa content would look out of place on e.g. an optometrist's About section).
  'massage-clinics': { about: '1600334089648-b0d9d3028eb2', services: ['1612531385446-f7e6d131e1d0', '1588776814546-1ffcf47267a5'] },
  // vets: about reuses its own hero (puppy photo, correctly animal-themed —
  // the only niche in this file where the extracted hero is unambiguously
  // right for the trade); services borrow the two clean medical photos for
  // "we're a real clinic" credibility rather than 3x the same puppy shot.
  vets: { about: '1576201836106-db1758fd1c97', services: ['1612531385446-f7e6d131e1d0', '1588776814546-1ffcf47267a5'] },
  'hair-salons': { about: '1585747860715-2ba37e788b70', services: ['1570172619644-dfd03ed5d881', '1604654894610-df63bc536371'] },
  barbers: { about: '1570172619644-dfd03ed5d881', services: ['1604654894610-df63bc536371', '1611501275019-9b5cda994e8d'] },
  'beauty-salons': { about: '1604654894610-df63bc536371', services: ['1611501275019-9b5cda994e8d', '1560066984-138dadb4c035'] },
  'nail-salons': { about: '1611501275019-9b5cda994e8d', services: ['1560066984-138dadb4c035', '1585747860715-2ba37e788b70'] },
  'tattoo-studios': { about: '1560066984-138dadb4c035', services: ['1585747860715-2ba37e788b70', '1570172619644-dfd03ed5d881'] },
  cafes: { about: '1517248135467-4c7edcad34c4', services: ['1568901346375-23c9450c58cd', '1509440159596-0249088772ff'] },
  restaurants: { about: '1568901346375-23c9450c58cd', services: ['1509440159596-0249088772ff', '1555244162-803834f70033'] },
  takeaway: { about: '1509440159596-0249088772ff', services: ['1555244162-803834f70033', '1554118811-1e0d58224f24'] },
  bakeries: { about: '1555244162-803834f70033', services: ['1554118811-1e0d58224f24', '1517248135467-4c7edcad34c4'] },
  catering: { about: '1554118811-1e0d58224f24', services: ['1517248135467-4c7edcad34c4', '1568901346375-23c9450c58cd'] },
};

// Fallback for niches not present anywhere in HERO_BRAND/ABOUT_SERVICES.
const GENERIC_ABOUT_SERVICES = {
  about: '1621905252507-b35492cc74b4',
  services: ['1541888946425-d81bb19240f5', '1613977257363-707ba9348227', '1504307651254-35680f356dfd'],
};
const GENERIC_HERO_BRAND = { hero: '1600585154340-be6161a56a0c', brand: '#9D174D' };

// frontend/src/lib/templates/*.js predate the 59-niche extracted table and use
// a few slightly different niche slugs. Alias them onto the real table key so
// those templates get real hero/brand/about/services instead of silently
// falling through to GENERIC. 'cleaning'/'handyman' have no equivalent in the
// extracted table (not trade-specific enough), so they point at the closest
// visual fit rather than a true match.
const NICHE_ALIASES = {
  'carpet-cleaning': 'carpet-cleaners',
  fitness: 'gyms',
  security: 'security-camera-installers',
  solar: 'solar-panel-installers',
  cleaning: 'carpet-cleaners',
  handyman: 'builders',
  // Catalog niches (frontend/src/app/lib/templateCatalog.js) whose full human-readable
  // name slugifies to something that doesn't match a HERO_BRAND key one-for-one —
  // found 2026-07-21 auditing Templates.jsx card photos against every real catalog
  // entry, not just the ones that happened to already work.
  'hvac-air-conditioning': 'hvac',
  'builders-construction': 'builders',
  'bathroom-renovators': 'bathroom-renovation',
  'garage-door-repair': 'garage-door',
  physiotherapists: 'physios',
  veterinarians: 'vets',
  'martial-arts-gyms': 'martial-arts',
  'takeaway-shops': 'takeaway',
  'catering-companies': 'catering',
};
// Real niche slugs (DB rows, e.g. "carpet-cleaning") are already dashed — but callers
// also pass full catalog display names with spaces/slashes (e.g. "HVAC / Air
// Conditioning") which never matched any HERO_BRAND key here since this only
// lowercased, never slugified. Slugify first, THEN alias-resolve, so both shapes work.
const resolveKey = (niche) => {
  const raw = String(niche || '').trim().toLowerCase();
  const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return NICHE_ALIASES[raw] || NICHE_ALIASES[slug] || slug;
};

// Testimonial/avatar faces via i.pravatar.cc (fake-face service, hotlink-stable,
// no key). Matches Tenji's `i.pravatar.cc/{size}?img={n}` pattern.
const AVATAR_IMGS = [11, 12, 13, 20, 21, 22, 32, 45, 47, 68];

/**
 * Resolve a niche to ready-to-use image URLs.
 * @param {string} niche - niche slug, e.g. "plumbing", "tree-removal" (case-insensitive).
 * @returns {{hero:string, about:string, services:string[]}}
 */
export function getNicheImages(niche) {
  const key = resolveKey(niche)
  const hb = HERO_BRAND[key] || GENERIC_HERO_BRAND;
  const as = ABOUT_SERVICES[key] || GENERIC_ABOUT_SERVICES;
  return {
    hero: U(hb.hero, 1600),
    about: U(as.about, 900),
    services: as.services.map((id) => U(id, 800)),
  };
}

/**
 * Real Tenji brand color for a niche (theme.primary default), e.g. plumbing → #2563EB.
 * @param {string} niche
 * @returns {string} hex color
 */
export function getNicheBrandColor(niche) {
  const key = resolveKey(niche)
  return (HERO_BRAND[key] || GENERIC_HERO_BRAND).brand;
}

/**
 * Testimonial avatar URL. Deterministic per index so a given reviewer is stable.
 * @param {number} index - reviewer index (0-based).
 * @param {number} [size=64] - px.
 * @returns {string}
 */
export function getAvatar(index = 0, size = 64) {
  const img = AVATAR_IMGS[index % AVATAR_IMGS.length];
  return `https://i.pravatar.cc/${size}?img=${img}`;
}

/** List of supported niche slugs. */
export const NICHE_SLUGS = Object.keys(HERO_BRAND);

export default getNicheImages;
