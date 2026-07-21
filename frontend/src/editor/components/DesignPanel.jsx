const FONTS = ['Inter', 'Space Grotesk', 'Poppins', 'Montserrat', 'DM Sans', 'Playfair Display', 'Lora', 'Roboto Slab'];

const QUICK_PALETTES = [
  { name: 'Sunny', primary: '#f59e0b', secondary: '#78350f' },
  { name: 'Forest', primary: '#16a34a', secondary: '#14532d' },
  { name: 'Crimson', primary: '#dc2626', secondary: '#1f2937' },
  { name: 'Ocean', primary: '#0284c7', secondary: '#0c4a6e' },
  { name: 'Royal', primary: '#7c3aed', secondary: '#1e1b4b' },
  { name: 'Ember', primary: '#ea580c', secondary: '#292524' },
];

const BUTTON_STYLES = ['Rounded', 'Pill', 'Sharp'];
const CORNER_RADII = ['Sharp', 'Soft', 'Round'];

export default function DesignPanel({ theme, onChange }) {
  return (
    <div className="side-panel" data-testid="design-panel">
      <h3>Design</h3>

      {/* Matches live Tenji's default (nothing-selected) right-panel state —
          reference/tenji-editor.png: a hint box, then a "Brand" sub-header before
          the palette/color controls. */}
      <p className="design-panel-hint">
        Select an element on the canvas to edit it — or rebrand the whole site below.
      </p>
      <p className="design-panel-section-title">Brand</p>

      <div className="quick-palettes">
        <label className="section-label">Quick Palettes</label>
        <div className="palette-grid">
          {QUICK_PALETTES.map((p) => (
            <button
              key={p.name}
              type="button"
              className="palette-swatch"
              title={p.name}
              onClick={() => { onChange('primary', p.primary); onChange('secondary', p.secondary); }}
            >
              <span className="swatch-dots">
                <span style={{ background: p.primary }} />
                <span style={{ background: p.secondary }} />
              </span>
              <small>{p.name}</small>
            </button>
          ))}
        </div>
      </div>

      <label>
        Primary Accent
        <div className="color-with-hex">
          <input type="color" value={theme.primary || '#9D174D'} onChange={(e) => onChange('primary', e.target.value)} />
          <input type="text" value={theme.primary || '#9D174D'} onChange={(e) => onChange('primary', e.target.value)} />
        </div>
      </label>
      <label>
        Secondary Colour
        <div className="color-with-hex">
          <input type="color" value={theme.secondary || '#15171f'} onChange={(e) => onChange('secondary', e.target.value)} />
          <input type="text" value={theme.secondary || '#15171f'} onChange={(e) => onChange('secondary', e.target.value)} />
        </div>
      </label>
      <label>
        Body Font
        <select value={theme.font || 'Inter'} onChange={(e) => onChange('font', e.target.value)}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>
      <label>
        Heading Font
        {/* headingFont/buttonStyle/cornerRadius are stored but not yet consumed by T2's
            SiteRenderer (which only reads theme.primary/secondary/font) — see BUILD-LOG. */}
        <select value={theme.headingFont || theme.font || 'Inter'} onChange={(e) => onChange('headingFont', e.target.value)}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>
      <label>
        Button Style
        <select value={theme.buttonStyle || 'Rounded'} onChange={(e) => onChange('buttonStyle', e.target.value)}>
          {BUTTON_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label>
        Corner Radius
        <select value={theme.cornerRadius || 'Soft'} onChange={(e) => onChange('cornerRadius', e.target.value)}>
          {CORNER_RADII.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="field-hint">Applies to cards and panels across the whole site.</span>
      </label>
    </div>
  );
}
