// Route config for Terminal 4's screens. Terminal 2 (skeleton owner) imports APP_ROUTES
// into the root router — see the INTEGRATION REQUEST in BUILD-LOG.md for the exact wiring.
// Route paths match UI-Reference/_INDEX.md's verified route map (corrected 2026-07-20):
// /app/proposals does not exist (merged into /app/contracts), /app/leads is Lead Search
// (not a leads-list — that's /app/crm). T5's sites/domains/analytics routes preserved below.
//
// BUNDLE DIET (2026-07-21): every page/tool below is React.lazy() instead of a static
// import — each becomes its own on-demand chunk fetched only when its route is actually
// visited, rather than all ~20 being forced into the bundle every visitor downloads
// regardless of which single page (if any) they land on. AUTH_ROUTES'/APP_ROUTES' shape,
// paths, and nesting are UNCHANGED — this only swaps how each element's component is
// imported, zero routing-behavior risk. AppShell stays a normal static import (needed
// immediately for any /app/* path, and small); its own <Outlet/> already has a Suspense
// boundary (AppShell.jsx) so these lazy children have a fallback to suspend into.
import { lazy } from 'react'
import { useLocation } from 'react-router-dom'
import AppShell from './AppShell'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LeadSearch = lazy(() => import('./pages/LeadSearch'))
const Tracker = lazy(() => import('./pages/Tracker'))
const FollowUps = lazy(() => import('./pages/FollowUps'))
const Templates = lazy(() => import('./pages/Templates'))
const Crm = lazy(() => import('./pages/Crm'))
const Clients = lazy(() => import('./pages/Clients'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Revenue = lazy(() => import('./pages/Revenue'))
const Team = lazy(() => import('./pages/Team'))
const Credits = lazy(() => import('./pages/Credits'))
const Billing = lazy(() => import('./pages/Billing'))
const Discovery = lazy(() => import('./pages/Discovery'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Contracts = lazy(() => import('./pages/Contracts'))
const SupportTickets = lazy(() => import('./pages/SupportTickets'))
const Settings = lazy(() => import('./pages/Settings'))
const Tutorials = lazy(() => import('./pages/Tutorials'))
const ScriptGenerator = lazy(() => import('../tools/ScriptGenerator'))
const ProposalGenerator = lazy(() => import('../tools/ProposalGenerator'))
const ClientSites = lazy(() => import('../tools/ClientSites'))
const Domains = lazy(() => import('../tools/Domains'))
const Analytics = lazy(() => import('../tools/Analytics'))

// Reads the `lead` prefill passed via navigate(path, { state: { lead } }) from
// Crm.jsx / Contracts.jsx, since route elements can't receive props directly.
function ScriptGeneratorRoute() {
  const { state } = useLocation()
  return <ScriptGenerator lead={state?.lead} />
}

function ProposalGeneratorRoute() {
  const { state } = useLocation()
  return <ProposalGenerator lead={state?.lead} />
}

export const AUTH_ROUTES = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]

export const APP_ROUTES = {
  path: '/app',
  element: <AppShell />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'leads', element: <LeadSearch /> },
    { path: 'tracker', element: <Tracker /> },
    { path: 'followups', element: <FollowUps /> },
    { path: 'templates', element: <Templates /> },
    { path: 'discovery', element: <Discovery /> },
    { path: 'sites', element: <ClientSites /> },
    { path: 'domains', element: <Domains /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'crm', element: <Crm /> },
    { path: 'clients', element: <Clients /> },
    { path: 'tasks', element: <Tasks /> },
    { path: 'revenue', element: <Revenue /> },
    { path: 'team', element: <Team /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'contracts', element: <Contracts /> },
    { path: 'credits', element: <Credits /> },
    { path: 'billing', element: <Billing /> },
    { path: 'support', element: <SupportTickets /> },
    { path: 'settings', element: <Settings /> },
    { path: 'tutorials', element: <Tutorials /> },
    { path: 'scripts', element: <ScriptGeneratorRoute /> },
    { path: 'tools/script', element: <ScriptGeneratorRoute /> },
    { path: 'tools/proposal', element: <ProposalGeneratorRoute /> },
  ],
}
