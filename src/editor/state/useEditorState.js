import { useCallback, useEffect, useMemo, useState } from 'react';
import { createHistory, push, undo, redo, canUndo, canRedo } from './history.js';
import { getAtPath, setAtPath } from './contentPath.js';
import { moveSection, reorderSection, duplicateSection, deleteSection, toggleVisible, addSection } from './sectionOps.js';
import { slugify } from './slug.js';

const STORAGE_PREFIX = 'nova.editor.doc.'; // TEMP: localStorage save fallback until Terminal 1's API is live.
// Confirmed live 2026-07-21: GET /api/functions/serveSite?subdomain=<slug> is a PUBLIC,
// unauthenticated endpoint (no api_key/session needed) that server-renders content_json
// straight from the GeneratedSite entity with correct `text/html` headers — verified in a
// real browser tab against a real published site, zero login. This is the actual mechanism
// a pitched prospect's link resolves through; see BUILD-LOG for the full before/after proof.
const BASE44_APP_URL = 'https://icy-nova-growth-lab.base44.app';

export function useEditorState(siteId, initialDoc) {
  const [hist, setHist] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_PREFIX + siteId) : null;
    return createHistory(saved ? JSON.parse(saved) : initialDoc);
  });
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saved | dirty
  const [published, setPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const doc = hist.present;
  // Bumps only on changes the iframe DOM doesn't already reflect itself (structural ops,
  // theme, undo/redo). Live text edits come FROM the iframe's own contenteditable input,
  // so re-rendering srcDoc for those would reload the iframe and wipe cursor position mid-keystroke.
  const [renderVersion, setRenderVersion] = useState(0);

  // BUG FIX (T4 found live, 2026-07-20): opening /app/designer?id=<real GeneratedSite id>
  // rendered the bundled sample fixture regardless of `id` — the constructor above only
  // ever checked localStorage for a previously-*saved* doc, so any real site with no local
  // save yet silently fell back to the demo. Fetch the real record on mount whenever no
  // local save exists for this id and Base44 is actually live (never in the standalone dev
  // harness, where `window.base44` doesn't exist — that path is untouched).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.base44 || siteId === 'local-preview') return undefined;
    if (window.localStorage.getItem(STORAGE_PREFIX + siteId)) return undefined; // local edits win over a stale server copy
    let cancelled = false;
    setLoading(true);
    window.base44.entities.GeneratedSite.get(siteId)
      .then((record) => {
        if (cancelled || !record?.content_json) return;
        setHist(createHistory(record.content_json));
        setRenderVersion((v) => v + 1);
        // BUG FIX (2026-07-21, T4 found live): `published` never reflected the real entity's
        // `status` — reopening an already-published site always showed the Publish button
        // instead of Unpublish/Republish, regardless of the actual backend state.
        setPublished(record.status === 'published');
        setPublishedUrl(record.content_json.publishedUrl || null);
      })
      .catch((err) => { if (!cancelled) setLoadError(err?.message || 'Failed to load this site.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [siteId]);

  const apply = useCallback((mutator, { rerender = true } = {}) => {
    setHist((h) => push(h, mutator(h.present)));
    setSaveStatus('dirty');
    if (rerender) setRenderVersion((v) => v + 1);
  }, []);

  const editText = useCallback((path, value) => {
    apply((d) => (getAtPath(d, path) === value ? d : setAtPath(d, path, value)), { rerender: false });
  }, [apply]);

  const editTheme = useCallback((key, value) => {
    apply((d) => setAtPath(d, `theme.${key}`, value));
  }, [apply]);

  // Generic setter for non-section metadata (SEO, domain) — not part of the spec's
  // content_json section schema, but the Settings tab needs somewhere to put it.
  const editMeta = useCallback((path, value) => {
    apply((d) => setAtPath(d, path, value));
  }, [apply]);

  // Per-element style overrides (content_json.elementStyles[editPath]) — rerender:false
  // because RealPreviewFrame applies these directly to the live DOM node itself the
  // instant they change (same live-preview pattern as text edits), no full re-render needed.
  // NOT built on setAtPath: `editPath` (e.g. "sections.1.props.headline") contains dots,
  // and setAtPath's dot-splitting would treat it as FOUR nested keys instead of one flat
  // object key — direct object spread instead.
  const editElementStyle = useCallback((editPath, patch) => {
    apply((d) => {
      const current = d.elementStyles || {};
      return { ...d, elementStyles: { ...current, [editPath]: { ...(current[editPath] || {}), ...patch } } };
    }, { rerender: false });
  }, [apply]);

  const clearElementStyle = useCallback((editPath) => {
    apply((d) => {
      const next = { ...(d.elementStyles || {}) };
      delete next[editPath];
      return { ...d, elementStyles: next };
    }, { rerender: false });
  }, [apply]);

  const move = useCallback((index, dir) => apply((d) => moveSection(d, index, dir)), [apply]);
  const reorder = useCallback((from, to) => apply((d) => reorderSection(d, from, to)), [apply]);
  const duplicate = useCallback((index) => apply((d) => duplicateSection(d, index)), [apply]);
  const remove = useCallback((index) => apply((d) => deleteSection(d, index)), [apply]);
  const toggleHidden = useCallback((index) => apply((d) => toggleVisible(d, index)), [apply]);
  const add = useCallback((type, atIndex) => apply((d) => addSection(d, type, atIndex)), [apply]);

  const doUndo = useCallback(() => { setHist((h) => undo(h)); setRenderVersion((v) => v + 1); }, []);
  const doRedo = useCallback(() => { setHist((h) => redo(h)); setRenderVersion((v) => v + 1); }, []);

  const save = useCallback(async () => {
    // Stamps lastSavedAt WITHOUT pushing an undo step — a save shouldn't consume an undo slot.
    const stamped = setAtPath(doc, 'lastSavedAt', Date.now());
    setSaveError(null);
    // BUG FIX (2026-07-21): this used to write to localStorage ONLY — a real GeneratedSite's
    // edits never reached the backend, so a reload (on another device, or once localStorage
    // is cleared) silently lost them. Now PATCHes the real entity when Base44 is live, same
    // `entities.<Entity>.update(id, patch)` shape T1 confirmed for every other entity and
    // used for generateSite's own GeneratedSite writes. localStorage stays as a fast local
    // cache/offline fallback either way, not the source of truth once live.
    if (typeof window !== 'undefined' && window.base44 && siteId !== 'local-preview') {
      try {
        await window.base44.entities.GeneratedSite.update(siteId, { content_json: stamped });
      } catch (err) {
        setSaveError(err?.message || 'Failed to save to the server — kept locally only.');
        window.localStorage.setItem(STORAGE_PREFIX + siteId, JSON.stringify(stamped));
        setHist((h) => ({ ...h, present: stamped }));
        return false; // don't claim "saved" if the backend write failed
      }
    }
    window.localStorage.setItem(STORAGE_PREFIX + siteId, JSON.stringify(stamped));
    setHist((h) => ({ ...h, present: stamped }));
    setSaveStatus('saved');
    return true;
  }, [siteId, doc]);

  // BUG FIX (2026-07-21, T4 found live, CRITICAL — blocked T5's exit test): Publish used
  // to only flip a LOCAL `published` boolean — the GeneratedSite entity's `status` stayed
  // "draft" forever and no `subdomain` was ever assigned, so there was no real servable URL
  // despite the UI showing a green "PUBLISHED" badge.
  //
  // REVISED (2026-07-21, per Josh's verify-gap report): the first fix used
  // `integrations.Core.UploadFile` to host a compiled static HTML file — that DID produce a
  // real public URL, but Base44 serves uploaded files as `application/octet-stream`
  // (confirmed live: `curl -D-` on the file_url), which makes browsers download the file
  // instead of rendering it — broken for a demo-pitch link. Investigated `serveSite`
  // (function #7) instead: confirmed live it's a PUBLIC, unauthenticated GET endpoint
  // (`/api/functions/serveSite?subdomain=<slug>`) that server-renders content_json directly
  // with correct `text/html` headers — published a real site, hit it from a fresh browser
  // tab with zero login, got the actual rendered page. That makes the compile+upload step
  // entirely unnecessary: serveSite already renders from content_json on every request, so
  // publishing now only needs to persist `status`/`subdomain` — no separate HTML artifact.
  const doPublish = useCallback(async () => {
    setPublishError(null);
    if (!(await save())) { setPublishError('Could not save — publish aborted.'); return; }
    if (typeof window === 'undefined' || !window.base44 || siteId === 'local-preview') {
      // Standalone dev harness / no backend: local-only flip, nothing real to persist.
      setPublished(true);
      return;
    }
    try {
      const siteName = doc.siteName || doc.sections?.[0]?.props?.logo || 'site';
      const slug = slugify(siteName, Date.now().toString(36));
      const url = `${BASE44_APP_URL}/api/functions/serveSite?subdomain=${slug}`;
      const stampedDoc = { ...doc, publishedUrl: url };
      await window.base44.entities.GeneratedSite.update(siteId, {
        status: 'published',
        subdomain: slug,
        published_at: new Date().toISOString(), // not in T1's declared schema (checked BUILD-LOG's field list) but harmless to include — MongoDB-backed entities tolerate extra fields, and the orchestrator asked for it explicitly
        content_json: stampedDoc,
      });
      setHist((h) => ({ ...h, present: stampedDoc }));
      setPublished(true);
      setPublishedUrl(url);
    } catch (err) {
      setPublishError(err?.message || 'Failed to publish — the site was saved but not published.');
    }
  }, [save, doc, siteId]);

  const unpublish = useCallback(async () => {
    setPublishError(null);
    if (typeof window !== 'undefined' && window.base44 && siteId !== 'local-preview') {
      try {
        await window.base44.entities.GeneratedSite.update(siteId, { status: 'draft' });
      } catch (err) {
        setPublishError(err?.message || 'Failed to unpublish on the server.');
        return; // don't flip local UI state if the backend write failed
      }
    }
    setPublished(false);
  }, [siteId]);

  // Republish re-runs the exact same compile+upload+persist path as a fresh publish (new
  // content, possibly a new file_url) — no separate code path to drift out of sync.
  const republish = doPublish;
  const publish = doPublish;

  return useMemo(() => ({
    doc, renderVersion, saveStatus, published, publishedUrl, loading, loadError, saveError, publishError,
    canUndo: canUndo(hist), canRedo: canRedo(hist),
    editText, editTheme, editMeta, editElementStyle, clearElementStyle, move, reorder, duplicate, remove, toggleHidden, add,
    undo: doUndo, redo: doRedo, save, publish, unpublish, republish,
  }), [doc, renderVersion, saveStatus, published, publishedUrl, loading, loadError, saveError, publishError, hist, editText, editTheme, editMeta, editElementStyle, clearElementStyle, move, reorder, duplicate, remove, toggleHidden, add, doUndo, doRedo, save, publish, unpublish, republish]);
}
