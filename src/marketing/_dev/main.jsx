import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import '../../index.css'
import Landing from '../Landing.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  </StrictMode>,
)
