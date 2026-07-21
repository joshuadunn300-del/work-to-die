// Per-element style overrides live outside T2's section `props` schema (same pattern as
// `seo`/`domain`/`quoteFields`) in `content_json.elementStyles[path]`, keyed by the same
// `data-edit-path` string T2's `editableProps()` already puts on every editable element.
// Pure/framework-agnostic — applies as plain inline CSS onto a real DOM node.

const FONT_WEIGHT_MAP = { Reg: '400', Med: '500', Semi: '600', Bold: '700' };
const SHADOW_MAP = { Soft: '0 1px 3px rgba(0,0,0,0.25)', Strong: '0 3px 10px rgba(0,0,0,0.45)' };
export const MANAGED_STYLE_PROPS = ['color', 'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'textAlign', 'marginTop', 'opacity', 'textShadow'];

export function cssFromElementStyle(s = {}) {
  const out = {};
  if (s.color) out.color = s.color;
  if (s.fontFamily) out.fontFamily = s.fontFamily;
  if (s.fontSize != null) out.fontSize = `${s.fontSize}px`;
  if (s.lineHeight != null) out.lineHeight = String(s.lineHeight);
  if (s.letterSpacing != null) out.letterSpacing = `${s.letterSpacing}px`;
  if (s.fontWeight) out.fontWeight = FONT_WEIGHT_MAP[s.fontWeight] || s.fontWeight;
  if (s.align) out.textAlign = s.align;
  if (s.spacingAbove != null) out.marginTop = `${s.spacingAbove}px`;
  if (s.opacity != null) out.opacity = String(s.opacity / 100);
  if (s.shadow && s.shadow !== 'None') out.textShadow = SHADOW_MAP[s.shadow];
  return out;
}

// Resets every managed property first, THEN applies the override — otherwise a stale
// property from a previous selection (or a cleared field) would linger on the DOM node.
export function applyElementStyleToNode(el, styleObj) {
  MANAGED_STYLE_PROPS.forEach((k) => { el.style[k] = ''; });
  Object.assign(el.style, cssFromElementStyle(styleObj));
}

export function applyAllElementStyles(iframeDoc, elementStyles) {
  if (!elementStyles) return;
  Object.entries(elementStyles).forEach(([path, styleObj]) => {
    const el = iframeDoc.querySelector(`[data-edit-path="${path}"]`);
    if (el) applyElementStyleToNode(el, styleObj);
  });
}

function demo() {
  console.assert(cssFromElementStyle({ fontWeight: 'Bold' }).fontWeight === '700', 'weight map failed');
  console.assert(cssFromElementStyle({ opacity: 50 }).opacity === '0.5', 'opacity scale failed');
  console.assert(cssFromElementStyle({ shadow: 'None' }).textShadow === undefined, '"None" shadow must not set textShadow');
  console.assert(cssFromElementStyle({ shadow: 'Soft' }).textShadow.includes('rgba'), 'Soft shadow should set textShadow');
  console.assert(Object.keys(cssFromElementStyle({})).length === 0, 'empty style object should produce no CSS properties');
  console.log('elementStyles demo: OK');
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) demo();
