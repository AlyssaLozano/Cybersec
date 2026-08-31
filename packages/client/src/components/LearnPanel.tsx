/**
 * The "learn it before you try it" panel.
 *
 * Sits above the terminal and gives a student four escalating ways to get
 * unstuck, so nobody is ever left staring at a prompt with nowhere to go:
 *
 *   1. The concept, syntax, flags, and worked examples -- open by default until
 *      the student passes, then collapsed to stay out of the way on review.
 *   2. Hints, one at a time, on request.
 *   3. The worked answer, behind a deliberate second click.
 *   4. `help` in the terminal itself, for the full command list.
 *
 * The worked examples never use the exercise's own answer. They teach the shape
 * of the command against a different target, so the student still has to make
 * the final step themselves.
 */

import { useState } from 'react';

import type { Teach } from '@soc/shared';

interface LearnPanelProps {
  teach: Teach;
  hints: string[];
  hintCount: number;
  solution?: string;
  /** Collapsed by default once the exercise is behind them. */
  startCollapsed: boolean;
  busy: boolean;
  onRequestHint: () => void;
  onRequestSolution: () => void;
  /** Puts a command into the terminal input so it can be tried immediately. */
  onTryExample: (command: string) => void;
}

export function LearnPanel({
  teach,
  hints,
  hintCount,
  solution,
  startCollapsed,
  busy,
  onRequestHint,
  onRequestSolution,
  onTryExample,
}: LearnPanelProps) {
  const [open, setOpen] = useState(!startCollapsed);
  const [confirmingSolution, setConfirmingSolution] = useState(false);

  const hintsLeft = hintCount - hints.length;

  return (
    <section className="learn">
      <button className="learn-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className={`chevron${open ? ' open' : ''}`}>▸</span>
        How this works
        {!open && <span className="learn-toggle-note">tap to read before you try</span>}
      </button>

      {open && (
        <div className="learn-body">
          <p className="concept">{teach.concept}</p>

          {teach.syntax && (
            <div className="syntax">
              <span className="tag">Shape of the command</span>
              <code>{teach.syntax}</code>
            </div>
          )}

          {teach.flags && teach.flags.length > 0 && (
            <dl className="flags">
              {teach.flags.map((entry) => (
                <div className="flag-row" key={entry.flag}>
                  <dt>
                    <code>{entry.flag}</code>
                  </dt>
                  <dd>{entry.means}</dd>
                </div>
              ))}
            </dl>
          )}

          {teach.examples && teach.examples.length > 0 && (
            <div className="examples">
              <span className="tag">Examples (not the answer)</span>
              {teach.examples.map((example) => (
                <div className="example" key={example.command}>
                  <button
                    className="example-cmd"
                    title="Put this in the terminal so you can try it"
                    onClick={() => onTryExample(example.command)}
                  >
                    {example.command}
                  </button>
                  <span className="example-note">{example.explains}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hints.length > 0 && (
        <ol className="hints">
          {hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ol>
      )}

      {!solution && (
        <div className="help-actions">
          {hintsLeft > 0 && (
            <button className="btn" onClick={onRequestHint} disabled={busy}>
              {hints.length === 0 ? 'Give me a hint' : `Another hint (${hintsLeft} left)`}
            </button>
          )}

          {confirmingSolution ? (
            <span className="confirm">
              Show the worked answer?
              <button className="btn" onClick={onRequestSolution} disabled={busy}>
                Yes, show it
              </button>
              <button className="btn ghost" onClick={() => setConfirmingSolution(false)}>
                Not yet
              </button>
            </span>
          ) : (
            <button className="btn ghost" onClick={() => setConfirmingSolution(true)} disabled={busy}>
              Show me the answer
            </button>
          )}
        </div>
      )}

      {solution && (
        <div className="revealed">
          <span className="tag">Worked answer</span>
          <button
            className="example-cmd"
            title="Put this in the terminal"
            onClick={() => onTryExample(solution)}
          >
            {solution}
          </button>
          <span className="example-note">
            You still need to run it. Type it yourself if you can -- it sticks better.
          </span>
        </div>
      )}
    </section>
  );
}
