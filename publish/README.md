# Nova Publish Pipeline

content_json → pure static HTML + inline CSS (no React/JS framework in the
output, matching Tenji). Owned by Terminal 5.

## Layout
- `lib/compile.js` — `compileToHtml(contentJson, opts)` → HTML string. `opts.siteId`, `opts.leadEndpoint`, `opts.title`.
- `lib/sections.js` — one renderer per section type (navbar, hero, services, gallery, about, testimonials, faq, cta, footer). Unknown types are skipped with an HTML comment, not a crash. All user text goes through `lib/escape.js`.
- `lib/css.js` — theme (primary/secondary/font) → inline `<style>` block, mobile-responsive.
- `lib/leadClient.js` — vanilla JS embedded in the page for the hero lead-capture form (fetch → `/__lead`, double-submit guard via button disable).
- `lib/publish.js` — `publishSite`/`unpublishSite`/`republishSite`, slug assignment + uniqueness, writes to `output/<slug>/index.html`.
- `lib/manifest.js` — `data/published.json`, slug → { siteId, status, publishedAt }.
- `server.js` — **temporary** local stand-in for Base44 hosting + the `/__lead` webhook. Serves `output/<slug>/` at `/preview/<slug>/`, accepts lead POSTs into `data/leads.json` (10s server-side dedupe by site+phone+email, 10KB body cap).

## Integration pending (see BUILD-LOG "Terminal 1")
- Real deploy target is Base44 hosting / a nova.app subdomain — `server.js`/`output/` is a placeholder until Terminal 1's backend is callable.
- `/__lead` should write to the site owner's Base44 `Lead` entity, not `data/leads.json`.
- Script/Proposal generator UIs (`frontend/src/tools/`) call `generateScript`/`getEntitlements`/Proposal entity create via placeholder `fetch` calls in `frontend/src/tools/api.js` — swap for the real Base44 SDK client once live, and wire the routes once Terminal 2 logs "SKELETON READY".

## Running
```
npm test    # compiler + e2e publish/lead/unpublish/republish checks
npm run serve   # preview server on :4173
```
