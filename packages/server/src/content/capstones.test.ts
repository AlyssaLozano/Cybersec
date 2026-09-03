/**
 * The GitHub Lab is deliberately outside the Exercise/Check catalogue (see
 * capstones.ts), so it needs its own reachability guard: the same "content
 * nobody can open is content nobody has" property career.test.ts enforces for
 * packages, checked here for capstone stages instead.
 */

import { describe, expect, it } from 'vitest';

import { CAPSTONES, GITHUB_WALKTHROUGH, capstoneOption, capstoneOptions } from './capstones.js';
import { TRACKS } from './tracks.js';

describe('the GitHub Lab catalogue', () => {
  const capstoneTrackIds = TRACKS.filter((track) =>
    track.curriculum.some((stage) => stage.capstoneTrack),
  ).map((track) => track.id);

  it('gives every capstone-bearing track at least one option', () => {
    for (const trackId of capstoneTrackIds) {
      expect(capstoneOptions(trackId).length, `${trackId} has a GitHub Lab stage but no options`).toBeGreaterThan(0);
    }
  });

  it('does not define options for a track with no capstone stage', () => {
    const orphans = Object.keys(CAPSTONES).filter((trackId) => !capstoneTrackIds.includes(trackId));
    expect(orphans).toEqual([]);
  });

  it('gives every option a stable, unique id within its track', () => {
    for (const [trackId, options] of Object.entries(CAPSTONES)) {
      const ids = options.map((option) => option.id);
      expect(new Set(ids).size, `${trackId} has a duplicate capstone option id`).toBe(ids.length);
    }
  });

  it('gives every option at least one deliverable', () => {
    for (const options of Object.values(CAPSTONES)) {
      for (const option of options) {
        expect(option.deliverables.length, `${option.id} has no deliverables`).toBeGreaterThan(0);
      }
    }
  });

  it('resolves a known option and returns null for an unknown one', () => {
    expect(capstoneOption('soc', 'soc-home-siem')?.title).toBe('Home SOC lab');
    expect(capstoneOption('soc', 'not-a-real-option')).toBeNull();
    expect(capstoneOption('not-a-real-track', 'soc-home-siem')).toBeNull();
  });

  it('walks a student all the way to submitting a link', () => {
    expect(GITHUB_WALKTHROUGH.length).toBeGreaterThan(0);
    expect(GITHUB_WALKTHROUGH.at(-1)?.title.toLowerCase()).toContain('link');
  });
});
