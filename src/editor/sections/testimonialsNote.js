// designer.md: testimonials sections show an editor-only note ("These are editable
// placeholder reviews...") with Add-a-review / Paste-a-real-Google-review buttons. Injected
// as a plain DOM overlay onto T2's rendered `[data-section-index]` wrapper from OUR side —
// no changes to T2's Testimonials.jsx needed, matches the same non-invasive pattern as
// applyAllElementStyles (reset-then-reapply on every render, since a fresh render has no
// knowledge of editor-only overlays). Built with createElement/textContent throughout
// (no innerHTML) even though every string here is a static literal, never user input.
function buildNote(iframeDoc, onAdd) {
  const note = iframeDoc.createElement('div');
  note.className = 'nova-testimonials-note';

  const p = iframeDoc.createElement('p');
  p.textContent = 'These are editable placeholder reviews. Paste in real Google reviews from the Reviews panel on the right, or use the tiles below.';

  const actions = iframeDoc.createElement('div');
  actions.className = 'nova-testimonials-note-actions';

  const addBtn = iframeDoc.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+ Add a review';
  addBtn.addEventListener('click', onAdd);

  const pasteBtn = iframeDoc.createElement('button');
  pasteBtn.type = 'button';
  pasteBtn.textContent = 'Paste a real Google review';
  pasteBtn.disabled = true;
  pasteBtn.title = 'No Google Reviews integration wired yet';

  actions.appendChild(addBtn);
  actions.appendChild(pasteBtn);
  note.appendChild(p);
  note.appendChild(actions);
  return note;
}

export function injectTestimonialsNotes(iframeDoc, doc, onAddReview) {
  doc.sections.forEach((section, i) => {
    if (!section || section.type !== 'testimonials' || section.visible === false) return;
    const wrapper = iframeDoc.querySelector(`[data-section-index="${i}"]`);
    if (!wrapper) return;
    wrapper.style.position = 'relative';
    if (!wrapper.querySelector('.nova-testimonials-note')) {
      wrapper.insertBefore(buildNote(iframeDoc, () => onAddReview(i)), wrapper.firstChild);
    }
  });
}
