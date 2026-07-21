import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorState } from './state/useEditorState.js';
import { getAtPath } from './state/contentPath.js';
import RealPreviewFrame from './components/RealPreviewFrame.jsx';
import Toolbar from './components/Toolbar.jsx';
import SectionList from './components/SectionList.jsx';
import DesignPanel from './components/DesignPanel.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import SubmissionsPanel from './components/SubmissionsPanel.jsx';
import ElementInspector from './components/ElementInspector.jsx';
import sampleDoc from './fixtures/sample.content.json';
import './editor.css';

// URL: /app/designer?id={id} — corrected 2026-07-20 from the original /app/Designer?siteId=
// once UI-Reference recon confirmed the real route/param names (App.jsx registers both the
// lowercase real route and the capital-D form for in-flight links). Comment previously said
// "/app/editor" — that was never the actual registered route, fixed 2026-07-20 (T4 caught
// this while debugging the site-not-loading bug below). `siteId` kept as a fallback query
// param so any link already built against the old param during the parallel build still resolves.
function getSiteId() {
  if (typeof window === 'undefined') return 'local-preview';
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('siteId') || 'local-preview';
}

export default function Designer({ initialDoc = sampleDoc }) {
  const siteId = getSiteId();
  const navigate = useNavigate();
  const editor = useEditorState(siteId, initialDoc);
  const [device, setDevice] = useState('desktop');
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('design'); // Design tab is active by default per UI-Reference/designer.md
  // Full content_json path to the image field being edited (e.g. "sections.1.props.image"
  // for a hero, or "sections.3.props.images.0.src" for a gallery item) — generalized so
  // the SAME picker serves the hero's background trigger and any future Gallery/About
  // image trigger T2 adds, without hardcoding "which section type has an image."
  const [imageEditPath, setImageEditPath] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const imageUrlInputRef = useRef(null);

  // Switching tabs manually deselects (selection is a temporary overlay on whichever tab
  // was open, per designer.md: "Selecting an element ... opens the right inspector").
  const selectTab = useCallback((tab) => { setActiveTab(tab); setSelectedPath(null); }, []);

  // Two entry points into the same picker: the sidebar ▣ button on hero rows (always
  // available) and any in-preview "Click to change image" trigger T2 exposes via
  // data-image-path (hero's data-bg-path today; see INTEGRATION REQUEST in BUILD-LOG for
  // extending the same pattern to Gallery/About).
  const onEditBackground = useCallback((index) => setImageEditPath(`sections.${index}.props.image`), []);
  const onImageTrigger = useCallback((path) => setImageEditPath(path), []);
  const applyImageUrl = useCallback((url) => {
    // editMeta (not editText) — this edit originates outside the iframe, so unlike a live
    // contentEditable keystroke, the DOM doesn't already reflect it and needs a real re-render.
    if (imageEditPath) editor.editMeta(imageEditPath, url);
    setImageEditPath(null);
  }, [imageEditPath, editor]);

  // "Add a review" from the testimonials editor-note — appends a blank placeholder item.
  const onAddReview = useCallback((sectionIndex) => {
    const items = editor.doc.sections[sectionIndex]?.props?.items || [];
    editor.editMeta(`sections.${sectionIndex}.props.items.${items.length}`, { quote: 'New review — click to edit.', author: 'Customer Name' });
  }, [editor]);

  if (editor.loading) {
    return (
      <div className="designer-empty" data-testid="designer-loading">
        <p>Loading site…</p>
      </div>
    );
  }

  if (editor.loadError) {
    return (
      <div className="designer-empty" data-testid="designer-load-error">
        <p>Couldn't load this site: {editor.loadError}</p>
      </div>
    );
  }

  if (!editor.doc.sections || editor.doc.sections.length === 0) {
    return (
      <div className="designer-empty" data-testid="designer-empty">
        <p>This site has no sections.</p>
        <button type="button" onClick={() => editor.add('hero')}>Add a hero section to get started</button>
      </div>
    );
  }

  return (
    <div className="designer-root" data-testid="designer-root">
      <Toolbar
        siteName={editor.doc.siteName || editor.doc.sections?.[0]?.props?.logo || 'Untitled Site'}
        device={device} setDevice={setDevice}
        zoom={zoom} setZoom={setZoom}
        canUndo={editor.canUndo} canRedo={editor.canRedo}
        onUndo={editor.undo} onRedo={editor.redo}
        saveStatus={editor.saveStatus} saveError={editor.saveError} onSave={editor.save}
        published={editor.published} publishedUrl={editor.publishedUrl} publishError={editor.publishError}
        onPublish={editor.publish} onUnpublish={editor.unpublish} onRepublish={editor.republish}
        activeTab={activeTab} setActiveTab={selectTab}
        onBack={() => navigate('/app/sites')}
      />

      <div className="designer-body">
        <aside className="designer-sidebar">
          <SectionList
            sections={editor.doc.sections}
            onMove={editor.move}
            onReorder={editor.reorder}
            onDuplicate={editor.duplicate}
            onDelete={editor.remove}
            onToggleHidden={editor.toggleHidden}
            onEditBackground={onEditBackground}
            onAddSection={(type) => editor.add(type)}
          />
        </aside>

        <main className="designer-canvas">
          <RealPreviewFrame
            doc={editor.doc}
            renderVersion={editor.renderVersion}
            device={device}
            zoom={zoom}
            onEdit={editor.editText}
            onBgTrigger={onImageTrigger}
            onSelect={setSelectedPath}
            onDeselect={() => setSelectedPath(null)}
            onAddReview={onAddReview}
          />
        </main>

        {selectedPath ? (
          <ElementInspector
            path={selectedPath}
            style={editor.doc.elementStyles?.[selectedPath] || {}}
            onChange={(patch) => editor.editElementStyle(selectedPath, patch)}
            onClear={() => editor.clearElementStyle(selectedPath)}
            onDeselect={() => setSelectedPath(null)}
          />
        ) : (
          <>
            {activeTab === 'design' && (
              <DesignPanel theme={editor.doc.theme || {}} onChange={editor.editTheme} />
            )}
            {activeTab === 'settings' && (
              <SettingsPanel doc={editor.doc} onEditMeta={editor.editMeta} onEditSiteName={(v) => editor.editMeta('siteName', v)} />
            )}
            {activeTab === 'submissions' && <SubmissionsPanel siteId={siteId} />}
          </>
        )}
      </div>

      {imageEditPath != null && (
        <div className="bg-picker-overlay" data-testid="bg-picker" onClick={() => setImageEditPath(null)}>
          <div className="bg-picker" onClick={(e) => e.stopPropagation()}>
            <h4>Image URL</h4>
            <input
              ref={imageUrlInputRef}
              type="text"
              data-testid="hero-bg-url-input"
              placeholder="https://…"
              defaultValue={getAtPath(editor.doc, imageEditPath) || ''}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') applyImageUrl(e.currentTarget.value); }}
            />
            <div className="bg-picker-actions">
              <button type="button" onClick={() => applyImageUrl('')}>Clear</button>
              <button type="button" onClick={() => applyImageUrl(imageUrlInputRef.current.value)}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
