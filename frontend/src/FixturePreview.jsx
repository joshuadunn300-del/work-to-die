import { useParams, useSearchParams, Link } from 'react-router-dom'
import SiteRenderer from './renderer/SiteRenderer.jsx'
import plumber from './renderer/fixtures/plumber.json'
import roofer from './renderer/fixtures/roofer.json'
import cleaner from './renderer/fixtures/cleaner.json'

const FIXTURES = { plumber, roofer, cleaner }

export default function FixturePreview() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const content = FIXTURES[slug]

  if (!content) {
    return (
      <div className="p-8 text-center">
        <p>Unknown fixture "{slug}".</p>
        <Link to="/" className="text-blue-600 underline">Back home</Link>
      </div>
    )
  }

  return <SiteRenderer content={content} editable={searchParams.get('editable') === '1'} />
}
