import { generatedSite } from '../lib/designTokens.js'

// Maps the Designer's Design tab controls (DesignPanel.jsx: Quick Palettes, Body/Heading
// Font, Button Style, Corner Radius) to concrete CSS values, and drives every other
// generated-site visual (colors, spacing rhythm, card/button recipes) off
// `lib/designTokens.js`'s `generatedSite` token set — extracted from Tenji's real
// generated-site HTML, not guessed (see lib/tenji-tokens.md for provenance). The only
// per-site variable is `theme.primary` ("BRAND" in the token docs); everything else here
// is fixed across every generated site, same as real Tenji.
//
// Everything resolves to CSS custom properties on SiteRenderer's wrapper div (same
// pattern as the existing --primary/--secondary/--heading-font), so section components
// just reference var(--card-bg) etc. in their inline styles — no prop drilling needed.
export const DEFAULT_THEME = {
  primary: '#9D174D',
  secondary: '#15171f',
  font: 'Inter',
  headingFont: 'Inter',
  buttonStyle: 'Pill', // real Tenji's CTA recipe is always pill; Rounded/Sharp are Nova customization options layered on top
  cornerRadius: 'Soft',
}

export const BUTTON_RADIUS = {
  Rounded: '0.375rem',
  Pill: generatedSite.ctaButton.radius, // 9999px
  Sharp: '0px',
}

export const CARD_RADIUS = {
  Sharp: '0px',
  Soft: generatedSite.card.radius, // 20px — the real "reusable gradient card" recipe
  Round: generatedSite.radius.cardLg, // 24px
}

const FONT_FALLBACK = 'ui-sans-serif, system-ui, -apple-system, sans-serif'

function hexToRgbTriplet(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  if (!m) return '157, 23, 77' // falls back to a neutral rose if theme.primary isn't a valid 6-digit hex
  return [m[1], m[2], m[3]].map((h) => parseInt(h, 16)).join(', ')
}

function substituteBrand(value, brandRgb) {
  return value.replace(/rgba\(BRAND,\s*([\d.]+)\)/g, `rgba(${brandRgb}, $1)`)
}

/**
 * Resolves a (possibly partial) content_json `theme` object into the CSS custom
 * properties SiteRenderer/sections consume — colors, spacing rhythm, and the real
 * card/CTA/input recipes with the lead's brand color (`theme.primary`) substituted
 * into every gradient/shadow layer that carries it. Values match the captured real
 * Tenji templates (09 - Resources/tenji-templates/tenji-plumbing-template.html) pixel
 * for pixel where the recipe carries no per-site variation.
 */
