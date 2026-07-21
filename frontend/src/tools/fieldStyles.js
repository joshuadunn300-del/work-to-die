// Shared input styling for tools/ forms — dojo/pink token system from
// Terminal 2's theme-token migration (frontend/src/index.css `@theme`), not
// hand-picked indigo/slate anymore. App chrome is permanently dark (T2's
// `class="dark"` fix), so one token per role replaces the old light/dark pair.
// Exact literal values from getComputedStyle against live tenji.ai/app/scripts
// (T5 PORTAL PARITY, 2026-07-21): input radius:12px/border:rgba(255,255,255,.08)/
// padding:12px 16px/height:46px; card radius:16px/border:rgba(255,255,255,.08)/padding:24px.
export const LABEL_CLASS = 'text-sm font-medium text-nova-text-muted';
export const FIELD_CLASS =
  'mt-1.5 w-full rounded-xl border border-white/[0.08] bg-nova-bg px-4 py-3 text-sm text-nova-text ' +
  'placeholder:text-nova-text-muted ' +
  'focus:outline-none focus:ring-2 focus:ring-nova-accent focus:border-nova-accent transition-colors';
export const CARD_CLASS =
  'rounded-2xl border border-white/[0.08] bg-nova-surface p-6 shadow-sm';
