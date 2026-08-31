/**
 * The AI copilot panel, shown beside one alert.
 *
 * DESIGN NOTES THAT ARE NOT COSMETIC
 *
 * 1. It is behind a click and it stays behind a click. Nothing is fetched until
 *    the student asks, because asking is the graded act — an analysis that
 *    appeared automatically would make every alert "consulted" whether or not
 *    anybody read a word of it, and the check would grade nothing.
 *
 * 2. What it could not see is printed ABOVE what it recommends. Reading order is
 *    the intervention. Nearly every bad suggestion in this corpus is defeated by
 *    the limits section, and an operator who meets the verdict first has already
 *    anchored by the time they reach it.
 *
 * 3. The recommendation is a word, not a coloured badge, and it is not a button.
 *    There is deliberately no "accept" affordance: the dispositions live on the
 *    alert, where they belong, and a one-click "do what it said" control would
 *    build exactly the habit the module exists to break.
 *
 * 4. Every claim shows where it came from — observed, inferred, or assumed. Real
 *    assistants do not annotate their own inventions. This one does, because a
 *    student has to know what one looks like before being asked to spot an
 *    unlabelled one.
 *
 * 5. Confidence is shown with the caption that it is not a probability. It is
 *    uncorrelated with correctness in this corpus on purpose, and a student who
 *    reads it as a likelihood has learned something false.
 *
 * 6. Nothing here knows whether the analysis is any good. Whether a suggestion
 *    was sound lives in a server-side table this component never receives, and
 *    arrives only in the debrief after the student has committed.
 */

import type { CopilotAnalysis, CopilotClaim, CopilotDebriefEntry } from '@soc/shared';

/** How each claim's provenance is labelled in the panel. */
const BASIS_LABEL: Record<CopilotClaim['basis'], string> = {
  observed: 'on the alert',
  inferred: 'reasoned',
  assumed: 'assumed',
};

function ClaimList({ claims, empty }: { claims: CopilotClaim[]; empty: string }) {
  if (claims.length === 0) return <p className="copilot__empty">{empty}</p>;
  return (
    <ul className="copilot__claims">
      {claims.map((claim, index) => (
        <li key={index} className={`copilot__claim copilot__claim--${claim.basis}`}>
          <span className="copilot__basis">{BASIS_LABEL[claim.basis]}</span>
          <span className="copilot__claim-text">{claim.text}</span>
        </li>
      ))}
    </ul>
  );
}

export interface CopilotProps {
  /** The alert the panel is about. */
  alertId: string;
  /** The analysis, once fetched. Null until the student asks. */
  analysis: CopilotAnalysis | null;
  /** True while the request is in flight. */
  loading: boolean;
  /** Set when the request failed, so a student is never left staring at nothing. */
  error: string | null;
  /** Ask the copilot about this alert. Records the consultation server-side. */
  onAsk: () => void;
  /**
   * Whether the server has this alert down as already consulted.
   *
   * True after a reload, when the analysis is no longer in memory but the
   * consultation is on record. The button says so rather than pretending the
   * student never looked.
   */
  previouslyAsked?: boolean;
  /**
   * The verdict on this suggestion, available only after the student commits.
   *
   * Absent during the exercise, on the same principle as the worked solution.
   */
  debrief?: CopilotDebriefEntry;
}

