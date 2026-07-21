const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { compileToHtml } = require('../lib/compile');

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (e) {
    console.error(`FAIL: ${name}\n  ${e.message}`);
    process.exitCode = 1;
  }
}

// Happy path: all 9 sections compile
test('plumber fixture compiles with all 9 section types', () => {
  const data = loadFixture('fixture-plumber.json');
  const html = compileToHtml(data, { siteId: data.site_id });
  ['navbar', 'hero', 'services', 'gallery', 'about', 'testimonials', 'faq', 'cta', 'footer']
    .forEach(type => assert(html.includes(`class="${type}"`) || html.includes(`class="${type} `), `missing section ${type}`));
  assert(html.includes('Rapid Flow Plumbing'));
  assert(html.includes('<style>'));
  assert(html.includes('NovaLead'));
  fs.writeFileSync(path.join(__dirname, 'out-plumber.html'), html);
});

// Adversarial: XSS must not appear unescaped
test('adversarial fixture escapes all injected script/attrs', () => {
  const data = loadFixture('fixture-adversarial.json');
  const html = compileToHtml(data, { siteId: data.site_id });
  assert(!html.includes('<script>alert'), 'raw <script>alert found — XSS not escaped');
  assert(!html.includes('<img src=x onerror=alert'), 'raw unescaped <img onerror> tag found — XSS not escaped');
  assert(!html.includes('onmouseover="alert'), 'raw onmouseover found — XSS not escaped');
  assert(!html.includes('href="javascript:alert'), 'javascript: URL not neutralized');
  assert(html.includes('&lt;script&gt;'), 'expected escaped script tag');
  fs.writeFileSync(path.join(__dirname, 'out-adversarial.html'), html);
});

// Missing/empty sections should not crash
test('empty items arrays render without crashing', () => {
  const data = loadFixture('fixture-adversarial.json');
  const html = compileToHtml(data);
  assert(html.includes('class="services"'), 'services section should still render its container');
  assert(html.includes('section-empty'), 'services section with empty items should render an empty-state message');
});

// Unknown section type should be skipped, not crash
test('unknown section type is skipped safely', () => {
  const data = loadFixture('fixture-adversarial.json');
  const html = compileToHtml(data);
  assert(html.includes('unknown section type'), 'expected comment marker for unknown type');
});

// Hidden section must not render
test('visible:false section is omitted', () => {
  const data = loadFixture('fixture-adversarial.json');
  const html = compileToHtml(data);
  assert(!html.includes('Hidden section should not render'));
});

// No content_json / malformed input should throw a clear error, not silently produce garbage
test('missing contentJson throws', () => {
  assert.throws(() => compileToHtml(null), /must be an object/);
});

// Bad theme color falls back to default instead of injecting into CSS
test('invalid theme color does not break CSS, falls back to default', () => {
  const data = loadFixture('fixture-adversarial.json');
  const html = compileToHtml(data);
  assert(html.includes('--primary: #9D174D'), 'expected fallback primary color');
  assert(!html.includes('not-a-color'), 'invalid color leaked into CSS');
  assert(!html.includes('display:none} /*'), 'CSS injection via font name leaked');
});

console.log('\nAll tests executed. Check output above for PASS/FAIL.');
