// Runnable check for the template library: `node test.mjs`
// Fills the plumbing template with sample lead data and asserts the output is
// a complete, token-free content_json.
import assert from 'node:assert/strict'
import { getTemplate, NICHES } from './index.js'
import { fillTemplate } from '../templateFiller.js'

const lead = {
  business_name: 'Rapid Flow Plumbing',
  phone: '(02) 8123 4567',
  location: 'Sydney',
  email: 'jobs@rapidflow.com.au',
  brand_color: '#0EA5E9',
  cta: 'Call 24/7',
}

const filled = fillTemplate(getTemplate('plumbing'), lead)

// 1. Exactly the 8 expected sections, in order.
const EXPECTED = ['navbar', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'footer']
assert.equal(filled.sections.length, 8, 'expected 8 sections')
assert.deepEqual(filled.sections.map((s) => s.type), EXPECTED, 'section types/order mismatch')

// 2. No unreplaced {{TOKENS}} anywhere.
const raw = JSON.stringify(filled)
const leftover = raw.match(/\{\{[^}]*\}\}/)
assert.equal(leftover, null, `unreplaced token found: ${leftover}`)

// 3. theme.primary set to the brand color.
assert.equal(filled.theme.primary, '#0EA5E9', 'theme.primary not set to brand color')

// 4. Lead values actually landed.
assert.ok(raw.includes('Rapid Flow Plumbing'), 'business name missing')
assert.ok(raw.includes('(02) 8123 4567'), 'phone missing')
assert.ok(raw.includes('Sydney'), 'location missing')

// 5. Required props non-empty per section.
const byType = Object.fromEntries(filled.sections.map((s) => [s.type, s.props]))
const nonEmpty = (v, msg) => assert.ok(typeof v === 'string' && v.trim().length, msg)

nonEmpty(byType.navbar.logo, 'navbar.logo empty')
nonEmpty(byType.navbar.phone, 'navbar.phone empty')
nonEmpty(byType.hero.headline, 'hero.headline empty')
nonEmpty(byType.hero.bgImage, 'hero.bgImage empty (image not injected)')
nonEmpty(byType.hero.ctaText, 'hero.ctaText empty')
assert.equal(byType.services.items.length, 6, 'services must have 6 items')
byType.services.items.forEach((i, n) => {
  nonEmpty(i.title, `service ${n} title empty`)
  nonEmpty(i.desc, `service ${n} desc empty`)
})
nonEmpty(byType.about.body, 'about.body empty')
nonEmpty(byType.about.image, 'about.image empty (image not injected)')
assert.equal(byType.testimonials.items.length, 3, 'testimonials must have 3 items')
assert.equal(byType.faq.items.length, 3, 'faq must have 3 items')
nonEmpty(byType.cta.buttonText, 'cta.buttonText empty')
nonEmpty(byType.footer.email, 'footer.email empty')

// 6. Every registered niche fills without leaving tokens (incl. missing fields).
for (const niche of NICHES) {
  const out = fillTemplate(getTemplate(niche), {}) // no lead data -> defaults
  const l = JSON.stringify(out).match(/\{\{[^}]*\}\}/)
  assert.equal(l, null, `[${niche}] unreplaced token with empty lead: ${l}`)
  assert.equal(out.sections.length, 8, `[${niche}] not 8 sections`)
}

console.log(`PASS — ${NICHES.length} niches, plumbing fill verified, no unreplaced tokens.`)
