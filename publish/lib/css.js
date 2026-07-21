// Ported 1:1 from frontend/src/renderer/theme.js + frontend/src/lib/designTokens.js
// (generatedSite token set) — publish/ is plain CommonJS and can't import that ESM
// module, so the resolved values are duplicated here rather than computed from a
// shared import. Keep both in sync by hand if either changes.

const DEFAULT_THEME = {
  primary: '#9D174D',
  secondary: '#15171f',
  font: 'Inter',
  headingFont: 'Inter',
  buttonStyle: 'Pill',
  cornerRadius: 'Soft',
};

const BUTTON_RADIUS = { Rounded: '0.375rem', Pill: '9999px', Sharp: '0px' };
const CARD_RADIUS = { Sharp: '0px', Soft: '20px', Round: '24px' };
const FONT_FALLBACK = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

function hexToRgbTriplet(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return '157, 23, 77';
  return [m[1], m[2], m[3]].map((h) => parseInt(h, 16)).join(', ');
}

function substituteBrand(value, brandRgb) {
  return value.replace(/rgba\(BRAND,\s*([\d.]+)\)/g, `rgba(${brandRgb}, $1)`);
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function sanitizeFont(font, fallback) {
  const cleaned = (font || '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
  return cleaned || fallback;
}

function resolveVars(theme) {
  const raw = { ...DEFAULT_THEME, ...(theme || {}) };
  const t = {
    ...raw,
    primary: HEX_COLOR.test(raw.primary || '') ? raw.primary : DEFAULT_THEME.primary,
    secondary: HEX_COLOR.test(raw.secondary || '') ? raw.secondary : DEFAULT_THEME.secondary,
    font: sanitizeFont(raw.font, DEFAULT_THEME.font),
    headingFont: sanitizeFont(raw.headingFont, ''),
  };
  const headingFont = t.headingFont || t.font;
  const brandRgb = hexToRgbTriplet(t.primary);

  return {
    '--primary': t.primary,
    '--secondary': t.secondary,
    '--heading-font': `"${headingFont}", ${FONT_FALLBACK}`,
    '--btn-radius': BUTTON_RADIUS[t.buttonStyle] || BUTTON_RADIUS.Pill,
    '--card-radius': CARD_RADIUS[t.cornerRadius] || CARD_RADIUS.Soft,

    '--heading-color': '#111827',
    '--body-color': '#374151',
    '--muted-color': '#6b7280',
    '--page-bg': '#f7f7f9',
    '--surface': '#ffffff',
    '--section-bg-alt': '#f4f5f8',
    '--input-border-color': '#e2e4ea',
    '--star-color': `rgb(${brandRgb})`,

    '--section-y': '112px',
    '--section-x': '32px',
    '--max-w': '72rem',

    '--card-bg': 'linear-gradient(165deg, #ffffff 0%, #f4f5f8 100%)',
    '--card-border': '1px solid rgba(17,18,28,0.07)',
    '--card-shadow': substituteBrand(
      '0 1px 0 rgba(255,255,255,0.95) inset, 0 22px 50px -22px rgba(17,18,28,0.22), 0 0 30px -14px rgba(BRAND,0.28)',
      brandRgb
    ),
    '--card-pad': '24px 28px',

    '--cta-pad': '14px 28px',
    '--cta-fs': '14px',
    '--cta-fw': 700,
    '--cta-color': '#000',
    '--cta-bg': substituteBrand('linear-gradient(180deg, rgba(BRAND,1) 0%, rgba(BRAND,0.82) 100%)', brandRgb),
    '--cta-shadow': substituteBrand(
      'inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 30px -6px rgba(BRAND,0.6), 0 2px 8px rgba(0,0,0,0.25)',
      brandRgb
    ),
    '--cta-sm-shadow': substituteBrand('inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 14px -2px rgba(BRAND,0.5)', brandRgb),

    '--input-bg': 'linear-gradient(180deg,#fbfbfd,#f4f5f8)',
    '--input-border': '1px solid #e2e4ea',
    '--input-radius': '10px',
    '--input-pad': '11px 14px',
    '--input-shadow': 'inset 0 1px 2px rgba(17,18,28,0.06)',

    '--hero-overlay':
      'linear-gradient(105deg, rgba(8,9,14,0.92) 0%, rgba(8,9,14,0.74) 38%, rgba(8,9,14,0.42) 66%, rgba(8,9,14,0.28) 100%)',
    '--hero-radial': `radial-gradient(120% 80% at 12% 42%, rgba(${brandRgb}, 0.16), transparent 55%)`,

    '--icon-tile-bg': substituteBrand('rgba(BRAND,0.12)', brandRgb),
    '--icon-tile-radius': '16px',
    '--icon-tile-size': '56px',

    '--logo-tile-bg': substituteBrand('linear-gradient(155deg, rgba(BRAND,0.95), rgba(BRAND,0.7))', brandRgb),
    '--logo-tile-shadow': substituteBrand('0 6px 16px -6px rgba(BRAND,0.6), inset 0 1px 0 rgba(255,255,255,0.45)', brandRgb),
    '--logo-tile-radius': '12px',
    '--logo-tile-size': '36px',

    '--glass-bg': 'rgba(255,255,255,0.08)',
    '--glass-border': '1px solid rgba(255,255,255,0.12)',
    '--glass-radius': '12px',
    '--glass-pad': '8px 14px',

    '--cta-panel-bg': `linear-gradient(160deg, rgba(21,23,31,0.96) 0%, rgba(21,23,31,0.7) 42%, rgba(${brandRgb}, 0.72) 100%)`,
    '--cta-panel-glow': `radial-gradient(75% 90% at 50% 28%, rgba(${brandRgb}, 0.5), transparent 60%)`,

    '--eyebrow-color': `rgba(${brandRgb}, 0.85)`,
  };
}

function buildCss(theme) {
  const font = sanitizeFont((theme || {}).font, DEFAULT_THEME.font);
  const vars = resolveVars(theme);
  const varsCss = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  return `
:root {
${varsCss}
}
* { box-sizing: border-box; }
body { margin: 0; font-family: "${font}", ${FONT_FALLBACK}; background: var(--page-bg); color: var(--body-color); line-height: 1.5; overflow-wrap: break-word; }
h1, h2, h3 { font-family: var(--heading-font); margin: 0; }
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; }
.btn-primary { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; background: var(--cta-bg); box-shadow: var(--cta-shadow); color: var(--cta-color); border-radius: var(--btn-radius); padding: var(--cta-pad); font-size: var(--cta-fs); font-weight: var(--cta-fw); }

/* Navbar */
.navbar { position: absolute; top: 0; left: 0; right: 0; z-index: 20; padding: 20px 24px; }
.navbar-inner { margin: 0 auto; max-width: 56rem; display: flex; align-items: center; gap: 24px; padding: 10px 12px 10px 20px; border-radius: 9999px; background: rgba(9,10,15,0.78); backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%); border: 1px solid rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 20px 50px -24px rgba(0,0,0,0.7); }
.navbar-brand { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.navbar-logo-tile { width: 36px; height: 36px; border-radius: 9999px; background: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.navbar-logo-text { font-weight: 600; font-size: 15px; color: #fff; letter-spacing: -0.01em; flex-shrink: 0; max-width: 10rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.navbar-links { display: flex; align-items: center; gap: 6px; margin: 0 auto; min-width: 0; list-style: none; padding: 0; }
.navbar-links li { max-width: 8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.navbar-link { display: block; border-radius: 9999px; padding: 6px 12px; font-size: 13px; white-space: nowrap; color: rgba(255,255,255,0.72); }
.navbar-link.is-active { color: #fff; background: color-mix(in srgb, var(--primary) 16%, transparent); }
.navbar-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.navbar-phone { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #fff; background: rgba(255,255,255,0.06); border-radius: 9999px; padding: 6px 12px; white-space: nowrap; }
.navbar-cta { flex-shrink: 0; box-shadow: var(--cta-sm-shadow); border-radius: 9999px; padding: 6px 16px; font-size: 13px; font-weight: 600; }
@media (max-width: 640px) { .navbar-phone { display: none; } }

/* Hero */
.hero { position: relative; width: 100%; overflow: hidden; background-color: var(--secondary); color: #fff; min-height: 660px; display: flex; align-items: center; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; background-size: cover; background-position: center; }
.hero-overlay { position: absolute; inset: 0; pointer-events: none; background: var(--hero-overlay); }
.hero-radial { position: absolute; inset: 0; pointer-events: none; background: var(--hero-radial); }
.hero-inner { position: relative; z-index: 10; margin: 0 auto; width: 100%; max-width: var(--max-w); padding: 112px 32px 64px; display: grid; grid-template-columns: 1fr; align-items: center; gap: 48px; }
.hero-inner.has-form { grid-template-columns: 1fr; }
@media (min-width: 768px) { .hero-inner.has-form { grid-template-columns: 1fr 1fr; } }
.hero-eyebrow { margin: 0 0 12px; text-transform: uppercase; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: var(--eyebrow-color); }
.hero-headline { font-weight: 700; line-height: 1; font-size: clamp(2.25rem, 5vw, 3.4rem); letter-spacing: -0.025em; }
.hero-sub { margin: 20px 0 0; color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.5; max-width: 28rem; }
.hero-cta { margin-top: 28px; }
.hero-rating { margin-top: 28px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.hero-stars { display: flex; gap: 2px; }
.hero-rating-text { color: rgba(255,255,255,0.8); font-size: 12px; }
.hero-badges { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 10px; }
.hero-badge { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 12px; font-weight: 600; background: var(--glass-bg); border: var(--glass-border); border-radius: var(--glass-radius); padding: var(--glass-pad); }
.hero-form-wrap { display: flex; justify-content: flex-end; }
.hero-form { width: 100%; max-width: 24rem; background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 30px 70px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.04); }
.hero-form h3 { text-align: center; font-weight: 700; margin-bottom: 16px; color: var(--heading-color); font-size: 1.125rem; }
.hero-form-fields { display: flex; flex-direction: column; gap: 12px; }
.hero-form-fields input, .hero-form-fields select, .hero-form-fields textarea { width: 100%; background: var(--input-bg); border: var(--input-border); border-radius: var(--input-radius); padding: var(--input-pad); box-shadow: var(--input-shadow); color: var(--heading-color); font-size: 14px; font-family: inherit; }
.hero-form-submit { width: 100%; margin-top: 16px; border-radius: var(--input-radius); padding: 12px; font-size: 14px; }
.hero-form-microcopy { margin-top: 12px; text-align: center; font-size: 11px; color: #9ca3af; }

/* Services */
.services { width: 100%; margin: 0 auto; padding-block: var(--section-y); padding-inline: var(--section-x); max-width: var(--max-w); }
.services-head { text-align: center; margin: 0 auto; max-width: 42rem; }
.section-heading { font-weight: 700; font-size: clamp(1.75rem, 4vw, 3rem); letter-spacing: -0.02em; line-height: 1.1; color: var(--heading-color); }
.section-subheading { margin-top: 20px; color: var(--muted-color); font-size: 1.125rem; line-height: 1.6; }
.services-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 64px; }
@media (min-width: 640px) { .services-grid { grid-template-columns: repeat(3, 1fr); } }
.service-card { background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow); border-radius: 24px; padding: 28px; min-width: 0; }
.service-icon-tile { display: flex; align-items: center; justify-content: center; margin-bottom: 24px; width: var(--icon-tile-size); height: var(--icon-tile-size); border-radius: var(--icon-tile-radius); background: var(--icon-tile-bg); }
.service-card h3 { font-weight: 600; font-size: 1.125rem; letter-spacing: -0.01em; color: var(--heading-color); }
.service-card p { margin-top: 10px; color: var(--muted-color); font-size: 14px; line-height: 1.6; }
.section-empty { text-align: center; margin-top: 64px; color: var(--muted-color); }

/* Gallery */
.gallery { width: 100%; margin: 0 auto; padding-block: var(--section-y); padding-inline: var(--section-x); max-width: var(--max-w); }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 48px; }
.gallery-grid img { border-radius: var(--card-radius); object-fit: cover; aspect-ratio: 4/3; width: 100%; }

/* About */
.about { width: 100%; margin: 0 auto; display: grid; grid-template-columns: 1fr; align-items: center; padding-block: var(--section-y); padding-inline: var(--section-x); max-width: var(--max-w); gap: 64px; }
@media (min-width: 768px) { .about { grid-template-columns: 1fr 1fr; } }
.about-image-wrap { position: relative; width: 100%; height: 26rem; order: -1; }
@media (min-width: 768px) { .about-image-wrap { order: 0; } }
.about-image-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.about-body { min-width: 0; }
.about-body p.about-text { margin-top: 24px; white-space: pre-line; color: var(--body-color); font-size: 1.125rem; line-height: 1.6; }
.about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 40px; }
.about-stat { background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow); border-radius: 16px; padding: 20px; }
.about-stat .stat-value { font-size: 1.875rem; font-weight: 700; color: var(--primary); }
.about-stat .stat-label { font-size: 12px; color: var(--muted-color); margin-top: 6px; line-height: 1.4; }

/* Testimonials */
.testimonials { width: 100%; margin: 0 auto; padding-block: var(--section-y); padding-inline: var(--section-x); max-width: var(--max-w); }
.testimonials h2 { text-align: center; }
.testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 64px; }
@media (min-width: 640px) { .testimonials-grid { grid-template-columns: repeat(3, 1fr); } }
.testimonial-card { background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow); border-radius: 24px; padding: 28px; min-width: 0; }
.testimonial-stars { display: flex; gap: 2px; margin-bottom: 16px; }
.testimonial-quote { color: var(--body-color); font-size: 14px; line-height: 1.6; }
.testimonial-name { margin-top: 20px; color: var(--heading-color); font-size: 14px; font-weight: 600; }
.testimonial-role { color: var(--primary); font-size: 12px; }

/* FAQ */
.faq { width: 100%; margin: 0 auto; padding-block: var(--section-y); padding-inline: var(--section-x); max-width: 48rem; }
.faq h2 { text-align: center; }
.faq-list { display: flex; flex-direction: column; gap: 16px; margin-top: 48px; }
.faq-item { background: var(--card-bg); border: var(--card-border); box-shadow: var(--card-shadow); border-radius: 20px; padding: 24px 28px; }
.faq-item summary { cursor: pointer; font-weight: 600; font-size: 1.0625rem; color: var(--heading-color); list-style: none; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item p { margin-top: 10px; color: var(--muted-color); font-size: 14px; line-height: 1.6; }

/* CTA */
.cta { width: 100%; padding: 48px 32px; background: #0a0b10; }
.cta-panel { position: relative; margin: 0 auto; overflow: hidden; text-align: center; max-width: 64rem; border-radius: 32px; padding: 80px 48px; background: var(--cta-panel-bg); box-shadow: 0 40px 90px -30px rgba(21,23,31,0.9), 0 0 0 1px rgba(255,255,255,0.06); }
.cta-glow { position: absolute; inset: 0; pointer-events: none; background: var(--cta-panel-glow); }
.cta-content { position: relative; }
.cta-content h2 { color: #fff; font-weight: 700; font-size: clamp(1.75rem, 4vw, 3rem); letter-spacing: -0.02em; line-height: 1.1; text-shadow: 0 2px 22px rgba(0,0,0,0.4); }
.cta-content p { margin: 20px auto 0; color: rgba(255,255,255,0.85); font-size: 1.125rem; max-width: 36rem; line-height: 1.6; }
.cta-btn { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; margin-top: 36px; padding: 16px 36px; border-radius: var(--btn-radius); color: #000; font-size: 14px; font-weight: 700; min-width: 13rem; background: linear-gradient(180deg, #ffffff 0%, #eef0f4 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), var(--cta-shadow); }

/* Footer */
.footer { width: 100%; padding: 64px 32px 40px; background: #0a0b0f; }
.footer-inner { margin: 0 auto; max-width: var(--max-w); }
.footer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
@media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(3, 1fr); } }
.footer-brand { max-width: 20rem; }
.footer-brand-row { display: flex; align-items: center; gap: 10px; }
.footer-logo-tile { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: var(--logo-tile-size); height: var(--logo-tile-size); border-radius: var(--logo-tile-radius); background: var(--logo-tile-bg); box-shadow: var(--logo-tile-shadow); }
.footer-logo-text { font-weight: 600; color: #fff; font-size: 1.125rem; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.footer-tagline { margin-top: 16px; color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.6; }
.footer-col-label { text-transform: uppercase; margin: 0 0 16px; font-size: 11px; letter-spacing: 0.18em; font-weight: 600; color: var(--eyebrow-color); }
.footer-contact { display: flex; flex-direction: column; gap: 12px; color: rgba(255,255,255,0.7); font-size: 14px; }
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-links a { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.55); font-size: 14px; text-decoration: none; }
.footer-links a .dot { flex-shrink: 0; width: 4px; height: 4px; border-radius: 9999px; background: var(--primary); }
.footer-bottom { margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.35); font-size: 12px; }
.footer-bottom .powered-by { opacity: 0.7; }
`.trim();
}

module.exports = { buildCss, resolveVars };
