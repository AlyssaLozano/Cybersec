/**
 * The stop between choosing a career and actually starting it.
 *
 * A track is not just its curriculum. It is also whatever certifications the
 * job actually asks for, and this is where a student sees both laid out as
 * separate choices rather than being dropped straight into exercise one:
 * "Learn and Drill" is the curriculum itself, and one box per certification
 * shows what study help exists for it, which today means an honest
 * "coming soon" rather than a purchase button for something unbuilt.
 */

import type { CertStudyOffer, TrackSummary } from '@soc/shared';

interface TrackHubProps {
  track: TrackSummary;
  /** Undefined until the study offer has loaded; the cert boxes simply wait. */
  certStudy?: CertStudyOffer;
  onEnter: () => void;
  onBack: () => void;
}

export function TrackHub({ track, certStudy, onEnter, onBack }: TrackHubProps) {
  const started = track.passedCount > 0;

  return (
    <div className="track-hub">
      <header className="track-hub-head">
        <button type="button" className="ghost small" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1>{track.title}</h1>
          <p className="lead">{track.summary}</p>
        </div>
      </header>

      <section className="hub-section hub-section--curriculum">
        <div className="hub-section-head">
          <span className="hub-box-tag">The curriculum</span>
          <h2>Learn and Drill</h2>
          <p className="hub-section-intro">
            Every exercise this role actually needs, in the order it needs them: a concept taught
            from first principles, then a hands-on drill that proves it landed, building from the
            first foundation to the last. This is the track itself, not a preview of it.
          </p>
        </div>
        <button type="button" className="hub-box hub-box--primary" onClick={onEnter}>
          <span className="hub-box-desc">
            {started
              ? `Pick up where you left off: ${track.passedCount} of ${track.exerciseCount} exercises passed so far.`
              : 'Start from the first foundation. Nothing here assumes you already know the last one.'}
          </span>
          <span className="hub-box-enter">{started ? 'Continue ›' : 'Start ›'}</span>
        </button>
      </section>

      {track.certificationDetail.length > 0 && (
        <>
          <div className="hub-section-gap" />

          <section className="hub-section hub-section--certs">
            <div className="hub-section-head">
              <h2>Certifications that matter here</h2>
              <p className="hub-section-intro">
                What employers hiring for this role actually ask for by name. Separate from the
                curriculum above: nothing here is required to keep training, and the exam fee is
                paid to the issuer directly, not part of your subscription.
              </p>
            </div>
            <div className="track-hub-grid">
              {track.certificationDetail.map((cert) => (
                <div
                  key={cert.id}
                  className={`hub-box hub-box--cert${certStudy?.status === 'coming-soon' ? ' locked' : ''}`}
                >
                  <span className="hub-box-tag">{cert.stage} certification</span>
                  <span className="hub-box-title">{cert.name}</span>
                  <span className="hub-box-desc">{cert.summary}</span>
                  {certStudy ? (
                    <div className="hub-box-cert-note">
                      <span className={`badge ${certStudy.status === 'coming-soon' ? 'planned' : 'ready'}`}>
                        {certStudy.status === 'coming-soon' ? 'Coming soon' : 'Available'}
                      </span>
                      <span className="hub-box-cert-price">
                        Study help: ${certStudy.amountUsd} for {certStudy.windowDays} days
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
