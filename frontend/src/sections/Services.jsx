import { editableProps } from './editable.js'
import { NovaIcon } from './icons.jsx'

export default function Services({ props = {}, path, editable = false }) {
  // `heading` is the real field (lib/templates/_base.js); `title` kept as a
  // back-compat read for any older content_json still using it.
  const { heading, title, subheading, items = [] } = props
  const sectionTitle = heading || title || 'Services'

  return (
    <section
      className="w-full mx-auto"
      style={{ paddingBlock: 'var(--section-y)', paddingInline: 'var(--section-x)', maxWidth: 'var(--max-w)' }}
    >
      <div className="text-center mx-auto" style={{ maxWidth: '42rem' }}>
        <h2
          className="font-bold break-words"
          style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
          {...editableProps(editable, `${path}.${heading ? 'heading' : 'title'}`)}
        >
          {sectionTitle}
        </h2>
        {subheading && (
          <p className="mt-5" style={{ color: 'var(--muted-color)', fontSize: '1.125rem', lineHeight: 1.6 }}>
            {subheading}
          </p>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-center mt-16" style={{ color: 'var(--muted-color)' }}>No services listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: '64px' }}>
          {items.map((item, i) => {
            const desc = item?.desc ?? item?.description ?? ''
            return (
              <div
                key={i}
                className="min-w-0"
                style={{
                  background: 'var(--card-bg)',
                  border: 'var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  // Real Tenji hardcodes 24px/28px here regardless of the Design tab's
                  // corner-radius knob (verified against both tenji-plumbing-template.html
                  // and tenji-catering-template.html) — --card-radius/--card-pad default to
                  // 20px/"24px 28px" which is only correct for FAQ cards, not these.
                  borderRadius: '24px',
                  padding: '28px',
                }}
              >
                {item?.icon && (
                  <div
                    className="flex items-center justify-center mb-6"
                    style={{
                      width: 'var(--icon-tile-size)',
                      height: 'var(--icon-tile-size)',
                      borderRadius: 'var(--icon-tile-radius)',
                      background: 'var(--icon-tile-bg)',
                    }}
                  >
                    <NovaIcon name={item.icon} size={24} color="var(--primary)" strokeWidth={2} />
                  </div>
                )}
                <h3
                  className="font-semibold break-words"
                  style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: '1.125rem', letterSpacing: '-0.01em' }}
                  {...editableProps(editable, `${path}.items.${i}.title`)}
                >
                  {item?.title || 'Service'}
                </h3>
                <p
                  className="mt-2.5 break-words"
                  style={{ color: 'var(--muted-color)', fontSize: '14px', lineHeight: 1.6 }}
                  {...editableProps(editable, `${path}.items.${i}.${item?.desc !== undefined ? 'desc' : 'description'}`)}
                >
                  {desc}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
