import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { listLeads, updateLead } from '../lib/api'
import { isHottest, leadScore, sortByScoreDesc } from '../lib/leadScore'

// Real Base44 Lead entity field is `name`; mock data used `business_name` — guard both.
const leadName = (l) => l.business_name || l.name || ''

// Verified live against the real, reactivated tenji.ai/app/tracker (2026-07-21): the real
// pipeline is exactly NEW / CALLED / INTERESTED / FOLLOW UP / CLOSED — not the
// new/contacted/demo_sent/closed/lost values from Lead's documented API schema. Tenji's
// tracker UI clearly runs its own stage vocabulary distinct from that schema doc, so
// matching the live product (the actual 1:1 target) wins over the doc here.
const COLUMNS = [
  { key: 'new', label: 'NEW', border: 'border-t-nova-border' },
  { key: 'called', label: 'CALLED', border: 'border-t-blue-500' },
  { key: 'interested', label: 'INTERESTED', border: 'border-t-pink-500' },
  { key: 'follow_up', label: 'FOLLOW UP', border: 'border-t-amber-500' },
  { key: 'closed', label: 'CLOSED', border: 'border-t-emerald-500' },
]

export default function Tracker() {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState('')
  const [dragId, setDragId] = useState(null)

  useEffect(() => {
    listLeads().then((rows) => setLeads(rows.map((r) => ({ ...r, status: r.status || 'new' }))))
  }, [])

  const filtered = (leads || []).filter((l) => l && (leadName(l) || '').toLowerCase().includes((search || '').toLowerCase()))
  // Real Lead entity has no revenue field, so this is always $0 today — kept as a real sum
  // (not a hardcoded string) so it picks up a value the moment leads carry one, matching
  // Tenji's exact "Closed MRR: $X/mo" copy rather than substituting a different metric.
  const closedMrr = (leads || []).filter((l) => l && l.status === 'closed').reduce((sum, l) => sum + (l.mrr || 0), 0)

  function moveLead(id, status) {
    const prevStatus = leads.find((l) => l.id === id)?.status
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    // Optimistic drag; revert only if the backend write actually fails.
    updateLead(id, { status }).catch(() => {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: prevStatus } : l)))
    })
  }

  return (
    <div>
      <p className="nova-eyebrow mb-1">PIPELINE</p>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Lead Tracker</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="nova-input-focus nova-solid-input px-4 py-2 text-sm text-white"
          />
          <button type="button" className="nova-btn-primary">
            ＋ Add Lead
          </button>
        </div>
      </div>
      <p className="text-sm text-nova-text-muted mb-6">
        Closed MRR: ${closedMrr}/mo · {leads.length} leads in pipeline
      </p>

      <div className="grid grid-cols-5 gap-3">
        {COLUMNS.map((col) => {
          const rows = sortByScoreDesc(filtered.filter((l) => l.status === col.key))
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveLead(dragId, col.key)}
              className={`rounded-nova border-t-4 ${col.border} border-x border-b border-nova-border bg-nova-surface min-h-[220px]`}
            >
              {/* Verified via getComputedStyle against live tenji.ai/app/tracker: column
                  label is 10px/600/white, not 12px/muted — the count badge stays muted. */}
              <div className="flex items-center justify-between px-3 py-2 text-[10px] font-semibold text-nova-text">
                <span style={{ letterSpacing: '1.5px' }}>{col.label}</span>
                {/* Exact per live probe: 10px/500, muted color, bg white/6%, full pill, 2px/8px padding. */}
                <span className="rounded-full text-nova-text-muted" style={{ fontSize: 10, fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 8px' }}>
                  {rows.length}
                </span>
              </div>
              <div className="px-2 pb-2 space-y-2">
                {rows.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10">
                    {/* Exact per live probe: 48x48, rounded-lg (not full circle), dashed border. */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-white/[0.12] text-nova-text-muted/50">$</div>
                    <span className="text-xs text-nova-text-muted">Drop a lead here</span>
                  </div>
                ) : (
                  rows.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDragId(lead.id)}
                      className={isHottest(lead) ? 'rounded-md border border-nova-accent/40 bg-nova-accent/10 px-2 py-2 text-xs cursor-grab' : 'rounded-md border border-nova-border bg-nova-bg px-2 py-2 text-xs cursor-grab'}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>{leadName(lead) || '(unnamed lead)'}</span>
                        <span className={isHottest(lead) ? 'shrink-0 font-semibold text-nova-accent' : 'shrink-0 font-semibold text-nova-text-muted'}>
                          {isHottest(lead) && <Flame size={11} />} {leadScore(lead)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
