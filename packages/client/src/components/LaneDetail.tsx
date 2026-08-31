/**
 * One career lane, described the way somebody doing the job would describe it.
 *
 * Pain points are given the same visual weight as the day-to-day, not tucked
 * into a footnote. Somebody deciding whether to retrain into shift work deserves
 * to read "alert fatigue is the number one reason people leave" at the same size
 * as everything else.
 *
 * Certifications show real costs and study times, because "get certified" is
 * useless advice without knowing it is $404 and eight weeks.
 */

import type { Certification, Foundation, LaneProfile, Track } from '@soc/shared';

const ENVIRONMENT_TITLES: Record<string, string> = {
  government: 'Government',
  corporate: 'Corporate',
  consulting: 'Consulting',
};

interface LaneDetailProps {
  lane: LaneProfile;
  certifications: Certification[];
  certPhilosophy: { headline: string; body: string[] };
  track?: Track;
  foundations?: Array<Foundation & { playable: boolean }>;
  readiness?: { foundationsTotal: number; foundationsPlayable: number };
  onBack: () => void;
  onChoose: () => void;
}

export function LaneDetail({
  lane,
  certifications,
  certPhilosophy,
  track,
  foundations,
  readiness,
  onBack,
  onChoose,
}: LaneDetailProps) {
  return (
    <div className="lane-detail">
      <header className="lane-detail-head">
        <button type="button" className="ghost small" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1>{lane.title}</h1>
          <p className="lead">{lane.summary}</p>
        </div>
        {track ? (
          <button type="button" className="primary" onClick={onChoose}>
            Start this track
          </button>
        ) : (
          <span className="badge planned">No track yet</span>
        )}
      </header>

      <div className="lane-meta">
        <span className={`burnout-tag ${lane.baselineBurnout}`}>
          Baseline burnout risk: {lane.baselineBurnout}
        </span>
        {track ? <span className={`badge entry-${track.entryDifficulty}`}>Entry: {track.entryDifficulty}</span> : null}
        {track ? <span className="badge rhythm">{track.workRhythm}</span> : null}
      </div>

      <section className="lane-section">
        <h2>What the day actually looks like</h2>
        <ul className="plain-list">
          {lane.dayToDay.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="lane-section">
        <h2>Who does well here</h2>
        <ul className="plain-list">
          {lane.personalityMatch.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {/* Same visual weight as everything else. This is the section that saves
          somebody two years, and burying it would defeat the purpose. */}
      <section className="lane-section pain">
        <h2>Why people leave this job</h2>
        <ul className="plain-list">
          {lane.painPoints.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="lane-section">
        <h2>Getting in from another career</h2>
        <p>{lane.entryReality}</p>
        <h3>Where it leads</h3>
        <p>{lane.advancement}</p>
      </section>

      <section className="lane-section">
        <h2>Where this job is best done</h2>
        <div className="env-rank">
          {[...lane.environmentFit]
            .sort((a, b) => a.rank - b.rank)
            .map((fit) => (
              <article key={fit.environmentId} className={`env-rank-card rank-${fit.rank}`}>
                <header>
                  <span className="env-rank-number">{fit.rank}</span>
                  <h3>{ENVIRONMENT_TITLES[fit.environmentId] ?? fit.environmentId}</h3>
                </header>
                <p>{fit.note}</p>
              </article>
            ))}
        </div>
      </section>

      {foundations && foundations.length > 0 ? (
        <section className="lane-section">
          <h2>What you would need to learn</h2>
          <p className="muted">
            {readiness
              ? `${readiness.foundationsPlayable} of ${readiness.foundationsTotal} are built and playable today.`
              : null}
          </p>
          <ul className="foundation-list">
            {foundations.map((foundation) => (
              <li key={foundation.id} className={foundation.playable ? 'playable' : 'planned'}>
                <div>
                  <strong>{foundation.title}</strong>
                  <p className="muted small">{foundation.summary}</p>
                </div>
                <span className="badge">
                  {foundation.playable ? 'Ready' : `Planned · ~${foundation.plannedExercises ?? '?'} exercises`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="lane-section">
        <h2>Certifications that matter here</h2>
        <p className="muted">{certPhilosophy.headline}</p>
        <div className="cert-list">
          {certifications.map((cert) => (
            <article key={cert.id} className={`cert-card stage-${cert.stage}`}>
              <header>
                <h3>{cert.name}</h3>
                <span className="badge">{cert.stage}</span>
              </header>
              <p>{cert.summary}</p>
              <dl className="cert-facts">
                <div>
                  <dt>Exam cost</dt>
                  <dd>${cert.approxCostUsd}</dd>
                </div>
                <div>
                  <dt>Typical study</dt>
                  <dd>{cert.typicalStudyWeeks} weeks</dd>
                </div>
                <div>
                  <dt>Issuer</dt>
                  <dd>{cert.issuer}</dd>
                </div>
              </dl>
              {cert.mandatedSomewhere && cert.mandateNote ? (
                <p className="mandate-note">
                  <strong>Sometimes mandatory:</strong> {cert.mandateNote}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <details className="cert-philosophy">
          <summary>How to think about certifications</summary>
          {certPhilosophy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </details>
      </section>

      <section className="lane-section">
        <h2>What burns people out here</h2>
        <ul className="plain-list">
          {lane.burnoutDrivers.map((driver) => (
            <li key={driver}>{driver}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
