import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swords, LayoutGrid, Menu, X } from 'lucide-react'
import { getSession } from '../../app/lib/auth'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'News', href: '/news' },
  { label: 'Affiliates', href: '/affiliates' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [session, setSession] = useState(null)
  // Live tenji.ai collapses to a hamburger + drawer below md — ours previously just hid
  // the link list with no way to reach Features/Pricing/News/Affiliates/Contact on mobile.
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setSession(getSession())
  }, [])

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(96vw,72rem)] -translate-x-1/2">
      <nav className="flex items-center justify-between gap-4 rounded-full border border-nova-border bg-[#0a0b10]/90 px-4 py-2.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 pl-1 pr-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nova-accent/15 text-nova-accent">
            <Swords className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-nova-text">
            nova<span className="text-nova-accent">.ai</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={
                  link.label === 'Home'
                    ? 'rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-nova-text'
                    : 'rounded-full px-3.5 py-1.5 text-sm font-medium text-nova-text-muted transition-colors hover:text-nova-text'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pr-0.5">
          {session ? (
            <>
              <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-nova-accent-bright to-nova-accent-deep text-[13px] font-semibold text-white md:flex">
                {(session.name || session.email || '?')[0].toUpperCase()}
              </span>
              <Link
                to="/app"
                className="hidden items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-nova-text transition-colors hover:bg-white/15 md:flex"
              >
                <LayoutGrid className="h-4 w-4" />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* Frozen tenji.ai reference (localhost:8000, logged-out state) renders a single
                  CTA pill here, no separate "Log in" link — Sign In stays reachable via the
                  footer's "Get Started" column and the mobile drawer below. */}
              <Link
                to="/signup"
                className="hidden whitespace-nowrap rounded-full bg-gradient-to-b from-nova-accent-bright to-nova-accent-deep px-4 py-1.5 text-sm font-semibold text-black shadow-[0_6px_18px_-4px_rgba(242,56,111,0.6)] transition-transform hover:scale-[1.03] sm:inline-flex"
              >
                Try Today
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-nova-text md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mt-2 rounded-2xl border border-nova-border bg-[#0a0b10]/95 p-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-nova-text-muted transition-colors hover:bg-white/5 hover:text-nova-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-2 border-t border-nova-border pt-3">
            {session ? (
              <Link
                to="/app"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-nova-text"
              >
                <LayoutGrid className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-3.5 py-2 text-center text-sm font-medium text-nova-text-muted"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-gradient-to-b from-nova-accent-bright to-nova-accent-deep px-3.5 py-2 text-center text-sm font-semibold text-black"
                >
                  Try Today
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
