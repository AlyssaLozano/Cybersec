/**
 * Invariants on the role catalogue.
 *
 * These exist because the catalogue silently drifted: the mitigation specialist
 * was added to SOC_ROLE_IDS, seated on every scenario floor, and given no career
 * profile at all, so a student could sit in a chair the product could not
 * describe. Nothing caught that, because nothing was checking that the two lists
 * agree.
 */

import { describe, expect, it } from 'vitest';

import { SOC_ROLES, SOC_ROLE_IDS } from '@soc/shared';

describe('role catalogue', () => {
  it('describes every seat a student can be put in', () => {
    const described = new Set(SOC_ROLES.map((r) => r.id));
    for (const id of SOC_ROLE_IDS) {
      expect(described.has(id), `${id} is seatable but has no career profile`).toBe(true);
    }
  });

  it('does not describe seats that do not exist', () => {
    for (const role of SOC_ROLES) {
      expect(SOC_ROLE_IDS).toContain(role.id);
    }
  });

  /*
   * The reason the tier field exists at all. A career changer reading the role
   * list needs to know which chair they will actually be hired into, and any
   * printed order reads as a ranking to somebody who does not yet know the
   * field. Exactly one seat is a true entry point, and if that ever becomes two
   * or zero it is a content decision somebody should have to make deliberately.
   */
  it('names exactly one entry point, and it is Tier 1', () => {
    const entry = SOC_ROLES.filter((r) => r.entryPoint);
    expect(entry.map((r) => r.id)).toEqual(['soc-operator']);
    expect(entry[0]!.tier).toBe('tier-1');
  });

  it('tells everybody else how they would actually get there', () => {
    for (const role of SOC_ROLES) {
      expect(role.howYouGetHere.length, `${role.id} has no path described`).toBeGreaterThan(40);
      if (!role.entryPoint) {
        // Not a style rule: a seat that reads as reachable from nowhere is the
        // thing that made the operator chair look senior in the first place.
        expect(role.tier, `${role.id} is not an entry point but is Tier 1`).not.toBe('tier-1');
      }
    }
  });
});
