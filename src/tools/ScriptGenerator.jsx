import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import UpgradeGate from '../app/components/UpgradeGate'
import { getEntitlements } from '../app/lib/api'
import { WEBSITE_WEAKNESSES, generateScript } from './api'
import { LABEL_CLASS, FIELD_CLASS, CARD_CLASS } from './fieldStyles'

// Layout parity target: 09 - Resources/UI-Reference/scripts.md — eyebrow +
// H1 + sub, two-column (left form card "WHO YOU'RE CALLING" / right output
// pane with an empty-state), YOU/THEIR SITE section labels, checkbox-style
// weakness picker, CTA copy "Generate Cold Call Script · 3 credits".
//
// The reference shows weakness as checkboxes (implying it *could* be
// multi-select), but generateScript's contract (T1's function + our own
// tools/api.js validation) takes one `websiteWeakness` value — kept that
// contract intact and rendered the picker as single-select toggle buttons
// that *look* like the recon'd checkboxes rather than changing the data
// shape everyone else already built against.
//
// Standalone-usable: reads entitlements from router outlet context when
// nested under AppShell, else fetches them itself so it also works dropped
// into a dev harness. `lead` prefills business name/niche when launched from
// a Lead row (T4's action). `leads` (optional array) powers the in-page
// "Choose a lead from your CRM" dropdown from the reference — empty by
// default until a CRM data source is passed in.
// Real Base44 Lead entity field is `name`, not `business_name` — guard both so a lead
// passed in from a real CRM row (or the picker below) doesn't prefill blank.
const leadName = (l) => l?.business_name || l?.name || ''

export default function ScriptGenerator({ lead, leads = [] }) {
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
    businessName: leadName(lead),
    niche: lead?.niche || '',
    yourName: '',
    tone: 'casual, confident, direct',
    websiteWeakness: WEBSITE_WEAKNESSES[0].value,
    convictionPoints: '',
  })
  const [state, setState] = useState({ loading: false, error: null, script: null })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const pickLead = (e) => {
    const picked = leads.find((l) => String(l.id) === e.target.value)
    if (!picked) return
    setForm((f) => ({ ...f, businessName: leadName(picked) || f.businessName, niche: picked.niche || f.niche }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (state.loading) return // double-submit guard
    setState({ loading: true, error: null, script: null })
    try {
      const result = await generateScript(form)
      setState({ loading: false, error: null, script: result.script_text })
    } catch (err) {
      setState({ loading: false, error: err.message, script: null })
    }
  }

  return (
    <UpgradeGate entitlements={entitlements} feature="scripts" label="The Script Generator">
      <div className="max-w-5xl">
        <p className="text-xs font-semibold tracking-wide uppercase text-nova-accent mb-2">Cold Call Outreach</p>
        <h1 className="text-2xl font-semibold font-nova-heading text-nova-text">Cold Call Script Generator</h1>
        <p className="text-sm text-nova-text-muted mb-6 max-w-2xl">
          Natural, non-cringe cold-call scripts personalized to each lead's website weaknesses.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <form onSubmit={submit} className={`${CARD_CLASS} space-y-4`}>
            <h2 className="text-[11px] font-semibold uppercase text-nova-text-muted/80 tracking-[0.16em]">Who You're Calling</h2>

            <label className="block">
              <span className={LABEL_CLASS}>Choose a lead from your CRM (optional)</span>
              <select className={FIELD_CLASS} defaultValue="" onChange={pickLead}>
                <option value="" disabled>
                  {leads.length ? 'Select a lead…' : 'No leads yet'}
                </option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>{leadName(l) || '(unnamed lead)'}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={LABEL_CLASS}>Business name *</span>
              <input className={FIELD_CLASS} value={form.businessName} onChange={update('businessName')} required />
            </label>
            <label className="block">
              <span className={LABEL_CLASS}>Lead niche (e.g. plumber)</span>
              <input className={FIELD_CLASS} placeholder="e.g. plumber" value={form.niche} onChange={update('niche')} />
            </label>

            <h2 className="text-[11px] font-semibold uppercase text-nova-text-muted/80 tracking-[0.16em] pt-2">You</h2>
            <label className="block">
              <span className={LABEL_CLASS}>Your name</span>
              <input className={FIELD_CLASS} value={form.yourName} onChange={update('yourName')} />
            </label>
            <label className="block">
              <span className={LABEL_CLASS}>Tone</span>
              <input className={FIELD_CLASS} value={form.tone} onChange={update('tone')} />
            </label>

            <h2 className="text-[11px] font-semibold uppercase text-nova-text-muted/80 tracking-[0.16em] pt-2">Their Site</h2>
            <fieldset className="block">
              <legend className={LABEL_CLASS}>Website weakness *</legend>
              <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WEBSITE_WEAKNESSES.map((w) => (
                  <label
                    key={w.value}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                      form.websiteWeakness === w.value
                        ? 'border-nova-accent bg-nova-accent/10 text-nova-text'
                        : 'border-nova-border text-nova-text-muted hover:bg-nova-surface-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.websiteWeakness === w.value}
                      onChange={() => setForm((f) => ({ ...f, websiteWeakness: w.value }))}
                      className="accent-nova-accent"
                    />
                    {w.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className={LABEL_CLASS}>Key conviction points / features to improve</span>
              <textarea className={FIELD_CLASS} rows={3} value={form.convictionPoints} onChange={update('convictionPoints')} />
            </label>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full rounded-lg bg-nova-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-nova-accent-deep disabled:opacity-50 transition-colors"
            >
              {state.loading ? 'Generating…' : 'Generate Cold Call Script · 3 credits'}
            </button>
            {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
          </form>

          <div className={`${CARD_CLASS} min-h-[16rem]`}>
            {state.script ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-nova-text">{state.script}</div>
            ) : (
              <p className="text-sm text-nova-text-muted">
                Your cold call script will appear here. Choose a lead or fill in details, then generate.
              </p>
            )}
          </div>
        </div>
      </div>
    </UpgradeGate>
  )
}
