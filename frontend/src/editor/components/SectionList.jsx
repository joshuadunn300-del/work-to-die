import { useState } from 'react';
import { Layers, GripVertical, ChevronUp, ChevronDown, Copy, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react';
import AddSectionMenu from './AddSectionMenu.jsx';

// Real Tenji labels the navbar section "Navigation" (verified live DOM text, section id
// stays "navbar" for content_json compatibility — this is a display-only relabel).
const DISPLAY_LABEL = { navbar: 'Navigation' };

// Native HTML5 drag-and-drop (same pattern as T4's Tracker kanban) — the ↑↓ buttons stay
// as the reliable/keyboard-accessible path, dragging is progressive enhancement matching
// designer.md's "drag handles" wording.
//
// Row layout + every exact value here (padding/radius/icons) verified via a live DOM/
// getComputedStyle probe of the real Tenji editor (tenji.ai/app/editor), 2026-07-21 — not
// the earlier screenshot-only pass. Real rows have NO persistent background (only a hover
// wash), lucide GripVertical/ChevronUp/ChevronDown/Copy/Trash2/Eye icons (not glyphs), and
// the move/duplicate/delete controls are hover-revealed exactly as before, just correctly
// iconified now.
export default function SectionList({ sections, onMove, onReorder, onDuplicate, onDelete, onToggleHidden, onEditBackground, onAddSection }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  return (
    <>
      <div className="section-list-header">
        <Layers size={14} className="section-list-header-icon" />
        <span>Sections</span>
        <AddSectionMenu onAdd={onAddSection} compact />
      </div>
      <ul className="section-list" data-testid="section-list">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`section-row${s.visible === false ? ' is-hidden' : ''}${overIndex === i ? ' drag-over' : ''}`}
            data-testid={`section-row-${s.id}`}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
            onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex != null && dragIndex !== i) onReorder(dragIndex, i);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
          >
            <span className="drag-handle" title="Drag to reorder"><GripVertical size={14} /></span>
            <span className="section-type">{DISPLAY_LABEL[s.type] || s.type}</span>
            <div className="section-controls-extra">
              <button type="button" title="Move up" disabled={i === 0} onClick={() => onMove(i, -1)}><ChevronUp size={14} /></button>
              <button type="button" title="Move down" disabled={i === sections.length - 1} onClick={() => onMove(i, 1)}><ChevronDown size={14} /></button>
              <button type="button" title="Duplicate" onClick={() => onDuplicate(i)}><Copy size={14} /></button>
              {s.type === 'hero' && (
                <button type="button" title="Change background image" onClick={() => onEditBackground(i)}><ImageIcon size={14} /></button>
              )}
              <button
                type="button"
                title="Delete"
                onClick={() => {
                  if (sections.length <= 1) return; // guard: never delete the last remaining section
                  onDelete(i);
                }}
                disabled={sections.length <= 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <button type="button" className="section-eye" title={s.visible === false ? 'Show' : 'Hide'} onClick={() => onToggleHidden(i)}>
              {s.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
