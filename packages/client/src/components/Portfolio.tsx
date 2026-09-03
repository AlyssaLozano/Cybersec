/**
 * The portfolio: AI Security findings (real work against simulated models) and
 * the GitHub Lab (real work against infrastructure the student controls,
 * pushed to a repo that is genuinely theirs).
 *
 * Follows BadgeCase's shape deliberately: fetch on mount, one loading state,
 * one error state, and show outstanding work alongside earned work rather
 * than only the earned half.
 */

import { useEffect, useState } from 'react';

import type { AiSecurityPortfolio, CapstoneOption, CapstoneState, CapstoneWalkthroughStep } from '@soc/shared';

import { ApiCallError, capstones as capstoneApi, portfolio as portfolioApi } from '../lib/api';

interface TrackCapstone {
  trackId: string;
  trackTitle: string;
  options: CapstoneOption[];
  walkthrough: CapstoneWalkthroughStep[];
  unlocked: boolean;
  state: CapstoneState;
}

export function Portfolio({ onBack }: { onBack: () => void }) {
  const [aiSecurity, setAiSecurity] = useState<AiSecurityPortfolio | null>(null);
  const [labs, setLabs] = useState<TrackCapstone[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([portfolioApi.aiSecurity(), portfolioApi.capstones()])
      .then(async ([aiSecurityData, capstonesData]) => {
        if (cancelled) return;
        setAiSecurity(aiSecurityData);

        const detail = await Promise.all(
          capstonesData.tracks.map(async (track) => {
            const forTrack = await capstoneApi.forTrack(track.id);
            return { ...forTrack, trackTitle: track.title };
          }),
        );
        if (!cancelled) setLabs(detail);
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load your portfolio.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function patchLab(trackId: string, patch: Partial<TrackCapstone>) {
    setLabs((current) =>
      current?.map((lab) => (lab.trackId === trackId ? { ...lab, ...patch } : lab)) ?? current,
    );
  }

  if (error) return <p className="seat-note seat-note--bad">{error}</p>;
  if (!aiSecurity || !labs) return <p className="seat-note">Loading…</p>;

  const hasFindings = aiSecurity.findings.length > 0 || aiSecurity.assessments.length > 0;

  return (
    <div className="portfolio">
      <header className="portfolio__head">
        <button type="button" className="linkish" onClick={onBack}>
          &larr; Back
        </button>
        <div>
          <h1>Your portfolio</h1>
          <p className="portfolio__meta">
            Everything you can put in front of an interviewer: what you found, and what you built.
          </p>
        </div>
      </header>

      <h2 className="portfolio__h">AI Security findings</h2>
      {hasFindings ? (
        <>
          <p className="portfolio__caveat">{aiSecurity.caveat}</p>
          <div className="portfolio__findings">
            {aiSecurity.assessments.map((assessment) => (
              <article key={assessment.modelId} className={`findingcard findingcard--${assessment.verdict}`}>
                <h3>{assessment.modelName}</h3>
                <p className="findingcard__verdict">{assessment.verdict.replace(/-/g, ' ')}</p>
                <p>{assessment.summary}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="lobby__hint">
          Nothing here yet. Findings appear as you pass Model Lab exercises that require a bypass.
        </p>
      )}

      <h2 className="portfolio__h">GitHub Lab</h2>
      <p className="lobby__hint">
        One real project, on infrastructure you control, on your own GitHub. Something an employer can
        actually open.
      </p>

      {labs.length === 0 ? (
        <p className="lobby__hint">No GitHub Lab is open on your current tracks yet.</p>
      ) : (
        labs.map((lab) => <CapstoneLab key={lab.trackId} lab={lab} onChange={(patch) => patchLab(lab.trackId, patch)} />)
      )}
    </div>
  );
}

function CapstoneLab({ lab, onChange }: { lab: TrackCapstone; onChange: (patch: Partial<TrackCapstone>) => void }) {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState(lab.state.repoUrl ?? '');
  const [summary, setSummary] = useState(lab.state.summary ?? '');

  if (!lab.unlocked) {
    return (
      <article className="capstonecard capstonecard--locked">
        <h3>{lab.trackTitle}</h3>
        <p className="lobby__hint">Finish the rest of this track to unlock its GitHub Lab.</p>
      </article>
    );
  }

  const selectedOption = lab.options.find((option) => option.id === lab.state.optionId) ?? null;

  async function select(optionId: string) {
    setBusy(true);
    setFormError(null);
    try {
      const state = await capstoneApi.select(lab.trackId, optionId);
      setRepoUrl('');
      setSummary('');
      onChange({ state });
    } catch (caught) {
      setFormError(caught instanceof ApiCallError ? caught.error.message : 'Could not select that project.');
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setFormError(null);
    try {
      const state = await capstoneApi.submit(lab.trackId, repoUrl.trim(), summary.trim() || undefined);
      onChange({ state });
    } catch (caught) {
      setFormError(caught instanceof ApiCallError ? caught.error.message : 'Could not submit that link.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="capstonecard">
      <h3>{lab.trackTitle}</h3>

      <button type="button" className="linkish" onClick={() => setShowWalkthrough((shown) => !shown)}>
        {showWalkthrough ? 'Hide' : 'New to GitHub? Start here'}
      </button>
      {showWalkthrough && (
        <ol className="capstonecard__walkthrough">
          {lab.walkthrough.map((step) => (
            <li key={step.title}>
              <strong>{step.title}.</strong> {step.detail}
              {step.command && <pre className="capstonecard__command">{step.command}</pre>}
            </li>
          ))}
        </ol>
      )}

      {lab.state.status === 'submitted' ? (
        <div className="capstonecard__submitted">
          <p className="findingcard__verdict">submitted</p>
          <h4>{selectedOption?.title ?? lab.state.optionId}</h4>
          {lab.state.repoUrl && (
            <a href={lab.state.repoUrl} target="_blank" rel="noreferrer noopener">
              View on GitHub &rarr;
            </a>
          )}
          {lab.state.summary && <p>{lab.state.summary}</p>}
          <button type="button" className="linkish" onClick={() => onChange({ state: { ...lab.state, status: 'selected' as const } })}>
            Update your link
          </button>
        </div>
      ) : selectedOption ? (
        <div className="capstonecard__form">
          <h4>{selectedOption.title}</h4>
          <p>{selectedOption.pitch}</p>
          <ul className="capstonecard__deliverables">
            {selectedOption.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <label className="capstonecard__label">
            Your repo URL
            <input
              type="url"
              className="capstonecard__input"
              placeholder="https://github.com/your-username/your-repo"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
            />
          </label>
          <label className="capstonecard__label">
            A short note for whoever reads this (optional)
            <textarea
              className="capstonecard__input"
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </label>
          {formError && <p className="seat-note seat-note--bad">{formError}</p>}
          <div className="capstonecard__actions">
            <button type="button" className="btn primary" disabled={busy || !repoUrl.trim()} onClick={() => void submit()}>
              Submit link
            </button>
            <button type="button" className="btn" disabled={busy} onClick={() => void select(selectedOption.id)}>
              Restart this project
            </button>
          </div>
        </div>
      ) : (
        <div className="capstonecard__options">
          {lab.options.map((option) => (
            <article key={option.id} className={`capstoneoption capstoneoption--${option.difficulty}`}>
              <h4>{option.title}</h4>
              <p>{option.pitch}</p>
              <p className="capstoneoption__meta">
                {option.estimatedHours} &middot; {option.difficulty}
              </p>
              <button type="button" className="btn" disabled={busy} onClick={() => void select(option.id)}>
                Start this project
              </button>
            </article>
          ))}
          {formError && <p className="seat-note seat-note--bad">{formError}</p>}
        </div>
      )}
    </article>
  );
}
