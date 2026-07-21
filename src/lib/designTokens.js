// Tenji design tokens — extracted from tenji-bundle.css (SaaS app chrome) +
// tenji-*-template.html (generated marketing sites). Values are real, grepped
// from the recovered bundle — not guessed. See tenji-tokens.md for provenance.
//
// TWO palettes:
//   appChrome    = the Tenji SaaS editor UI (dark, pink accent, Space Grotesk)
//   generatedSite = the marketing pages Tenji renders for leads (light, brand
//                   color INJECTED per-site from theme.primary). Brand-neutral
//                   here; substitute `brand` at render time.

export const appChrome = {
  colors: {
    accent: '#f2386f',        // primary pink, = hsl(335 90% 56%); 13 uses in bundle
    accentBright: '#ff5c99',
    accentSoft: '#ff8fb0',
    accentPale: '#ffd1e0',
    accentDeep: '#db2777',
    pink500: '#ec4899',
    bg: '#08080c',            // near-black app background
    bgRaised: '#0a0b10',
    surface: '#181825',       // panel / card surface (dark)
    ringDefault: 'rgb(59 130 246 / .5)', // Tailwind default blue — NOT customized
    focusBorder: '#f2386f',   // border-[#F2386F]/60 on focus
  },
  // Exact shadcn/ui-convention CSS variables, pulled directly from Josh's real
  // Tenji bundle (2026-07-20) — raw "H S% L%" triplets, consumed as hsl(var(--x)).
  // Confirms + completes `colors` above (same palette, shadcn's own names, plus
  // the semantic roles — secondary/muted/border/input/ring/sidebar-* — that
  // weren't broken out individually before). Mirrored in index.css's `.dark`
  // block; see there for the actual usable CSS.
  css: {
    background: '240 20% 1%',
    foreground: '0 0% 100%',
    card: '240 14% 4%',
    primary: '335 90% 56%', // #F2386F
    secondary: '340 10% 8%',
    muted: '340 10% 8%',
    mutedForeground: '330 8% 60%',
    accent: '348 100% 78%',
    border: '335 15% 12%',
    input: '335 15% 12%',
    ring: '335 90% 56%',
    sidebar: {
      background: '240 14% 4%',
      foreground: '0 0% 100%',
      primary: '335 90% 50%',
      accent: '240 10% 8%',
      border: '240 10% 12%',
      ring: '335 90% 50%',
    },
  },
  fonts: {
    display: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif', // headings
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  radius: {
    base: '1rem',             // --radius
    lg: '0.75rem',            // calc(--radius - 2px) region, most-used util
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
    pill: '9999px',
  },
  // Pink "glow" elevation — the signature app-chrome look (hsl 335 90% 56% = accent)
  shadows: {
    glowFocus: '0 0 0 3px hsl(335 90% 56% / .18), 0 0 28px hsl(335 90% 56% / .22)',
    glowStrong: '0 0 18px 3px hsl(335 90% 56% / .7)',
    glowSoft: '0 0 12px hsl(335 90% 56% / .3)',
  },
};

export const generatedSite = {
  // Light-mode marketing page. `brand` is the per-site injected color
  // (e.g. plumbing #2563EB, catering #9d174d). Everything else is fixed.
  colors: {
    heading: '#111827',
    body: '#374151',
    muted: '#6b7280',
    subtle: '#9ca3af',
    pageBg: '#f7f7f9',
    sectionBgAlt: '#f4f5f8',
    surface: '#ffffff',
    inputBorder: '#e2e4ea',
    star: '#facc15',
    // dark hero/nav/footer overlays
    darkOverlay: 'rgba(8,9,14,0.92)',   // #08090e-ish, hero image scrim
    darkPanel: 'rgba(21,23,31,0.96)',   // #15171f = theme.secondary
  },
  fonts: {
    // Generated sites use theme.font (default "Inter"); no Space Grotesk here.
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  radius: {
    input: '10px',
    iconTileSm: '12px',
    iconTileLg: '16px',
    card: '16px',   // also 20px / 24px by nesting depth
    cardLg: '24px',
    pill: '9999px',
  },
  spacing: {
    sectionY: '112px',        // vertical section rhythm (padding:112px 32px)
    sectionX: '32px',
    maxWidth: '72rem',        // content container
    cardPad: '24px',          // 20 / 24px 28px / 28px by size
    gap: { xs: '6px', sm: '8px', md: '12px', lg: '24px', xl: '48px' },
  },
  type: {
    eyebrow: { size: '11px', weight: 600, transform: 'uppercase', letterSpacing: '0.18em' },
    headline: { size: '3rem', weight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    cardTitle: { size: '1.125rem', weight: 600, letterSpacing: '-0.01em' },
    body: { size: '14px', lineHeight: 1.6 },
    statNumber: { size: '1.875rem', weight: 700 },
  },
  // The reusable "gradient card" surface — used for every card/panel.
  card: {
    background: 'linear-gradient(165deg, #ffffff 0%, #f4f5f8 100%)',
    border: '1px solid rgba(17,18,28,0.07)',
    // last shadow layer tints with brand — swap rgba(37,99,235,…) for brand.
    shadow: '0 1px 0 rgba(255,255,255,0.95) inset, 0 22px 50px -22px rgba(17,18,28,0.22), 0 0 30px -14px rgba(BRAND,0.28)',
    radius: '20px',
    padding: '24px 28px',
  },
  input: {
    background: 'linear-gradient(180deg,#fbfbfd,#f4f5f8)',
    border: '1px solid #e2e4ea',
    radius: '10px',
    padding: '11px 14px',
    shadow: 'inset 0 1px 2px rgba(17,18,28,0.06)',
    focusTransition: 'border-color .18s ease, box-shadow .18s ease, background .18s ease',
  },
  // Primary CTA — pill, brand gradient, BLACK text, inset highlight + brand glow.
  ctaButton: {
    radius: '9999px',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#000',
    background: 'linear-gradient(180deg, rgba(BRAND,1) 0%, rgba(BRAND,0.82) 100%)',
    shadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 30px -6px rgba(BRAND,0.6), 0 2px 8px rgba(0,0,0,0.25)',
  },
  // Real values via getComputedStyle against a live tenji.ai generated site's nav CTA,
  // 2026-07-21 — a distinct, lighter shadow than the big ctaButton's (2-layer, not 3-layer).
  ctaButtonSmall: {
    radius: '9999px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#000',
    shadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 14px -2px rgba(BRAND,0.5)',
  },
  formButton: { radius: '10px', padding: '12px', fontWeight: 700, fontSize: '14px', color: '#000' },
  // Glass pill (trust badges over dark hero)
  glassBadge: {
    padding: '8px 14px',
    radius: '12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
  },
  iconTile: {
    size: '56px',
    radius: '16px',
    background: 'rgba(BRAND,0.12)', // tinted brand wash
  },
  // Brand-tinted small logo tile (36px) uses a brand gradient + inset highlight
  logoTile: {
    size: '36px',
    radius: '12px',
    background: 'linear-gradient(155deg, rgba(BRAND,0.95), rgba(BRAND,0.7))',
    shadow: '0 6px 16px -6px rgba(BRAND,0.6), inset 0 1px 0 rgba(255,255,255,0.45)',
  },
};

// Real brand colors observed in shipped Tenji theme blocks (theme.primary):
export const observedBrandColors = {
  plumbing: '#2563EB',  // blue
  catering: '#9d174d',  // deep rose  (note: this is a SITE brand, not app accent)
};

export default { appChrome, generatedSite, observedBrandColors };
