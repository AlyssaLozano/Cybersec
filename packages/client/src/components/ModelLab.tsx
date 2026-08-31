/**
 * The Model Lab: the surface an AI Security Analyst works through.
 *
 * THREE PANES, AND THE SPLIT IS THE LESSON
 *
 * The CARD is what a real assessor is handed in a scoping document: what the
 * system is for, where it sits, how much traffic it takes, and what the owning
 * team claim about its defences. The claim is deliberately given equal weight
 * to the facts, because reading it sceptically is most of the job.
 *
 * The CONSOLE is where payloads are sent. It has two buttons and they do
 * different things: Send is unlimited and ungraded, Submit is the short list of
 * probes the student puts their name to. Keeping them visibly separate is the
 * point: testing is mostly failure, and a surface that made every attempt feel
 * like an exam answer would teach people to guess carefully rather than test
 * systematically.
 *
 * The DEPLOYMENT panel appears only when the exercise grades a defence set. It
 * shows the eight available controls with what each one does, what it does NOT
 * do, and what it costs, and a running cost total, because "turn everything on"
 * is not an answer anybody ships and the budget is what makes that concrete.
 *
 * WHAT THIS COMPONENT NEVER SHOWS
 *
 * Which controls the deployment actually has. A result says the stage a payload
 * died at: before the model, at the instruction boundary, or on the way out:
 * and nothing more. That is roughly what a real black-box tester infers, and
 * naming the control would let somebody map a deployment in eight probes
 * without understanding any of it.
 */

import { useMemo, useState } from 'react';

import type {
  AttackSuite,
  DefenceId,
  HardeningScore,
  ModelCard,
  ProbeEntry,
  ProbeResult,
} from '@soc/shared';
import { ATTACK_CARRIER_LABELS, ATTACK_INTENT_LABELS, DEFENCE_PROFILES } from '@soc/shared';

interface ModelLabProps {
  model: ModelCard;
  /**
   * The fixed suite the defence set is measured against, when there is one.
   *
   * Separate from `configurable` on purpose: one exercise asks the student to
   * deploy a control and then break their own fix with their own payloads, so
   * it configures defences and names no suite.
   */
  suite?: AttackSuite;
  /** Whether this exercise lets the student rebuild the deployment. */
  configurable?: boolean;
  /** Probes the student has queued for submission. Held by the parent so a re-render keeps them. */
  probes: ProbeEntry[];
  onChangeProbes: (probes: ProbeEntry[]) => void;
  defences: DefenceId[];
  onChangeDefences: (defences: DefenceId[]) => void;
  /** Fire one payload without grading. Returns what happened to it. */
  onSend: (probe: ProbeEntry) => Promise<ProbeResult | null>;
  onSubmit: () => void;
  busy: boolean;
  /** Graded results, once a submission has been made. */
  submitted?: ProbeResult[];
  hardening?: HardeningScore[];
  /** Released on a pass: why the deployment held or failed. */
  postMortem?: string;
}

/** One entry in the ungraded scratch log. */
interface Trial {
  probe: ProbeEntry;
  result: ProbeResult;
}

const STAGE_LABEL: Record<ProbeResult['stage'], string> = {
  'input-filter': 'Stopped before the model',
  'instruction-boundary': 'Reached the model; refused as an instruction',
  'output-filter': 'Complied; response suppressed on the way out',
  none: 'Nothing stopped it',
};

