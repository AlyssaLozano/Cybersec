/**
 * The SOC Operator role's surface: an alert queue with dispositions.
 *
 * DESIGN NOTES THAT ARE NOT COSMETIC
 *
 * 1. The queue is NOT sorted by severity by default, and severity is shown as a
 *    quiet label rather than a colour-coded banner. That is deliberate. The
 *    package exists to teach that severity is a claim made by a rule, and a UI
 *    that paints critical alerts red and low alerts grey teaches the opposite
 *    before the student has read a word.
 *
 * 2. Prior firings and prior false positives are shown on the row, not hidden
 *    behind a click. They are the two numbers that most change a real triage
 *    decision, and burying them would make the exercise harder in a way that
 *    teaches nothing.
 *
 * 3. Progress is counted as "decided", never as "escalated". An operator whose
 *    interface congratulates them for escalating will escalate.
 *
 * 4. Nothing here knows the right answer. The queue arrives without ground truth
 *    and the component never receives it — grading happens server-side, and the
 *    debrief arrives only after the student commits. The same is true of the
 *    copilot: this component is handed what the assistant said, never whether it
 *    was worth listening to.
 *
 * 5. The copilot is offered only when the exercise enables it, and never opens
 *    itself. Modules 3.1 to 3.4 are worked unaided on purpose, and asking is the
 *    graded act — a panel that populated on selection would mark every alert
 *    consulted whether or not anybody read it.
 */

import { useMemo, useState } from 'react';

import type {
  Alert,
  AlertQueue as Queue,
  CollaborationScore,
  CopilotAnalysis,
  CopilotDebriefEntry,
  TriageDecision,
  TriageEntry,
} from '@soc/shared';

import { CollaborationScorecard, Copilot } from './Copilot';

const DECISIONS: Array<{ id: TriageDecision; label: string; hint: string }> = [
  { id: 'escalate', label: 'Escalate', hint: 'Hand to a second analyst now.' },
  { id: 'investigate', label: 'Investigate', hint: 'Keep it; you need more before deciding.' },
  { id: 'dismiss', label: 'Dismiss', hint: 'Close it. Correct or harmless, nothing further needed.' },
  { id: 'tune', label: 'Tune rule', hint: 'Close it and flag the rule — it will keep arriving.' },
];

type SortKey = 'time' | 'severity' | 'rule';

/** Severity order for the optional sort. Not used for colouring, on purpose. */
const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

function timeOf(alert: Alert): string {
  // The corpus stores ISO timestamps; the operator only ever cares about the
  // time of day within the shift.
  return alert.raisedAt.slice(11, 19);
}

export interface AlertQueueProps {
  queue: Queue;
  /** Current dispositions, owned by the parent so they survive a re-render. */
  entries: TriageEntry[];
  onChange: (entries: TriageEntry[]) => void;
  onSubmit: () => void;
  busy: boolean;
  /** Set once the student has committed, to explain what they missed. */
  debrief?: {
    scores: Array<{ decision: TriageDecision; precision: number; recall: number; expected: number; correct: number; selected: number }>;
    missed: Array<{ alertId: string; yourDecision: TriageDecision | null; correct: TriageDecision; why: string }>;
  };
  /**
   * The copilot, when the exercise offers one.
   *
   * Absent on every exercise before Module 3.5, which is the point: those are
   * worked unaided. Analyses are owned by the parent so that an answer already
   * fetched survives switching between alerts — re-fetching would be a second
   * consultation of something the student already read.
   */
  copilot?: {
    analyses: Record<string, CopilotAnalysis>;
    /**
     * Alerts already asked about, as the server records them.
     *
     * Server-supplied rather than derived from `analyses`, because a reload
     * empties the local cache and several exercises require a minimum number of
     * consultations. A student needs to see the count the grader will use.
     */
    consultedAlertIds: string[];
    /** The alert currently being asked about, if any. */
    loadingAlertId: string | null;
    error: string | null;
    onAsk: (alertId: string) => void;
    /** Released with the debrief: which suggestions were unsound, and how. */
    debriefByAlert?: Record<string, CopilotDebriefEntry>;
    collaboration?: CollaborationScore;
  };
}

