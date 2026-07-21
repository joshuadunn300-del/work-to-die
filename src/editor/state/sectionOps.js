// Pure section-array operations used by moves/duplicate/delete/hide/add. All immutable.
export function moveSection(doc, index, dir) {
  const target = index + dir;
  const sections = doc.sections;
  if (target < 0 || target >= sections.length) return doc; // no-op at edges
  const next = [...sections];
  [next[index], next[target]] = [next[target], next[index]];
  return { ...doc, sections: next };
}

// Arbitrary-position reorder (drag-and-drop) as ONE mutation — repeatedly calling
// moveSection would work too but costs N history/undo steps for a single drag instead of one.
export function reorderSection(doc, from, to) {
  if (from === to || from < 0 || to < 0 || from >= doc.sections.length || to >= doc.sections.length) return doc;
  const next = [...doc.sections];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return { ...doc, sections: next };
}

export function duplicateSection(doc, index) {
  const original = doc.sections[index];
  const copy = { ...original, id: `${original.id}-copy-${Date.now() % 100000}` };
  const next = [...doc.sections];
  next.splice(index + 1, 0, copy);
  return { ...doc, sections: next };
}

export function deleteSection(doc, index) {
  const next = doc.sections.filter((_, i) => i !== index);
  return { ...doc, sections: next };
}

export function toggleVisible(doc, index) {
  const next = doc.sections.map((s, i) => (i === index ? { ...s, visible: s.visible === false ? true : false } : s));
  return { ...doc, sections: next };
}

const BLANK_PROPS = {
  navbar: { logo: 'Brand', links: [] },
  hero: { headline: 'New Headline', subheadline: '', background: '#15171f', cta_label: 'Get Started', form: { fields: ['name', 'phone'] } },
  services: { title: 'Services', items: [] },
  gallery: { title: 'Gallery', images: [] },
  about: { title: 'About', body: '' },
  testimonials: { title: 'Testimonials', items: [] },
  faq: { title: 'FAQ', items: [] },
  cta: { headline: 'Ready to get started?', button_label: 'Contact Us' },
  footer: { text: '' },
};

export function addSection(doc, type, atIndex) {
  const section = { id: `${type}-${Date.now() % 100000}`, type, visible: true, props: BLANK_PROPS[type] || {} };
  const next = [...doc.sections];
  const insertAt = atIndex == null ? next.length : atIndex;
  next.splice(insertAt, 0, section);
  return { ...doc, sections: next };
}

function demo() {
  const doc = { sections: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
  console.assert(moveSection(doc, 0, -1).sections.map((s) => s.id).join() === 'a,b,c', 'move at top edge must no-op');
  console.assert(moveSection(doc, 0, 1).sections.map((s) => s.id).join() === 'b,a,c', 'move down failed');
  console.assert(reorderSection(doc, 0, 2).sections.map((s) => s.id).join() === 'b,c,a', 'reorder forward failed');
  console.assert(reorderSection(doc, 2, 0).sections.map((s) => s.id).join() === 'c,a,b', 'reorder backward failed');
  console.assert(reorderSection(doc, 1, 1).sections.map((s) => s.id).join() === 'a,b,c', 'no-op reorder should not mutate order');
  console.assert(duplicateSection(doc, 0).sections.length === 4, 'duplicate should add one');
  console.assert(deleteSection(doc, 1).sections.map((s) => s.id).join() === 'a,c', 'delete failed');
  console.assert(toggleVisible(doc, 0).sections[0].visible === false, 'hide failed');
  console.assert(toggleVisible(toggleVisible(doc, 0), 0).sections[0].visible === true, 'un-hide failed');
  console.assert(doc.sections.length === 3, 'original doc must not mutate');
  console.log('sectionOps demo: OK');
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) demo();
