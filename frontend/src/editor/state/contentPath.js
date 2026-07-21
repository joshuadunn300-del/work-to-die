// Get/set nested values in content_json by dot/bracket path, e.g. "sections.2.props.headline".
export function getAtPath(obj, path) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
}

// Returns a NEW object with the value at path replaced (immutable update for undo/redo).
export function setAtPath(obj, path, value) {
  const keys = path.split('.');
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : { ...next };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

function demo() {
  const doc = { sections: [{ props: { headline: 'old' } }] };
  console.assert(getAtPath(doc, 'sections.0.props.headline') === 'old', 'get failed');
  const updated = setAtPath(doc, 'sections.0.props.headline', 'new');
  console.assert(updated.sections[0].props.headline === 'new', 'set failed');
  console.assert(doc.sections[0].props.headline === 'old', 'original mutated — immutability broken');
  console.assert(getAtPath(doc, 'sections.9.props.x') === undefined, 'out-of-range should be undefined, not throw');
  console.log('contentPath demo: OK');
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) demo();
