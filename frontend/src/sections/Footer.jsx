import { editableProps } from './editable.js'
import { NovaIcon } from './icons.jsx'

export default function Footer({ props = {}, path, editable = false }) {
  // `tagline` is the real field (lib/templates/_base.js); `text` kept as a
  // back-compat read for older content_json. Explore `links` may be plain
  // strings (real template shape, same as Navbar's) or {label,href} objects.
  const { logo = 'Business', tagline, text, links = [], phone, email, copyright, logoIcon } = props
  const taglineText = tagline ?? text ?? ''
  const taglineField = tagline !== undefined ? 'tagline' : 'text'

  return (
    <footer className="w-full" style={{ padding: '64px 32px 40px', background: '#0a0b0f' }}>
      <div className="mx-auto" style={{ maxWidth: 'var(--max-w)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div style={{ maxWidth: '20rem' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 'var(--logo-tile-size)',
                  height: 'var(--logo-tile-size)',
                  borderRadius: 'var(--logo-tile-radius)',
                  background: 'var(--logo-tile-bg)',
                  boxShadow: 'var(--logo-tile-shadow)',
                }}
              >
                <NovaIcon name={logoIcon} size={24} color="#000" strokeWidth={2} />
              </div>
              <span
                className="font-semibold truncate"
                style={{ color: '#fff', fontSize: '1.125rem', letterSpacing: '-0.01em' }}
                {...editableProps(editable, `${path}.logo`)}
              >
                {logo}
              </span>
            </div>
            {taglineText && (
              <p
                className="mt-4 break-words"
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}
                {...editableProps(editable, `${path}.${taglineField}`)}
              >
                {taglineText}
              </p>
            )}
          </div>

          {(phone || email) && (
            <div>
              <p className="uppercase mb-4" style={{ fontSize: '11px', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--eyebrow-color)' }}>
                Get in touch
              </p>
              <div className="flex flex-col gap-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                {phone && <div>{phone}</div>}
                {email && <div>{email}</div>}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div>
              <p className="uppercase mb-4" style={{ fontSize: '11px', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--eyebrow-color)' }}>
                Explore
              </p>
              <div className="flex flex-col gap-2.5">
                {links.map((link, i) => {
                  const isString = typeof link === 'string'
                  const label = isString ? link : link?.label || 'Link'
                  const href = isString ? `#${link.toLowerCase().replace(/\s+/g, '-')}` : link?.href || '#'
                  return (
                    <a
                      key={i}
                      href={href}
                      className="flex items-center gap-2 hover:text-white transition-colors truncate"
                      style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textDecoration: 'none' }}
                      {...(isString ? {} : editableProps(editable, `${path}.links.${i}.label`))}
                    >
                      <span className="shrink-0" style={{ width: '4px', height: '4px', borderRadius: '9999px', background: 'var(--primary)' }} />
                      {label}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {copyright && (
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}
              {...editableProps(editable, `${path}.copyright`)}
            >
              {copyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}
