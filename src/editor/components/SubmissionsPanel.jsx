import { useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';

// Loads real inbound form-fills for THIS site. serveSite (the public function that serves
// published sites) writes a Submission row server-side on every form POST — logged-out
// visitors can't touch the entity API directly, so the write is proxied there. Here we just
// read them back for the site's owner, filtered by generated_site_id (the site being edited).
// ponytail: frontend filters by site id; entity read-access is app-wide, so tighten Submission
// RLS in Base44 if cross-owner isolation ever matters for real customers.
export default function SubmissionsPanel({ siteId }) {
  const [submissions, setSubmissions] = useState([]);
  const [state, setState] = useState('loading'); // loading | ready | error | offline
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (typeof window === 'undefined' || !window.base44 || !siteId || siteId === 'local-preview') {
      setState('offline');
      return;
    }
    window.base44.entities.Submission
      .filter({ generated_site_id: siteId })
      // sort newest-first client-side — avoids depending on the SDK's filter() sort-arg position
      .then((rows) => { if (alive) { setSubmissions((rows || []).slice().sort((a, b) => new Date(b.created_date) - new Date(a.created_date))); setState('ready'); } })
      .catch((e) => { if (alive) { setError(e.message || String(e)); setState('error'); } });
    return () => { alive = false; };
  }, [siteId]);

  return (
    <div className="side-panel" data-testid="submissions-panel">
      <h3>Submissions</h3>
      {state === 'loading' && <p className="panel-note">Loading…</p>}
      {state === 'error' && <p className="panel-note">Couldn't load submissions: {error}</p>}
      {(state === 'offline' || (state === 'ready' && submissions.length === 0)) ? (
        <div className="submissions-empty">
          {/* Verified live against tenji.ai/app/editor's real Submissions tab: plain muted
              outline inbox icon (no colored tile), and the copy is "Use Preview mode to test
              it." — this file's old copy ("Publish the site and share its link...") didn't
              match the real product. */}
          <Inbox className="submissions-empty-icon" size={28} />
          <p className="submissions-empty-title">No submissions yet</p>
          <p className="panel-note">When visitors submit the quote form on this site, their answers will appear here. Use Preview mode to test it.</p>
        </div>
      ) : (
        <ul className="submissions-list">
          {submissions.map((s) => (
            <li key={s.id}>
              <strong>{s.name || 'Someone'}</strong>{s.phone ? ` — ${s.phone}` : ''}<br />
              {s.email && <><span>{s.email}</span><br /></>}
              {s.service && <><span className="sub-service">{s.service}</span><br /></>}
              {s.message && <><span>{s.message}</span><br /></>}
              <small>{s.created_date ? new Date(s.created_date).toLocaleString() : ''}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
