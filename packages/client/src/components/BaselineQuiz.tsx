/**
 * The baseline quiz: one probe at a time, for one lane.
 *
 * Entered automatically by App.tsx once the preference half of the Career
 * Fit Analyzer is scored -- never its own menu destination. `laneId` is
 * always the person's own top match, chosen for them, which is what lets
 * this run without a lane picker.
 *
 * UNLIKE Assessment.tsx, THIS REVEALS FEEDBACK IMMEDIATELY
 *
 * A Career Fit item has no right answer, so Assessment.tsx auto-advances with
 * nothing to show. A probe has exactly one correct option and a written
 * explanation, released by the server the moment it is answered. Holding that
 * back until a final report would throw away the best part of each question:
 * getting one wrong and immediately learning why is the actual teaching
 * moment here, so answering locks the card, reveals right or wrong plus the
 * explanation, and advancing is a separate, explicit click.
 *
 * Answers are freely re-answerable (services/baseline.ts never locks a
 * response), so revisiting an already-answered probe just re-fetches its
 * feedback rather than needing it cached across a page reload.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import { baseline, type BaselineState, type ClientProbe, type ProbeFeedback } from '../lib/api';

interface BaselineQuizProps {
  laneId: string;
  laneTitle: string;
  onComplete: () => void;
  onExit: () => void;
}

export function BaselineQuiz({ laneId, laneTitle, onComplete, onExit }: BaselineQuizProps) {
  const [probes, setProbes] = useState<ClientProbe[] | null>(null);
  const [state, setState] = useState<BaselineState | null>(null);
  const [index, setIndex] = useState(0);
  const [feedbackByProbe, setFeedbackByProbe] = useState<Map<string, ProbeFeedback>>(new Map());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([baseline.start(laneId), baseline.probes(laneId)])
      .then(([startResult, probesResult]) => {
        setState(startResult);
        setProbes(probesResult.probes);
        const next = startResult.nextProbeId;
        const resumeAt = next ? probesResult.probes.findIndex((probe) => probe.id === next) : -1;
        // Nothing left to answer: land on the last probe rather than the first,
        // so "Next" reads as "see the report" instead of restarting the lane.
        setIndex(resumeAt === -1 ? Math.max(probesResult.probes.length - 1, 0) : resumeAt);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load this lane.'));
  }, [laneId]);

  /** Answers so far, keyed by probe, so navigating back shows what was chosen. */
  const answered = useMemo(() => {
    const map = new Map<string, string>();
    for (const response of state?.responses ?? []) map.set(response.probeId, response.optionId);
    return map;
  }, [state]);

  const answer = useCallback(async (probeId: string, optionId: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await baseline.respond([{ probeId, optionId }]);
      const { feedback, ...rest } = result;
      setState(rest);
      setFeedbackByProbe((current) => {
        const next = new Map(current);
        for (const entry of feedback) next.set(entry.probeId, entry);
        return next;
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save that answer.');
    } finally {
      setBusy(false);
    }
  }, []);

  const probe = probes?.[index] ?? null;
  const existingOptionId = probe ? answered.get(probe.id) : undefined;
  const feedback = probe ? feedbackByProbe.get(probe.id) : undefined;

  // Resuming a probe answered in an earlier visit: the option is known but the
  // explanation was never sent this session. Re-submitting the same answer is
  // harmless (saveProbeResponses just overwrites with the same value) and is
  // what gets the explanation back onto the screen.
  useEffect(() => {
    if (probe && existingOptionId && !feedback && !busy) {
      void answer(probe.id, existingOptionId);
    }
  }, [probe, existingOptionId, feedback, busy, answer]);

  if (error && !probes) return <div className="centered-note error">{error}</div>;
  if (!probes || !state) return <div className="centered-note">Loading the lane…</div>;

  const percent = state.total > 0 ? Math.round((state.answered / state.total) * 100) : 0;
  const allAnswered = state.answered >= state.total;

  return (
    <div className="assessment baseline-quiz">
      <header className="assessment-head">
        <div>
          <h1>One more thing: your skill baseline for {laneTitle}</h1>
          <p className="muted">
            Real questions against real material, one right answer each, for your top match. Getting
            one wrong is the point: read why before moving on. Skip ahead any time.
          </p>
        </div>
        <button type="button" className="ghost" onClick={onExit}>
          Skip to my results
        </button>
      </header>

      <div className="assessment-progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">
          {state.answered} of {state.total} answered
        </span>
      </div>

      {probe ? (
        <ProbeCard
          probe={probe}
          selectedOptionId={existingOptionId}
          feedback={feedback}
          busy={busy}
          onAnswer={(optionId) => void answer(probe.id, optionId)}
        />
      ) : null}

      {error ? <p className="inline-error">{error}</p> : null}

      <nav className="assessment-nav">
        <button type="button" className="ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Previous
        </button>
        <span className="muted">
          Question {index + 1} of {probes.length}
        </span>
        <button
          type="button"
          className="ghost"
          disabled={index >= probes.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          {feedback ? 'Next →' : 'Skip →'}
        </button>
      </nav>

      <footer className="assessment-foot">
        <button type="button" className="primary" disabled={busy} onClick={onComplete}>
          {allAnswered
            ? 'See my full report'
            : state.answered > 0
              ? `See my report so far (${state.answered} answered)`
              : 'Skip this, see my report'}
        </button>
        {!allAnswered && state.answered > 0 ? (
          <p className="muted small">
            Fewer answers means a rougher readiness figure, and the report says so rather than
            pretending otherwise.
          </p>
        ) : null}
      </footer>
    </div>
  );
}

function ProbeCard({
  probe,
  selectedOptionId,
  feedback,
  busy,
  onAnswer,
}: {
  probe: ClientProbe;
  selectedOptionId: string | undefined;
  feedback: ProbeFeedback | undefined;
  busy: boolean;
  onAnswer: (optionId: string) => void;
}) {
  const locked = Boolean(feedback);

  return (
    <section className="question-card probe-card">
      {probe.artifact ? <pre className="probe-artifact">{probe.artifact}</pre> : null}
      <p className="question-statement">{probe.prompt}</p>

      <div className="choice-list">
        {probe.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectAnswer = feedback && option.id === feedback.answerId;
          const resultClass = !locked
            ? ''
            : isSelected && feedback?.correct
              ? ' probe-correct'
              : isSelected && !feedback?.correct
                ? ' probe-incorrect'
                : isCorrectAnswer
                  ? ' probe-correct-unpicked'
                  : '';
          return (
            <button
              key={option.id}
              type="button"
              disabled={busy || locked}
              className={`choice-option probe-option${isSelected ? ' selected' : ''}${resultClass}`}
              onClick={() => onAnswer(option.id)}
            >
              <span className="choice-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      {feedback ? (
        <p className={`probe-feedback${feedback.correct ? ' correct' : ' incorrect'}`}>
          <strong>{feedback.correct ? 'Correct.' : 'Not quite.'}</strong> {feedback.explanation}
        </p>
      ) : null}
    </section>
  );
}
