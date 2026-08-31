/**
 * The Career Fit Analyzer question flow.
 *
 * DESIGN CONSTRAINTS THAT SHAPED THIS
 *
 * Seventy items is a lot to ask of somebody who has not yet seen any value from
 * the platform. Three things carry the weight:
 *
 *   1. Answers save the moment they are given. Closing the tab costs only the
 *      questions not yet reached, so abandoning is cheap and returning is easy.
 *   2. Progress is shown by dimension, not just overall, so the end is always
 *      visible and a section feels finishable.
 *   3. You can stop and see partial results at any point. A result built from
 *      thirty answers is worth having, and it is labelled as less certain rather
 *      than withheld.
 *
 * One item at a time, rather than a wall of them: a long scrolling form invites
 * pattern-answering, which is exactly what the reverse-coded items exist to
 * catch. Slowing people down slightly makes the instrument work better.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Dimension, ItemResponse } from '@soc/shared';

import { assessment, type AssessmentState, type ClientItem } from '../lib/api';

const LIKERT_LABELS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

interface AssessmentProps {
  onComplete: () => void;
  onExit: () => void;
}

export function Assessment({ onComplete, onExit }: AssessmentProps) {
  const [items, setItems] = useState<ClientItem[] | null>(null);
  const [disclaimer, setDisclaimer] = useState('');
  const [state, setState] = useState<AssessmentState | null>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([assessment.items(), assessment.state()])
      .then(([itemResult, stateResult]) => {
        setItems(itemResult.items);
        setDisclaimer(itemResult.disclaimer);
        setState(stateResult);

        // Resume where they left off rather than at the beginning.
        const next = stateResult.nextItemId;
        const resumeAt = next ? itemResult.items.findIndex((item) => item.id === next) : 0;
        setIndex(resumeAt === -1 ? 0 : resumeAt);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load the assessment.'));
  }, []);

  /** Answers so far, keyed by item, so navigating back shows what was chosen. */
  const answers = useMemo(() => {
    const map = new Map<string, ItemResponse>();
    for (const response of state?.responses ?? []) map.set(response.itemId, response);
    return map;
  }, [state]);

  const answer = useCallback(
    async (response: ItemResponse) => {
      setBusy(true);
      setError(null);
      try {
        const updated = await assessment.save([response]);
        setState(updated);
        // Advance automatically: the answer IS the "next" action, and an extra
        // click per question adds seventy clicks to the flow.
        setIndex((current) => Math.min(current + 1, (items?.length ?? 1) - 1));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Could not save that answer.');
      } finally {
        setBusy(false);
      }
    },
    [items],
  );

  if (error && !items) return <div className="centered-note error">{error}</div>;
  if (!items || !state) return <div className="centered-note">Loading the assessment…</div>;

  const item = items[index];
  const answered = state.answeredItems;
  const percent = Math.round((answered / state.totalItems) * 100);
  const allAnswered = answered >= state.totalItems;

  return (
    <div className="assessment">
      <header className="assessment-head">
        <div>
          <h1>Career Fit Analyzer</h1>
          <p className="muted">{disclaimer}</p>
        </div>
        <button type="button" className="ghost" onClick={onExit}>
          Save and exit
        </button>
      </header>

      <div className="assessment-progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">
          {answered} of {state.totalItems} answered
        </span>
      </div>

      <div className="dimension-strip">
        {state.dimensions.map((dimension) => (
          <div
            key={dimension.dimension}
            className={`dimension-chip${dimension.complete ? ' complete' : ''}${
              item?.dimension === dimension.dimension ? ' current' : ''
            }`}
            title={`${dimension.answered} of ${dimension.total} answered`}
          >
            <span className="dimension-name">{dimension.label}</span>
            <span className="dimension-count">
              {dimension.answered}/{dimension.total}
            </span>
          </div>
        ))}
      </div>

      {item ? (
        <QuestionCard
          item={item}
          existing={answers.get(item.id)}
          busy={busy}
          onAnswer={answer}
        />
      ) : null}

      {error ? <p className="inline-error">{error}</p> : null}

      <nav className="assessment-nav">
        <button type="button" className="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Previous
        </button>
        <span className="muted">
          Question {index + 1} of {items.length}
        </span>
        <button
          type="button"
          className="ghost"
          disabled={index >= items.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Skip →
        </button>
      </nav>

      <footer className="assessment-foot">
        <button type="button" className="primary" disabled={answered === 0 || busy} onClick={onComplete}>
          {allAnswered ? 'See my results' : `See results so far (${answered} answers)`}
        </button>
        {!allAnswered && answered > 0 ? (
          <p className="muted small">
            You can stop here. Fewer answers means a less certain result, and the report will say so
            rather than pretending otherwise.
          </p>
        ) : null}
      </footer>
    </div>
  );
}

function QuestionCard({
  item,
  existing,
  busy,
  onAnswer,
}: {
  item: ClientItem;
  existing: ItemResponse | undefined;
  busy: boolean;
  onAnswer: (response: ItemResponse) => void;
}) {
  if (item.kind === 'likert') {
    return (
      <section className="question-card">
        <p className="question-statement">{item.statement}</p>
        <div className="likert">
          {LIKERT_LABELS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={busy}
              className={`likert-option${existing?.value === option.value ? ' selected' : ''}`}
              onClick={() => onAnswer({ itemId: item.id, value: option.value })}
            >
              <span className="likert-dot" aria-hidden="true" />
              <span className="likert-label">{option.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="question-card">
      <p className="question-statement">{item.prompt}</p>
      {item.detail ? <p className="question-detail">{item.detail}</p> : null}
      <div className="choice-list">
        {item.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={busy}
            className={`choice-option${existing?.optionId === option.id ? ' selected' : ''}`}
            onClick={() => onAnswer({ itemId: item.id, optionId: option.id })}
          >
            <span className="choice-label">{option.label}</span>
            {option.detail ? <span className="choice-detail">{option.detail}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
