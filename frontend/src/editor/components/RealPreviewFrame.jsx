import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SiteRenderer from '../../renderer/SiteRenderer.jsx';
import { syncStylesIntoIframe } from '../sections/iframeStyles.js';
import { applyAllElementStyles } from '../state/elementStyles.js';
import { injectTestimonialsNotes } from '../sections/testimonialsNote.js';

const DEVICE_WIDTH = { desktop: '100%', tablet: '768px', mobile: '390px' };
const SHELL = '<!doctype html><html><head></head><body><div id="nova-site-root"></div></body></html>';

// Mounts T2's REAL <SiteRenderer editable /> (frontend/src/renderer + sections/*.jsx) inside
// the preview iframe via a second React root — not a lookalike. T2 built the `editable`
// prop natively (data-edit-path, data-section-index, data-bg-path/data-hero-bg-trigger)
// after reviewing this file's first draft, which used a hand-rolled DOM-selector map
// (editableSelectors.js, now deleted) to fake the same contract from outside their
// components. This version supersedes that one — see BUILD-LOG Terminal 3/2 for the story.
export default function RealPreviewFrame({ doc, renderVersion, device, zoom, onEdit, onBgTrigger, onSelect, onDeselect, onAddReview }) {
  const iframeRef = useRef(null);
  const rootRef = useRef(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  function renderTree() {
    if (!rootRef.current) return;
    // flushSync forces the commit synchronously — root.render() alone schedules through
    // React's own scheduler with no fixed delay, so a not-yet-committed tree was briefly
    // observed here (confirmed live before this fix landed).
    flushSync(() => rootRef.current.render(<SiteRenderer content={docRef.current} editable />));
    // A fresh render has no knowledge of per-element style overrides or the editor-only
    // testimonials note (both live outside T2's components) — reapply every time.
    applyAllElementStyles(iframeRef.current.contentDocument, docRef.current.elementStyles);
    injectTestimonialsNotes(iframeRef.current.contentDocument, docRef.current, onAddReview);
  }

  function handleLoad() {
    const iframeDoc = iframeRef.current.contentDocument;
    syncStylesIntoIframe(iframeDoc);
    const editableStyle = iframeDoc.createElement('style');
    editableStyle.textContent = `
      [contenteditable="true"] { cursor: text; }
      [contenteditable="true"]:hover { outline: 1px dashed rgba(59,130,246,0.6); outline-offset: 2px; }
      [contenteditable="true"]:focus, [data-edit-path].nova-selected {
        outline: 1px solid hsl(335 90% 56% / .6); outline-offset: 2px;
        box-shadow: 0 0 0 3px hsl(335 90% 56% / .18), 0 0 28px hsl(335 90% 56% / .22);
      }
      .nova-testimonials-note { background: rgba(242,56,111,0.08); border: 1px dashed rgba(242,56,111,0.4); border-radius: 8px; padding: 12px 16px; margin: 0 auto 20px; max-width: 640px; font-size: 13px; color: #9d174d; }
      .nova-testimonials-note p { margin: 0 0 10px; }
      .nova-testimonials-note-actions { display: flex; gap: 8px; }
      .nova-testimonials-note-actions button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(242,56,111,0.4); background: #fff; color: #9d174d; cursor: pointer; }
      .nova-testimonials-note-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    iframeDoc.head.appendChild(editableStyle);

    // ONE delegated listener each — T2's components already carry data-edit-path/
    // data-hero-bg-trigger on every relevant element, so no per-section DOM walking needed.
    iframeDoc.addEventListener('input', (e) => {
      const el = e.target.closest('[data-edit-path]');
      if (el) onEdit(el.getAttribute('data-edit-path'), el.innerText);
    });
    iframeDoc.addEventListener('click', (e) => {
      // data-hero-bg-trigger/data-bg-path is T2's existing hero pattern; data-image-trigger/
      // data-image-path is the SAME shape generalized for a future Gallery/About "click to
      // change image" trigger (see INTEGRATION REQUEST, BUILD-LOG Terminal 3) — wiring both
      // now means Gallery/About lights up with zero further changes here once T2 adds it.
      const trigger = e.target.closest('[data-hero-bg-trigger], [data-image-trigger]');
      if (trigger) {
        const host = e.target.closest('[data-bg-path], [data-image-path]');
        const path = host?.getAttribute('data-bg-path') || host?.getAttribute('data-image-path');
        if (path) onBgTrigger(path);
      } else if (!e.target.closest('[data-edit-path]')) {
        onDeselect();
      }
    });
    // Selecting an element for the style inspector is the SAME action as focusing it to
    // edit its text (designer.md: "Selecting an element outlines it in pink and opens the
    // right inspector") — focusin fires exactly on that click, no separate gesture needed.
    iframeDoc.addEventListener('focusin', (e) => {
      const el = e.target.closest('[data-edit-path]');
      if (el) onSelect(el.getAttribute('data-edit-path'));
    });

    rootRef.current = createRoot(iframeDoc.getElementById('nova-site-root'));
    renderTree();
  }

  // Re-render ONLY on renderVersion bumps (structural/theme/undo/redo), NOT on every doc
  // change — re-rendering a live-typed contentEditable text node on every keystroke resets
  // its caret-relative offset even when the new string matches what was just typed (the
  // classic React+contentEditable bug; confirmed live as character-reversed typed text
  // before this guard was added). Live text edits are already correct in the iframe's own
  // DOM the moment they happen — React doesn't need to touch it again until something
  // structural changes.
  useEffect(() => {
    if (rootRef.current) renderTree();
  }, [renderVersion]);

  // Per-element style overrides apply live, independent of renderVersion — setting inline
  // CSS properties never touches text content, so there's no caret-position risk the way
  // a full re-render has, and the user should see the slider/swatch effect immediately.
  useEffect(() => {
    if (rootRef.current && iframeRef.current?.contentDocument) {
      applyAllElementStyles(iframeRef.current.contentDocument, doc.elementStyles);
    }
  }, [doc.elementStyles]);

  useEffect(() => () => rootRef.current?.unmount(), []);

  return (
    <div className="preview-viewport" data-testid="preview-viewport">
      <div
        className="preview-scale"
        style={{ width: DEVICE_WIDTH[device] || DEVICE_WIDTH.desktop, transform: `scale(${zoom})`, transformOrigin: 'top center', margin: '0 auto', transition: 'width 0.15s ease' }}
      >
        <iframe
          ref={iframeRef}
          title="site-preview"
          data-testid="site-iframe"
          srcDoc={SHELL}
          onLoad={handleLoad}
          style={{ width: '100%', height: '2400px', border: '1px solid #2a2a33', background: '#fff' }}
        />
      </div>
    </div>
  );
}