export function AlertQueue({
  queue,
  entries,
  onChange,
  onSubmit,
  busy,
  debrief,
  copilot,
}: AlertQueueProps) {
  const [selectedId, setSelectedId] = useState<string | null>(queue.alerts[0]?.id ?? null);
  const [sort, setSort] = useState<SortKey>('time');
  const [onlyUndecided, setOnlyUndecided] = useState(false);

  const decisionOf = useMemo(() => {
    const map = new Map<string, TriageEntry>();
    for (const entry of entries) map.set(entry.alertId, entry);
    return map;
  }, [entries]);

  const missedById = useMemo(() => {
    const map = new Map<string, NonNullable<AlertQueueProps['debrief']>['missed'][number]>();
    for (const item of debrief?.missed ?? []) map.set(item.alertId, item);
    return map;
  }, [debrief]);

  const rows = useMemo(() => {
    const list = [...queue.alerts];
    if (sort === 'severity') {
      list.sort(
        (a, b) =>
          (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9) ||
          a.raisedAt.localeCompare(b.raisedAt),
      );
    } else if (sort === 'rule') {
      list.sort((a, b) => a.ruleId.localeCompare(b.ruleId) || a.raisedAt.localeCompare(b.raisedAt));
    } else {
      list.sort((a, b) => a.raisedAt.localeCompare(b.raisedAt));
    }
    return onlyUndecided ? list.filter((alert) => !decisionOf.has(alert.id)) : list;
  }, [queue.alerts, sort, onlyUndecided, decisionOf]);

  const selected = queue.alerts.find((alert) => alert.id === selectedId) ?? null;
  const decided = entries.length;
  const total = queue.alerts.length;

  function setDecision(alertId: string, decision: TriageDecision) {
    const existing = decisionOf.get(alertId);
    // Clicking the decision an alert already has clears it, so a misclick is
    // recoverable without hunting for an "undo".
    if (existing?.decision === decision) {
      onChange(entries.filter((entry) => entry.alertId !== alertId));
      return;
    }
    const next = entries.filter((entry) => entry.alertId !== alertId);
    next.push({ alertId, decision, ...(existing?.justification ? { justification: existing.justification } : {}) });
    onChange(next);
  }

  function setJustification(alertId: string, justification: string) {
    const existing = decisionOf.get(alertId);
    if (!existing) return;
    onChange(
      entries.map((entry) => (entry.alertId === alertId ? { ...entry, justification } : entry)),
    );
  }

  return (
    <div className="alert-queue">
      <header className="alert-queue__head">
        <div>
          <h3>{queue.title}</h3>
          <p className="alert-queue__briefing">{queue.briefing}</p>
        </div>
      </header>

      <div className="alert-queue__controls">
        <span className="alert-queue__count">
          {decided} of {total} decided
        </span>
        {copilot ? (
          <span className="alert-queue__count alert-queue__count--consulted">
            {copilot.consultedAlertIds.length} asked about
          </span>
        ) : null}
        <label>
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="time">Time raised</option>
            <option value="severity">Severity claimed</option>
            <option value="rule">Rule</option>
          </select>
        </label>
        <label className="alert-queue__toggle">
          <input
            type="checkbox"
            checked={onlyUndecided}
            onChange={(event) => setOnlyUndecided(event.target.checked)}
          />
          Undecided only
        </label>
        <button type="button" onClick={onSubmit} disabled={busy || decided === 0}>
          {busy ? 'Submitting…' : 'Submit dispositions'}
        </button>
      </div>

      <div className="alert-queue__body">
        <ol className="alert-queue__list">
          {rows.map((alert) => {
            const entry = decisionOf.get(alert.id);
            const missed = missedById.get(alert.id);
            return (
              <li
                key={alert.id}
                className={[
                  'alert-row',
                  selectedId === alert.id ? 'alert-row--selected' : '',
                  entry ? `alert-row--${entry.decision}` : '',
                  missed ? 'alert-row--missed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <button type="button" className="alert-row__main" onClick={() => setSelectedId(alert.id)}>
                  <span className="alert-row__time">{timeOf(alert)}</span>
                  <span className="alert-row__id">{alert.id}</span>
                  <span className="alert-row__severity">{alert.severity}</span>
                  <span className="alert-row__summary">{alert.summary}</span>
                  <span className="alert-row__rule">{alert.ruleName}</span>
                  <span className="alert-row__history">
                    fired {alert.enrichment.priorFirings.toLocaleString()} ·{' '}
                    {alert.enrichment.priorFalsePositives.toLocaleString()} closed as noise
                  </span>
                  {entry ? <span className="alert-row__decision">{entry.decision}</span> : null}
                </button>
              </li>
            );
          })}
          {rows.length === 0 ? (
            <li className="alert-queue__empty">Every alert has a disposition.</li>
          ) : null}
        </ol>

        <aside className="alert-detail">
          {selected ? (
            <>
              <h4>
                {selected.id} · {selected.ruleName}
              </h4>
              <dl className="alert-detail__facts">
                <div>
                  <dt>Raised</dt>
                  <dd>{timeOf(selected)}</dd>
                </div>
                <div>
                  <dt>Claimed severity</dt>
                  <dd>
                    {selected.severity} · {selected.confidence}% confidence
                  </dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>
                    {selected.from.ip}
                    {selected.from.host ? ` (${selected.from.host})` : ''}
                    {selected.from.user ? ` as ${selected.from.user}` : ''}
                  </dd>
                </div>
                {selected.to ? (
                  <div>
                    <dt>Destination</dt>
                    <dd>
                      {selected.to.ip}
                      {selected.to.port ? `:${selected.to.port}` : ''}
                      {selected.to.host ? ` (${selected.to.host})` : ''}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Rule history</dt>
                  <dd>
                    fired {selected.enrichment.priorFirings.toLocaleString()} times,{' '}
                    {selected.enrichment.priorFalsePositives.toLocaleString()} closed as not worth acting on
                  </dd>
                </div>
                {selected.enrichment.reputation ? (
                  <div>
                    <dt>Reputation</dt>
                    <dd>
                      {selected.enrichment.reputation}
                      {selected.enrichment.reputationNote ? ` — ${selected.enrichment.reputationNote}` : ''}
                    </dd>
                  </div>
                ) : null}
                {selected.enrichment.allowlisted !== undefined ? (
                  <div>
                    <dt>Egress allowlist</dt>
                    <dd>{selected.enrichment.allowlisted ? 'listed' : 'not listed'}</dd>
                  </div>
                ) : null}
              </dl>

              <p className="alert-detail__body">{selected.detail}</p>

              <div className="alert-detail__decisions">
                {DECISIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    title={option.hint}
                    className={
                      decisionOf.get(selected.id)?.decision === option.id
                        ? 'is-chosen'
                        : undefined
                    }
                    onClick={() => setDecision(selected.id, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {decisionOf.get(selected.id) ? (
                <label className="alert-detail__note">
                  Why (optional, but some exercises grade it)
                  <textarea
                    rows={3}
                    value={decisionOf.get(selected.id)?.justification ?? ''}
                    onChange={(event) => setJustification(selected.id, event.target.value)}
                    placeholder="What this is, why it is or is not an incident, and what should happen next."
                  />
                </label>
              ) : null}

              {missedById.get(selected.id) ? (
                <div className="alert-detail__missed">
                  <strong>
                    You said {missedById.get(selected.id)!.yourDecision ?? 'nothing'}; the answer is{' '}
                    {missedById.get(selected.id)!.correct}.
                  </strong>
                  <p>{missedById.get(selected.id)!.why}</p>
                </div>
              ) : null}

              {copilot ? (
                <Copilot
                  alertId={selected.id}
                  analysis={copilot.analyses[selected.id] ?? null}
                  loading={copilot.loadingAlertId === selected.id}
                  error={copilot.loadingAlertId === selected.id ? copilot.error : null}
                  onAsk={() => copilot.onAsk(selected.id)}
                  previouslyAsked={copilot.consultedAlertIds.includes(selected.id)}
                  {...(copilot.debriefByAlert?.[selected.id]
                    ? { debrief: copilot.debriefByAlert[selected.id]! }
                    : {})}
                />
              ) : null}
            </>
          ) : (
            <p>Select an alert.</p>
          )}
        </aside>
      </div>

      {debrief ? (
        <section className="alert-queue__scores">
          <h4>How you scored</h4>
          <p className="alert-queue__scores-note">
            Precision and recall are reported separately on purpose. Escalating everything gives you
            perfect recall and is worthless; escalating nothing gives you perfect precision and is
            worse.
          </p>
          <table>
            <thead>
              <tr>
                <th>Decision</th>
                <th>You</th>
                <th>Warranted</th>
                <th>Correct</th>
                <th>Precision</th>
                <th>Recall</th>
              </tr>
            </thead>
            <tbody>
              {debrief.scores.map((score) => (
                <tr key={score.decision}>
                  <td>{score.decision}</td>
                  <td>{score.selected}</td>
                  <td>{score.expected}</td>
                  <td>{score.correct}</td>
                  <td>{Math.round(score.precision * 100)}%</td>
                  <td>{Math.round(score.recall * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {copilot?.collaboration ? (
        <CollaborationScorecard score={copilot.collaboration} />
      ) : null}
    </div>
  );
}
