const fs = require('fs');
const path = require('path');
const { compileToHtml } = require('./compile');
const { loadManifest, saveManifest } = require('./manifest');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function slugify(input) {
  return String(input || 'site')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'site';
}

function uniqueSlug(baseSlug, manifest, excludeSiteId) {
  let slug = baseSlug;
  let n = 2;
  while (manifest[slug] && manifest[slug].siteId !== excludeSiteId) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }
  return slug;
}

// TEMPORARY: real deploy is Base44 hosting / a nova.app subdomain per spec.
// Until Terminal 1's Base44 functions are live, this writes to local disk and
// serves via publish/server.js as a stand-in "preview URL". No public DNS/domain touched.
function publishSite({ siteId, contentJson, requestedSlug, leadEndpoint }) {
  if (!siteId) throw new Error('publishSite requires siteId');
  const manifest = loadManifest();

  // find existing slug for this site (republish) or mint a new one
  const existingEntry = Object.entries(manifest).find(([, v]) => v.siteId === siteId);
  const baseSlug = slugify(requestedSlug || (existingEntry ? existingEntry[0] : siteId));
  const slug = existingEntry ? existingEntry[0] : uniqueSlug(baseSlug, manifest, siteId);

  const html = compileToHtml(contentJson, { siteId, leadEndpoint: leadEndpoint || '/__lead' });
  const siteDir = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(siteDir, { recursive: true });
  fs.writeFileSync(path.join(siteDir, 'index.html'), html);

  manifest[slug] = {
    siteId,
    status: 'published',
    publishedAt: new Date().toISOString(),
    previewUrl: `/preview/${slug}/`,
  };
  saveManifest(manifest);
  return { slug, previewUrl: manifest[slug].previewUrl, status: 'published' };
}

function unpublishSite(slug) {
  const manifest = loadManifest();
  if (!manifest[slug]) throw new Error(`unpublishSite: unknown slug "${slug}"`);
  manifest[slug].status = 'unpublished';
  manifest[slug].unpublishedAt = new Date().toISOString();
  saveManifest(manifest);
  return manifest[slug];
}

// republish = re-run publishSite with the latest contentJson against the same slug
function republishSite({ siteId, contentJson, leadEndpoint }) {
  return publishSite({ siteId, contentJson, leadEndpoint });
}

function getPublishedEntry(slug) {
  const manifest = loadManifest();
  return manifest[slug] || null;
}

module.exports = { publishSite, unpublishSite, republishSite, getPublishedEntry, slugify };
