# imageLibrary

Curated, hand-verified stock photos so generated demo sites show real imagery
instead of gray placeholder boxes — the single biggest visual-quality lever.
Mirrors how Tenji hotlinks Unsplash photos + `i.pravatar.cc` avatars.

## How the generator / template store calls it

```js
import { getNicheImages, getAvatar } from '@/lib/imageLibrary';

const img = getNicheImages(lead.industry); // e.g. "plumbing" — case-insensitive
// img.hero      -> hero bgImage      (w=1600)
// img.about     -> about section img (w=900)
// img.services  -> [url, url, url]   (w=800) for services/gallery cards

// When assembling content_json:
heroSection.props.bgImage   = img.hero;
aboutSection.props.image    = img.about;
// gallery/service cards -> img.services[i]

// Testimonial faces (deterministic per reviewer index):
testimonials.forEach((t, i) => { t.avatar = getAvatar(i); }); // getAvatar(i, size=64)
```

Unknown / unlisted niches automatically fall back to the `GENERIC` set — the
function never returns undefined, so there is never a missing-image gray box.

## Licensing

All photos are **Unsplash License** (https://unsplash.com/license): free for
commercial use, no attribution required, no API key. Every URL is a direct
`images.unsplash.com/photo-...` hotlink (NOT `plus.unsplash.com` premium).
Avatars use `i.pravatar.cc` (generated faces, free hotlink, no key).

Each ID was verified HTTP 200 **and** visually checked for correct subject on
2026-07-20. Re-verify with a quick `curl -I` sweep if links ever 404 (Unsplash
IDs are stable but not contractually permanent).

## Adding a niche

Add an entry to `NICHES` in `imageLibrary.js`:

```js
'window-cleaning': {
  hero: '<photo-id>',        // used at w=1600
  about: '<photo-id>',       // used at w=900
  services: ['<id>', '<id>'] // 2-3, used at w=800
},
```

The photo id is the part after `photo-` in `images.unsplash.com/photo-<ID>`.
Before committing, verify each: it must return 200 **and** show the right
subject — don't invent IDs blindly.

```bash
curl -sI "https://images.unsplash.com/photo-<ID>?w=400" | head -1   # want: 200
```

Only use `images.unsplash.com/photo-...` (free). Never `plus.unsplash.com/premium_photo-...` (paid).
