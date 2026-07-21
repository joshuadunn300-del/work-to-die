const { escapeHtml, escapeAttr } = require('./escape');
const { RENDERERS, safeUrl } = require('./sections');
const { buildCss } = require('./css');
const { buildLeadClientScript } = require('./leadClient');

function findSection(sections, type) {
  return sections.find((s) => s && s.type === type && s.props);
}

function truncate(str, max) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max - 1).trimEnd() + '…';
}

function compileToHtml(contentJson, opts = {}) {
  if (!contentJson || typeof contentJson !== 'object') {
    throw new Error('compileToHtml: contentJson must be an object');
  }
  const theme = contentJson.theme || {};
  const sections = Array.isArray(contentJson.sections) ? contentJson.sections : [];
  const siteId = opts.siteId || contentJson.site_id || '';
  const leadEndpoint = opts.leadEndpoint || '/__lead';

  const navbar = findSection(sections, 'navbar');
  const hero = findSection(sections, 'hero');
  const about = findSection(sections, 'about');

  const siteName = navbar?.props?.logo || theme.siteTitle || 'Website';
  const headline = hero?.props?.headline || '';
  const title = escapeHtml(opts.title || theme.siteTitle || (headline ? `${siteName} | ${headline}` : siteName));
  const description = truncate(
    hero?.props?.subtext || hero?.props?.subheadline || about?.props?.body || '',
    160
  );
  const ogImage = hero?.props?.bgImage || hero?.props?.image || about?.props?.image || '';

  const bodyHtml = sections
    .filter((s) => s && s.visible !== false)
    .map((s) => {
      const renderer = RENDERERS[s.type];
      if (!renderer) {
        // unknown section type: skip rather than crash the whole page. escapeHtml
        // neutralizes < > so this can't inject a tag, but it doesn't touch "--",
        // which can prematurely close an HTML comment — strip it too so the comment
        // itself can't be broken out of regardless of escaper choice.
        const safeType = escapeHtml(s.type || 'undefined').replace(/--/g, '––');
        return `<!-- unknown section type: ${safeType} -->`;
      }
      const props = s.props || {};
      return s.type === 'hero' ? renderer(props, siteId) : renderer(props);
    })
    .join('\n');

  const hasLeadForm = sections.some(
    (s) =>
      s &&
      s.type === 'hero' &&
      s.props &&
      s.props.form &&
      s.props.form.enabled !== false &&
      Array.isArray(s.props.form.fields) &&
      s.props.form.fields.length > 0
  );

  const descTag = description ? `<meta name="description" content="${escapeAttr(description)}" />` : '';
  const ogTags = `
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
${description ? `<meta property="og:description" content="${escapeAttr(description)}" />` : ''}
${ogImage ? `<meta property="og:image" content="${safeUrl(ogImage)}" />` : ''}
<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />
<meta name="twitter:title" content="${title}" />
${description ? `<meta name="twitter:description" content="${escapeAttr(description)}" />` : ''}
${ogImage ? `<meta name="twitter:image" content="${safeUrl(ogImage)}" />` : ''}`.trim();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
${descTag}
${ogTags}
<style>${buildCss(theme)}</style>
</head>
<body>
${bodyHtml}
${hasLeadForm ? buildLeadClientScript(leadEndpoint) : ''}
</body>
</html>`;
}

module.exports = { compileToHtml };
