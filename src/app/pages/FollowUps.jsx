import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { listLeads } from '../lib/api'

// Verified live against the real tenji.ai/app/followups (2026-07-21): Tracker's real
// pipeline column is literally "Follow Up" (status key `follow_up`), matching Tracker.jsx.
const leadName = (l) => l.business_name || l.name || ''

export default function FollowUps() {
  const [leads, setLeads] = useState([])

  useEffect(() => {
    listLeads().then((rows) => setLeads(rows.filter((r) => r.status === 'follow_up')))
  }, [])

  return (
    <div className="max-w-3xl">
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Follow-ups</h1>
      <p className="text-sm text-nova-text-muted mb-6">
        Never let a warm lead go cold. Set follow-up dates on leads in the tracker.
      </p>

      {leads.length === 0 ? (
        <div className="nova-empty-card">
          <div className="nova-empty-icon-tile mx-auto mb-4"><CalendarClock size={22} /></div>
          <p className="text-lg font-semibold">No leads in Follow Up</p>
          <p className="text-sm text-nova-text-muted mt-1">
            Drag leads to the "Follow Up" column in your Lead Tracker and they'll appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {leads.map((l) => (
            <li key={l.id} className="rounded-md border border-nova-border px-3 py-2 text-sm">
              {leadName(l) || '(unnamed lead)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
