# Nova Frontend

Vite + React 19 + Tailwind v4 + react-router-dom v7.

## Run

```
npm install
npm run dev
```

Home page (`/`) links to fixture previews at `/preview/plumber`, `/preview/roofer`, `/preview/cleaner`.

## Renderer contract

`src/renderer/SiteRenderer.jsx` takes a `content` prop shaped like Tenji's `content_json`:

```json
{
  "version": 1,
  "theme": { "primary": "#9D174D", "secondary": "#15171f", "font": "Inter" },
  "sections": [
    { "id": "hero", "type": "hero", "visible": true, "props": { ... } }
  ]
}
```

- `theme` is optional; missing keys fall back to Tenji defaults (`#9D174D` / `#15171f` / `Inter`). Applied as CSS custom properties (`--primary`, `--secondary`) on the wrapper div, plus `fontFamily`. Sections read the vars via inline `style`.
- `sections` is rendered in array order — reordering the array reorders the page. No other layout logic; the editor (Terminal 3) owns reorder/duplicate/delete UI and just rewrites this array.
- `visible: false` skips a section entirely (not just hidden with CSS — unmounted).
- Unknown `type` values are skipped (not thrown) with a `console.warn` in dev only, so a published site never hard-crashes if a newer section type ships later.
- Each section component receives a single `props` object (`section.props`, defaulted to `{}`) — it is fully responsible for its own defaults/fallbacks for missing fields, empty arrays, and long text (truncate/break-words). See any file in `src/sections/` for the pattern.

### Section registry

`src/renderer/sectionRegistry.js` maps `type` string → component. All 9 Tenji section types are wired: `navbar`, `hero`, `services`, `gallery`, `about`, `testimonials`, `faq`, `cta`, `footer`. Hero supports either a `cta` button or a lead-capture `form` (mutually exclusive per Tenji's spec — form takes priority when `form.enabled`).

### Adding a new section type

1. Add `src/sections/YourSection.jsx` — export default function taking `{ props }`.
2. Register it in `sectionRegistry.js`.
3. Handle missing/empty `props` defensively — this renderer is used for both the live editor preview and the publish pipeline (Terminal 5), so it must never crash on partial/malformed content_json.

## Ownership / shared-file rule

Terminal 2 owns everything in this folder's shared files (`package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, routes) plus `src/sections/` and `src/renderer/`. Other terminals build standalone inside their own folders (`src/editor/`, `src/app/`, `src/tools/`) and post `INTEGRATION REQUEST:` entries in `BUILD-LOG.md` for anything that needs a shared-file change (new route, new dependency).

Current routes:
- `/` — fixture picker
- `/preview/:slug` — renders a fixture through `SiteRenderer`
- `/app/Designer` — reserved for Terminal 3 (Live Editor), placeholder until integrated
- `/app/*` — reserved for Terminal 4 (Dashboard & CRM), placeholder until integrated
