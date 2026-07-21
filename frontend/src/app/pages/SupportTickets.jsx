import { useEffect, useState } from 'react'
import { LifeBuoy } from 'lucide-react'
import { createSupportTicket, listSupportTickets } from '../lib/api'
import DataTable from '../components/DataTable'

export default function SupportTickets() {
  const [tickets, setTickets] = useState(null)
  const [error, setError] = useState('')
  const [subject, setSubject] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    listSupportTickets().then(setTickets).catch((err) => setError(err.message || 'Failed to load tickets.'))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!subject.trim()) return
    setBusy(true)
    try {
      const ticket = await createSupportTicket({ subject: subject.trim() })
      setTickets((prev) => [ticket, ...(prev || [])])
      setSubject('')
    } catch (err) {
      setError(err.message || 'Failed to create ticket.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="nova-eyebrow mb-1">LEARN</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Support</h1>
      <p className="text-sm text-nova-text-muted mb-6">Open a ticket if something's broken.</p>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          placeholder="What's going on?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy || !subject.trim()}
          className="nova-btn-primary disabled:opacity-50"
        >
          Submit
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {tickets === null && !error ? (
        <p className="text-sm text-nova-text-muted">Loading…</p>
      ) : (tickets || []).length === 0 ? (
        <div className="nova-card border-dashed p-10 text-center">
          <div className="nova-icon-tile mx-auto mb-3 text-base">
            <LifeBuoy size={18} />
          </div>
          <p className="text-sm font-medium">No tickets yet</p>
          <p className="text-sm text-nova-text-muted mt-1">You're all set — open one above if something's broken.</p>
        </div>
      ) : (
        <DataTable
          rows={tickets}
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'status', label: 'Status' },
            { key: 'priority', label: 'Priority' },
            { key: 'created_date', label: 'Opened', render: (r) => (r.created_date ? new Date(r.created_date).toLocaleDateString() : '—') },
          ]}
        />
      )}
    </div>
  )
}
