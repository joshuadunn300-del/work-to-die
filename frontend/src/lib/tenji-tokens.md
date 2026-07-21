# Tenji Design Tokens — extracted reference

Source of truth: `09 - Resources/tenji-templates/` (recovered bundle).
All values below were **grepped from the real files**, not guessed.

Two distinct design systems live in the bundle:

| System | Where it lives | Look |
|---|---|---|
| **APP CHROME** | `tenji-bundle.css` (Tailwind output for the SaaS editor UI) | Dark, **pink** accent, Space Grotesk headings |
| **GENERATED SITE** | `tenji-*-template.html` (fully **inline-styled**; brand color injected per-lead from `theme.primary`) | Light, brand-colored, Inter |

Key structural finding: the generated marketing pages do **not** use the Tailwind
utility classes from the bundle. They are 100% inline `style="..."` with the
site's brand color hard-substituted. So there are two separate token sets to match.

---

## 1. APP CHROME (the editor/dashboard UI)

### Colors
| Token | Value | Notes |
|---|---|---|
| accent (primary) | `#f2386f` | 13 uses — the real Tenji pink. = `hsl(335 90% 56%)` |
| accent bright | `#ff5c99` | gradient stop |
| accent soft | `#ff8fb0` | gradient stop (5 uses) |
| accent pale | `#ffd1e0` | gradient stop |
| accent deep | `#db2777` | |
| pink-500 | `#ec4899` | |
| bg | `#08080c` | near-black app background |
| bg raised | `#0a0b10` | |
| surface (dark panel) | `#181825` | |
| ring (default) | `rgb(59 130 246 / .5)` | Tailwind default blue — **left uncustomized** |
| focus border | `#f2386f` | `border-[#F2386F]/60:focus` |

Signature gradients (pink text/fills):
`linear-gradient(120deg,#fff 30%,#f2386f,#ff8fb0)` ·
`linear-gradient(120deg,#181825 30%,#f2386f,#ff5c99)`

### Typography
| Role | Family |
|---|---|
| display / headings | `"Space Grotesk", ui-sans-serif, system-ui, sans-serif` (`--font-display`) |
| body | `"Inter", ui-sans-serif, system-ui, sans-serif` (`--font-body`) |
| mono | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

### Radii
`--radius: 1rem` base. Utilities derive: `calc(--radius - 2px)`, `calc(--radius - 4px)`.
Most-used literal: `.75rem`. Pills: `9999px`.

### Shadows — the pink "glow" elevation
| Use | Value |
|---|---|
| focus glow | `0 0 0 3px hsl(335 90% 56% / .18), 0 0 28px hsl(335 90% 56% / .22)` |
| strong glow | `0 0 18px 3px hsl(335 90% 56% / .7)` |
| soft glow | `0 0 12px hsl(335 90% 56% / .3)` |

---

## 2. GENERATED SITE (the marketing pages)

Brand color is per-site (`theme.primary`). Observed real values:
`#2563EB` (plumbing, blue) · `#9d174d` (catering, deep rose). Everything else fixed.
In the tables below **BRAND** = the injected color (as `rgba(r,g,b,a)`).

