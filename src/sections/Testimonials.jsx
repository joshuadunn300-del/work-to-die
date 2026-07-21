import { editableProps } from './editable.js'

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--star-color)" stroke="var(--star-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function Testimonials({ props = {}, path, editable = false }) {
  // `heading`/`name` are the real fields (lib/templates/_base.js); `title`/`author`
  // kept as back-compat reads for any older content_json still using them.
  const { heading, title, items = [] } = props
  const sectionTitle = heading || title || 'What Our Customers Say'

  return (
    <section
      className="w-full mx-auto"
      style={{ paddingBlock: 'var(--section-y)', paddingInline: 'var(--section-x)', maxWidth: 'var(--max-w)' }}
    >
      <h2
        className="text-center font-bold break-words"
        style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
        {...editableProps(editable, `${path}.${heading ? 'heading' : 'title'}`)}
      >
        {sectionTitle}
      </h2>
      {items.length === 0 ? (
        <p className="text-center mt-16" style={{ color: 'var(--muted-color)' }}>No testimonials yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: '64px' }}>
          {items.map((item, i) => {
            const author = item?.name ?? item?.author ?? 'Customer'
            const authorField = item?.name !== undefined ? 'name' : 'author'
            return (
              <div
                key={i}
                className="min-w-0"
                style={{
                  background: 'var(--card-bg)',
                  border: 'var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  // Real Tenji hardcodes 24px/28px here (verified against both real
                  // template HTML files) — see Services.jsx for the same fix + rationale.
                  borderRadius: '24px',
                  padding: '28px',
                }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} />)}
                </div>
                <p className="break-words" style={{ color: 'var(--body-color)', fontSize: '14px', lineHeight: 1.6 }}>
                  <span {...editableProps(editable, `${path}.items.${i}.quote`)}>{item?.quote || ''}</span>
                </p>
                <div className="mt-5">
                  <p style={{ color: 'var(--heading-color)', fontSize: '14px', fontWeight: 600 }}>
                    <span {...editableProps(editable, `${path}.items.${i}.${authorField}`)}>{author}</span>
                  </p>
                  {item?.role && (
                    <p style={{ color: 'var(--primary)', fontSize: '12px' }}>
                      <span {...editableProps(editable, `${path}.items.${i}.role`)}>{item.role}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
