// TEMPORARY, Terminal-5-only harness for the visual-gap comparison task —
// not part of the app build. Renders a filled Nova template through the
// real SiteRenderer (T2's file, imported not edited) so it can be
// screenshotted by Playwright and compared against Tenji's real recovered
// template HTML.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import SiteRenderer from '../../renderer/SiteRenderer.jsx';
import { getTemplate } from '../../lib/templates/index.js';
import { fillTemplate } from '../../lib/templateFiller.js';

const niche = new URLSearchParams(window.location.search).get('niche') || 'plumbing';

// No dedicated "catering" template exists in Nova's library yet (checked
// lib/templates/index.js — TEMPLATES has no catering entry, no alias either),
// so `niche=catering` resolves via normalizeNiche's fallback to the generic
// template. That's a deliberate stand-in for structural comparison purposes
// (same _base.js-built section shape as every other niche) — flagged as its
// own gap in the audit log, not hidden here.
const LEAD_DATA = {
  plumbing: {
    business_name: 'Riverside Plumbing Co',
    phone: '(555) 011-2234',
    location: 'Austin, TX',
    email: 'hello@riversideplumbing.example',
    brand_color: '#2563EB',
    cta: 'Get a Free Quote',
  },
  catering: {
    business_name: "Bella's Catering Co",
    phone: '(555) 044-7788',
    location: 'Austin, TX',
    email: 'hello@bellascatering.example',
    brand_color: '#9D174D',
    cta: 'Get a Free Quote',
  },
};

const filled = fillTemplate(getTemplate(niche), LEAD_DATA[niche] || LEAD_DATA.plumbing);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteRenderer content={filled} />
  </StrictMode>,
);
