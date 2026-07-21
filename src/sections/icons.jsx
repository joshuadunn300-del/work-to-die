import { DynamicIcon, iconNames } from 'lucide-react/dynamic'

// Template data (lib/templates/*.js) names icons with kebab-case Lucide names
// ("droplets", "grid-3x3", "building-2") — matches real Tenji's actual embedded
// SVGs, and matches lucide's own dynamic-import key format exactly (verified
// against node_modules/lucide-react/dynamicIconImports.mjs), so no case
// conversion is needed.
//
// BUNDLE DIET (2026-07-21): previously `import * as LucideIcons from 'lucide-react'`
// pulled the entire icon set into the main chunk (~650kB) just so any of the 59
// niches' icon names could resolve at runtime. `lucide-react/dynamic`'s DynamicIcon
// code-splits each icon into its own tiny chunk, fetched only when that specific
// icon name is actually rendered — same runtime capability, none of the bundle cost.
const iconNameSet = new Set(iconNames)

/**
 * Renders a Lucide icon by kebab-case name, code-split per icon. Falls back to
 * 'sparkles' for a missing/unknown name (never renders nothing).
 */
export function NovaIcon({ name, ...props }) {
  const resolved = name && iconNameSet.has(name) ? name : 'sparkles'
  return <DynamicIcon name={resolved} {...props} />
}