export function Copilot({
  alertId,
  analysis,
  loading,
  error,
  onAsk,
  previouslyAsked,
  debrief,
}: CopilotProps) {
  if (!analysis) {
    return (
      <section className="copilot copilot--closed">
        <div className="copilot__head">
          <h5>AI copilot</h5>
          <button type="button" onClick={onAsk} disabled={loading}>
            {loading ? 'Asking…' : previouslyAsked ? 'Read it again' : `Ask about ${alertId}`}
          </button>
        </div>
        <p className="copilot__standing-note">
          It reads this alert on its own — not the queue, not the shift, not your change records. It
          is right about most alerts here, which is what makes the ones it is wrong about worth
          finding.
        </p>
        {error ? <p className="copilot__error">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="copilot">
      <div className="copilot__head">
        <h5>AI copilot</h5>
        <span className="copilot__asked">asked</span>
      </div>

      <p className="copilot__headline">{analysis.headline}</p>

      {/*
        Deliberately first. The limits are what defeat most of the bad advice in
        this corpus, and they are worthless printed underneath the verdict.
      */}
      <div className="copilot__section copilot__section--limits">
        <h6>What it could not see</h6>
        <ul>
          {analysis.limits.map((limit, index) => (
            <li key={index}>{limit}</li>
          ))}
        </ul>
      </div>

      <div className="copilot__section">
        <h6>Reads as risk</h6>
        <ClaimList claims={analysis.riskFactors} empty="Nothing flagged." />
      </div>

      <div className="copilot__section">
        <h6>Reads as mitigating</h6>
        <ClaimList claims={analysis.mitigatingFactors} empty="Nothing flagged." />
      </div>

      <div className="copilot__recommendation">
        <span className="copilot__rec-label">It would</span>
        <span className="copilot__rec-value">{analysis.recommendation}</span>
        <span className="copilot__confidence">
          {analysis.confidence}% confident
          <em>
            — how it writes, not how likely it is to be right. The two are unrelated.
          </em>
        </span>
      </div>

      <div className="copilot__section">
        <h6>Suggested next steps</h6>
        <ol className="copilot__steps">
          {analysis.nextSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <p className="copilot__standing-note">
        The disposition is still yours. Nothing here files it for you.
      </p>

      {debrief ? (
        <div
          className={`copilot__verdict ${
            debrief.misleads ? 'copilot__verdict--misleading' : 'copilot__verdict--reasoning'
          }`}
        >
          <strong>
            {debrief.misleads
              ? `This suggestion was wrong. It said ${debrief.recommendation}; you said ${
                  debrief.yourDecision ?? 'nothing'
                }.`
              : `This recommendation was right, and the reasoning behind it was not.`}
          </strong>
          <p>{debrief.why}</p>
        </div>
      ) : null}
    </section>
  );
}

/**
 * The collaboration scorecard, shown in the debrief.
 *
 * The headline number is printed next to its parts rather than on its own, for
 * the same reason precision and recall are never averaged in the triage
 * scorecard: a single figure hides which way somebody failed. Deferring into
 * wrong answers and never asking at all both lower it, and they call for
 * opposite advice.
 */
export function CollaborationScorecard({
  score,
}: {
  score: {
    score: number;
    decided: number;
    consulted: number;
    deferenceRate: number | null;
    counts: Record<string, number>;
  };
}) {
  const ROWS: Array<{ key: string; label: string }> = [
    { key: 'caught', label: 'Overrode a suggestion that was wrong' },
    { key: 'corroborated', label: 'Asked, agreed, and were right' },
    { key: 'misled', label: 'Took a recommendation that was wrong' },
    { key: 'strayed', label: 'Asked, went elsewhere, and were wrong' },
    { key: 'both-wrong', label: 'Disagreed with bad advice and were still wrong' },
    { key: 'solo-right', label: 'Decided correctly without asking' },
    { key: 'solo-missed-help', label: 'Did not ask, got it wrong, and it would have helped' },
    { key: 'solo-wrong', label: 'Did not ask, got it wrong, and it would not have helped' },
  ];

  return (
    <section className="collaboration">
      <h4>Working with the copilot</h4>
      <p className="collaboration__note">
        Consulting the copilot is not worth marks on its own — deciding correctly without asking
        scores the same as asking and agreeing. What is worth marks is the handful of alerts where
        it was wrong and you noticed.
      </p>

      <div className="collaboration__headline">
        <span className="collaboration__score">{score.score}</span>
        <span className="collaboration__scale">/ 100</span>
        <span className="collaboration__meta">
          {score.consulted} of {score.decided} dispositioned alerts consulted
          {score.deferenceRate !== null
            ? ` · took its recommendation on ${Math.round(score.deferenceRate * 100)}% of those`
            : ''}
        </span>
      </div>

      <table className="collaboration__table">
        <tbody>
          {ROWS.filter((row) => (score.counts[row.key] ?? 0) > 0).map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              <td className="collaboration__count">{score.counts[row.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {score.deferenceRate !== null && score.deferenceRate > 0.95 && score.consulted > 3 ? (
        <p className="collaboration__warning">
          You took its recommendation on nearly everything you asked about. That works for as long
          as it is right, and this queue is built so that it is — mostly.
        </p>
      ) : null}
    </section>
  );
}
