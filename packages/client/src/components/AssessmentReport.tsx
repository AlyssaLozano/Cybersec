/**
 * The results page.
 *
 * The order here is deliberate. Confidence and caveats come FIRST, above the
 * ranked lanes, because a reader who sees "your strongest match is red team"
 * before "you answered 18 of 70 questions" has already formed the belief. Putting
 * the uncertainty after the conclusion is how career tools quietly overclaim.
 *
 * The mismatch section is the most valuable part and the one most tools omit: a
 * lane somebody scored well on, paired with the specific reason it may not suit
 * them. It is the only section that tells a reader something they did not
 * already suspect about themselves.
 */

import { useState } from 'react';

import type { AssessmentReport as Report, Dimension, LaneScore } from '@soc/shared';

import { assessment } from '../lib/api';

const ENVIRONMENT_TITLES: Record<string, string> = {
  government: 'Government',
  corporate: 'Corporate',
  consulting: 'Consulting',
};

const BURNOUT_COPY: Record<string, string> = {
  low: 'Low burnout risk for your profile',
  medium: 'Moderate burnout risk for your profile',
  high: 'High burnout risk for your profile',
};

interface ReportProps {
  report: Report;
  laneTitles: Record<string, string>;
  onRetakeDimension: (dimension: Dimension) => void;
  onOpenLane: (laneId: string) => void;
  onChooseTrack: (laneId: string) => void;
  dimensions: Array<{ dimension: Dimension; label: string }>;
  /**
   * Rendered directly under the top-lanes section when present: the skill
   * baseline for the top match, taken automatically as part of the same
   * pass through the assessment. See BaselineReport in the caller.
   */
  baselineSection?: React.ReactNode;
}

