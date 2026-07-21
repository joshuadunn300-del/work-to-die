import { editableProps } from './editable.js'

export default function Cta({ props = {}, path, editable = false }) {
  // `heading`/`subtext`/`buttonText` are the real fields (lib/templates/_base.js,
  // buttonText is a plain string); `headline`/`subheadline`/`button:{label,href}`
  // kept as back-compat reads for older content_json.
  const { heading, headline, subtext, subheadline, buttonText, button } = props
  const title = heading || headline || 'Ready to get started?'
  const sub = subtext ?? subheadline ?? ''
  const btnLabel = buttonText || button?.label
  const btnHref = button?.href || '#'

  return (
    <section className="w-full" style={{ padding: '48px 32px', background: '#0a0b10' }}>
      <div
        className="relative mx-auto overflow-hidden text-center"
        style={{
          maxWidth: '64rem',
          borderRadius: '32px',
          padding: '80px 48px',
          background: 'var(--cta-panel-bg)',
          boxShadow: '0 40px 90px -30px rgba(21,23,31,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--cta-panel-glow)' }} aria-hidden="true" />
        <div className="relative">
          <h2
            className="font-bold break-words"
            style={{
              fontFamily: 'var(--heading-font)',
              color: '#fff',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              textShadow: '0 2px 22px rgba(0,0,0,0.4)',
            }}
            {...editableProps(editable, `${path}.${heading ? 'heading' : 'headline'}`)}
          >
            {title}
          </h2>
          {sub && (
            <p
              className="mx-auto break-words"
              style={{ marginTop: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', maxWidth: '36rem', lineHeight: 1.6 }}
              {...editableProps(editable, `${path}.${subtext !== undefined ? 'subtext' : 'subheadline'}`)}
            >
              {sub}
            </p>
          )}
          {btnLabel && (
            <a
              href={btnHref}
              className="inline-flex items-center justify-center whitespace-nowrap"
              style={{
                marginTop: '36px',
                padding: '16px 36px',
                borderRadius: 'var(--btn-radius)',
                color: '#000',
                fontSize: '14px',
                fontWeight: 700,
                minWidth: '13rem',
                background: 'linear-gradient(180deg, #ffffff 0%, #eef0f4 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), var(--cta-shadow)',
              }}
              {...editableProps(editable, `${path}.${buttonText !== undefined ? 'buttonText' : 'button.label'}`)}
            >
              {btnLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
