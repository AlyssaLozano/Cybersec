/**
 * The IR Lead's surface: an incident snapshot and a decision to commit to.
 *
 * DESIGN NOTES THAT ARE NOT COSMETIC
 *
 * 1. The UNKNOWN list is given the same visual weight as the known one, and sits
 *    beside it rather than below. Every decision in this package is made without
 *    knowing whether the attacker reached the database, and an interface that
 *    tucked that away in small grey text would be teaching students to decide
 *    without looking at it — which is the exact habit the package exists to
 *    break.
 *
 * 2. Options carry no scoring hint of any kind before commit. No colour, no
 *    ordering, no "recommended" marker. Several are deliberately defensible and
 *    one is usually harmful, and the whole exercise is telling them apart from
 *    the text alone.
 *
 * 3. Consequences arrive only after submitting, and then for EVERY option, not
 *    just the chosen ones. Most of the learning in a decision exercise is in
 *    reading what the other four would have cost.
 *
 * 4. Ordering is built by clicking steps in sequence rather than by dragging.
 *    Drag-and-drop is worse on touch, worse with a keyboard, and adds a
 *    dependency; clicking in order is unambiguous and reversible.
 */

import { useMemo, useState } from 'react';

import type { DecisionQuality, StudentDecisionPoint } from '@soc/shared';

export interface DecisionOutcomeView {
  optionId: string;
  label: string;
  quality: DecisionQuality;
  consequence: string;
  chosen: boolean;
}

export interface IncidentConsoleProps {
  point: StudentDecisionPoint;
  optionIds: string[];
  ordering: string[];
  justification: string;
  onChange: (next: { optionIds?: string[]; ordering?: string[]; justification?: string }) => void;
  onSubmit: () => void;
  busy: boolean;
  /** Released only after the student commits. */
  outcomes?: DecisionOutcomeView[];
}

const QUALITY_LABEL: Record<DecisionQuality, string> = {
  sound: 'Sound',
  defensible: 'Defensible, at a cost',
  harmful: 'Harmful',
};

export function IncidentConsole({
  point,
  optionIds,
  ordering,
  justification,
  onChange,
  onSubmit,
  busy,
  outcomes,
}: IncidentConsoleProps) {
  const [showSnapshot, setShowSnapshot] = useState(true);

  const outcomeByOption = useMemo(() => {
    const map = new Map<string, DecisionOutcomeView>();
    for (const outcome of outcomes ?? []) map.set(outcome.optionId, outcome);
    return map;
  }, [outcomes]);

  const committed = (outcomes?.length ?? 0) > 0;

  function toggleOption(id: string) {
    onChange({
      optionIds: optionIds.includes(id)
        ? optionIds.filter((existing) => existing !== id)
        : [...optionIds, id],
    });
  }

  function toggleOrder(id: string) {
    // Clicking a step already in the sequence removes it and everything after,
    // so a misordered run can be rewound without starting over.
    const index = ordering.indexOf(id);
    onChange({ ordering: index === -1 ? [...ordering, id] : ordering.slice(0, index) });
  }

  const ready = point.ordered ? ordering.length === point.options.length : optionIds.length > 0;

  return (
    <div className="incident-console">
      <header className="incident-console__head">
        <h3>{point.title}</h3>
        <p className="incident-console__situation">{point.situation}</p>
      </header>

      <section className="incident-snapshot">
        <button
          type="button"
          className="incident-snapshot__toggle"
          onClick={() => setShowSnapshot((open) => !open)}
        >
          {showSnapshot ? '▾' : '▸'} Incident picture — {point.snapshot.asOf}
        </button>

        {showSnapshot && (
          <div className="incident-snapshot__body">
            <div className="incident-snapshot__facts">
              <div>
                <h4>Established</h4>
                <ul>
                  {point.snapshot.known.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* Same weight as "Established", deliberately. See note 1. */}
              <div className="incident-snapshot__unknown">
                <h4>Not established</h4>
                <ul>
                  {point.snapshot.unknown.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <table className="incident-snapshot__systems">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Role</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {point.snapshot.systems.map((system) => (
                  <tr key={system.host}>
                    <td>{system.host}</td>
                    <td>{system.role}</td>
                    <td>{system.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {point.snapshot.pressures && point.snapshot.pressures.length > 0 && (
              <div className="incident-snapshot__pressures">
                <h4>Bearing on the decision</h4>
                <ul>
                  {point.snapshot.pressures.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="incident-options">
        <h4>
          {point.ordered
            ? `Click the steps in the order you would perform them (${ordering.length} of ${point.options.length})`
            : 'Choose what you do'}
        </h4>

        <ul>
          {point.options.map((option) => {
            const position = ordering.indexOf(option.id);
            const picked = point.ordered ? position !== -1 : optionIds.includes(option.id);
            const outcome = outcomeByOption.get(option.id);

            return (
              <li
                key={option.id}
                className={[
                  'incident-option',
                  picked ? 'incident-option--picked' : '',
                  outcome ? `incident-option--${outcome.quality}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <button
                  type="button"
                  className="incident-option__choose"
                  disabled={busy}
                  onClick={() => (point.ordered ? toggleOrder(option.id) : toggleOption(option.id))}
                >
                  <span className="incident-option__marker">
                    {point.ordered ? (position === -1 ? '·' : position + 1) : picked ? '✓' : ''}
                  </span>
                  <span className="incident-option__text">
                    <strong>{option.label}</strong>
                    {option.detail && <span className="incident-option__detail">{option.detail}</span>}
                  </span>
                </button>

                {outcome && (
                  <div className="incident-option__outcome">
                    <span className={`incident-option__quality is-${outcome.quality}`}>
                      {QUALITY_LABEL[outcome.quality]}
                      {outcome.chosen ? ' · you chose this' : ''}
                    </span>
                    <p>{outcome.consequence}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <label className="incident-console__note">
          Why (optional, but some exercises grade it)
          <textarea
            rows={3}
            value={justification}
            disabled={busy}
            onChange={(event) => onChange({ justification: event.target.value })}
            placeholder="What you are deciding, and what you are accepting as the cost of it."
          />
        </label>

        <div className="incident-console__actions">
          {point.ordered && ordering.length > 0 && (
            <button type="button" onClick={() => onChange({ ordering: [] })} disabled={busy}>
              Clear order
            </button>
          )}
          <button
            type="button"
            className="incident-console__commit"
            onClick={onSubmit}
            disabled={busy || !ready}
          >
            {busy ? 'Committing…' : committed ? 'Commit again' : 'Commit to this'}
          </button>
        </div>

        {!ready && point.ordered && (
          <p className="incident-console__hint">
            Every step belongs in the sequence — the answer is the order, not the selection.
          </p>
        )}
      </section>
    </div>
  );
}
