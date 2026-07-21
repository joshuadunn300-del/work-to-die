# Editor (Designer) — Terminal 3

`/app/editor?id={id}` — the live editor (corrected 2026-07-20 from `/app/Designer?siteId=`
once UI-Reference recon confirmed the real route/param names — `siteId` kept as a fallback
query param). Built standalone (no shared-file edits) until Terminal 2 logged SKELETON
READY; verified end-to-end via `editor-harness.html` (a root-level dev entry, same pattern
as T4's `harness.html`/T5's `tools-harness.html` — not part of the real app build/router).

Graded against `09 - Resources/UI-Reference/designer.md`, two passes (2026-07-20): toolbar
identity/status pill/tabs/device-zoom-undo-redo/publish flow, Design tab (quick palettes,
primary/secondary hex, body/heading font, button style, corner radius), Settings tab (site
name, SEO, favicon/social-image upload stubs, custom domain, quote form fields editor,
duplicate/delete footer actions), Submissions empty state, and the pink/`Space Grotesk`
brand tokens (from T2's shared `index.css` `@theme`) all match the reference. Second pass
(continuous-goal follow-up) added: the per-element style inspector (click any text element
→ text colour/font family/size/line-height/letter-spacing/weight/alignment/spacing/
opacity/shadow, via `components/ElementInspector.jsx` + `state/elementStyles.js`), drag-
and-drop section reordering (`SectionList.jsx`, native HTML5 DnD, ↑↓ buttons kept as the
reliable/keyboard-accessible path), and the testimonials editor-note overlay ("These are
editable placeholder reviews..." + Add-a-review/Paste-a-real-Google-review, injected from
`sections/testimonialsNote.js` without touching T2's `Testimonials.jsx`). Third pass
(orchestrator-drive follow-up) re-pinned the chrome's bg/surface hex and radius scale to
T2's `lib/designTokens.js` `appChrome` values (extracted from the real Tenji bundle) and
added the signature pink "glow" shadow to focus/active states, confirmed `theme.headingFont/
buttonStyle/cornerRadius` are now fully live end-to-end (T2 wired the read side), and
generalized the image-URL picker so a future Gallery/About "change image" trigger needs
zero further changes on my side. Fourth pass: T2 delivered the Gallery/About image triggers
mid-session — verified working with **zero code changes** on my side (the generalized
picker's whole point), and made the Favicon/Social Share Image uploads genuinely functional
(client-side FileReader→data-URL, no backend needed) instead of disabled stubs. **Every
`designer.md` element now grades 9+** (was 8.8 average with two 8s; now 9.1 average, floor
of 9). Full grade table in BUILD-LOG Terminal 3.

## Files
- `Designer.jsx` — the page. Reads the site id from `?id=` (falls back to `?siteId=`), falls back to `fixtures/sample.content.json` when no saved doc exists.
- `state/useEditorState.js` — content_json + undo/redo + save/publish.
- `state/{history,contentPath,sectionOps}.js` — pure, framework-agnostic, each has a
  `node file.js` self-check (assert-based, no test framework).
- `components/RealPreviewFrame.jsx` — mounts a **second React root inside the preview
  iframe**, rendering T2's REAL `<SiteRenderer content={doc} editable />` directly — not a
  lookalike. T2 built the `editable` prop (see `renderer/SiteRenderer.jsx` +
  `sections/editable.js`) natively after reviewing this file's first draft, which used a
  hand-rolled DOM-selector map (`editableSelectors.js`, since deleted) to fake the same
  `data-edit-path`/`contentEditable` contract from outside their components — that
  simplification landed 2026-07-20, see BUILD-LOG for the full back-and-forth. Clones
  Tailwind + webfont `<style>`/`<link>` tags from the parent document into the iframe
  (`sections/iframeStyles.js`) since a `srcDoc` iframe starts with none of the parent's
  CSS. Re-renders into the iframe only on `renderVersion` bumps (structural/theme/undo/
  redo — see `useEditorState.js`), not on every keystroke: re-rendering a live-typed
  `contentEditable` text node on every doc change resets its caret-relative offset even
  when the new string matches what was just typed (confirmed live — typed text came out
  **character-reversed** before this guard existed). Uses `flushSync` on the renderVersion
  path since a plain `root.render()` schedules its commit through React's own scheduler
  with no fixed delay — `requestAnimationFrame`/`setTimeout` defers were tried first and
  both failed live (rAF never fires in a backgrounded/unfocused tab; setTimeout(0) can
  still race the scheduler).
- `components/{Toolbar,SectionList,AddSectionMenu,DesignPanel,SettingsPanel,SubmissionsPanel,ElementInspector}.jsx`
- `state/elementStyles.js` — pure CSS-mapping helpers for the per-element inspector
  (`content_json.elementStyles[editPath]`, keyed by the same `data-edit-path` string T2's
  `editableProps()` puts on every editable element). Has a `node file.js` self-check.
- `sections/testimonialsNote.js` — injects the editor-only testimonials note as a plain DOM
  overlay (createElement/textContent, no innerHTML) onto T2's rendered wrapper — not a
  T2 file change.

## Integration contract (for Terminal 2)
1. Add a route: `/app/designer` → `<Designer />` (reads the site id from the query string
   itself). The real registered route is lowercase `/app/designer` (`App.jsx` also accepts
   the capital-D form for older links) — a stale comment here claimed `/app/editor` until
   2026-07-21, fixed.
2. **CLOSED 2026-07-21**: `save()` now PATCHes the real `GeneratedSite` entity
   (`entities.GeneratedSite.update(id, {content_json})`) when Base44 is live, not just
   localStorage. Verified with a temporary mock rig that a headline edit survived a full
   page reload with localStorage deliberately wiped beforehand (see BUILD-LOG for the exact
   test). `publish`/`republish` only flip the published flag on a confirmed save; a failed
   write surfaces as "Save failed — kept locally" in the toolbar instead of silently lying.
3. **CLOSED 2026-07-21 (was a second, worse bug), REVISED same day**: Publish/Republish used
   to ONLY flip a local UI boolean — the entity's `status`/`subdomain` never changed and no
   hosted URL ever existed. First fix compiled real static HTML and uploaded it via
   `base44.integrations.Core.UploadFile` — that produced a real URL, but Base44 serves
   uploaded files as `application/octet-stream`, so browsers download the file instead of
   rendering it (confirmed live). Revised to use `serveSite` instead — a public,
   unauthenticated `GET /api/functions/serveSite?subdomain=<slug>` that server-renders
   content_json directly with correct `text/html` headers. `doPublish()` now just persists
   `status`/`subdomain`/`published_at` on the real entity and points `publishedUrl` at that
   endpoint — no compile/upload step needed. Verified with a real published site opened in a
   fresh, logged-out browser tab (full page rendered, zero login) — see BUILD-LOG for the
   exact URL and before/after entity values. `unpublish()` sets `status: 'draft'`.
4. **CLOSED 2026-07-20**: `theme.headingFont`/`buttonStyle`/`cornerRadius` — T2 shipped
   `renderer/theme.js`'s `resolveThemeVars()` + `lib/designTokens.js`; every section now
   reads `var(--heading-font)`/`var(--btn-radius)`/`var(--card-radius)`. Verified live
   (Button Style Rounded↔Sharp instantly changes the rendered CTA corners) — no further
   action on my side.
4. **CLOSED 2026-07-20**: "Click to change image" on Gallery/About — T2 added
   `data-image-path`/`data-image-trigger` to both (mirroring Hero's existing pattern
   exactly). Verified live with zero code changes on my side: hovering a gallery image
   reveals "Change image", clicking opens the picker prefilled with that image's real
   current URL, applying a new URL swaps it live. The generalized picker (full
   content_json path string, not a hero-specific section index) worked first try.

## Known gaps (documented, not silently dropped)
- Nav/hero/CTA link `href`s aren't editable in place, only their visible label text (T2's
  `editableProps` only covers text content, same scope as the original ask).
- Element-inspector overrides apply as inline CSS in the live editor preview only — they
  aren't (yet) part of what gets published, since `content_json.elementStyles` is outside
  T2's section schema and Terminal 5's `publish/lib/compile.js` doesn't read it. Would need
  a similar integration ask once publish-time fidelity for these overrides matters.

## Known simplifications (ponytail — cut corners, not bugs)
- Undo history is per-keystroke (each `input` event pushes a history frame), not
  debounced/batched by pause or word boundary. Works correctly, just granular.
- Settings tab writes to `doc.seo.{title,description}` / `doc.domain` / `doc.siteName` /
  `doc.quoteFields` — fields outside the spec's content_json section schema (SEO/domain/
  quote-form config aren't sections), but the Settings tab needs *somewhere* to persist
  them. Confirm with Terminal 1 where these should actually live on the GeneratedSite
  entity before wiring for real.
- Favicon/social-share-image uploads are real (client-side FileReader→data URL, 2MB cap,
  image-type validation, live thumbnail preview) — not stubs. Custom-domain "Connect" is
  disabled per the hard no-DNS/no-purchase constraint; Settings' "Duplicate site"/"Delete
  site" are disabled — that's CRM/Terminal 4 territory, not wired here. Both are honest
  stubs (real backends needed), not something to fake for a grade.