export function ModelLab({
  model,
  suite,
  configurable,
  probes,
  onChangeProbes,
  defences,
  onChangeDefences,
  onSend,
  onSubmit,
  busy,
  submitted,
  hardening,
  postMortem,
}: ModelLabProps) {
  const [draft, setDraft] = useState('');
  const [channel, setChannel] = useState<'user' | 'retrieved'>('user');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);

  const cost = useMemo(
    () =>
      defences.reduce(
        (total, id) => total + (DEFENCE_PROFILES.find((p) => p.id === id)?.cost ?? 0),
        0,
      ),
    [defences],
  );

  const send = async () => {
    const payload = draft.trim();
    if (!payload) return;
    setSendError(null);
    const probe: ProbeEntry = { payload, ...(channel === 'retrieved' ? { channel } : {}) };
    try {
      const result = await onSend(probe);
      if (result) setTrials((previous) => [{ probe, result }, ...previous]);
    } catch {
      setSendError('That probe could not be sent.');
    }
  };

  const queueForSubmission = (probe: ProbeEntry) => {
    if (probes.some((item) => item.payload === probe.payload && item.channel === probe.channel)) {
      return;
    }
    onChangeProbes([...probes, probe]);
  };

  const toggleDefence = (id: DefenceId) => {
    onChangeDefences(
      defences.includes(id) ? defences.filter((item) => item !== id) : [...defences, id],
    );
  };

  return (
    <section className="lab">
      <div className="lab-grid">
        {/* --- the scoping document ----------------------------------------- */}
        <aside className="lab-card">
          <div className="lab-eyebrow">Model under test</div>
          <h2>
            {model.name} <span className="lab-version">{model.version}</span>
          </h2>
          <p className="lab-purpose">{model.purpose}</p>

          <dl className="lab-facts">
            <div>
              <dt>Deployment</dt>
              <dd className={`lab-stage lab-stage-${model.stage}`}>{model.stage}</dd>
            </div>
            <div>
              <dt>Traffic</dt>
              <dd>{model.dailyQueries.toLocaleString()} queries/day</dd>
            </div>
          </dl>

          {model.systemPrompt && (
            <div className="lab-block">
              <div className="lab-block-head">System prompt (disclosed by the team)</div>
              <pre className="lab-pre">{model.systemPrompt}</pre>
            </div>
          )}

          {/*
           * The vendor claim sits alongside the facts rather than above or below
           * them, because in this job it is neither. It is an assertion by an
           * interested party, and the whole exercise is finding out where it and
           * the running system disagree.
           */}
          <div className="lab-block lab-claim">
            <div className="lab-block-head">What the team say</div>
            <p>{model.vendorClaim}</p>
          </div>

          {model.retrievalNote && (
            <div className="lab-block lab-retrieval">
              <div className="lab-block-head">Retrieval</div>
              <p>{model.retrievalNote}</p>
            </div>
          )}
        </aside>

        {/* --- the probe console -------------------------------------------- */}
        <div className="lab-console">
          <label className="lab-label" htmlFor="lab-payload">
            Payload
          </label>
          <textarea
            id="lab-payload"
            className="lab-input"
            rows={6}
            value={draft}
            spellCheck={false}
            placeholder="Type what you would send to this system…"
            onChange={(event) => setDraft(event.target.value)}
          />

          <div className="lab-controls">
            {/*
             * The channel selector is not a convenience. Choosing which way in
             * to take is the decision the whole of module ais.4 turns on, so the
             * student makes it explicitly rather than the harness inferring it
             * from the text.
             */}
            <fieldset className="lab-channel">
              <legend>Arrives as</legend>
              <label>
                <input
                  type="radio"
                  name="lab-channel"
                  checked={channel === 'user'}
                  onChange={() => setChannel('user')}
                />
                something a user typed
              </label>
              <label>
                <input
                  type="radio"
                  name="lab-channel"
                  checked={channel === 'retrieved'}
                  onChange={() => setChannel('retrieved')}
                />
                a document the system retrieved
              </label>
            </fieldset>

            <div className="lab-buttons">
              <button className="btn" disabled={busy || !draft.trim()} onClick={send}>
                Send
              </button>
              <span className="lab-hint-text">Unlimited. Never graded.</span>
            </div>
          </div>

          {sendError && <p className="lab-error">{sendError}</p>}

          {/* --- the scratch log -------------------------------------------- */}
          <div className="lab-trials">
            {trials.length === 0 && (
              <p className="lab-empty">
                Nothing sent yet. Send a payload with no attack in it first, so you know what a
                normal answer from this system looks like.
              </p>
            )}
            {trials.map((trial, index) => (
              <article
                key={`${index}-${trial.probe.payload.slice(0, 24)}`}
                className={`lab-trial${trial.result.bypassed ? ' bypassed' : ''}`}
              >
                <header>
                  <span className={`lab-verdict${trial.result.bypassed ? ' through' : ''}`}>
                    {trial.result.bypassed ? 'GOT THROUGH' : 'BLOCKED'}
                  </span>
                  <span className="lab-stage-note">{STAGE_LABEL[trial.result.stage]}</span>
                  {trial.probe.channel === 'retrieved' && (
                    <span className="lab-tag">retrieval path</span>
                  )}
                </header>

                <div className="lab-techniques">
                  {trial.result.intents.length === 0 ? (
                    <span className="lab-tag muted">no attack recognised</span>
                  ) : (
                    trial.result.intents.map((intent) => (
                      <span className="lab-tag" key={intent}>
                        {ATTACK_INTENT_LABELS[intent]}
                      </span>
                    ))
                  )}
                  {trial.result.carriers
                    .filter((carrier) => carrier !== 'none')
                    .map((carrier) => (
                      <span className="lab-tag carrier" key={carrier}>
                        {ATTACK_CARRIER_LABELS[carrier]}
                      </span>
                    ))}
                </div>

                <pre className="lab-pre response">{trial.result.response}</pre>

                <button
                  className="btn small"
                  onClick={() => queueForSubmission(trial.probe)}
                  disabled={probes.some(
                    (item) =>
                      item.payload === trial.probe.payload && item.channel === trial.probe.channel,
                  )}
                >
                  Add to submission
                </button>
              </article>
            ))}
          </div>
        </div>

        {/* --- the deployment panel ----------------------------------------- */}
        {configurable && (
          <aside className="lab-deployment">
            <div className="lab-eyebrow">Deployment</div>
            <p className="lab-note">
              {suite
                ? 'Choose the controls to run in front of this model. The suite below is what your choice will be measured against: you can read every payload in it before you decide.'
                : 'Choose the controls to run in front of this model, then attack it again with your own payloads and show that every one is now blocked.'}
            </p>

            <div className="lab-cost">
              Cost <strong>{cost}</strong>
            </div>

            {(['normalising', 'pattern', 'structural'] as const).map((kind) => (
              <div className="lab-defence-group" key={kind}>
                <div className="lab-group-head">{kind}</div>
                {DEFENCE_PROFILES.filter((profile) => profile.kind === kind).map((profile) => (
                  <label className="lab-defence" key={profile.id}>
                    <input
                      type="checkbox"
                      checked={defences.includes(profile.id)}
                      onChange={() => toggleDefence(profile.id)}
                    />
                    <span className="lab-defence-body">
                      <span className="lab-defence-title">
                        {profile.title} <span className="lab-defence-cost">{profile.cost}</span>
                      </span>
                      <span className="lab-defence-summary">{profile.summary}</span>
                      {/*
                       * The limitation is shown by default rather than behind a
                       * disclosure. What a control does NOT do is the half teams
                       * get wrong, and hiding it behind a click would reproduce
                       * exactly the mistake this package exists to teach.
                       */}
                      <span className="lab-defence-limit">{profile.limitation}</span>
                    </span>
                  </label>
                ))}
              </div>
            ))}

            {suite && (
            <details className="lab-suite">
              <summary>
                {suite.title}: read the payloads
              </summary>
              <p className="lab-note">{suite.summary}</p>
              {suite.payloads.map((payload, index) => (
                <pre className="lab-pre small" key={index}>
                  {payload}
                </pre>
              ))}
            </details>
            )}
          </aside>
        )}
      </div>

      {/* --- the submission -------------------------------------------------- */}
      <div className="lab-submission">
        <div className="lab-submission-head">
          <h3>Submission</h3>
          <span className="lab-hint-text">
            {probes.length === 0
              ? 'Nothing queued. Add the probes that demonstrate your finding.'
              : `${probes.length} probe${probes.length === 1 ? '' : 's'} queued.`}
          </span>
        </div>

        {probes.map((probe, index) => (
          <div className="lab-queued" key={`${index}-${probe.payload.slice(0, 24)}`}>
            <pre className="lab-pre small">{probe.payload}</pre>
            {probe.channel === 'retrieved' && <span className="lab-tag">retrieval path</span>}
            <button
              className="btn small"
              onClick={() => onChangeProbes(probes.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        ))}

        <button className="btn primary" disabled={busy} onClick={onSubmit}>
          Submit assessment
        </button>

        {hardening && hardening.length > 0 && (
          <div className="lab-scores">
            {hardening.map((score) => (
              <div className="lab-score" key={score.suiteId}>
                <span className="lab-score-value">
                  {score.blocked}/{score.total}
                </span>
                <span className="lab-score-label">blocked, at a cost of {score.cost}</span>
              </div>
            ))}
          </div>
        )}

        {submitted && submitted.length > 0 && (
          <ul className="lab-graded">
            {submitted.map((result) => (
              <li key={result.index} className={result.bypassed ? 'through' : ''}>
                Probe {result.index + 1}: {result.bypassed ? 'got through' : STAGE_LABEL[result.stage]}
              </li>
            ))}
          </ul>
        )}

        {postMortem && (
          <div className="lab-postmortem">
            <span className="tag">What was actually in front of it</span>
            <p>{postMortem}</p>
          </div>
        )}
      </div>
    </section>
  );
}
