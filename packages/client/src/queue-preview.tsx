/**
 * TEMPORARY harness. Renders the real AlertQueue against the real seeded queue
 * so it can be looked at without signing in. Delete when done.
 */

import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AlertQueue } from './components/AlertQueue';
import fixture from './_queue.json';

import './styles.css';
import './alerts.css';

const { queue, analyses } = fixture as any;

function Preview() {
  const [entries, setEntries] = useState<any[]>([]);
  const [withCopilot, setWithCopilot] = useState(false);

  const decided = entries.filter((e) => e.decision).length;

  return (
    <div className="app" style={{ padding: '1.5rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>The SOC Operator's screen</h1>
        <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          exercise triage.1.1, queue {queue.id}, {queue.alerts.length} alerts, {decided} dispositioned
        </span>
        <button
          type="button"
          onClick={() => setWithCopilot((v) => !v)}
          style={{ marginLeft: 'auto' }}
        >
          {withCopilot ? 'Hide the copilot' : 'Show the copilot (module 5)'}
        </button>
      </div>

      <AlertQueue
        queue={queue}
        entries={entries}
        onChange={setEntries}
        onSubmit={() => undefined}
        busy={false}
        {...(withCopilot
          ? {
              copilot: {
                analyses,
                consultedAlertIds: Object.keys(analyses),
                loadingAlertId: null,
                error: null,
                onAsk: () => undefined,
              },
            }
          : {})}
      />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
