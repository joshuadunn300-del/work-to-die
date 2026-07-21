# Clone-Phase Exit Test

One repeatable, scripted proof of the whole product loop — the acceptance
test the clone phase must pass before Josh's adjustments phase starts (see
`BUILD-LOG.md` under Terminal 5 for the sign-off entries).

```
npm run exit-test
# or: node test/exit-test.js
```

**As of 2026-07-21 this runs fully live, 0 simulated steps.**

## What it proves, step by step

1. **Pull real Lead entities** — real Google Places data already in Base44 (from a prior real `searchLeads` run).
2. **Pick a lead**.
3. **Build a real `GeneratedSite`** — fetches the real seeded `SiteTemplate` for that niche and creates a real `GeneratedSite` entity from it.
4. **Edit + save** — mutates the headline and `PUT`s it back to Base44 — a genuine backend write.
5. **Publish** — `publish/lib/publish.js` compiles the real content_json to static HTML and serves it; also flips the `GeneratedSite.status` to `published` in Base44.
6. **Verify the published page is servable** and reflects the edit.
7. **Submit a lead** on the published page's `/__lead` endpoint.
8. **Verify the lead landed** in `data/leads.json`.
9. **Cleanup** — deletes the test `GeneratedSite` record from Base44 so repeated runs don't accumulate test data in production.

Every step logs `[PASS]`, `[SIM ]` (simulated), or `[FAIL]` with a one-line
reason. The script exits non-zero if anything fails.

## Auth

Set `BASE44_API_KEY` in `~/nova/.env` (gitignored, never commit/log the
value) per Josh's `~/nova/reference/nova-api-reference.md`:

```
BASE44_API_KEY=<key>              # required to run for real
BASE44_APP_ID=<app id>             # defaults to Nova's real app id
BASE44_API_BASE=<base url>         # defaults to https://icy-nova-growth-lab.base44.app/api
```

Without a key set, the script refuses to run (prints an error and exits
non-zero) rather than silently faking a pass with fixture data.

## Important discovery: `api_key` auths entities, not functions

Confirmed by direct testing (curl, 8+ header-name/placement variants tried):
the `api_key` header authenticates entity REST calls (`GET`/`POST`/`PUT`/`DELETE
/entities/{Entity}`) but **not** function invocation (`POST /functions/{name}`)
— every function call (`searchLeads`, `generateSite`, `getEntitlements`, etc.)
401s regardless of how the key is sent. Functions evidently require a real
logged-in user's session token, which `api_key` doesn't substitute for.

So steps 1 and 3 use real entity reads/writes instead of calling
`searchLeads`/`generateSite` directly — the **data is still genuinely real**
(actual Google Places leads and the actual seeded template already in Base44),
it's just not routed through the function endpoint. If a user-session token
becomes available for scripted use, swap `step1_getRealLeads`/
`step3_buildRealSite` back to `base44.callFunction('searchLeads', ...)` /
`callFunction('generateSite', ...)` — `base44Client.js`'s `callFunction` is
still there, unused but ready.

## Known simplification (flagged, not hidden)

Step 4 mutates the `content_json` object directly rather than driving
Terminal 3's real React editor in a browser (T3's `Save` persists to
`localStorage` only, and driving their UI headlessly would mean adding
Playwright against their owned component internals — out of scope here).
The Base44 write itself (the actual save) is real.

## Steps 5–8 are fully real, no simulation

Publish, serving the page, submitting a lead, and verifying it landed all
exercise the actual `publish/` pipeline — no mocks. The test cleans up after
itself both locally (`unpublishSite`) and in Base44 (deletes the test
`GeneratedSite`), so repeated runs don't accumulate artifacts anywhere.
