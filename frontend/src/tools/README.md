# Nova Tools (Terminal 5)

`ScriptGenerator.jsx` + `ProposalGenerator.jsx` — Pro/Agency-gated generator UIs.

- Reuses Terminal 4's `UpgradeGate` + `entitlements.js` for plan gating (don't
  duplicate — `canUseFeature(entitlements, 'scripts'|'proposals')` is the
  single source of truth for what's gated).
- `api.js` follows the same `window.base44`-live / mock-fallback convention as
  `../app/lib/api.js`. Swap the `live()` branch for the real Base44 SDK call
  once Terminal 1 logs `generateScript` as deployed.
- `fieldStyles.js` — shared input/card Tailwind classes so both forms match
  the app's dark-SaaS look (border-slate, focus:ring-indigo, rounded-lg cards).
- Components read `entitlements` from router `useOutletContext()` when nested
  under `AppShell` (matches `Proposals.jsx`'s pattern), and self-fetch via
  `getEntitlements()` otherwise — works standalone in the dev harness too.
- Optional `lead` prop prefills business name/niche when launched from a
  Lead/Client row (not yet wired to an actual button — see INTEGRATION
  REQUEST in BUILD-LOG).

## Dev harness
`../../tools-harness.html` (frontend project root) + `_dev/main.jsx` — mounts
both generators in a `MemoryRouter` so `useOutletContext` doesn't throw when
standalone.

**Gotcha:** don't give this harness its own `vite.config.js` with `root:`
pointed at a subdirectory — Tailwind v4's automatic content scan is scoped to
that root and silently drops classes used in files outside it (this bit us:
first pass rendered fully unstyled). Always serve dev harnesses through the
main Vite config (a root-level `*.html` entry, per Terminal 4's
`harness.html` pattern) so the whole `src/` tree gets scanned.

Run: `cd ~/nova/frontend && npm run dev`, open `/tools-harness.html`.
