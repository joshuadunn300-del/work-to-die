import { X, RotateCcw, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const TEXT_COLOR_SWATCHES = ['#111827', '#ffffff', '#f2386f', '#9d174d', '#0284c7', '#16a34a'];
const FONTS = ['Site default (Inter)', 'Inter', 'Space Grotesk', 'Poppins', 'Montserrat', 'DM Sans', 'Playfair Display', 'Lora', 'Roboto Slab'];
const WEIGHTS = ['Reg', 'Med', 'Semi', 'Bold'];
const ALIGNS = [{ v: 'left', Icon: AlignLeft }, { v: 'center', Icon: AlignCenter }, { v: 'right', Icon: AlignRight }];
const SHADOWS = ['None', 'Soft', 'Strong'];

const SLIDERS = [
  { key: 'fontSize', label: 'Font Size', min: 10, max: 72, step: 1, unit: 'px' },
  { key: 'lineHeight', label: 'Line Height', min: 0.8, max: 2.4, step: 0.05, unit: '' },
  { key: 'letterSpacing', label: 'Letter Spacing', min: -2, max: 8, step: 0.5, unit: 'px' },
  { key: 'spacingAbove', label: 'Spacing Above', min: 0, max: 120, step: 4, unit: 'px' },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 5, unit: '%' },
];

function humanize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
}

// Derives a human label from a data-edit-path like "sections.1.props.items.0.title" → "Item 1 Title".
export function labelFromPath(path) {
  const parts = path.split('.').slice(3);
  if (parts.length === 1) return humanize(parts[0]);
  if (parts.length === 3 && /^\d+$/.test(parts[1])) {
    return `${humanize(parts[0]).replace(/s$/, '')} ${Number(parts[1]) + 1} ${humanize(parts[2])}`;
  }
  return parts.map(humanize).join(' ');
}

function AutoSlider({ label, unit, min, max, step, value, onChange, onReset }) {
  const isAuto = value == null;
  return (
    <div className="inspector-slider-row">
      <div className="inspector-slider-label">
        <span>{label}</span>
        <span className="inspector-slider-value">{isAuto ? 'AUTO' : `${value}${unit}`}</span>
      </div>
      <div className="inspector-slider-controls">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={isAuto ? (min + max) / 2 : value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {!isAuto && <button type="button" title="Reset to auto" onClick={onReset}><RotateCcw size={12} /></button>}
      </div>
    </div>
  );
}

export default function ElementInspector({ path, style = {}, onChange, onClear, onDeselect }) {
  const set = (key, value) => onChange({ [key]: value });
  const clear = (key) => onChange({ [key]: undefined });

  return (
    <div className="side-panel" data-testid="element-inspector">
      <div className="inspector-header">
        <span className="inspector-eyebrow">SELECTED</span>
        <div className="inspector-header-top">
          <h3>{labelFromPath(path)}</h3>
          <button type="button" className="inspector-close" title="Deselect" onClick={onDeselect}><X size={14} /></button>
        </div>
      </div>

      <label className="section-label">Text Colour</label>
      <div className="inspector-color-row">
        <button type="button" className={`inspector-default-btn${!style.color ? ' active' : ''}`} onClick={() => clear('color')}>Default</button>
        {TEXT_COLOR_SWATCHES.map((c) => (
          <button key={c} type="button" className="palette-dot" style={{ background: c }} onClick={() => set('color', c)} />
        ))}
        <input type="color" value={style.color || '#000000'} onChange={(e) => set('color', e.target.value)} />
      </div>

      <label>
        Font Family
        <select value={style.fontFamily || FONTS[0]} onChange={(e) => (e.target.value === FONTS[0] ? clear('fontFamily') : set('fontFamily', e.target.value))}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>

      {SLIDERS.map((s) => (
        <AutoSlider
          key={s.key}
          label={s.label.toUpperCase()}
          unit={s.unit}
          min={s.min}
          max={s.max}
          step={s.step}
          value={style[s.key]}
          onChange={(v) => set(s.key, v)}
          onReset={() => clear(s.key)}
        />
      ))}

      <label className="section-label">Font Weight</label>
      <div className="inspector-btn-group">
        {WEIGHTS.map((w) => (
          <button key={w} type="button" className={style.fontWeight === w ? 'active' : ''} onClick={() => set('fontWeight', w)}>{w}</button>
        ))}
      </div>

      <label className="section-label">Alignment</label>
      <div className="inspector-btn-group">
        {ALIGNS.map((a) => (
          <button key={a.v} type="button" className={style.align === a.v ? 'active' : ''} title={a.v} onClick={() => set('align', a.v)}>
            <a.Icon size={14} />
          </button>
        ))}
      </div>

      <label className="section-label">Shadow</label>
      <div className="inspector-btn-group">
        {SHADOWS.map((sh) => (
          <button key={sh} type="button" className={(style.shadow || 'None') === sh ? 'active' : ''} onClick={() => set('shadow', sh)}>{sh}</button>
        ))}
      </div>

      <button type="button" className="inspector-clear-all" onClick={onClear}>Clear all overrides</button>
    </div>
  );
}
