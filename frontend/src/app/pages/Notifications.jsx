import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { listNotifications, markNotificationRead } from '../lib/api'

export default function Notifications() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listNotifications().then(setItems).catch((err) => setError(err.message || 'Failed to load notifications.'))
  }, [])

  async function markRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await markNotificationRead(id)
    } catch {
      // best-effort; UI already optimistically updated
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="nova-eyebrow mb-1">ACCOUNT</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Notifications</h1>
      <p className="text-sm text-nova-text-muted mb-6">Lead searches, generations, follow-ups, and system updates.</p>

      {error && (
        <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {items === null && !error ? (
        <p className="text-sm text-nova-text-muted">Loading…</p>
      ) : (items || []).length === 0 ? (
        <div className="nova-card border-dashed p-10 text-center">
          <div className="nova-icon-tile mx-auto mb-3 text-base">
            <Bell size={18} />
          </div>
          <p className="text-sm font-medium">No notifications</p>
          <p className="text-sm text-nova-text-muted mt-1">
            You'll see updates here when lead searches finish, sites are generated, and follow-ups are due.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            // Real Notification entity is message/type/read/link — no `title`/`body` fields
            // (this file's original mock shape), so both rendered blank on real data.
            <li
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`rounded-nova border p-3 cursor-pointer ${
                n.read
                  ? 'border-nova-border opacity-60'
                  : 'border-nova-accent/40 bg-nova-accent/10'
              }`}
            >
              <p className="text-sm font-medium">{n.title || n.message}</p>
              {n.title && n.body && <p className="text-sm text-nova-text-muted">{n.body}</p>}
              {n.created_date && <p className="text-xs text-nova-text-muted mt-1">{new Date(n.created_date).toLocaleString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
