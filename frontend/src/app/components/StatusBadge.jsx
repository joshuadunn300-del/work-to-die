const STYLES = {
  none: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  poor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  decent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

const LABELS = { none: 'No website', poor: 'Poor website', decent: 'Decent website' }

export default function WebsiteStatusBadge({ status }) {
  const cls = STYLES[status] || 'bg-nova-surface-hover text-nova-text-muted'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {LABELS[status] || status || 'Unknown'}
    </span>
  )
}
