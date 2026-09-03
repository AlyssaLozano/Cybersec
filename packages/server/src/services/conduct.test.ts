import { describe, expect, it } from 'vitest';

import {
  BAN_AFTER_EJECTIONS,
  EJECTION_REPORTERS,
  REPORT_REASONS,
  REPORT_SPACES,
  SUSPEND_AFTER_EJECTIONS,
  conductAction,
  ejectionThreshold,
  reportReason,
} from '@soc/shared';

/*
 * These are the rules that decide whether one person can remove another, so
 * they are tested as arithmetic rather than through a room. A regression here
 * does not look like a broken page: it looks like the product working exactly
 * as before, for everybody except the person it just removed.
 */

describe('how many people it takes to remove somebody', () => {
  it('is three on any room big enough for three to mean something', () => {
    expect(ejectionThreshold(4)).toBe(EJECTION_REPORTERS);
    expect(ejectionThreshold(7)).toBe(EJECTION_REPORTERS);
    expect(ejectionThreshold(13)).toBe(EJECTION_REPORTERS);
  });

  it('never falls to one, however small the room', () => {
    for (let occupants = 0; occupants <= 20; occupants += 1) {
      expect(ejectionThreshold(occupants)).toBeGreaterThan(1);
    }
  });

  /*
   * The case the whole scaling rule exists for. With two people present only
   * one of them can press the button, so a threshold of two cannot be reached,
   * and that is the intended answer rather than an oversight: handing either
   * person in a pair the power to remove the other is worse than having no
   * button, and leaving is already available.
   */
  it('cannot be reached in a room of two', () => {
    const others = 2 - 1;
    expect(ejectionThreshold(2)).toBeGreaterThan(others);
  });

  it('can be reached in a room of three, but only by both other people', () => {
    expect(ejectionThreshold(3)).toBe(2);
  });

  /*
   * A red versus blue match is two people, and goes through the same function
   * for the same reason: nobody gets to remove their opponent mid-match.
   */
  it('cannot be reached in a duel', () => {
    expect(ejectionThreshold(2)).toBeGreaterThan(1);
  });
});

describe('what a run of ejections costs an account', () => {
  it('costs nothing for one, because one is a bad hour', () => {
    expect(conductAction(0)).toBe('none');
    expect(conductAction(1)).toBe('none');
  });

  it('suspends on the second, when two separate rooms agree', () => {
    expect(conductAction(SUSPEND_AFTER_EJECTIONS)).toBe('suspend');
  });

  it('holds the account on the third', () => {
    expect(conductAction(BAN_AFTER_EJECTIONS)).toBe('ban');
    expect(conductAction(BAN_AFTER_EJECTIONS + 5)).toBe('ban');
  });

  it('escalates in one direction only, however many rooms', () => {
    const order = { none: 0, suspend: 1, ban: 2 };
    let previous = 0;
    for (let count = 0; count <= 10; count += 1) {
      const now = order[conductAction(count)];
      expect(now).toBeGreaterThanOrEqual(previous);
      previous = now;
    }
  });
});

describe('the reasons somebody can pick', () => {
  it('has no duplicate ids, since the tally keys on them', () => {
    const ids = REPORT_REASONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('always ends with a way to say something the list did not anticipate', () => {
    expect(REPORT_REASONS[REPORT_REASONS.length - 1]!.id).toBe('other');
  });

  /*
   * The urgent categories are what stops a threat sitting behind forty spam
   * reports in the queue. If none of them carried the flag the sort would be
   * by age alone, which is the failure mode that makes a queue worthless.
   */
  it('marks at least one category as reaching staff immediately', () => {
    expect(REPORT_REASONS.some((r) => r.escalatesImmediately)).toBe(true);
  });

  it('is looked up by id, and refuses one that is not on the list', () => {
    expect(reportReason('harassment')?.id).toBe('harassment');
    expect(reportReason('not-a-reason')).toBeNull();
  });

  it('gives every reason something to read under the label', () => {
    for (const reason of REPORT_REASONS) {
      expect(reason.label.length).toBeGreaterThan(0);
      expect(reason.detail.length).toBeGreaterThan(0);
    }
  });
});

describe('the spaces a report can come from', () => {
  /*
   * Every shared space has to be covered or the rule has a hole in it, and the
   * hole is always the space somebody moves to once they are removed from the
   * first one.
   */
  it('covers the floor, the match and the lobby', () => {
    expect(REPORT_SPACES).toContain('soc-floor');
    expect(REPORT_SPACES).toContain('redblue');
    expect(REPORT_SPACES).toContain('lobby');
  });
});
