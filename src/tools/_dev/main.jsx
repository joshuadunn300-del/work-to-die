// TEMPORARY, Terminal-5-only test harness — not part of the app build.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '../../index.css';
import ScriptGenerator from '../ScriptGenerator.jsx';
import ProposalGenerator from '../ProposalGenerator.jsx';
import ClientSites from '../ClientSites.jsx';
import Domains from '../Domains.jsx';
import Analytics from '../Analytics.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter>
      <div className="min-h-screen bg-nova-bg text-nova-text p-8 space-y-16">
        <ClientSites />
        <hr className="border-nova-border" />
        <Domains />
        <hr className="border-nova-border" />
        <Analytics />
        <hr className="border-nova-border" />
        <ScriptGenerator />
        <hr className="border-nova-border" />
        <ProposalGenerator />
      </div>
    </MemoryRouter>
  </StrictMode>,
);
