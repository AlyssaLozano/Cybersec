/**
 * Track selection.
 *
 * Tracks that have no content yet are shown, clearly marked, rather than hidden.
 * A student choosing a career direction deserves to see where each one leads,
 * and an honest "not written yet" badge is better than a track that looks
 * playable and then is not.
 *
 * Every track ends with the certifications that role is actually asked for, and
 * with the exam fee attached. It sits after the curriculum on purpose: a
 * certification is what happens after the learning, and putting it first would
 * imply the exam is the point rather than the job.
 */

import type { CertStudyOffer, TrackSummary } from '@soc/shared';

import { CertStudyNote } from './CertStudyNote';

interface TrackPickerProps {
  tracks: TrackSummary[];
  activeTrackId: string | null;
  /** Undefined until the track list has loaded; the section simply waits. */
  certStudy?: CertStudyOffer;
  onChoose: (trackId: string) => void;
}

export function TrackPicker({ tracks, activeTrackId, certStudy, onChoose }: TrackPickerProps) {
  return (
    <div className="track-picker">
      <header className="track-picker-head">
        <h1>Choose your track</h1>
        <p>
          Each track is a full curriculum for one role. You can switch at any time, and progress is
          kept separately for each.
        </p>
      </header>

      <div className="track-grid">
        {tracks.map((track) => {
          const available = track.status === 'available';
          /*
           * Count foundations as well as curriculum stages. After foundations
           * became per-track, a SOC analyst's Linux and Log Analysis packages
           * live in `foundations`, not `curriculum` -- so counting only stages
           * reported "0 of 2 ready" for a track with two finished packages.
           */
          const ready = track.readiness.foundationsPlayable + track.readiness.stagesPlayable;
          const totalParts = track.readiness.foundationsTotal + track.readiness.stagesTotal;

          return (
            <article
              key={track.id}
              className={`track-card${available ? '' : ' unavailable'}${track.id === activeTrackId ? ' active' : ''}`}
            >
              <header>
                <h2>{track.title}</h2>
                {available ? (
                  <span className="badge ready">
                    {ready} of {totalParts} parts ready
                  </span>
                ) : (
                  <span className="badge planned">Curriculum outlined, content not written yet</span>
                )}
              </header>

              <p className="track-summary">{track.summary}</p>

              <p className="track-audience">
                <span className="tag">Who it is for</span>
                {track.audience}
              </p>

              <ul className="track-roles">
                {track.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>

              <ol className="track-stages">
                {track.curriculum.map((stage) => (
                  <li key={stage.title} className={stage.packageId ? 'ready' : 'planned'}>
                    <span className="stage-title">{stage.title}</span>
                    <span className="stage-summary">{stage.summary}</span>
                    {!stage.packageId && stage.plannedExercises && (
                      <span className="stage-note">~{stage.plannedExercises} exercises planned</span>
                    )}
                  </li>
                ))}
              </ol>

              {/* The end of the track: what the industry asks for once the
                  curriculum above is behind you. */}
              {track.certificationDetail.length > 0 && (
                <section className="track-certs">
                  <h3>Industry certifications for this role</h3>
                  <p className="muted small">
                    These are the certifications employers hiring for this role ask for by name. The
                    fee below is the exam only, paid to the issuer, and it is not part of your
                    subscription.
                  </p>
                  <ul className="track-cert-list">
                    {track.certificationDetail.map((cert) => (
                      <li key={cert.id}>
                        <span className="track-cert-name">{cert.name}</span>
                        <span className="track-cert-issuer">{cert.issuer}</span>
                        <span className="track-cert-cost">
                          ${cert.approxCostUsd} exam · ~{cert.typicalStudyWeeks} weeks study
                        </span>
                        {cert.mandatedSomewhere && (
                          <span className="track-cert-mandate">Mandatory in some sectors</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {certStudy ? <CertStudyNote offer={certStudy} compact /> : null}
                </section>
              )}

              {available && track.exerciseCount > 0 && (
                <div className="track-progress">
                  <div className="progress-bar">
                    <span style={{ width: `${track.percentComplete}%` }} />
                  </div>
                  <span className="progress-label">
                    {track.passedCount} of {track.exerciseCount} exercises passed
                  </span>
                </div>
              )}

              <button
                className={`btn ${available ? 'primary' : 'ghost'}`}
                disabled={!available}
                onClick={() => onChoose(track.id)}
              >
                {available
                  ? track.passedCount > 0
                    ? 'Continue this track'
                    : 'Start this track'
                  : 'Not available yet'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
