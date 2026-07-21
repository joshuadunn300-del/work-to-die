// Pure slug generator for the published subdomain field — no backend, no dependencies.
export function slugify(input, uniqueSuffix) {
  const base = String(input || 'site')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'site';
  return uniqueSuffix ? `${base}-${uniqueSuffix}` : base;
}

function demo() {
  console.assert(slugify("Ken Hall Plumbers") === 'ken-hall-plumbers', 'basic slugify failed');
  console.assert(slugify('') === 'site', 'empty input should fall back to "site"');
  console.assert(slugify('A!!!B') === 'a-b', 'special chars should collapse to single hyphen');
  console.assert(slugify('Ken Hall', 'ab12') === 'ken-hall-ab12', 'unique suffix should append');
  console.log('slug demo: OK');
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) demo();
