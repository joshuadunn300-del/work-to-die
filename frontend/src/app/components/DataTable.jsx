// Generic list table reused by Leads/Clients/Tasks/Contracts/Proposals/SupportTickets —
// avoids six near-identical bespoke tables (ponytail rung 6: one component, column configs vary).
export default function DataTable({ columns, rows, keyField = 'id', emptyMessage = 'Nothing here yet.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="nova-card border-dashed p-10 text-center text-sm text-nova-text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto nova-card">
      <table className="min-w-full divide-y divide-white/[0.06] text-sm">
        <thead className="bg-white/[0.03]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2.5 text-left font-medium text-nova-text-muted whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <tr key={row[keyField]} className="hover:bg-white/[0.03]">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="px-4 py-2.5 align-middle whitespace-nowrap max-w-xs truncate"
                  title={typeof row[c.key] === 'string' ? row[c.key] : undefined}
                >
                  {c.render ? c.render(row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
