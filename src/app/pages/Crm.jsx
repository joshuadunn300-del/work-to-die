import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Download, Users, Flame } from 'lucide-react'
import { listLeads } from '../lib/api'
import { canUseFeature } from '../lib/entitlements'
import { isHottest, leadScore, sortByScoreDesc } from '../lib/leadScore'
import DataTable from '../components/DataTable'
import WebsiteStatusBadge from '../components/StatusBadge'

// Real Base44 Lead entity field is `name`; mock data (and this file, until this fix)
// used `business_name` — the mismatch crashed the live app the moment a real Lead record
// (name populated, business_name undefined) reached a bare `.toLowerCase()` call.
const leadName = (l) => l.business_name || l.name || ''
const leadRating = (l) => l.rating ?? l.google_rating

// CSV/formula-injection guard: a cell starting with =,+,-,@ (or tab/CR) becomes a live
// formula the instant the file opens in Excel/Sheets. Prefix with a literal-forcing `'`
// and always quote+escape (flagged twice in BUILD-LOG, fixing now — Lead names are
// untrusted free text, not internal-only data).
function csvCell(value) {
  let s = value == null ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

function toCsv(rows) {
  const header = 'business_name,phone,website_status,rating,review_count,created_date'
  const lines = rows.map((r) => [leadName(r), r.phone, r.website_status, leadRating(r), r.review_count, r.created_date].map(csvCell).join(','))
  return [header, ...lines].join('\n')
}

export default function Crm() {
  const { entitlements } = useOutletContext()
  const navigate = useNavigate()
  const [leads, setLeads] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    listLeads().then(setLeads)
  }, [])

  // Real Lead field is `status` (enum: new/contacted/demo_sent/closed/lost), not `stage`
  // — this filter matched zero rows for every non-"all" option against real data (a lead
  // record has no `stage` field at all), and closedCount was always 0.
  const rows = (leads || []).filter(
    (l) =>
      l &&
      (leadName(l) || '').toLowerCase().includes((search || '').toLowerCase()) &&
      (status === 'all' || l.status === status)
  )
  const closedCount = (leads || []).filter((l) => l.status === 'closed').length

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">CRM</h1>
        <button type="button" onClick={exportCsv} className="nova-btn-secondary inline-flex items-center gap-1.5">
          <Download size={14} /> Export CSV
        </button>
      </div>
      <p className="text-sm text-nova-text-muted mb-4">
        {(leads || []).length} leads · {closedCount} closed
      </p>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search businesses..."
          className="flex-1 nova-input-focus nova-solid-input px-4 py-2 text-sm text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="nova-input-focus nova-solid-input px-4 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="demo_sent">Demo sent</option>
          <option value="closed">Closed</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {leads === null ? (
        <p className="text-sm text-nova-text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="nova-empty-card">
          <div className="nova-empty-icon-tile mx-auto mb-4"><Users size={22} /></div>
          <p className="text-lg font-semibold">No leads found</p>
          <p className="text-sm text-nova-text-muted mt-1">
            Run a lead search or add leads manually from the tracker.
          </p>
        </div>
      ) : (
        <DataTable
          rows={sortByScoreDesc(rows)}
          columns={[
            {
              key: 'score',
              label: 'Score',
              render: (r) => (
                <span className={isHottest(r) ? 'inline-flex items-center gap-1 rounded-full bg-nova-accent/15 px-2 py-0.5 font-semibold text-nova-accent' : 'font-semibold'}>
                  {isHottest(r) && <Flame size={12} />} {leadScore(r)}
                </span>
              ),
            },
            { key: 'business_name', label: 'Business', render: (r) => leadName(r) || '—' },
            { key: 'phone', label: 'Phone' },
            { key: 'website_status', label: 'Website status', render: (r) => <WebsiteStatusBadge status={r.website_status} /> },
            { key: 'rating', label: 'Rating', render: (r) => `${leadRating(r) ?? '—'}★ (${r.review_count ?? 0})` },
            {
              key: 'actions',
              label: '',
              render: (r) =>
                canUseFeature(entitlements, 'scripts') ? (
                  <button
                    type="button"
                    onClick={() => navigate('/app/scripts', { state: { lead: r } })}
                    className="text-nova-accent font-medium"
                  >
                    Generate script
                  </button>
                ) : (
                  <span className="text-nova-text-muted">Pro+</span>
                ),
            },
          ]}
        />
      )}
    </div>
  )
}
