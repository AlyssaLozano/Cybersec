/**
 * Standalone preview for the Terminal, following the pattern of
 * home-preview.tsx.
 *
 * Exists because the Terminal is otherwise only reachable after signing in with
 * an entry code and opening an exercise, which makes checking a change to the
 * input row far more expensive than the change itself. Here-document support
 * turned the single-line input into a growing textarea, and that is a visual
 * change that ought to be looked at rather than assumed.
 *
 * The scrollback below is real output copied from the engine, so what renders
 * here is what a student sees.
 */

import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Terminal } from './src/components/Terminal';
import './src/styles.css';

const OPENING = [
  { kind: 'system' as const, text: 'Simulated session on rmg-web-02. Type a command and press Enter.' },
  { kind: 'command' as const, text: "cat > rule.yar <<'EOF'", cwd: '/home/student' },
  { kind: 'output' as const, text: '', exitCode: 0 },
  { kind: 'command' as const, text: 'cat rule.yar', cwd: '/home/student' },
  {
    kind: 'output' as const,
    text: 'rule Northwind_Dropper\n{\n    strings:\n        $a = "sysmon" ascii\n    condition:\n        $a\n}\n',
    exitCode: 0,
  },
];

function Preview() {
  const [scrollback, setScrollback] = useState(OPENING);

  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: 'min(900px, 100%)' }}>
        <Terminal
          scrollback={scrollback}
          cwd="/home/student"
          busy={false}
          disabled={false}
          onRun={(input) =>
            setScrollback((previous) => [
              ...previous,
              { kind: 'command' as const, text: input, cwd: '/home/student' },
              { kind: 'output' as const, text: `(preview: ${input.split('\n').length} line(s) submitted)`, exitCode: 0 },
            ])
          }
          onReset={() => setScrollback(OPENING)}
        />
      </div>
    </div>
  );
}

const el = document.getElementById('root');
if (el) createRoot(el).render(<Preview />);
