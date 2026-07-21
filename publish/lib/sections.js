const { escapeHtml, escapeAttr } = require('./escape');
const { renderIcon } = require('./icons');

function safeUrl(url) {
  const u = (url || '').trim();
  if (!u) return '#';
  if (/^javascript:/i.test(u)) return '#';
  return escapeAttr(u);
}

// links may be plain strings or {label,href} objects — matches the real content_json
// shape (frontend/src/sections/Navbar.jsx / Footer.jsx read both).
function linkParts(link) {
  const isString = typeof link === 'string';
  const label = isString ? link : link?.label || 'Link';
  const href = isString ? `#${link.toLowerCase().replace(/\s+/g, '-')}` : link?.href || '#';
  return { label, href };
}

function star() {
  return '<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--star-color)" stroke="var(--star-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
}

function renderNavbar(props) {
  const logo = escapeHtml(props.logo || 'Business');
  const links = Array.isArray(props.links) ? props.links : [];
  const linksHtml = links
    .map((l, i) => {
      const { label, href } = linkParts(l);
      const activeClass = i === 0 ? ' is-active' : '';
      return `<li><a class="navbar-link${activeClass}" href="${safeUrl(href)}">${escapeHtml(label)}</a></li>`;
    })
    .join('');
  const ctaLabel = props.ctaText || props.cta?.label;
  const ctaHref = props.cta?.href || '#';
  const cta = ctaLabel
    ? `<a class="btn-primary navbar-cta" href="${safeUrl(ctaHref)}">${escapeHtml(ctaLabel)}</a>`
    : '';
  const phone = props.phone ? `<div class="navbar-phone">${escapeHtml(props.phone)}</div>` : '';
  const logoIconSvg = renderIcon(props.logoIcon, { size: 18, color: '#fff', strokeWidth: 2 });

  return `
  <header class="navbar">
    <nav class="navbar-inner">
      <div class="navbar-brand">
        <div class="navbar-logo-tile">${logoIconSvg}</div>
        <span class="navbar-logo-text">${logo}</span>
      </div>
      <ul class="navbar-links">${linksHtml}</ul>
      <div class="navbar-actions">${phone}${cta}</div>
    </nav>
  </header>`;
}

function renderLeadForm(form, siteId) {
  const submitText = escapeHtml(form.buttonText || form.submitLabel || 'Get a Quote');
  const title = escapeHtml(form.title || 'Request a Quote');
  const microcopy = escapeHtml(form.microcopy || 'No obligation · Fast response');
  const fields = Array.isArray(form.fields) ? form.fields : [];
  const fieldsHtml = fields
    .map((field) => {
      const isObj = typeof field === 'object' && field !== null;
      const name = escapeAttr(isObj ? field.id || field.label : field);
      const label = escapeHtml(isObj ? field.label : field);
      const type = isObj ? field.type : 'text';
      if (type === 'select') {
        const options = (isObj && field.options) || [];
        const optsHtml = options.map((o) => `<option value="${escapeAttr(o)}">${escapeHtml(o)}</option>`).join('');
        return `<select name="${name}" required><option value="" disabled selected>${label}</option>${optsHtml}</select>`;
      }
      if (type === 'textarea') {
        return `<textarea name="${name}" placeholder="${escapeAttr(label)}" rows="3"></textarea>`;
      }
      const inputType = type === 'tel' || type === 'email' ? type : 'text';
      return `<input type="${inputType}" name="${name}" placeholder="${escapeAttr(label)}" />`;
    })
    .join('');

  return `
    <form class="hero-form" data-site-id="${escapeAttr(siteId || '')}" onsubmit="return NovaLead.submit(event, this)">
      <h3>${title}</h3>
      <div class="hero-form-fields">${fieldsHtml}</div>
      <button type="submit" class="btn-primary hero-form-submit">${submitText}</button>
      <p class="hero-form-microcopy lead-form-status" aria-live="polite">${microcopy}</p>
    </form>`;
}

