/**
 * The answer surface for multiple-choice and short-answer exercises.
 *
 * WHY SHORT ANSWERS ARE GRADED THE WAY THEY ARE
 *
 * A short-answer exercise here is checked for whether it hits the required
 * concepts, not for prose quality — no grader can fairly mark writing style, and
 * pretending to would fail people for phrasing. The student is told this
 * explicitly below, because an unexplained free-text box invites either a
 * one-word answer or an essay, and neither is what is being asked for.
 */

import { useState } from 'react';

import type { ExerciseKind } from '@soc/shared';

export interface WrittenAnswerProps {
  kind: ExerciseKind;
  options: Array<{ id: string; label: string }>;
  busy: boolean;
  onSubmit: (answer: { selectedOptionIds?: string[]; answerText?: string }) => void;
}

export function WrittenAnswer({ kind, options, busy, onSubmit }: WrittenAnswerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState('');

  if (kind === 'multiple-choice') {
    return (
      <section className="written-answer">
        <ul className="written-answer__options">
          {options.map((option) => (
            <li key={option.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={(event) =>
                    setSelected((current) =>
                      event.target.checked
                        ? [...current, option.id]
                        : current.filter((id) => id !== option.id),
                    )
                  }
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
        {/* Checkboxes rather than radios even when one answer is expected: the
            prompt says whether to select one or several, and radio buttons would
            silently give away that the answer is singular. */}
        <button
          type="button"
          disabled={busy || selected.length === 0}
          onClick={() => onSubmit({ selectedOptionIds: selected })}
        >
          {busy ? 'Checking…' : 'Submit answer'}
        </button>
      </section>
    );
  }

  return (
    <section className="written-answer">
      <label className="written-answer__field">
        Your answer
        <textarea
          rows={8}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write in your own words. A few sentences is usually right."
        />
      </label>
      <p className="written-answer__note">
        Graded on whether you cover the necessary points, not on style or length. There is no single
        correct wording.
      </p>
      <button
        type="button"
        disabled={busy || text.trim().length === 0}
        onClick={() => onSubmit({ answerText: text })}
      >
        {busy ? 'Checking…' : 'Submit answer'}
      </button>
    </section>
  );
}
