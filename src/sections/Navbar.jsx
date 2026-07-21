import { editableProps } from './editable.js'
import { NovaIcon } from './icons.jsx'

export default function Navbar({ props = {}, path, editable = false }) {
  // `ctaText` (plain string) is the real field (lib/templates/_base.js); `cta:{label,href}`
  // kept as a back-compat read. `links` may be plain strings (real shape) or
  // {label,href} objects — both rendered the same, only strings aren't inline-editable
  // (no stable path into a bare string array item makes sense to expose as a link URL).
  const { logo = 'Business', links = [], cta, ctaText, phone, logoIcon } = props
  const ctaLabel = ctaText || cta?.label
  const ctaHref = cta?.href || '#'

  return (
    <header className="absolute top-0 left-0 right-0 z-20 py-5 px-6">
      <nav
        className="mx-auto flex items-center gap-6 rounded-full"
        style={{
          maxWidth: '56rem',
          padding: '10px 12px 10px 20px',
          background: 'rgba(9, 10, 15, 0.78)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 20px 50px -24px rgba(0,0,0,0.7)',
        }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              // Live Tenji editor (tenji-editor.png, 2026-07-21) shows a CIRCULAR navbar
              // logo tile with a white icon stroke — supersedes the older rounded-square/
              // black-icon spec read off static template HTML files. Footer's tile is a
              // separate, still-correct spec (see Footer.jsx) — not touched here.
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'var(--primary)',
            }}
          >
            <NovaIcon name={logoIcon} size={18} color="#fff" strokeWidth={2} />
          </div>
          <span
            className="font-semibold text-[15px] shrink-0 truncate max-w-[10rem]"
            style={{ color: '#fff', letterSpacing: '-0.01em' }}
            {...editableProps(editable, `${path}.logo`)}
          >
            {logo}
          </span>
        </div>

        {/* Real Tenji generated sites do NOT collapse nav links behind a hamburger at
            mobile widths — verified live (tenji.ai/app editor Live Preview, Mobile frame,
            2026-07-21): the pill bar just keeps the full link row and lets it run past the
            viewport edge. Matching that exactly rather than adding a hamburger of our own. */}
        <ul className="flex items-center gap-1.5 mx-auto min-w-0">
          {Array.isArray(links) &&
            links.map((link, i) => {
              const isString = typeof link === 'string'
              const label = isString ? link : link?.label || 'Link'
              const href = isString ? `#${link.toLowerCase().replace(/\s+/g, '-')}` : link?.href || '#'
              // Real Tenji always shows the first nav link (the page's own "Home"/top
              // anchor) in an active pill — verified live, tenji-editor.png.
              const isActive = i === 0
              return (
                <li key={i} className="truncate max-w-[8rem]">
                  <a
                    href={href}
                    className="block rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors hover:text-white hover:bg-white/10"
                    style={
                      isActive
                        ? { color: '#fff', background: 'color-mix(in srgb, var(--primary) 16%, transparent)' }
                        : { color: 'rgba(255,255,255,0.72)' }
                    }
                    {...(isString ? {} : editableProps(editable, `${path}.links.${i}.label`))}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
        </ul>

        <div className="flex items-center gap-3 shrink-0">
          {phone && (
            // Real values via getComputedStyle against a live tenji.ai generated site's
            // nav phone chip, 2026-07-21 — distinct from the shared glassBadge tokens
            // (no border, no backdrop-blur, lighter fill, pill radius not 12px).
            <div
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap text-white"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '9999px',
                padding: '6px 12px',
              }}
            >
              {phone}
            </div>
          )}
          {ctaLabel && (
            <a
              href={ctaHref}
              className="shrink-0 whitespace-nowrap"
              style={{
                background: 'var(--cta-bg)',
                boxShadow: 'var(--cta-sm-shadow)',
                color: 'var(--cta-color)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 600,
              }}
              {...editableProps(editable, `${path}.${ctaText !== undefined ? 'ctaText' : 'cta.label'}`)}
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}
