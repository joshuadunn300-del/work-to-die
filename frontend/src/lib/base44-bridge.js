// Wires a real @base44/sdk client to window.base44 so frontend/src/app/lib/api.js and
// auth.js (built by T4) flip from mock data to the real Nova Base44 backend.
// This is the ONLY thing those adapters check (`typeof window.base44 !== 'undefined'`).
import { createClient } from '@base44/sdk'

if (typeof window !== 'undefined' && !window.base44) {
  window.base44 = createClient({
    appId: '6a5e2a32604b8e5802285ce3', // Nova app id
  })
}
