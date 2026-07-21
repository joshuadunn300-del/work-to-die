import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getSession, logout } from '../lib/auth'
import { getSettings, updateSettings } from '../lib/api'
import { PALETTE_PRESETS } from '../lib/mockData'
import { planOf } from '../lib/entitlements'

// Rebuilt per UI-Reference/settings.md — single scrolling page of stacked cards
// (Profile, Plan, Discord, Preferences, Branding, Security, Danger Zone), no tabs.
export default function Settings() {
  const { entitlements } = useOutletContext()
  const navigate = useNavigate()
  const session = getSession()
  const [settings, setSettings] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)
  const [brandSaved, setBrandSaved] = useState(false)
  const [resetLinkSent, setResetLinkSent] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  function setField(key, value) {
    setSettings((s) => ({ ...s, [key]: value }))
    setProfileSaved(false)
    setBrandSaved(false)
  }

  function setEmailPref(key, value) {
    setSettings((s) => ({ ...s, email_notifications: { ...s.email_notifications, [key]: value } }))
  }

  async function saveProfile(e) {
    e.preventDefault()
    await updateSettings(settings)
    setProfileSaved(true)
  }

  async function saveBranding(e) {
    e.preventDefault()
    await updateSettings(settings)
    setBrandSaved(true)
  }

  function toggleTheme(theme) {
    setField('theme', theme)
    // Best-effort only: applies if the app's Tailwind config uses a class-based dark
    // variant. If T2's config is media-query-only this is a harmless no-op.
    document.documentElement.classList.toggle('dark', theme === 'dark')
    updateSettings({ ...settings, theme })
  }

  if (!settings) return <p className="text-sm text-nova-text-muted">Loading…</p>

  const plan = planOf(entitlements)
  // Real Tenji shows the raw plan key, not a humanized label — confirmed live via
  // tenji-Credits.png ("Free_trial Plan"), same convention reused here for consistency.
  const rawPlanKey = entitlements?.plan || 'trial'
  const rawPlanLabel = rawPlanKey.charAt(0).toUpperCase() + rawPlanKey.slice(1)
  // Real live accounts don't have a `palette_preset` field on the User entity at all
  // (found live: it comes back undefined, not 'nova') — fall back to Nova's own accent
  // rather than silently landing on whichever preset happens to be first in the map.
  const effectivePreset = settings.palette_preset || 'nova'
  const activeColors =
    effectivePreset === 'custom'
      ? { primary: settings.custom_primary || PALETTE_PRESETS.nova.primary, secondary: settings.custom_secondary || PALETTE_PRESETS.nova.secondary }
      : PALETTE_PRESETS[effectivePreset] || PALETTE_PRESETS.nova

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="nova-eyebrow mb-1">ACCOUNT</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-nova-text-muted">Your profile, preferences and integrations.</p>
      </div>

      {/* Profile */}
      <form onSubmit={saveProfile} className="nova-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Profile</h2>
          <p className="text-sm text-nova-text-muted">Your personal and agency details</p>
        </div>

        <div className="flex items-center gap-3">
          <div
            title="Hover the avatar to change your picture"
            className="group relative h-14 w-14 rounded-full bg-nova-accent text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
          >
            {settings.full_name?.[0]?.toUpperCase() || 'J'}
            <span className="absolute inset-0 rounded-full bg-black/50 text-xs items-center justify-center hidden group-hover:flex">
              Change
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{settings.full_name}</p>
            <p className="text-sm text-nova-text-muted">{session?.email}</p>
            <p className="text-xs text-nova-text-muted mt-0.5">Hover the avatar to change your picture</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              value={settings.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
              className="w-full nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              value={session?.email || ''}
              disabled
              className="w-full nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm opacity-60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="agency_name">Agency name</label>
            <input
              id="agency_name"
              placeholder="Your agency brand"
              value={settings.agency_name}
              onChange={(e) => setField('agency_name', e.target.value)}
              className="w-full nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="agency_bio">Agency bio</label>
          <textarea
            id="agency_bio"
            rows={3}
            placeholder="We build high-converting websites for local businesses…"
            value={settings.agency_bio}
            onChange={(e) => setField('agency_bio', e.target.value)}
            className="w-full nova-input-focus rounded-md border border-nova-border bg-transparent px-3 py-2 text-sm"
          />
          <p className="text-xs text-nova-text-muted mt-1">
            A short description of your agency — shown on proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="nova-btn-primary">
            Save Changes
          </button>
          {profileSaved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</span>}
        </div>
      </form>

      {/* Plan */}
      <section className="nova-card p-5">
        <h2 className="text-sm font-semibold">Plan</h2>
        <p className="text-sm text-nova-text-muted mb-3">Your current subscription</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {rawPlanLabel} Plan · {plan.monthlyCredits.toLocaleString()} credits/month
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/billing')}
            className="text-sm font-medium text-nova-accent"
          >
            Manage
          </button>
        </div>
      </section>

      {/* Discord */}
      <section className="nova-card p-5">
        <h2 className="text-sm font-semibold">Discord</h2>
        <p className="text-sm text-nova-text-muted mb-3">
          Link your Discord and sync your plan role automatically.
        </p>
        {settings.discord_connected ? (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Discord connected.</p>
        ) : (
          <>
            <p className="text-sm text-nova-text-muted mb-1">Connect your Discord account</p>
            <p className="text-sm text-nova-text-muted mb-3">
              Get your role automatically in the Nova server — updates when your plan changes.
            </p>
            <button
              type="button"
              onClick={() => setField('discord_connected', true)}
              className="nova-btn-primary mb-2"
            >
              Connect Discord
            </button>
            <p className="text-sm">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-nova-accent">
                Not in the server yet? Join the Nova community
              </a>
            </p>
          </>
        )}
      </section>

      {/* Preferences */}
      <section className="nova-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Preferences</h2>
          <p className="text-sm text-nova-text-muted">Theme and email notifications</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Appearance</p>
          <p className="text-sm text-nova-text-muted mb-2">Choose how Nova looks</p>
          <div className="inline-flex rounded-md border border-nova-border overflow-hidden">
            <button
              type="button"
              onClick={() => toggleTheme('dark')}
              className={`px-3 py-1.5 text-sm font-medium ${settings.theme === 'dark' ? 'bg-nova-accent text-white' : ''}`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => toggleTheme('light')}
              className={`px-3 py-1.5 text-sm font-medium ${settings.theme === 'light' ? 'bg-nova-accent text-white' : ''}`}
            >
              Light
            </button>
          </div>
        </div>

        <div>
          <p className="nova-eyebrow mb-2">EMAIL NOTIFICATIONS</p>
          {[
            { key: 'product_updates', label: 'Product updates', desc: 'New features and improvements' },
            { key: 'billing_credits', label: 'Billing & credits', desc: 'Receipts, credit alerts and renewals' },
            { key: 'tips_playbooks', label: 'Tips & playbooks', desc: 'Occasional guides to grow your agency' },
          ].map((n) => (
            <label key={n.key} className="flex items-center justify-between py-2 border-t border-nova-border first:border-t-0 cursor-pointer">
              <span>
                <span className="block text-sm font-medium">{n.label}</span>
                <span className="block text-sm text-nova-text-muted">{n.desc}</span>
              </span>
              <input
                type="checkbox"
                checked={settings.email_notifications[n.key]}
                onChange={(e) => setEmailPref(n.key, e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-5 w-9 shrink-0 rounded-full bg-white/10 transition-colors peer-checked:bg-nova-accent after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Branding */}
      <form onSubmit={saveBranding} className="nova-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Branding</h2>
          <p className="text-sm text-nova-text-muted">Defaults applied to new client sites in the builder</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default brand colour</label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {Object.entries(PALETTE_PRESETS).map(([key, colors]) => (
              <button
                type="button"
                key={key}
                onClick={() => setField('palette_preset', key)}
                className={`h-9 w-9 rounded-full border-2 ${effectivePreset === key ? 'border-white' : 'border-transparent'}`}
                style={{ background: `linear-gradient(135deg, ${colors.primary} 50%, ${colors.secondary} 50%)` }}
                aria-label={`${key} preset`}
                title={key}
              />
            ))}
            <button
              type="button"
              onClick={() => setField('palette_preset', 'custom')}
              className={`h-9 w-9 rounded-full border text-sm ${effectivePreset === 'custom' ? 'border-white' : 'border-nova-border'}`}
            >
              ＋
            </button>
          </div>
          {effectivePreset === 'custom' && (
            <div className="flex gap-4 mb-2">
              <label className="text-xs text-nova-text-muted flex items-center gap-2">
                Primary
                <input type="color" value={settings.custom_primary || '#4f46e5'} onChange={(e) => setField('custom_primary', e.target.value)} />
              </label>
              <label className="text-xs text-nova-text-muted flex items-center gap-2">
                Secondary
                <input type="color" value={settings.custom_secondary || '#111827'} onChange={(e) => setField('custom_secondary', e.target.value)} />
              </label>
            </div>
          )}
          <p className="text-xs text-nova-text-muted font-mono">{activeColors.primary}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Agency logo</label>
          <label className="inline-flex items-center gap-2 rounded-md border border-nova-border px-3 py-2 text-sm cursor-pointer hover:bg-nova-surface-hover">
            <span>{settings.logo_url ? 'Change logo' : 'Upload logo'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setField('logo_url', URL.createObjectURL(file))
              }}
              className="hidden"
            />
          </label>
          <p className="text-xs text-nova-text-muted mt-1">Used as the default logo on generated client sites.</p>
          {settings.logo_url && (
            <img src={settings.logo_url} alt="Agency logo preview" className="mt-2 h-12 w-12 rounded object-cover" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="nova-btn-primary">
            Save Branding
          </button>
          {brandSaved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</span>}
        </div>
      </form>

      {/* Security */}
      <section className="nova-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Security</h2>
          <p className="text-sm text-nova-text-muted">Login method and account access</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Login method — email</span>
          <span className="text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5">Active</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Change password</p>
            <p className="text-sm text-nova-text-muted">We'll email you a secure reset link</p>
          </div>
          <button
            type="button"
            onClick={() => setResetLinkSent(true)}
            className="rounded-md border border-nova-border px-3 py-1.5 text-sm font-medium"
          >
            {resetLinkSent ? 'Link sent' : 'Send link'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Sign out everywhere</p>
            <p className="text-sm text-nova-text-muted">End your session on all devices</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className="rounded-md border border-nova-border px-3 py-1.5 text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-nova border border-rose-300 dark:border-rose-800 p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger Zone</h2>
          <p className="text-sm text-nova-text-muted">Irreversible actions</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-sm text-nova-text-muted">
              Permanently removes your account, sites, leads and data.
            </p>
          </div>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE"'
            className="w-32 nova-input-focus rounded-md border border-nova-border bg-transparent px-2 py-1.5 text-sm"
          />
          {/* Intentionally no onClick: real account deletion needs a backend endpoint
              (T1) plus a second explicit confirmation step — not wiring a destructive
              no-op or a fake-success path here. */}
          <button
            type="button"
            disabled={deleteConfirm !== 'DELETE'}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete account
          </button>
        </div>
      </section>
    </div>
  )
}
