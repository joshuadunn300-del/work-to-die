# Nova — Terminal 1 Checkpoint (2026-07-20)

## searchLeads — LIVE, CONFIRMED WORKING
- Google Places API (New) Text Search, real key in Base44 Secrets (name: `GOOGLE_PLACES_API_KEY`)
- Real test: "plumbers" in "Sydney, Australia" → 2 real results, website_status + opportunity_score computed correctly
- Credits deducted 2454→2452 (matches actual result count, not requested limit)
- CreditTransaction + AuditLog rows both verified in Data view

## generateSite (AI/Claude path) — LIVE, CONFIRMED WORKING
- Calls real Anthropic API directly (api.anthropic.com/v1/messages), key in Base44 Secrets (name: `ANTHROPIC_API_KEY`)
- Model: `claude-haiku-4-5` (resolves to claude-haiku-4-5-20251001)
- Output schema matches the real recovered `tenji-plumbing-template.json` exactly: 8 sections (navbar/hero/services/about/testimonials/faq/cta/footer), theme{primary,secondary,font}, styles:{} on every section
- hero.bgImage / about.image overridden post-generation from the real `imageLibrary.js` niche mapping (replicated as a literal in the Deno function)
- Real test: "Bondi" plumbing/sydney → 200, 20 credits deducted (2452→2432), section-by-section verified against the real template file

## createSiteFromTemplate (free/non-AI path) — LIVE, CONFIRMED WORKING
- 0 credits (verified: 2432 unchanged)
- Real test: "Test Plumbing Co" plumbing/Melbourne → 200, all {{TOKENS}} replaced correctly

## Secrets set (names only)
- `GOOGLE_PLACES_API_KEY` — Base44 Secrets, used by searchLeads
- `ANTHROPIC_API_KEY` — Base44 Secrets, used by generateSite + generateScript

## App deploy state
- Published/Public — confirmed live at icy-nova-growth-lab.base44.app (was blocking all live calls with 403 not_deployed until fixed)

## BASE44_TOKEN for T5's headless exit test — UNRESOLVED, was mid-investigation
No service-role/app-level token confirmed yet. Two candidate paths, neither verified:
1. Ask Base44's own AI chat (question was being typed when compaction hit — unconfirmed if it sent) whether a service-role key exists under Security/Settings in the dashboard.
2. Fallback if no service-role key exists: create one verified test user, log in via `base44.auth.loginViaEmailPassword(email, password)` from a script, grab the real `access_token` from the response, hand that to T5 as `BASE44_TOKEN`. Note real SDK auth also supports `register()` + `verifyOtp()` if a fresh user is needed — may be able to bypass OTP by marking a user verified directly in the Users admin panel (unconfirmed, not yet tried).

Next action on resume: check Base44 chat tab for whether the pending question sent, get the answer, document the concrete steps + env var name for T5.
