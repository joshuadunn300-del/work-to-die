import { Link } from 'react-router-dom'

const FIXTURES = ['plumber', 'roofer', 'cleaner']

export default function Home() {
  return (
    <div className="nova-dojo-bg nova-kanji-watermark min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-nova-text">
      <div className="relative text-center">
        <h1 className="font-nova-heading text-2xl font-semibold tracking-tight">
          Nova
        </h1>
        <p className="mt-2 text-sm text-nova-text-muted">Section renderer — fixture previews</p>
      </div>
      <ul className="relative flex gap-4">
        {FIXTURES.map((slug) => (
          <li key={slug}>
            <Link
              to={`/preview/${slug}`}
              className="rounded-lg border border-nova-border bg-nova-surface px-5 py-2.5 capitalize text-sm font-medium text-nova-text transition hover:border-nova-accent/50 hover:bg-nova-surface-hover hover:shadow-[0_0_12px_hsl(335_90%_56%_/_0.3)]"
            >
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