function renderHero(props, siteId) {
  const headline = escapeHtml(props.headline || 'Your headline here');
  const sub = escapeHtml(props.subtext ?? props.subheadline ?? '');
  const eyebrow = props.eyebrow ? `<p class="hero-eyebrow">${escapeHtml(props.eyebrow)}</p>` : '';
  const ctaLabel = props.ctaText || props.cta?.label;
  const ctaHref = props.cta?.href || '#';
  const cta = ctaLabel
    ? `<a class="btn-primary hero-cta" href="${safeUrl(ctaHref)}">${escapeHtml(ctaLabel)}</a>`
    : '';
  const bg = props.bgImage || props.image;
  const bgHtml = bg
    ? `<div class="hero-bg" style="background-image:url('${safeUrl(bg)}')" aria-hidden="true"></div>
       <div class="hero-overlay" aria-hidden="true"></div>
       <div class="hero-radial" aria-hidden="true"></div>`
    : '';

  const rating = props.ratingText
    ? `<div class="hero-rating">
        <div class="hero-stars">${star().repeat(5)}</div>
        <span class="hero-rating-text">${escapeHtml(props.ratingText)}</span>
      </div>`
    : '';

  const badges = Array.isArray(props.trustBadges) && props.trustBadges.length
    ? `<div class="hero-badges">${props.trustBadges.map((b) => `<div class="hero-badge">${escapeHtml(b)}</div>`).join('')}</div>`
    : '';

  // Real template data has no `form.enabled` flag — a form is "on" simply by having
  // fields; `enabled: false` (or an empty/missing form) explicitly turns it off.
  const form = props.form;
  const formOn = !!form && form.enabled !== false && Array.isArray(form.fields) && form.fields.length > 0;
  const formHtml = formOn
    ? `<div class="hero-form-wrap">${renderLeadForm(form, siteId)}</div>`
    : '';

  return `
  <header class="hero">
    ${bgHtml}
    <div class="hero-inner${formOn ? ' has-form' : ''}">
      <div>
        ${eyebrow}
        <h1 class="hero-headline">${headline}</h1>
        ${sub ? `<p class="hero-sub">${sub}</p>` : ''}
        ${cta}
        ${rating}
        ${badges}
      </div>
      ${formHtml}
    </div>
  </header>`;
}

function renderServices(props) {
  const heading = escapeHtml(props.heading || props.title || 'Services');
  const subheading = props.subheading ? `<p class="section-subheading">${escapeHtml(props.subheading)}</p>` : '';
  const items = Array.isArray(props.items) ? props.items : [];
  const body = items.length
    ? `<div class="services-grid">${items
        .map((it) => {
          const desc = it?.desc ?? it?.description ?? '';
          const iconHtml = it?.icon
            ? `<div class="service-icon-tile">${renderIcon(it.icon, { size: 24, color: 'var(--primary)', strokeWidth: 2 })}</div>`
            : '';
          return `<div class="service-card">${iconHtml}<h3>${escapeHtml(it?.title || 'Service')}</h3><p>${escapeHtml(desc)}</p></div>`;
        })
        .join('')}</div>`
    : `<p class="section-empty">No services listed yet.</p>`;
  return `
  <section class="services">
    <div class="services-head"><h2 class="section-heading">${heading}</h2>${subheading}</div>
    ${body}
  </section>`;
}

function renderGallery(props) {
  const images = Array.isArray(props.images) ? props.images : [];
  const imgsHtml = images
    .map((img) => `<img loading="lazy" src="${safeUrl(img.src)}" alt="${escapeAttr(img.alt || '')}" />`)
    .join('');
  return `
  <section class="gallery">
    <div class="gallery-grid">${imgsHtml}</div>
  </section>`;
}

function renderAbout(props) {
  const heading = escapeHtml(props.heading || props.title || 'About Us');
  const body = escapeHtml(props.body || '');
  const image = props.image
    ? `<div class="about-image-wrap"><img loading="lazy" src="${safeUrl(props.image)}" alt="" /></div>`
    : '';
  const stats = Array.isArray(props.stats) ? props.stats : [];
  const statsHtml = stats.length
    ? `<div class="about-stats">${stats
        .map((s) => `<div class="about-stat"><p class="stat-value">${escapeHtml(s.value)}</p><p class="stat-label">${escapeHtml(s.label)}</p></div>`)
        .join('')}</div>`
    : '';
  return `
  <section class="about">
    ${image}
    <div class="about-body">
      <h2 class="section-heading">${heading}</h2>
      <p class="about-text">${body}</p>
      ${statsHtml}
    </div>
  </section>`;
}

