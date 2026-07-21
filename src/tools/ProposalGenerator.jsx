import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import UpgradeGate from '../app/components/UpgradeGate'
import { getEntitlements } from '../app/lib/api'
import { createProposal } from './api'
import { LABEL_CLASS, FIELD_CLASS, CARD_CLASS } from './fieldStyles'

const DEFAULT_TIERS = [
  { name: 'Starter Site', price: '', description: '' },
  { name: 'Growth Package', price: '', description: '' },
]

const TIER_FIELD_CLASS =
  'w-full rounded-md border border-nova-border bg-nova-bg px-2.5 py-1.5 text-sm text-nova-text ' +
  'focus:outline-none focus:ring-2 focus:ring-nova-accent focus:border-nova-accent transition-colors';

// No UI-Reference file describes the ungated proposal-creation form itself
// (contracts.md only recon'd the Pro-wall gate card, since the recon account
// never had Pro access) — applying the same left-form/right-preview layout
// as ScriptGenerator (scripts.md) for visual consistency across the two
// generator tools, with a live preview instead of a static empty state since
// there's real content to preview here as the form fills in.
//
// `lead` optional — prefills business name when launched from a Lead/Client row.
export default function ProposalGenerator({ lead, onSaved }) {
  const outletContext = useOutletContext()
  const [entitlements, setEntitlements] = useState(outletContext?.entitlements ?? null)

  useEffect(() => {
    if (outletContext?.entitlements !== undefined) {
      setEntitlements(outletContext.entitlements)
      return
    }
    getEntitlements().then(setEntitlements)
  }, [outletContext?.entitlements])

  const [form, setForm] = useState({
    businessName: lead?.business_name || '',
    valueEstimate: '',
    projectSummary: '',
    scope: '',
    terms: 'Net 15. 50% deposit to begin, balance due on delivery.',
    tiers: DEFAULT_TIERS,
  })
  const [state, setState] = useState({ saving: false, error: null, saved: false })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const updateTier = (index, key) => (e) => {
    setForm((f) => ({ ...f, tiers: f.tiers.map((t, i) => (i === index ? { ...t, [key]: e.target.value } : t)) }))
  }
  const addTier = () => setForm((f) => ({ ...f, tiers: [...f.tiers, { name: '', price: '', description: '' }] }))
  const removeTier = (index) => setForm((f) => ({ ...f, tiers: f.tiers.filter((_, i) => i !== index) }))

  const submit = async (e) => {
    e.preventDefault()
    if (state.saving) return // double-submit guard
    if (!form.businessName.trim()) {
      setState({ saving: false, error: 'Business name is required.', saved: false })
      return
    }
    const validTiers = form.tiers.filter((t) => t.name.trim())
    if (validTiers.length === 0) {
      setState({ saving: false, error: 'Add at least one pricing tier.', saved: false })
      return
    }
    setState({ saving: true, error: null, saved: false })
    try {
      const saved = await createProposal({ ...form, tiers: validTiers })
      setState({ saving: false, error: null, saved: true })
      onSaved?.(saved)
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false })
    }
  }

  const validTiers = form.tiers.filter((t) => t.name.trim())
  const hasPreviewContent = form.businessName.trim() || form.projectSummary.trim() || validTiers.length > 0

  return (
    <UpgradeGate entitlements={entitlements} feature="proposals" label="The Proposal Generator">
      <div className="max-w-5xl">
        <p className="text-xs font-semibold tracking-wide uppercase text-nova-accent mb-2">Client Pitch</p>
        <h1 className="text-2xl font-semibold font-nova-heading text-nova-text">Proposal Generator</h1>
        <p className="text-sm text-nova-text-muted mb-6 max-w-2xl">
          Build a client-ready pitch: scope, pricing tiers, terms.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <form onSubmit={submit} className={`${CARD_CLASS} space-y-4`}>
            <h2 className="text-xs font-semibold tracking-wide uppercase text-nova-text-muted">Details</h2>
            <label className="block">
              <span className={LABEL_CLASS}>Business name *</span>
              <input className={FIELD_CLASS} value={form.businessName} onChange={update('businessName')} required />
            </label>
            <label className="block">
              <span className={LABEL_CLASS}>Value estimate ($)</span>
              <input type="number" min="0" className={FIELD_CLASS} value={form.valueEstimate} onChange={update('valueEstimate')} />
            </label>
            <label className="block">
              <span className={LABEL_CLASS}>Project summary</span>
              <textarea className={FIELD_CLASS} rows={3} value={form.projectSummary} onChange={update('projectSummary')} />
            </label>
            <label className="block">
              <span className={LABEL_CLASS}>Scope of work</span>
              <textarea className={FIELD_CLASS} rows={3} value={form.scope} onChange={update('scope')} />
            </label>

            <div>
              <span className={LABEL_CLASS}>Pricing tiers</span>
              <div className="mt-2 space-y-3">
                {form.tiers.map((tier, i) => (
                  <div key={i} className="flex gap-3 items-start rounded-lg border border-nova-border bg-nova-bg/40 p-3">
                    <div className="flex-1 space-y-2">
                      <input className={TIER_FIELD_CLASS} placeholder="Tier name" value={tier.name} onChange={updateTier(i, 'name')} />
                      <input className={TIER_FIELD_CLASS} placeholder="Price" value={tier.price} onChange={updateTier(i, 'price')} />
                      <input className={TIER_FIELD_CLASS} placeholder="Description" value={tier.description} onChange={updateTier(i, 'description')} />
                    </div>
                    <button type="button" onClick={() => removeTier(i)} className="text-sm text-nova-text-muted hover:text-rose-400 transition-colors">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTier} className="mt-2 text-sm font-medium text-nova-accent hover:text-nova-accent-deep">
                + Add tier
              </button>
            </div>

            <label className="block">
              <span className={LABEL_CLASS}>Terms</span>
              <textarea className={FIELD_CLASS} rows={2} value={form.terms} onChange={update('terms')} />
            </label>

            <button
              type="submit"
              disabled={state.saving}
              className="w-full rounded-lg bg-nova-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-nova-accent-deep disabled:opacity-50 transition-colors"
            >
              {state.saving ? 'Saving…' : 'Save Proposal'}
            </button>
            {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
            {state.saved && <p className="text-sm text-emerald-400">Proposal saved as draft.</p>}
          </form>

          <div className={`${CARD_CLASS} min-h-[16rem]`}>
            {hasPreviewContent ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-nova-heading text-nova-text">
                  {form.businessName || 'Untitled Proposal'}
                </h3>
                {form.projectSummary && <p className="text-sm text-nova-text-muted">{form.projectSummary}</p>}
                {form.scope && (
                  <div>
                    <p className="text-xs font-semibold tracking-wide uppercase text-nova-text-muted">Scope</p>
                    <p className="text-sm text-nova-text whitespace-pre-wrap">{form.scope}</p>
                  </div>
                )}
                {validTiers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wide uppercase text-nova-text-muted">Pricing</p>
                    {validTiers.map((tier, i) => (
                      <div key={i} className="flex items-baseline justify-between border-b border-nova-border pb-1 text-sm">
                        <span className="text-nova-text">{tier.name}</span>
                        {tier.price && <span className="text-nova-text-muted">{tier.price}</span>}
                      </div>
                    ))}
                  </div>
                )}
                {form.terms && <p className="text-xs text-nova-text-muted">{form.terms}</p>}
              </div>
            ) : (
              <p className="text-sm text-nova-text-muted">
                Your proposal preview will appear here. Fill in the details, then save it as a draft.
              </p>
            )}
          </div>
        </div>
      </div>
    </UpgradeGate>
  )
}
