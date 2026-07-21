import { editableProps } from './editable.js'

export default function Gallery({ props = {}, path, editable = false }) {
  const { title = 'Gallery', images = [] } = props

  return (
    <section
      className="w-full mx-auto"
      style={{ paddingBlock: 'var(--section-y)', paddingInline: 'var(--section-x)', maxWidth: 'var(--max-w)' }}
    >
      <h2
        className="text-center font-bold break-words"
        style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
        {...editableProps(editable, `${path}.title`)}
      >
        {title}
      </h2>
      {images.length === 0 ? (
        <p className="text-center mt-16" style={{ color: 'var(--muted-color)' }}>No images yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: '64px' }}>
          {images.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden group"
              data-image-path={editable ? `${path}.images.${i}.src` : undefined}
              style={{
                backgroundColor: 'var(--section-bg-alt)',
                borderRadius: 'var(--card-radius)',
                height: '16rem',
                boxShadow: '0 18px 40px -18px rgba(17,18,28,0.3)',
              }}
            >
              {img?.src && (
                <img
                  src={img.src}
                  alt={img?.alt || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              {editable && (
                <button
                  type="button"
                  data-image-trigger
                  className="absolute top-2 right-2 z-10 rounded-md border border-white/40 bg-black/55 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Change image
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
