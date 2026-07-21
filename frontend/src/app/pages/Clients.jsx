import { useEffect, useState } from 'react'
import { Briefcase } from 'lucide-react'
import { createClient, listClients } from '../lib/api'
import DataTable from '../components/DataTable'

// Real Client entity is `company`/`name`/`monthly_value`/`status`[active|paused|churned] —
// not `business_name`/`contact_name`/`mrr`/'onboarding' (this file's original mock shape).
// Guard both so mock mode (still using the old field names) keeps working.
const clientBusiness = (c) => c.company || c.business_name || ''
const clientContact = (c) => c.name || c.contact_name || ''
const clientMonthly = (c) => c.monthly_value ?? c.mrr ?? 0

const STATUS_STYLE = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  churned: 'bg-nova-surface-hover text-nova-text-muted',
}

export default function Clients() {
  const [clients, setClients] = useState(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ business_name: '', contact_name: '', email: '' })

  useEffect(() => {
    listClients().then(setClients).catch((err) => setError(err.message || 'Failed to load clients.'))
  }, [])

  const active = (clients || []).filter((c) => c.status === 'active')
  const mrr = active.reduce((sum, c) => sum + clientMonthly(c), 0)

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.business_name.trim()) return
    const client = await createClient(form)
    setClients((prev) => [client, ...(prev || [])])
    setForm({ business_name: '', contact_name: '', email: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-5xl">
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Clients</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="nova-btn-primary"
        >
          ＋ Add Client
        </button>
      </div>
      <p className="text-sm text-nova-text-muted mb-6">
        {active.length} active clients · ${mrr}/mo MRR
      </p>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 nova-card p-4 flex flex-wrap gap-3">
          <input
            placeholder="Business name"
            value={form.business_name}
            onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
            className="flex-1 min-w-[160px] nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
          />
          <input
            placeholder="Contact name"
            value={form.contact_name}
            onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
            className="flex-1 min-w-[160px] nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="flex-1 min-w-[160px] nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
          />
          <button type="submit" className="nova-btn-primary">
            Add
          </button>
        </form>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {clients === null && !error ? (
        <p className="text-sm text-nova-text-muted">Loading…</p>
      ) : (clients || []).length === 0 ? (
        <div className="nova-empty-card">
          <div className="nova-empty-icon-tile mx-auto mb-4"><Briefcase size={22} /></div>
          <p className="text-lg font-semibold">No clients yet</p>
          <p className="text-sm text-nova-text-muted mt-1 mb-4">
            Close your first lead and convert it to a client from the CRM — or add one manually.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="nova-btn-primary"
          >
            Add Client
          </button>
        </div>
      ) : (
        <DataTable
          rows={clients}
          columns={[
            { key: 'business_name', label: 'Business', render: (r) => clientBusiness(r) || '—' },
            { key: 'contact_name', label: 'Contact', render: (r) => clientContact(r) || '—' },
            { key: 'email', label: 'Email' },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status] || STATUS_STYLE.churned}`}>
                  {r.status}
                </span>
              ),
            },
            { key: 'mrr', label: 'MRR', render: (r) => `$${clientMonthly(r)}/mo` },
          ]}
        />
      )}
    </div>
  )
}
