import { useEffect, useState } from 'react'
import { Calculator, DollarSign, Percent, TrendingUp, Users, Wallet } from 'lucide-react'
import { listClients } from '../lib/api'

export default function Revenue() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    listClients().then(setClients)
  }, [])

  // Real Client field is `monthly_value`, not `mrr`.
  const active = clients.filter((c) => c.status === 'active')
  const totalMrr = active.reduce((sum, c) => sum + (c.monthly_value ?? c.mrr ?? 0), 0)
  const avgValue = active.length ? Math.round(totalMrr / active.length) : 0

  const STATS = [
    { label: 'Total MRR', value: `$${totalMrr}`, Icon: DollarSign, highlight: true },
    { label: 'Setup Fees', value: '$0', Icon: TrendingUp },
    { label: 'Closed Clients', value: active.length, Icon: Users },
    { label: 'Avg Client Value', value: `$${avgValue}`, Icon: Calculator },
    { label: 'Conversion', value: '0%', Icon: Percent },
    { label: 'Pipeline Value', value: '$0', Icon: Wallet },
  ]

  return (
    <div>
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Revenue Tracker</h1>
      <p className="text-sm text-nova-text-muted mb-6">Your agency's money at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {STATS.map((s) => (
          <div key={s.label} className={`nova-stat-card ${s.highlight ? 'nova-card-active' : ''}`}>
            <div className={s.highlight ? 'nova-icon-tile mb-3' : 'nova-icon-tile-muted mb-3'}>
              <s.Icon size={s.highlight ? 18 : 16} />
            </div>
            <p className={s.highlight ? 'nova-stat-label-lg mb-1' : 'nova-stat-label mb-1'}>{s.label}</p>
            <p className="text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="nova-card p-4">
          <p className="text-sm font-medium mb-3">MRR Over Time</p>
          <div className="flex gap-3">
            <div className="flex flex-col justify-between h-32 text-xs text-nova-text-muted pb-5">
              {['$4', '$3', '$2', '$1', '$0'].map((y) => (
                <span key={y}>{y}</span>
              ))}
            </div>
            <div className="flex-1 flex items-end justify-between h-32 text-xs text-nova-text-muted border-l border-nova-border pl-3">
              {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                <div key={m} className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-nova-surface-hover rounded-t" style={{ height: '4px' }} />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="nova-card p-4">
          <p className="text-sm font-medium mb-2">
            Clients on Retainer <span className="rounded-full bg-nova-surface-hover px-2 py-0.5 text-xs">{active.length}</span>
          </p>
          {active.length === 0 && <p className="text-sm text-nova-text-muted">No active clients yet.</p>}
        </div>
      </div>
    </div>
  )
}
