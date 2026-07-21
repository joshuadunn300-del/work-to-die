import { canUseFeature } from '../lib/entitlements'

// Wraps Pro+ gated screens/sections. Matches Tenji: scripts/proposals/full analytics
// require Pro or Agency; gating is UI-only here — server-side enforcement is Terminal 1's job.
export default function UpgradeGate({ entitlements, feature, label, children }) {
  if (canUseFeature(entitlements, feature)) return children

  return (
    <div className="rounded-nova border border-nova-border bg-nova-surface p-10 text-center">
      <p className="text-sm font-medium text-nova-text">
        {label || 'This feature'} is available on Pro and Agency plans.
      </p>
      <p className="mt-1 text-sm text-nova-text-muted">
        Upgrade your plan to unlock it.
      </p>
      <button
        type="button"
        className="mt-4 rounded-md bg-nova-accent px-4 py-2 text-sm font-medium text-white hover:bg-nova-accent-deep"
      >
        Upgrade plan
      </button>
    </div>
  )
}
