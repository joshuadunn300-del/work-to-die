import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '../../index.css'; // Tailwind + fonts — needed in THIS document so syncStylesIntoIframe has something to clone.
import Designer from '../Designer.jsx';

// MemoryRouter (not BrowserRouter) — this harness has no real routes to serve, it just
// needs SOME router context for Designer's useNavigate() (the toolbar back button) to work.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter>
      <Designer />
    </MemoryRouter>
  </StrictMode>,
);
