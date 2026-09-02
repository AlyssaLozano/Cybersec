/**
 * The terminal.
 *
 * Built as a plain React component rather than with xterm.js. The specification
 * suggested "xterm.js or similar", and the deciding factor is that xterm.js is a
 * terminal *emulator* for a real PTY: it wants to own every keystroke and render
 * a character grid. This terminal has no PTY behind it -- each command is a round
 * trip to a grader -- and the exercise UI needs to interleave non-terminal
 * elements with the output. A scrollback list plus a controlled input does that
 * in a fraction of the code, and keeps the whole thing accessible to a screen
 * reader.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import type { ScrollbackEntry } from '@soc/shared';

interface TerminalProps {
  scrollback: ScrollbackEntry[];
  cwd: string;
  busy: boolean;
  disabled?: boolean;
  /** Text to drop into the input, e.g. when a student clicks a worked example. */
  prefill?: string | null;
  onPrefillConsumed?: () => void;
  onRun: (input: string) => void;
  onReset: () => void;
}

/** Shorten a path the way a shell prompt does: /home/student becomes ~. */
function promptPath(cwd: string): string {
  if (cwd === '/home/student') return '~';
  if (cwd.startsWith('/home/student/')) return '~' + cwd.slice('/home/student'.length);
  return cwd;
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="ps1">
      student@rmg-web-02:<span className="path">{promptPath(cwd)}</span>${' '}
    </span>
  );
}

export function Terminal({
  scrollback,
  cwd,
  busy,
  disabled,
  prefill,
  onPrefillConsumed,
  onRun,
  onReset,
}: TerminalProps) {
  const [value, setValue] = useState('');
  /** Command history, newest last, navigated with the arrow keys. */
  const [history, setHistory] = useState<string[]>([]);
  /** How far back through history we are; null means "editing a fresh line". */
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest output in view, the way a real terminal does.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [scrollback, busy]);

  // Return focus to the input once a command finishes.
  useEffect(() => {
    if (!busy && !disabled) inputRef.current?.focus();
  }, [busy, disabled]);

  // Load a clicked example into the input, but never run it: the student still
  // presses Enter, so nothing executes that they did not choose to execute.
  useEffect(() => {
    if (prefill === null || prefill === undefined) return;
    setValue(prefill);
    inputRef.current?.focus();
    onPrefillConsumed?.();
  }, [prefill, onPrefillConsumed]);

  /** True once the buffer holds more than one line, e.g. a here-document. */
  const multiline = value.includes('\n');

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed === '' || busy || disabled) return;
    setHistory((previous) => [...previous, trimmed]);
    setHistoryIndex(null);
    setValue('');
    onRun(trimmed);
  };

  const handleKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter runs, Shift+Enter adds a line. That is the wrong way round for a
    // text box and the right way round for a prompt, which is what this is:
    // every command is one line until somebody opens a here-document, and
    // making the common case need a modifier would tax every student to serve
    // the few exercises that author a rule file.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
      return;
    }
    if (event.key === 'Enter') return;

    // History navigation only makes sense while the buffer is a single line.
    // Inside a here-document the arrows have to move the cursor, or the body
    // cannot be edited.
    if (multiline) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? '');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue('');
        return;
      }
      setHistoryIndex(next);
      setValue(history[next] ?? '');
      return;
    }

    // Ctrl+L clears the view, as in a real shell.
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      onReset();
    }
  };

  return (
    <div className="terminal-wrap">
      <div className="terminal-bar">
        <span className="host">rmg-web-02</span>
        <span>ssh session (simulated)</span>
        <span className="spacer" />
        <button className="btn" onClick={onReset} title="Clear the screen and restart this exercise">
          Restart exercise
        </button>
      </div>

      <div
        className="scrollback"
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus()}
      >
        {scrollback.map((entry, index) => {
          if (entry.kind === 'system') {
            return (
              <div className="sys" key={index}>
                {entry.text}
              </div>
            );
          }
          if (entry.kind === 'command') {
            return (
              <div className="cmd" key={index}>
                <Prompt cwd={entry.cwd ?? cwd} />
                {entry.text}
              </div>
            );
          }
          return (
            <div className={`out${entry.exitCode && entry.exitCode !== 0 ? ' err' : ''}`} key={index}>
              {entry.text.replace(/\n$/, '')}
            </div>
          );
        })}
        {busy && <div className="sys">running…</div>}
      </div>

      <div className={`input-row${multiline ? ' multiline' : ''}`}>
        <Prompt cwd={cwd} />
        <textarea
          ref={inputRef}
          value={value}
          rows={multiline ? Math.min(value.split('\n').length + 1, 16) : 1}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal input"
          placeholder={disabled ? 'Exercise complete' : busy ? '' : 'type a command and press Enter'}
          disabled={busy || disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {multiline && (
        <div className="input-hint">
          Shift+Enter for a new line, Enter to run. A here-document ends when you type its
          terminator on a line of its own.
        </div>
      )}
    </div>
  );
}
