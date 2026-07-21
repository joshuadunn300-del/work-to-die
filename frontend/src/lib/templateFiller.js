// templateFiller.js — Nova's no-LLM site-creation path.
// fillTemplate(nicheTemplate, leadData) -> a complete content_json with every
// {{TOKEN}} replaced, brand color applied to theme.primary, and hero/about
// images pulled from imageLibrary by niche. Missing lead fields fall back to
// sensible defaults so a raw {{TOKEN}} is never rendered.

// imageLibrary.js landed 2026-07-21 (59 real Tenji niches, hero+brand extracted
// from the production bundle). Kept as a dynamic import + fallback so this
// module still runs standalone if imageLibrary.js is ever mid-edit.
let _getNicheImages = null
let _getNicheBrandColor = null
try {
  ;({ getNicheImages: _getNicheImages, getNicheBrandColor: _getNicheBrandColor } = await import('./imageLibrary.js'))
} catch {
  _getNicheImages = null
  _getNicheBrandColor = null
}

// Fallback stock images (Tenji's originals) used until imageLibrary exists.
const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80&auto=format&fit=crop',
  about: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&q=80&auto=format&fit=crop',
}

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 40) || 'yourbusiness'

function pick(leadData, ...keys) {
  for (const k of keys) {
    const v = leadData?.[k]
    if (v != null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

function resolveImages(niche, getImages) {
  const fn = getImages || _getNicheImages
  if (typeof fn === 'function') {
    try {
      const imgs = fn(niche) || {}
      return { hero: imgs.hero || FALLBACK_IMAGES.hero, about: imgs.about || FALLBACK_IMAGES.about }
    } catch {
      /* fall through to fallback */
    }
  }
  return { ...FALLBACK_IMAGES }
}

/**
 * @param {object} nicheTemplate - a content_json template from ./templates
 * @param {object} leadData - lead fields (business_name, phone, location, email, brand_color, cta, services)
 * @param {object} [opts] - { getNicheImages } to inject the image resolver (else auto/fallback)
 * @returns {object} filled content_json
 */
export function fillTemplate(nicheTemplate, leadData = {}, opts = {}) {
  const tpl = structuredClone(nicheTemplate)
  const niche = tpl.niche || 'generic'

  const businessName = pick(leadData, 'business_name', 'businessName', 'name') || 'Your Business'
  const niceColorFn = opts.getNicheBrandColor || _getNicheBrandColor
  const nicheColor = typeof niceColorFn === 'function' ? niceColorFn(niche) : null
  const tokens = {
    BUSINESS_NAME: businessName,
    PHONE: pick(leadData, 'phone', 'phone_number') || '(555) 012-3456',
    LOCATION: pick(leadData, 'location', 'suburb', 'city') || 'your area',
    EMAIL: pick(leadData, 'email') || `hello@${slug(businessName)}.com`,
    BRAND_COLOR: pick(leadData, 'brand_color', 'brandColor', 'color') || nicheColor || '#2563EB',
    CTA: pick(leadData, 'cta') || 'Call Now',
    SERVICES: pick(leadData, 'services') || serviceList(tpl),
  }

  const replace = (str) =>
    str.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in tokens ? tokens[key] : ''))

  walkStrings(tpl, replace)

  // Apply brand color + niche images (post-token, so they're not string-mangled).
  tpl.theme.primary = tokens.BRAND_COLOR
  const images = resolveImages(niche, opts.getNicheImages)
  for (const section of tpl.sections) {
    if (section.type === 'hero') section.props.bgImage = images.hero
    if (section.type === 'about') section.props.image = images.about
  }

  return tpl
}

function serviceList(tpl) {
  const svc = tpl.sections.find((s) => s.type === 'services')
  return (svc?.props?.items || []).map((i) => i.title).join(', ')
}

// Mutates every string in an object/array tree via fn.
function walkStrings(node, fn) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      if (typeof node[i] === 'string') node[i] = fn(node[i])
      else walkStrings(node[i], fn)
    }
  } else if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      if (typeof node[k] === 'string') node[k] = fn(node[k])
      else walkStrings(node[k], fn)
    }
  }
}

export default fillTemplate
