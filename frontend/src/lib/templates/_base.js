// Shared 8-section content_json builder for Nova's pre-built template path.
// Each niche file calls buildTemplate() with its own copy; the filler
// (../templateFiller.js) swaps the {{TOKENS}} for lead data.
//
// Tokens the filler replaces: {{BUSINESS_NAME}} {{PHONE}} {{LOCATION}}
// {{EMAIL}} {{BRAND_COLOR}} {{CTA}}. Hero/about images are BAKED IN here from
// imageLibrary by niche so bgImage is never empty on any path (frontend filler,
// Base44 backend, or a raw template read) — the filler may still override with
// the same/newer URL, which is harmless.
import { getNicheImages } from '../imageLibrary.js'

export function buildTemplate(cfg) {
  const img = getNicheImages(cfg.niche)
  return {
    niche: cfg.niche,
    version: 1,
    theme: { primary: '{{BRAND_COLOR}}', secondary: '#15171f', font: 'Inter' },
    sections: [
      {
        id: 'navbar',
        type: 'navbar',
        visible: true,
        props: {
          logo: '{{BUSINESS_NAME}}',
          links: cfg.navLinks || ['Home', 'Services', 'About', 'Reviews'],
          phone: '{{PHONE}}',
          ctaText: cfg.navCta || 'Get a Quote',
          logoIcon: cfg.logoIcon,
          styles: {},
        },
      },
      {
        id: 'hero',
        type: 'hero',
        visible: true,
        props: {
          bgImage: img.hero, // baked from imageLibrary(niche).hero — never empty
          eyebrow: cfg.hero.eyebrow,
          headline: cfg.hero.headline,
          subtext: cfg.hero.subtext,
          ctaText: '{{CTA}}',
          ratingText: cfg.hero.ratingText || 'From 2,000+ ratings',
          trustBadges: cfg.hero.trustBadges,
          form: {
            title: cfg.hero.formTitle,
            buttonText: cfg.hero.formButton || 'Get Help Now',
            fields: [
              { id: 'name', label: 'Your name', type: 'text', required: true },
              { id: 'phone', label: 'Phone number', type: 'tel', required: true },
              {
                id: 'service',
                label: 'What do you need?',
                type: 'select',
                required: false,
                options: [...cfg.hero.formOptions, 'Something else'],
              },
              { id: 'message', label: 'Tell us a bit more (optional)', type: 'textarea', required: false },
            ],
          },
          styles: {},
        },
      },
      {
        id: 'services',
        type: 'services',
        visible: true,
        props: {
          heading: cfg.services.heading,
          subheading: cfg.services.subheading,
          items: cfg.services.items,
          styles: {},
        },
      },
      {
        id: 'about',
        type: 'about',
        visible: true,
        props: {
          image: img.about, // baked from imageLibrary(niche).about — never empty
          heading: cfg.about.heading,
          body: cfg.about.body,
          stats: cfg.about.stats,
          styles: {},
        },
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        visible: true,
        props: {
          heading: cfg.testimonials.heading,
          items: cfg.testimonials.items,
          styles: {},
        },
      },
      {
        id: 'faq',
        type: 'faq',
        visible: true,
        props: {
          heading: 'Frequently asked questions',
          items: cfg.faq,
          styles: {},
        },
      },
      {
        id: 'cta',
        type: 'cta',
        visible: true,
        props: {
          heading: cfg.cta.heading,
          subtext: cfg.cta.subtext,
          buttonText: '{{CTA}}',
          styles: {},
        },
      },
      {
        id: 'footer',
        type: 'footer',
        visible: true,
        props: {
          logo: '{{BUSINESS_NAME}}',
          tagline: cfg.footerTagline,
          phone: '{{PHONE}}',
          email: '{{EMAIL}}',
          logoIcon: cfg.logoIcon,
          links: cfg.navLinks || ['Home', 'Services', 'About', 'Reviews'],
          copyright: '© 2026 {{BUSINESS_NAME}}. All rights reserved.',
          styles: {},
        },
      },
    ],
  }
}
