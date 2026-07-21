import ProFeatureGate from './ProFeatureGate'

// Parity target: 09 - Resources/UI-Reference/analytics.md (Pro wall, no data
// behind it on trial — verbatim copy below).
export default function Analytics() {
  return (
    <div>
      {/* Real tenji.ai/app/analytics has no page header — just the standalone wall card, confirmed via getComputedStyle (T5 PORTAL PARITY, 2026-07-21). */}
      <ProFeatureGate
        heading="Full Analytics"
        body="Track traffic, conversions, and performance across every published client site. Unlock the full analytics suite with Pro."
        bullets={[
          'Traffic & conversion trends',
          'Per-site performance ranking',
          'Lead capture analytics',
          'Traffic source breakdown',
        ]}
      />
    </div>
  )
}
