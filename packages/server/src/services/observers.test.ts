/**
 * The property that matters here is that stealth hides an admin from the floor
 * and never from the record. If those two ever come apart, the feature stops
 * being a supervision tool and becomes a back door, so both halves are asserted
 * from both directions.
 */

import { describe, expect, it } from 'vitest';

import { attributeMessage, auditJoin, join, visibleObservers } from './observers.js';

const AT = 1_700_000_000_000;

function announced() {
  return join('ridgeline', 'u1', 'A. Okafor', 'announced', 'Sitting in on the shift.', AT).observer;
}
function stealth() {
  return join('ridgeline', 'u2', 'R. Chen', 'stealth', 'Repairing a misfiring event.', AT).observer;
}

describe('what the floor can see', () => {
  it('shows an announced observer by name', () => {
    const badges = visibleObservers([announced()]);
    expect(badges).toEqual([{ displayName: 'A. Okafor', joinedAt: AT }]);
  });

  it('shows nothing at all for a stealth observer', () => {
    expect(visibleObservers([stealth()])).toEqual([]);
  });

  it('never leaks the stealth identity into the participant view', () => {
    const view = JSON.stringify(visibleObservers([announced(), stealth()]));
    expect(view).not.toContain('R. Chen');
    expect(view).not.toContain('Repairing');
    expect(view).toContain('A. Okafor');
  });
});

describe('what the record keeps', () => {
  it('audits a stealth join exactly as fully as an announced one', () => {
    const open = auditJoin(announced(), 'ridgeline');
    const quiet = auditJoin(stealth(), 'ridgeline');
    expect(Object.keys(quiet).sort()).toEqual(Object.keys(open).sort());
    expect(quiet.displayName).toBe('R. Chen');
    expect(quiet.mode).toBe('stealth');
    expect(quiet.reason).toContain('Repairing');
  });

  it('cannot produce a presence without producing its audit line', () => {
    const { observer, audit } = join(
      'ridgeline',
      'u3',
      'M. Iqbal',
      'stealth',
      'Checking a scoring complaint.',
      AT,
    );
    expect(audit.userId).toBe(observer.userId);
    expect(audit.mode).toBe('stealth');
  });

  it('refuses a stealth join with no stated reason', () => {
    expect(() => join('ridgeline', 'u4', 'X', 'stealth', 'fixing', AT)).toThrow(/stated reason/i);
    // Announced does not need one: they are visible, which is its own account.
    expect(() => join('ridgeline', 'u4', 'X', 'announced', '', AT)).not.toThrow();
  });
});

describe('a stealth admin who speaks', () => {
  it('is attributed to a facilitator rather than to nobody', () => {
    // A message from no one is worse than a message from an admin: the floor
    // assumes a teammate said it and acts on it.
    const said = attributeMessage(stealth());
    expect(said.author).toBe('Facilitator');
    expect(said.fromObserver).toBe(true);
  });

  it('is attributed by name when announced', () => {
    expect(attributeMessage(announced()).author).toBe('A. Okafor');
  });
});