export function resolveThemeVars(theme) {
  const t = { ...DEFAULT_THEME, ...(theme || {}) }
  const headingFont = t.headingFont || t.font
  const brandRgb = hexToRgbTriplet(t.primary)

  const vars = {
    '--primary': t.primary,
    '--secondary': t.secondary,
    '--heading-font': `"${headingFont}", ${FONT_FALLBACK}`,
    '--btn-radius': BUTTON_RADIUS[t.buttonStyle] || BUTTON_RADIUS.Pill,
    '--card-radius': CARD_RADIUS[t.cornerRadius] || CARD_RADIUS.Soft,

    '--heading-color': generatedSite.colors.heading,
    '--body-color': generatedSite.colors.body,
    '--muted-color': generatedSite.colors.muted,
    '--page-bg': generatedSite.colors.pageBg,
    '--surface': generatedSite.colors.surface,
    '--section-bg-alt': generatedSite.colors.sectionBgAlt,
    '--input-border-color': generatedSite.colors.inputBorder,
    '--star-color': `rgb(${brandRgb})`, // real Tenji fills rating stars with the brand color, not a fixed yellow

    '--section-y': generatedSite.spacing.sectionY,
    '--section-x': generatedSite.spacing.sectionX,
    '--max-w': generatedSite.spacing.maxWidth,

    '--card-bg': generatedSite.card.background,
    '--card-border': generatedSite.card.border,
    '--card-shadow': substituteBrand(generatedSite.card.shadow, brandRgb),
    '--card-pad': generatedSite.card.padding,

    '--cta-pad': generatedSite.ctaButton.padding,
    '--cta-fs': generatedSite.ctaButton.fontSize,
    '--cta-fw': generatedSite.ctaButton.fontWeight,
    '--cta-color': generatedSite.ctaButton.color,
    '--cta-bg': substituteBrand(generatedSite.ctaButton.background, brandRgb),
    '--cta-shadow': substituteBrand(generatedSite.ctaButton.shadow, brandRgb),
    // Small CTA variant (Navbar's pill button) — distinct real shadow, see ctaButtonSmall.
    '--cta-sm-shadow': substituteBrand(generatedSite.ctaButtonSmall.shadow, brandRgb),

    '--input-bg': generatedSite.input.background,
    '--input-border': generatedSite.input.border,
    '--input-radius': generatedSite.input.radius,
    '--input-pad': generatedSite.input.padding,
    '--input-shadow': generatedSite.input.shadow,

    // Hero photo scrim — real Tenji dark-overlays the hero background photo with a
    // 4-stop diagonal gradient (left = near-opaque, right = mostly-transparent) plus a
    // soft brand-tinted radial glow bottom-left, not a flat opacity fade.
    '--hero-overlay': 'linear-gradient(105deg, rgba(8,9,14,0.92) 0%, rgba(8,9,14,0.74) 38%, rgba(8,9,14,0.42) 66%, rgba(8,9,14,0.28) 100%)',
    '--hero-radial': `radial-gradient(120% 80% at 12% 42%, rgba(${brandRgb}, 0.16), transparent 55%)`,

    // Icon tile (service card icon, feature icon) — brand-tinted wash.
    '--icon-tile-bg': generatedSite.iconTile.background.replace(/rgba\(BRAND,([\d.]+)\)/, `rgba(${brandRgb}, $1)`),
    '--icon-tile-radius': generatedSite.iconTile.radius,
    '--icon-tile-size': generatedSite.iconTile.size,

    // Logo tile (navbar/footer brand mark) — brand gradient chip.
    '--logo-tile-bg': generatedSite.logoTile.background.replace(/rgba\(BRAND,([\d.]+)\)/g, `rgba(${brandRgb}, $1)`),
    '--logo-tile-shadow': generatedSite.logoTile.shadow.replace(/rgba\(BRAND,([\d.]+)\)/g, `rgba(${brandRgb}, $1)`),
    '--logo-tile-radius': generatedSite.logoTile.radius,
    '--logo-tile-size': generatedSite.logoTile.size,

    // Glass badge (hero trust pills, nav phone chip).
    '--glass-bg': generatedSite.glassBadge.background,
    '--glass-border': generatedSite.glassBadge.border,
    '--glass-radius': generatedSite.glassBadge.radius,
    '--glass-pad': generatedSite.glassBadge.padding,

    // Dark CTA band — inner panel gradient (secondary → brand) + radial glow, real
    // Tenji's CTA section is a near-black band containing a smaller glowing dark panel,
    // not a full-bleed flat brand-colored section.
    '--cta-panel-bg': `linear-gradient(160deg, rgba(21,23,31,0.96) 0%, rgba(21,23,31,0.7) 42%, rgba(${brandRgb}, 0.72) 100%)`,
    '--cta-panel-glow': `radial-gradient(75% 90% at 50% 28%, rgba(${brandRgb}, 0.5), transparent 60%)`,

    // Eyebrow label (small uppercase tag above headings, footer column labels).
    '--eyebrow-color': `rgba(${brandRgb}, 0.85)`,
  }

  return {
    theme: t,
    fontFamily: `"${t.font}", ${FONT_FALLBACK}`,
    vars,
  }
}
