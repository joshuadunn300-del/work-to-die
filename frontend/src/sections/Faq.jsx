import { editableProps } from './editable.js'

export default function Faq({ props = {}, path, editable = false }) {
  // `heading`/`q`/`a` are the real fields (lib/templates/_base.js); `title`/
  // `question`/`answer` kept as back-compat reads for older content_json.
  const { heading, title, items = [] } = props
  const sectionTitle = heading || title || 'Frequently Asked Questions'

  return (
    <section
      className="w-full mx-auto"
      style={{ paddingBlock: 'var(--section-y)', paddingInline: 'var(--section-x)', maxWidth: '48rem' }}
    >
      <h2
        className="text-center font-bold break-words"
        style={{ fontFamily: 'var(--heading-font)', color: 'var(--heading-color)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
        {...editableProps(editable, `${path}.${heading ? 'heading' : 'title'}`)}
      >
        {sectionTitle}
      </h2>
      {items.length === 0 ? (
        <p className="text-center mt-12" style={{ color: 'var(--muted-color)' }}>No questions yet.</p>
      ) : (
        <div className="flex flex-col gap-4" style={{ marginTop: '48px' }}>
          {items.map((item, i) => {
            const question = item?.q ?? item?.question ?? 'Question'
            const questionField = item?.q !== undefined ? 'q' : 'question'
            const answer = item?.a ?? item?.answer ?? ''
            const answerField = item?.a !== undefined ? 'a' : 'answer'
            return (
              <div
                key={i}
                style={{
                  background: 'var(--card-bg)',
                  border: 'var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                }}
              >
                <p
                  className="font-semibold break-words"
                  style={{ color: 'var(--heading-color)', fontSize: '1.0625rem' }}
                  {...editableProps(editable, `${path}.items.${i}.${questionField}`)}
                >
                  {question}
                </p>
                <p
                  className="mt-2.5 break-words"
                  style={{ color: 'var(--muted-color)', fontSize: '14px', lineHeight: 1.6 }}
                  {...editableProps(editable, `${path}.items.${i}.${answerField}`)}
                >
                  {answer}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