export function AssessmentReport({
  report,
  laneTitles,
  onRetakeDimension,
  onOpenLane,
  onChooseTrack,
  dimensions,
  baselineSection,
}: ReportProps) {
  const [shareable, setShareable] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const confidenceTone =
    report.overallConfidence >= 75 ? 'good' : report.overallConfidence >= 55 ? 'fair' : 'weak';

  return (
    <div className="report">
      <header className="report-head">
        <h1>Your results</h1>
        <p className="muted">
          A career-guidance tool, not a validated psychometric test. Treat this as a structured
          starting point.
        </p>
      </header>

      {/* Uncertainty before conclusions, deliberately. */}
      <section className={`confidence-panel ${confidenceTone}`}>
        <div className="confidence-figure">
          <strong>{report.overallConfidence}%</strong>
          <span>confidence</span>
        </div>
        <div>
          <p>
            Based on {report.answered} of {report.applicable} questions.
          </p>
          {report.caveats.length > 0 ? (
            <ul className="caveat-list">
              {report.caveats.map((caveat) => (
                <li key={caveat}>{caveat}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Your answers were internally consistent.</p>
          )}
        </div>
      </section>

      <section className="summary-panel">
        <p>{report.summary}</p>
      </section>

      {report.burnoutWarning ? (
        <section className="warning-panel">
          <h2>Worth knowing before you commit</h2>
          <p>{report.burnoutWarning}</p>
        </section>
      ) : null}

      <section>
        <h2>Your strongest matches</h2>
        <div className="lane-list">
          {report.topLanes.map((lane, position) => (
            <LaneCard
              key={lane.laneId}
              lane={lane}
              title={laneTitles[lane.laneId] ?? lane.laneId}
              rank={position + 1}
              onOpen={() => onOpenLane(lane.laneId)}
              onChoose={() => onChooseTrack(lane.laneId)}
            />
          ))}
        </div>
      </section>

      {baselineSection}

      {report.alternatives.length > 0 ? (
        <section>
          <h2>Also worth a look</h2>
          <div className="lane-list compact">
            {report.alternatives.map((lane) => (
              <LaneCard
                key={lane.laneId}
                lane={lane}
                title={laneTitles[lane.laneId] ?? lane.laneId}
                compact
                onOpen={() => onOpenLane(lane.laneId)}
                onChoose={() => onChooseTrack(lane.laneId)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {report.mismatches.length > 0 ? (
        <section>
          <h2>Fits your interests, but read this first</h2>
          <p className="muted">
            These scored well on what you enjoy, but something in your answers suggests friction.
            That does not rule them out: it tells you what to ask about at interview.
          </p>
          <div className="mismatch-list">
            {report.mismatches.map((mismatch) => (
              <article key={mismatch.laneId} className="mismatch-card">
                <h3>{laneTitles[mismatch.laneId] ?? mismatch.laneId}</h3>
                <p className="mismatch-attraction">{mismatch.attraction}</p>
                <p className="mismatch-problem">
                  <strong>But:</strong> {mismatch.problem}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2>Where you would fit best</h2>
        <div className="environment-list">
          {report.environments.map((environment) => (
            <article key={environment.environmentId} className="environment-card">
              <header>
                <h3>{ENVIRONMENT_TITLES[environment.environmentId] ?? environment.environmentId}</h3>
                <span className="score-pill">{environment.score}</span>
              </header>
              <ul>
                {environment.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>What your answers said about you</h2>
        <div className="trait-list">
          {report.traits
            .filter((trait) => trait.indicators >= 2)
            .map((trait) => (
              <div key={trait.trait} className="trait-row">
                <span className="trait-name">{trait.trait.replace(/_/g, ' ')}</span>
                <div className="trait-scale">
                  <div
                    className="trait-marker"
                    style={{ left: `${((trait.value + 2) / 4) * 100}%` }}
                    title={`${trait.value} across ${trait.indicators} questions`}
                  />
                </div>
                <span className={`trait-consistency${trait.consistency < 0.6 ? ' shaky' : ''}`}>
                  {trait.consistency < 0.6 ? 'mixed answers' : `${trait.indicators} questions`}
                </span>
              </div>
            ))}
        </div>
      </section>

      <section className="report-actions">
        <h2>Refine or share</h2>
        <p className="muted">
          Answering a section again replaces those answers and rescores. Useful if you rushed one.
        </p>
        <div className="retake-row">
          {dimensions.map((dimension) => (
            <button
              key={dimension.dimension}
              type="button"
              className="ghost small"
              onClick={() => onRetakeDimension(dimension.dimension)}
            >
              Retake: {dimension.label}
            </button>
          ))}
        </div>

        <div className="share-row">
          <button
            type="button"
            className="ghost"
            onClick={async () => {
              const result = await assessment.submit();
              setShareable(result.shareable);
              setCopied(false);
            }}
          >
            Get a shareable summary
          </button>
          {shareable ? (
            <div className="shareable">
              <pre>{shareable}</pre>
              <button
                type="button"
                className="ghost small"
                onClick={() => {
                  void navigator.clipboard?.writeText(shareable);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="report-disclaimer">
        This is not professional, legal, medical, or financial advice. It is one tool&rsquo;s opinion,
        based only on the answers you gave, and it is meant as a starting point for your own thinking,
        not a verdict. No questionnaire knows your life the way you do. Weigh it, take what is useful,
        and do what you feel is best for you.
      </footer>
    </div>
  );
}

function LaneCard({
  lane,
  title,
  rank,
  compact,
  onOpen,
  onChoose,
}: {
  lane: LaneScore;
  title: string;
  rank?: number;
  compact?: boolean;
  onOpen: () => void;
  onChoose: () => void;
}) {
  return (
    <article className={`lane-card${compact ? ' compact' : ''}`}>
      <header>
        <div className="lane-title">
          {rank ? <span className="lane-rank">{rank}</span> : null}
          <h3>{title}</h3>
        </div>
        <div className="lane-scores">
          <span className="score-pill">{lane.score}</span>
          <span className={`confidence-pill${lane.confidence < 60 ? ' weak' : ''}`}>
            {lane.confidence}% confidence
          </span>
        </div>
      </header>

      {lane.reasons.length > 0 ? (
        <ul className="lane-reasons">
          {lane.reasons.slice(0, compact ? 1 : 3).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}

      {lane.concerns.length > 0 && !compact ? (
        <ul className="lane-concerns">
          {lane.concerns.map((concern) => (
            <li key={concern}>{concern}</li>
          ))}
        </ul>
      ) : null}

      <footer>
        <span className={`burnout-tag ${lane.burnoutRisk}`}>{BURNOUT_COPY[lane.burnoutRisk]}</span>
        <div className="lane-actions">
          <button type="button" className="ghost small" onClick={onOpen}>
            What this job is really like
          </button>
          <button type="button" className="primary small" onClick={onChoose}>
            Start this track
          </button>
        </div>
      </footer>
    </article>
  );
}