function renderTestimonials(props) {
  const heading = escapeHtml(props.heading || props.title || 'What Our Customers Say');
  const items = Array.isArray(props.items) ? props.items : [];
  const body = items.length
    ? `<div class="testimonials-grid">${items
        .map((it) => {
          const author = it?.name ?? it?.author ?? 'Customer';
          const role = it?.role ? `<p class="testimonial-role">${escapeHtml(it.role)}</p>` : '';
          return `<div class="testimonial-card">
            <div class="testimonial-stars">${star().repeat(5)}</div>
            <p class="testimonial-quote">${escapeHtml(it?.quote || '')}</p>
            <p class="testimonial-name">${escapeHtml(author)}</p>
            ${role}
          </div>`;
        })
        .join('')}</div>`
    : `<p class="section-empty">No testimonials yet.</p>`;
  return `
  <section class="testimonials">
    <h2 class="section-heading">${heading}</h2>
    ${body}
  </section>`;
}

function renderFaq(props) {
  const heading = escapeHtml(props.heading || props.title || 'Frequently Asked Questions');
  const items = Array.isArray(props.items) ? props.items : [];
  const body = items.length
    ? `<div class="faq-list">${items
        .map((it) => {
          const q = it?.q ?? it?.question ?? 'Question';
          const a = it?.a ?? it?.answer ?? '';
          return `<div class="faq-item"><p class="faq-q">${escapeHtml(q)}</p><p>${escapeHtml(a)}</p></div>`;
        })
        .join('')}</div>`
    : `<p class="section-empty">No questions yet.</p>`;
  return `
  <section class="faq">
    <h2 class="section-heading">${heading}</h2>
    ${body}
  </section>`;
}

function renderCta(props) {
  const heading = escapeHtml(props.heading || props.headline || 'Ready to get started?');
  const sub = escapeHtml(props.subtext ?? props.subheadline ?? '');
  const btnLabel = props.buttonText || props.button?.label;
  const btnHref = props.button?.href || '#';
  const btn = btnLabel ? `<a class="cta-btn" href="${safeUrl(btnHref)}">${escapeHtml(btnLabel)}</a>` : '';
  return `
  <section class="cta">
    <div class="cta-panel">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="cta-content">
        <h2>${heading}</h2>
        ${sub ? `<p>${sub}</p>` : ''}
        ${btn}
      </div>
    </div>
  </section>`;
}

function renderFooter(props) {
  const logo = escapeHtml(props.logo || 'Business');
  const tagline = escapeHtml(props.tagline ?? props.text ?? '');
  const phone = props.phone ? `<div>${escapeHtml(props.phone)}</div>` : '';
  const email = props.email ? `<div>${escapeHtml(props.email)}</div>` : '';
  const contactCol =
    props.phone || props.email
      ? `<div><p class="footer-col-label">Get in touch</p><div class="footer-contact">${phone}${email}</div></div>`
      : '';
  const links = Array.isArray(props.links) ? props.links : [];
  const linksCol = links.length
    ? `<div><p class="footer-col-label">Explore</p><div class="footer-links">${links
        .map((l) => {
          const { label, href } = linkParts(l);
          return `<a href="${safeUrl(href)}"><span class="dot"></span>${escapeHtml(label)}</a>`;
        })
        .join('')}</div></div>`
    : '';
  const copyright = props.copyright ? escapeHtml(props.copyright) : '';
  const logoIconSvg = renderIcon(props.logoIcon, { size: 24, color: '#000', strokeWidth: 2 });

  return `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-brand-row">
            <div class="footer-logo-tile">${logoIconSvg}</div>
            <span class="footer-logo-text">${logo}</span>
          </div>
          ${tagline ? `<p class="footer-tagline">${tagline}</p>` : ''}
        </div>
        ${contactCol}
        ${linksCol}
      </div>
      <div class="footer-bottom">
        ${copyright ? `<span class="copyright">${copyright}</span> ` : ''}<span class="powered-by">&bull; Powered by Nova</span>
      </div>
    </div>
  </footer>`;
}

const RENDERERS = {
  navbar: renderNavbar,
  hero: renderHero,
  services: renderServices,
  gallery: renderGallery,
  about: renderAbout,
  testimonials: renderTestimonials,
  faq: renderFaq,
  cta: renderCta,
  footer: renderFooter,
};

module.exports = { RENDERERS, safeUrl };
