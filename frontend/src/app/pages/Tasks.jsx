import { useEffect, useState } from 'react'
import { SquareCheck } from 'lucide-react'
import { createTask, listTasks, updateTask } from '../lib/api'

export default function Tasks() {
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('open')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    listTasks().then(setTasks).catch((err) => setError(err.message || 'Failed to load tasks.'))
  }, [])

  async function toggleDone(task) {
    const nextStatus = task.status === 'done' ? 'open' : 'done'
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)))
    try {
      await updateTask(task.id, { status: nextStatus })
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)))
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    const task = await createTask({ title: title.trim(), due_date: dueDate, priority })
    setTasks((prev) => [task, ...(prev || [])])
    setTitle('')
    setDueDate('')
    setPriority('medium')
  }

  const filtered = (tasks || []).filter((t) => (filter === 'open' ? t.status !== 'done' : t.status === 'done'))

  return (
    <div className="max-w-4xl">
      <p className="nova-eyebrow mb-1">AGENCY</p>
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Tasks</h1>
      <p className="text-sm text-nova-text-muted mb-6">Keep your agency moving — calls, builds, follow-ups, launches.</p>

      <form onSubmit={handleAdd} className="nova-card p-3 flex flex-wrap gap-2 mb-4">
        <input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[200px] nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="nova-input-focus rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="nova-btn-primary">
          ＋ Add
        </button>
      </form>

      <div className="flex gap-1 mb-4">
        {[
          { key: 'open', label: 'Open' },
          { key: 'done', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === tab.key ? 'bg-nova-accent text-white' : 'text-nova-text-muted hover:bg-nova-surface-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {tasks === null && !error ? (
        <p className="text-sm text-nova-text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="nova-empty-card">
          <div className="nova-empty-icon-tile mx-auto mb-4"><SquareCheck size={22} /></div>
          <p className="text-lg font-semibold">{filter === 'open' ? 'No open tasks' : 'No completed tasks'}</p>
          <p className="text-sm text-nova-text-muted mt-1">
            {filter === 'open' ? "You're all caught up. Add your next move above." : 'Finished tasks will show up here.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((t) => (
            <li key={t.id} className="flex items-center gap-3 nova-card px-3 py-2">
              <input type="checkbox" checked={t.status === 'done'} onChange={() => toggleDone(t)} className="h-4 w-4" />
              <span className={`flex-1 text-sm ${t.status === 'done' ? 'line-through text-nova-text-muted' : ''}`}>{t.title}</span>
              {t.related_to && <span className="text-xs text-nova-text-muted">{t.related_to}</span>}
              <span className="text-xs text-nova-text-muted">{t.priority}</span>
              <span className="text-xs text-nova-text-muted">{t.due_date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