### Colors (fixed)
| Token | Value | Where |
|---|---|---|
| heading | `#111827` | all headings/titles |
| body | `#374151` | paragraph text |
| muted | `#6b7280` | captions, sublabels |
| subtle | `#9ca3af` | |
| page bg | `#f7f7f9` | section backgrounds |
| section bg alt | `#f4f5f8` / `#eef0f4` | |
| surface | `#ffffff` | |
| input border | `#e2e4ea` | |
| star | `#facc15` | rating stars |
| dark hero scrim | `rgba(8,9,14,0.92)` (#08090e) | hero image overlay |
| dark panel | `rgba(21,23,31,0.96)` = `#15171f` | = theme.secondary; nav/footer |

### Typography (Inter; theme.font)
| Role | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| eyebrow | 11px | 600 | `0.18em` uppercase | — |
| headline | 3rem | 700 | `-0.02em` | 1.1 |
| card title | 1.125rem | 600 | `-0.01em` | — |
| body | 14px | 400 | — | 1.6 |
| stat number | 1.875rem | 700 | — | — |

### Spacing / rhythm
| Token | Value |
|---|---|
| section vertical | `112px` (`padding:112px 32px`) — the section rhythm |
| section horizontal | `32px` |
| content max-width | `72rem` |
| card padding | `20px` → `24px 28px` → `28px` (by size) |
| gaps | 6 / 8 / 12 / 24 / 48px |

### Radii
input `10px` · icon-tile-sm `12px` · icon-tile-lg / card `16px` · card mid `20px` · card lg `24px` · pill `9999px`

### Component signatures (the exact recipes)

**Card / panel** (the single most reused surface):
```
background: linear-gradient(165deg, #ffffff 0%, #f4f5f8 100%);
border: 1px solid rgba(17,18,28,0.07);
box-shadow: 0 1px 0 rgba(255,255,255,0.95) inset,
            0 22px 50px -22px rgba(17,18,28,0.22),
            0 0 30px -14px rgba(BRAND,0.28);   /* last layer = brand tint */
border-radius: 16–24px; padding: 20–28px;
```

**Primary CTA button** — pill, brand gradient, **black text**, inset highlight + brand glow:
```
padding:14px 28px; border-radius:9999px; font-weight:700; font-size:14px; color:#000;
background: linear-gradient(180deg, rgba(BRAND,1) 0%, rgba(BRAND,0.82) 100%);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.55),
            0 10px 30px -6px rgba(BRAND,0.6),
            0 2px 8px rgba(0,0,0,0.25);
```
Small pill CTA: `padding:6px 16px; radius:9999px; 13px/600; color:#000`.
Form submit: `radius:10px; padding:12px; 700/14px; color:#000`.

**Input:**
```
padding:11px 14px; border-radius:10px; border:1px solid #e2e4ea;
background:linear-gradient(180deg,#fbfbfd,#f4f5f8);
box-shadow:inset 0 1px 2px rgba(17,18,28,0.06);
transition:border-color .18s, box-shadow .18s, background .18s;
```

**Icon tile** (feature icons): `56×56, radius 16, background: rgba(BRAND,0.12)`.
**Logo tile** (small brand mark): `36×36, radius 12, background: linear-gradient(155deg, rgba(BRAND,0.95), rgba(BRAND,0.7)); box-shadow:0 6px 16px -6px rgba(BRAND,0.6), inset 0 1px 0 rgba(255,255,255,0.45)`.

**Glass badge** (trust pills over dark hero):
```
padding:8px 14px; border-radius:12px; color:#fff;
background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
backdrop-filter:blur(8px);
```

**Eyebrow label:** `11px; uppercase; letter-spacing:0.18em; weight 600; color:rgba(BRAND,0.85)`.

**Nav pill (on dark):** `padding:6px 12px; radius:9999px; color:rgba(255,255,255,0.72)`.

**Dark hero overlay:** `linear-gradient(105deg, rgba(8,9,14,0.92) 0%, … 0.28 100%)` over bg image;
secondary tint variant `linear-gradient(160deg, rgba(21,23,31,0.96) 0%, … rgba(BRAND,0.72) 100%)`.

---

## 3. DIVERGENCE vs Nova's current "dojo" theme  (for T2 to reconcile)

| Aspect | Nova dojo assumed | Tenji real | Verdict |
|---|---|---|---|
| Heading font | Space Grotesk | Space Grotesk (`--font-display`) | ✅ MATCH — keep |
| Body font | (Inter?) | Inter (`--font-body`) | ✅ use Inter |
| **App accent pink** | `#9D174D` / `#FF3D8A` | **`#f2386f`** (`hsl 335 90% 56%`) | ❌ **CHANGE** — real accent is brighter magenta-pink `#f2386f`, not `#9D174D` |
| `#9D174D` | (assumed as accent) | actually a **generated-site** brand color (catering) | reclassify — it's a site brand, not the app accent |
| `#FF3D8A` | assumed | closest real stop is `#ff5c99` | near, but use `#ff5c99` |
| Base radius | ? | `1rem` (`--radius`), pills `9999px` | set base = 1rem |
| Elevation | ? | pink **glow** shadows on `hsl(335 90% 56%)` | adopt glow recipe |

**Action for T2:** import `designTokens.js`, set the dojo/app accent to `#f2386f`
(and its `hsl(335 90% 56%)` glow family), keep Space Grotesk + Inter, base radius 1rem.
For rendered sites, drive everything off `generatedSite` tokens with the lead's
brand color substituted for `BRAND`.
