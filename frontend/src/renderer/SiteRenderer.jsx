import React from 'react';
import { resolveThemeVars } from './theme.js';
// Import all section components
import Navbar from '../sections/Navbar.jsx';
import Hero from '../sections/Hero.jsx';
import Services from '../sections/Services.jsx';
import Gallery from '../sections/Gallery.jsx';
import About from '../sections/About.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Faq from '../sections/Faq.jsx';
import Cta from '../sections/Cta.jsx';
import Footer from '../sections/Footer.jsx';

/**
 * Renders a Tenji-schema content_json object into a full page.
 * Unknown section types are skipped (not crashed on) so future section
 * types don't break older published sites.
 *
 * @param {object} content - Tenji-schema content_json (sections may live at
 *   `content.sections` or nested at `content.content.sections`)
 * @param {boolean} [editable] - when true, editable text nodes get
 *   `contentEditable` + `data-edit-path="sections.<i>.props.<field>"`, and each
 *   section root gets `data-section-id`/`data-section-index` — the contract the
 *   live editor's iframe bridge listens for (see editor/README.md).
 */

const sectionMap = {
  navbar: Navbar,
  hero: Hero,
  services: Services,
  gallery: Gallery,
  about: About,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  footer: Footer,
};

export default function SiteRenderer({ content, editable = false }) {
  // Handle both content.content.sections and direct content.sections
  const sections = content?.sections || content?.content?.sections || [];

  if (!sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No sections found. Add sections to your content JSON.
      </div>
    );
  }

  const { fontFamily, vars } = resolveThemeVars(content?.theme || content?.content?.theme);

  return (
    <div
      className="nova-site-render relative"
      style={{ ...vars, fontFamily, backgroundColor: 'var(--page-bg)', color: 'var(--body-color)' }}
    >
      {sections.map((section, index) => {
        if (!section || section.visible === false) return null;

        const Component = sectionMap[section.type];
        if (!Component) {
          if (import.meta.env.DEV) {
            console.warn(`SiteRenderer: unknown section type "${section?.type}", skipped.`);
          }
          return null;
        }

        const path = `sections.${index}.props`;

        if (!editable) {
          return <Component key={section.id ?? index} props={section.props || {}} />;
        }

        return (
          <div
            key={section.id ?? index}
            data-section-id={section.id ?? index}
            data-section-index={index}
          >
            <Component props={section.props || {}} path={path} editable />
          </div>
        );
      })}
    </div>
  );
}
