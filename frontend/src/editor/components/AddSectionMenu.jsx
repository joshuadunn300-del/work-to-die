import { useState } from 'react';

const TYPES = ['navbar', 'hero', 'services', 'gallery', 'about', 'testimonials', 'faq', 'cta', 'footer'];

export default function AddSectionMenu({ onAdd, compact = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={compact ? 'add-section-menu add-section-menu-compact' : 'add-section-menu'}>
      <button type="button" data-testid="add-section-btn" title="Add section" onClick={() => setOpen((o) => !o)}>
        {compact ? '+' : '+ Add section'}
      </button>
      {open && (
        <div className="add-section-dropdown" data-testid="add-section-dropdown">
          {TYPES.map((t) => (
            <button key={t} type="button" onClick={() => { onAdd(t); setOpen(false); }}>{t}</button>
          ))}
        </div>
      )}
    </div>
  );
}
