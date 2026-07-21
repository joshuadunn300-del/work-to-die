import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { listContracts, listProposals } from '../lib/api'
import { canUseFeature } from '../lib/entitlements'
import DataTable from '../components/DataTable'
import ProFeatureGate from '../../tools/ProFeatureGate'

// Per UI-Reference/contracts.md: "Proposals & Contracts" — no separate /app/proposals route
// (merged here per orchestrator correction). Full Pro wall; gate copy is verbatim from recon.
export default function Contracts() {
  const { entitlements } = useOutletContext()
  const navigate = useNavigate()
  const [contracts, setContracts] = useState(null)
  const [proposals, setProposals] = useState(null)
  const allowed = canUseFeature(entitlements, 'contracts')

  useEffect(() => {
    if (!allowed) return
    listContracts().then(setContracts)
    listProposals().then(setProposals)
  }, [allowed])

  return (
    <div className="max-w-4xl">
      <p className="nova-eyebrow mb-1">OUTREACH</p>
      <h1 className="text-xl font-semibold mb-6">Proposals & Contracts</h1>

      {!allowed ? (
        <ProFeatureGate
          heading="Full Proposals & Contracts"
          body="Generate polished, client-ready service agreements that lock in recurring retainers, then export them as professional PDFs. Unlock the full proposal suite with Pro."
          bullets={['Branded contract PDFs', 'Recurring retainer terms', 'Auto-filled agency details', 'Save & reuse contracts']}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Contracts</h2>
              <button
                type="button"
                onClick={() => navigate('/app/tools/proposal')}
                className="nova-btn-primary"
              >
                New proposal
              </button>
            </div>
            {contracts === null ? (
              <p className="text-sm text-nova-text-muted">Loading…</p>
            ) : (
              // Real Contract entity is client_id/title/terms/value/status/signed_at — no
              // `client` (display name) or `start_date` field exist on the real schema.
              <DataTable
                emptyMessage="No contracts yet."
                rows={contracts}
                columns={[
                  { key: 'title', label: 'Title', render: (r) => r.title || r.client || '—' },
                  { key: 'value', label: 'Value', render: (r) => `$${r.value ?? 0}` },
                  { key: 'status', label: 'Status' },
                  { key: 'signed_at', label: 'Signed', render: (r) => r.signed_at || '—' },
                ]}
              />
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3">Proposals</h2>
            {proposals === null ? (
              <p className="text-sm text-nova-text-muted">Loading…</p>
            ) : (
              // Real Proposal entity is client_id/lead_id/title/content/value/status — no
              // `business_name`/`value_estimate`/`sent_date` on the real schema.
              <DataTable
                emptyMessage="No proposals sent yet — generate one above."
                rows={proposals}
                columns={[
                  { key: 'title', label: 'Title', render: (r) => r.title || r.business_name || '—' },
                  { key: 'status', label: 'Status' },
                  { key: 'value', label: 'Estimate', render: (r) => `$${r.value ?? r.value_estimate ?? 0}` },
                  { key: 'created_date', label: 'Created' },
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
