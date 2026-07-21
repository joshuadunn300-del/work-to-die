import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Link, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import FixturePreview from './FixturePreview.jsx'
import ActivationWall from './app/pages/ActivationWall.jsx'
import { AUTH_ROUTES, APP_ROUTES } from './app/routes.jsx'

// BUNDLE DIET (2026-07-21): the real bundle-size win lives in routes.jsx now — every
// page/tool it used to import eagerly is wrapped in React.lazy() there instead, so each
// becomes its own on-demand chunk (finer-grained than splitting by top-level section, and
// zero change to AUTH_ROUTES'/APP_ROUTES' shape or the nested-route structure, so no
// routing-behavior risk). This file only lazy-loads the two branches that are safe/trivial
// to split at the App.jsx level because neither has react-router children of its own:
// Landing (marketing, "/") and Designer (the editor). Attempting to lazy-load the whole
// AUTH_ROUTES/APP_ROUTES tree from here instead (an earlier version of this diff) broke
// AppShell's nested <Outlet/> — those need real per-route `children` arrays that
// react-router matches natively, which a hand-rolled component-level lazy wrapper can't
// replicate; reverted in favor of the routes.jsx-level fix.
const Landing = lazy(() => import('./marketing/Landing.jsx'))
const Designer = lazy(() => import('./editor/Designer.jsx'))
const PricingPage = lazy(() => import('./marketing/PricingPage.jsx'))
const Terms = lazy(() => import('./marketing/Terms.jsx'))
const Privacy = lazy(() => import('./marketing/Privacy.jsx'))
const Refund = lazy(() => import('./marketing/Refund.jsx'))
const Contact = lazy(() => import('./marketing/Contact.jsx'))
const RequestFeature = lazy(() => import('./marketing/RequestFeature.jsx'))
const News = lazy(() => import('./marketing/News.jsx'))
const Affiliates = lazy(() => import('./marketing/Affiliates.jsx'))

function EnteringNova() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <div className="nova-icon-tile animate-spin" style={{ width: '3.5rem', height: '3.5rem', animationDuration: '1.1s' }} />
      <p className="text-sm text-white/50 tracking-wide">Entering Nova...</p>
    </div>
  )
}

function MinimalSpinner() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
    </div>
  )
}

// T4's routes.jsx now owns tools/script + tools/proposal directly (with lead-state
// wrappers) — no longer added here, avoids the duplicate-route bug from before.
// Lowercase `/app/designer` matches real Tenji (UI-Reference/_INDEX.md route map) and
// T4's AppShell nav link — also accept the capital-D form some in-flight files still use.
//
// Root ('/') now serves the marketing landing (T6 integration, 2026-07-21) instead of
// redirecting straight to /app — Nav's own session-aware Dashboard button (L1's territory)
// handles routing a logged-in visitor onward from there.
const devRoutes = import.meta.env.DEV
  ? [
      { path: '/dev', element: <Home /> },
      { path: '/preview/:slug', element: <FixturePreview /> },
      // Dev-only QA route for the activation wall (T2 wires the real gate into
      // AppShell.jsx — this is just for screenshotting the component in isolation).
      { path: '/dev/activation-wall', element: <ActivationWall onActivated={() => alert('activated!')} /> },
    ]
  : []

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Landing />
      </Suspense>
    ),
  },
  ...devRoutes,
  {
    path: '/pricing',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <PricingPage />
      </Suspense>
    ),
  },
  {
    path: '/terms',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Terms />
      </Suspense>
    ),
  },
  {
    path: '/privacy',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Privacy />
      </Suspense>
    ),
  },
  {
    path: '/refund',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Refund />
      </Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: '/request-feature',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <RequestFeature />
      </Suspense>
    ),
  },
  {
    path: '/news',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <News />
      </Suspense>
    ),
  },
  {
    path: '/affiliates',
    element: (
      <Suspense fallback={<MinimalSpinner />}>
        <Affiliates />
      </Suspense>
    ),
  },
  {
    path: '/app/designer',
    element: (
      <Suspense fallback={<EnteringNova />}>
        <Designer />
      </Suspense>
    ),
  },
  {
    path: '/app/Designer',
    element: (
      <Suspense fallback={<EnteringNova />}>
        <Designer />
      </Suspense>
    ),
  },
  ...AUTH_ROUTES,
  APP_ROUTES,
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center text-white/60">
        <p>
          Not found. <Link className="underline hover:text-white" to="/">Go home</Link>
        </p>
      </div>
    ),
  },
])

function App() {
  // Outer catch-all Suspense boundary: Login/Signup and AppShell's own app-page children
  // are lazy() now too (routes.jsx) but don't have a route-level Suspense wrapper the way
  // Landing/Designer do above — this is their fallback when no nearer one exists.
  // AppShell.jsx wraps its own <Outlet/> in a nearer "Entering Nova..." boundary, so /app/*
  // page navigations show that instead of falling through to this one.
  return (
    <Suspense fallback={<MinimalSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
