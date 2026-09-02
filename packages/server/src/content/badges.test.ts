import { describe, expect, it } from 'vitest';

import { buildCase, newlyEarned, pinnedBadges, standingFor } from '@soc/shared';
import type { BadgeDefinition } from '@soc/shared';

import { BADGES, hasHandWrittenArt, packageBadgeId, trackBadgeId } from './badges.js';
import { PACKAGES } from './index.js';
import { TRACKS } from './tracks.js';
import { trackPackages } from './curriculum.js';

describe('the catalogue', () => {
  it('gives every package a badge', () => {
    for (const pkg of PACKAGES) {
      const badge = BADGES.find((entry) => entry.id === packageBadgeId(pkg.id));
      expect(badge, `no badge for package "${pkg.id}"`).toBeDefined();
      expect(badge!.requires).toEqual([pkg.id]);
    }
  });

  /*
   * The reason the catalogue is derived rather than hand-listed is that a
   * second list drifts. This is the test that would have caught the drift.
   */
  it('gives every package a hand-written citation', () => {
    const missing = PACKAGES.filter((pkg) => !hasHandWrittenArt(pkg.id)).map((pkg) => pkg.id);
    expect(
      missing,
      `add these to PACKAGE_ART in content/badges.ts: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('gives a badge to every track that has playable content, and none to the rest', () => {
    for (const track of TRACKS) {
      const badge = BADGES.find((entry) => entry.id === trackBadgeId(track.id));
      const playable = trackPackages(track.id);
      if (playable.length === 0) {
        // A badge behind a track made entirely of outlines is a locked door
        // with nothing behind it.
        expect(badge, `track "${track.id}" has no content but has a badge`).toBeUndefined();
      } else {
        expect(badge, `track "${track.id}" is playable but has no badge`).toBeDefined();
        expect(badge!.requires).toEqual(playable);
      }
    }
  });

  it('has unique ids and no badge that requires nothing', () => {
    const ids = BADGES.map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const badge of BADGES) {
      expect(badge.requires.length, `badge "${badge.id}" requires nothing`).toBeGreaterThan(0);
    }
  });

  it('only ever requires packages that exist', () => {
    const known = new Set(PACKAGES.map((pkg) => pkg.id));
    for (const badge of BADGES) {
      for (const requirement of badge.requires) {
        expect(known.has(requirement), `badge "${badge.id}" wants missing "${requirement}"`).toBe(
          true,
        );
      }
    }
  });

  it('names every requirement in words, not slugs', () => {
    for (const badge of BADGES) {
      for (const requirement of badge.requires) {
        const title = badge.requirementTitles[requirement];
        expect(title, `badge "${badge.id}" has no title for "${requirement}"`).toBeTruthy();
        // A slug is the internal name for the thing, not the name of the thing.
        expect(title).not.toBe(requirement);
      }
    }
  });

  it('writes a requirement and a citation somebody else could read', () => {
    for (const badge of BADGES) {
      expect(badge.citation.length, badge.id).toBeGreaterThan(20);
      expect(badge.requirement.length, badge.id).toBeGreaterThan(10);
      expect(badge.title.trim()).not.toBe('');
    }
  });
});

const PACKAGE_BADGE: BadgeDefinition = {
  id: 'badge.package.demo',
  kind: 'package',
  title: 'Demo',
  citation: 'Did the demo package, which is a thing that happened.',
  requirement: 'Pass every exercise in Demo.',
  requires: ['demo'],
  requirementTitles: { demo: 'Demo' },
  trackId: null,
  emblem: 'terminal',
  accent: 'green',
};

const TRACK_BADGE: BadgeDefinition = {
  ...PACKAGE_BADGE,
  id: 'badge.track.demo',
  kind: 'track',
  title: 'Demo Track',
  requires: ['demo', 'demo-two'],
  requirementTitles: { demo: 'Demo', 'demo-two': 'Demo Two' },
};

describe('awarding', () => {
  it('awards a badge whose requirements are all complete', () => {
    const earned = newlyEarned([PACKAGE_BADGE], new Set(['demo']), new Set());
    expect(earned.map((badge) => badge.id)).toEqual(['badge.package.demo']);
  });

  it('does not award one that is only partly done', () => {
    expect(newlyEarned([TRACK_BADGE], new Set(['demo']), new Set())).toEqual([]);
  });

  it('does not award one already held', () => {
    const held = new Set(['badge.package.demo']);
    expect(newlyEarned([PACKAGE_BADGE], new Set(['demo']), held)).toEqual([]);
  });

  it('never awards a badge wired to nothing', () => {
    const orphan: BadgeDefinition = { ...PACKAGE_BADGE, id: 'badge.orphan', requires: [] };
    // `every` over an empty array is true, so without the guard this would be
    // handed to everybody the instant they signed up.
    expect(newlyEarned([orphan], new Set(), new Set())).toEqual([]);
  });
});

describe('a case', () => {
  it('reports progress towards a badge not yet held', () => {
    const standing = standingFor(TRACK_BADGE, new Set(['demo']), null);
    expect(standing.done).toEqual(['demo']);
    expect(standing.outstanding).toEqual(['demo-two']);
    expect(standing.percent).toBe(50);
    expect(standing.earnedAt).toBeNull();
  });

  /*
   * The point of storing awards as rows. A track that grows a module must not
   * quietly take a badge back off somebody's shelf.
   */
  it('keeps a held badge even when its requirements have since grown', () => {
    const built = buildCase(
      [TRACK_BADGE],
      new Set(['demo']),
      [{ badgeId: 'badge.track.demo', earnedAt: '2026-08-01T10:00:00.000Z' }],
    );
    expect(built.earnedCount).toBe(1);
    expect(built.badges[0]!.earnedAt).toBe('2026-08-01T10:00:00.000Z');
    // Still honest about what is outstanding now, without revoking anything.
    expect(built.badges[0]!.outstanding).toEqual(['demo-two']);
  });

  it('sorts held badges first, newest first, then the closest unearned', () => {
    const far: BadgeDefinition = { ...PACKAGE_BADGE, id: 'far', requires: ['a', 'b', 'c', 'd'] };
    const near: BadgeDefinition = { ...PACKAGE_BADGE, id: 'near', requires: ['a', 'b'] };
    const built = buildCase(
      [far, near, PACKAGE_BADGE],
      new Set(['a']),
      [{ badgeId: 'badge.package.demo', earnedAt: '2026-08-01T10:00:00.000Z' }],
    );
    expect(built.badges.map((badge) => badge.id)).toEqual(['badge.package.demo', 'near', 'far']);
    expect(built.latest?.badgeId).toBe('badge.package.demo');
  });

  it('pins track badges ahead of package badges beside a name', () => {
    const held = [
      standingFor(PACKAGE_BADGE, new Set(), '2026-08-05T10:00:00.000Z'),
      standingFor(TRACK_BADGE, new Set(), '2026-08-01T10:00:00.000Z'),
    ];
    // The track badge is older and still comes first: "SOC Analyst" is the
    // thing worth knowing about a stranger.
    expect(pinnedBadges(held).map((badge) => badge.id)).toEqual([
      'badge.track.demo',
      'badge.package.demo',
    ]);
  });

  it('pins at most three', () => {
    const held = ['a', 'b', 'c', 'd'].map((id) =>
      standingFor({ ...PACKAGE_BADGE, id }, new Set(), '2026-08-01T10:00:00.000Z'),
    );
    expect(pinnedBadges(held)).toHaveLength(3);
  });
});
