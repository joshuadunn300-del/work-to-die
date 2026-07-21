import { editableProps } from './editable.js'

export default function About({ props = {}, path, editable = false }) {
  // `heading` is the real field (lib/templates/_base.js); `title` kept as a
  // back-compat read for any older content_json still using it.
  const { heading, title, body = '', image, stats = [] } = props
  const sectionTitle = heading || title || 'About Us'

  return (
    <section
      className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center"
      style={{ paddingBlock: 'var(--section-y)', paddingInline: 'var(--section-x)', maxWidth: 'var(--max-w)', gap: '64px' }}
    >
      {(image || editable) && (
        <div
          className="relative w-full order-1 md:order-none group"
          data-image-path={editable ? `${path}.image` : undefined}
          style={{ height: '26rem' }}
        >
          {image && (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
              // Real Tenji hardcodes 24px on the hero image regardless of the Design
              // tab's corner-radius knob (see Services.jsx for the same fix + rationale).
              style={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            />
          )}
          {editable && (
            <button
              type="button"
              data-image-trigger
              className="absolute top-3 right-3 z-10 rounded-md border border-white/40 bg-black/55 px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Click to change image
            </button>
          )}
        </div>
      )}
      <div className="min-w-0">
        <h2
          className="font-bold break-words"
          style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
          {...editableProps(editable, `${path}.${heading ? 'heading' : 'title'}`)}
        >
          {sectionTitle}
        </h2>
        <p
          className="whitespace-pre-line break-words"
          style={{ marginTop: '24px', color: 'var(--body-color)', fontSize: '1.125rem', lineHeight: 1.6 }}
          {...editableProps(editable, `${path}.body`)}
        >
          {body}
        </p>
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4" style={{ marginTop: '40px' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--card-bg)',
                  border: 'var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <p style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted-color)', marginTop: '6px', lineHeight: 1.4 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
