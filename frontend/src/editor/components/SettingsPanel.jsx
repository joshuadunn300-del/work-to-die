import { useRef, useState } from 'react';

const FIELD_TYPES = ['text', 'email', 'tel', 'select', 'textarea'];
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB — data-URL storage in content_json, keep it sane

export default function SettingsPanel({ doc, onEditMeta, onEditSiteName }) {
  const [newFieldOpen, setNewFieldOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const faviconInputRef = useRef(null);
  const socialImageInputRef = useRef(null);
  const quoteFields = doc.quoteFields || [{ type: 'text', label: 'Name', required: true }, { type: 'tel', label: 'Phone', required: true }, { type: 'textarea', label: 'Message', required: false }];

  function updateField(i, patch) {
    const next = quoteFields.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    onEditMeta('quoteFields', next);
  }
  function addField() {
    onEditMeta('quoteFields', [...quoteFields, { type: 'text', label: 'New field', required: false }]);
    setNewFieldOpen(false);
  }

  // Real client-side upload (FileReader → data URL stored in content_json) — no backend
  // needed for this; genuinely functional, not another disabled stub.
  function handleUpload(field, file) {
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please choose an image file.'); return; }
    if (file.size > MAX_UPLOAD_BYTES) { setUploadError('Image is too large (max 2MB).'); return; }
    const reader = new FileReader();
    reader.onload = () => onEditMeta(field, reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="side-panel" data-testid="settings-panel">
      <h3>Settings</h3>

      <label>
        Site Name
        <input type="text" value={doc.siteName || ''} onChange={(e) => onEditSiteName(e.target.value)} />
      </label>
      <p className="panel-note">Last saved {doc.lastSavedAt ? new Date(doc.lastSavedAt).toLocaleString() : 'not yet'}.</p>

      <label className="section-label-only">SEO &amp; Sharing</label>
      <label>
        Page title
        <input type="text" placeholder="Business Name — Trusted Local S…" value={doc.seo?.title || ''} onChange={(e) => onEditMeta('seo.title', e.target.value)} />
      </label>
      <label>
        Meta description
        <textarea placeholder="What this business does, for search results" value={doc.seo?.description || ''} onChange={(e) => onEditMeta('seo.description', e.target.value)} />
      </label>

      <label>
        Favicon
        <div className="upload-row">
          {doc.favicon && <img src={doc.favicon} alt="" className="upload-preview upload-preview-favicon" />}
          <button type="button" className="upload-btn" onClick={() => faviconInputRef.current.click()}>
            {doc.favicon ? 'Replace' : 'Upload'}
          </button>
          <input ref={faviconInputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload('favicon', e.target.files[0])} />
        </div>
      </label>
      <label>
        Social Share Image
        <div className="upload-row">
          {doc.socialImage && <img src={doc.socialImage} alt="" className="upload-preview" />}
          <button type="button" className="upload-btn" onClick={() => socialImageInputRef.current.click()}>
            {doc.socialImage ? 'Replace' : 'Upload'}
          </button>
          <input ref={socialImageInputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload('socialImage', e.target.files[0])} />
        </div>
      </label>
      {uploadError && <p className="upload-error">{uploadError}</p>}

      <label>
        Custom Domain
        <div className="inline-field">
          <input type="text" placeholder="yourclient.com" value={doc.domain || ''} onChange={(e) => onEditMeta('domain', e.target.value)} />
          <button type="button" disabled title="Domain purchase/DNS is out of scope — no domains purchased per hard constraint">Connect</button>
        </div>
        <span className="field-hint">Need a domain? Purchase one →</span>
      </label>

      <label className="section-label-only">Quote Form Fields</label>
      <div className="quote-fields-list">
        {quoteFields.map((f, i) => (
          <div key={i} className="quote-field-row">
            <select value={f.type} onChange={(e) => updateField(i, { type: e.target.value })}>
              {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} />
            <label className="required-toggle">
              <input type="checkbox" checked={!!f.required} onChange={(e) => updateField(i, { required: e.target.checked })} /> Required
            </label>
          </div>
        ))}
      </div>
      <button type="button" onClick={addField}>+ Add field</button>

      <div className="settings-footer-actions">
        <button type="button" disabled title="Site duplication is CRM/Terminal 4 territory — not wired here yet">Duplicate site</button>
        <button type="button" className="danger" disabled title="Site deletion is CRM/Terminal 4 territory — not wired here yet">Delete site</button>
      </div>
    </div>
  );
}
