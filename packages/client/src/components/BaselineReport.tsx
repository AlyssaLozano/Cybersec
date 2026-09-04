/**
 * The readiness section of the combined report: how the top match's real
 * skill probes went, embedded directly under "Your strongest matches" in
 * AssessmentReport rather than living on a page of its own -- see
 * `baselineSection` in AssessmentReport.tsx.
 *
 * `readiness` and `readinessOfTeachable` are two different questions and the
 * report never blends them: the first is "how ready for this job", the
 * second is "how ready for the part of it this platform actually teaches
 * you". Reading only the first would make a lane with six untaught skills
 * look like a platform failure instead of an honest gap.
 */
import type { ReadinessReport } from '@soc/shared';

const IMPORTANCE_LABEL: Record<string, string> = {
  core: 'Core',
  supporting: 'Supporting',
  peripheral: 'Peripheral',
};

interface BaselineReportProps {
  report: ReadinessReport;
  onRetake: () => void;
}

export function BaselineReport({ report, onRetake }: BaselineReportProps) {
  const readinessTone = report.readiness >= 75 ? 'good' : report.readiness >= 45 ? 'fair' : 'weak';
  const groups = new Map<string, typeof report.results>();
  for (const result of report.results) {
    const bucket = groups.get(result.foundationTitle);
    if (bucket) bucket.push(result);
    else groups.set(result.foundationTitle, [result]);
  }

  return (
    <section className="baseline-section">
      <h2>Your skill baseline for {report.laneTitle}</h2>
      <p className="muted">
        Based on {report.probesAnswered} of {report.probesTotal} probes against real logs and
        material, taken automatically for your top match. Not a certification: a structured read on
        where you actually stand right now, separate from whether you would enjoy the work.
      </p>

      <div className={`confidence-panel ${readinessTone}`}>
        <div className="confidence-figure">
          <strong>{report.readiness}%</strong>
          <span>ready for {report.laneTitle}</span>
        </div>
        <div>
          <p>
            <strong>{report.readinessOfTeachable}%</strong> of what this platform actually teaches
            for this lane.
          </p>
          {report.coverageNote ? <p className="muted">{report.coverageNote}</p> : null}
        </div>
      </div>

      <div className="baseline-groups">
        {[...groups.entries()].map(([foundationTitle, results]) => (
          <article key={foundationTitle} className="baseline-group">
            <h3>{foundationTitle}</h3>
            <ul className="baseline-capability-list">
              {results.map((result) => (
                <li key={result.capabilityId} className={result.demonstrated ? 'demonstrated' : 'not-demonstrated'}>
                  <span className="baseline-cap-mark" aria-hidden="true">
                    {result.demonstrated ? '✓' : result.attempted > 0 ? '✕' : '—'}
                  </span>
                  <span className="baseline-cap-title">{result.title}</span>
                  <span className={`baseline-cap-importance ${result.importance}`}>
                    {IMPORTANCE_LABEL[result.importance] ?? result.importance}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {report.steps.length > 0 ? (
        <>
          <h3 className="baseline-subhead">What would move the needle most</h3>
          <ol className="baseline-steps">
            {report.steps.map((step) => (
              <li key={step.capabilityId}>
                <div>
                  <strong>{step.title}</strong>
                  <span className="muted"> · {step.foundationTitle}</span>
                </div>
                {step.teachable && step.exerciseIds.length > 0 ? (
                  <span className="muted small">Practised in {step.exerciseIds.join(', ')}</span>
                ) : (
                  <span className="muted small">Not built on this platform yet</span>
                )}
                <span className="baseline-step-after">→ {step.readinessAfter}%</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {report.projection ? (
        <p className="muted">
          Finishing the {report.projection.exerciseCount} exercises behind those{' '}
          {report.projection.capabilityCount} capabilities would take this from{' '}
          {report.projection.from}% to {report.projection.to}%.
        </p>
      ) : null}

      <button type="button" className="ghost small" onClick={onRetake}>
        Retake this skill check
      </button>
    </section>
  );
}
