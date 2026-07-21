import { PlayCircle } from 'lucide-react'

// Content TBD by Josh — placeholder lesson titles/durations only, matching the app's card
// tokens (nova-card, nova-icon-tile) so the grid slots in cleanly once real lessons land.
const LESSONS = [
  { title: 'Getting started with Nova', duration: '4 min' },
  { title: 'Finding your first leads', duration: '6 min' },
  { title: 'Generating a client site', duration: '5 min' },
  { title: 'Writing a cold call script', duration: '3 min' },
  { title: 'Sending your first proposal', duration: '4 min' },
  { title: 'Publishing a client site', duration: '3 min' },
]

export default function Tutorials() {
  return (
    <div>
      <p className="nova-eyebrow mb-1">LEARN</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Tutorials</h1>
      <p className="text-sm text-nova-text-muted mb-6">Guides for getting the most out of Nova.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson) => (
          <div key={lesson.title} className="nova-card p-4">
            <div className="nova-icon-tile mb-3 text-base">
              <PlayCircle size={18} />
            </div>
            <h3 className="font-medium mb-1">{lesson.title}</h3>
            <p className="text-sm text-nova-text-muted">{lesson.duration}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
