import { useOutletContext } from 'react-router-dom'
import { canUseFeature } from '../lib/entitlements'
import ProFeatureGate from '../../tools/ProFeatureGate'

export default function Team() {
  const { entitlements } = useOutletContext()
  const allowed = canUseFeature(entitlements, 'team')

  return (
    <div>
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <h1 className="text-xl font-semibold mb-1">Team Members</h1>
      <p className="text-sm text-nova-text-muted mb-6">Invite and manage your team.</p>

      {allowed ? (
        <p className="text-sm text-nova-text-muted">Team management UI goes here (Agency plan confirmed).</p>
      ) : (
        <ProFeatureGate
          eyebrow="Agency Exclusive"
          heading="Team Members"
          body="Invite up to 5 team members to share your agency workspace and credit pool."
          ctaLabel="Upgrade to Agency →"
        />
      )}
    </div>
  )
}
