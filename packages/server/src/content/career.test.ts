/**
 * Tests for career routing: tracks, foundations, certifications, and the
 * assessment that steers somebody toward one.
 *
 * The most important test in this file is the one asserting that a risk or
 * privacy track requires no Linux. That is the entire reason foundations became
 * per-track, and a future edit that quietly reintroduces a universal Linux
 * requirement should fail loudly here.
 */

import { describe, expect, it } from 'vitest';

import type { AssessmentAnswer } from '@soc/shared';

import {
  ASSESSMENT_QUESTIONS,
  profileFromAnswers,
  recommend,
  remainingQuestions,
  scoreTracks,
  sectorGuidanceKey,
  shouldAsk,
} from './assessment.js';
import { CERTIFICATIONS, getCertification } from './certifications.js';
import { foundationsWithDemand, trackFoundations, trackPackages, trackReadiness } from './curriculum.js';
import { FOUNDATIONS, getFoundation } from './foundations.js';
import { getToolMapping, TOOL_MAPPINGS } from './tools.js';
import { getTrack, TRACKS } from './tracks.js';

const trackIds = new Set(TRACKS.map((track) => track.id));

describe('catalogue integrity', () => {
  it('gives every track, foundation, certification, and tool a unique id', () => {
    for (const [label, ids] of [
      ['tracks', TRACKS.map((t) => t.id)],
      ['foundations', FOUNDATIONS.map((f) => f.id)],
      ['certifications', CERTIFICATIONS.map((c) => c.id)],
      ['tools', TOOL_MAPPINGS.map((t) => t.id)],
    ] as const) {
      expect(new Set(ids).size, `${label} has duplicate ids`).toBe(ids.length);
    }
  });

  it('resolves every foundation a track requires', () => {
    const broken: string[] = [];
    for (const track of TRACKS) {
      for (const id of track.foundations) {
        if (!getFoundation(id)) broken.push(`${track.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('resolves every certification a track names', () => {
    const broken: string[] = [];
    for (const track of TRACKS) {
      for (const id of track.certifications) {
        if (!getCertification(id)) broken.push(`${track.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('resolves every tool mapping a foundation names', () => {
    const broken: string[] = [];
    for (const foundation of FOUNDATIONS) {
      for (const id of foundation.tools ?? []) {
        if (!getToolMapping(id)) broken.push(`${foundation.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('resolves every certification prerequisite', () => {
    const broken: string[] = [];
    for (const cert of CERTIFICATIONS) {
      for (const id of cert.prerequisites ?? []) {
        if (!getCertification(id)) broken.push(`${cert.id} -> ${id}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('gives every track at least one foundation and one certification', () => {
    for (const track of TRACKS) {
      expect(track.foundations.length, `${track.id} has no foundations`).toBeGreaterThan(0);
      expect(track.certifications.length, `${track.id} names no certifications`).toBeGreaterThan(0);
    }
  });

  it('marks a track available only when it has a playable foundation', () => {
    for (const track of TRACKS.filter((t) => t.status === 'available')) {
      expect(trackReadiness(track.id).foundationsPlayable, `${track.id} claims to be available`).toBeGreaterThan(0);
    }
  });
});

describe('foundations are per-track, not universal', () => {
  it('does not require Linux for risk, compliance, privacy, or awareness', () => {
    // This is the point of the whole model: a future GRC analyst should never be
    // marched through a terminal to prove they belong in security.
    for (const trackId of ['risk-governance', 'compliance-audit', 'privacy', 'awareness']) {
      const foundations = trackFoundations(trackId).map((f) => f.id);
      expect(foundations, `${trackId} should not require Linux`).not.toContain('linux');
    }
  });

  it('does require Linux for the hands-on defensive and offensive tracks', () => {
    for (const trackId of ['soc', 'incident-response', 'pentest', 'security-engineering']) {
      expect(trackFoundations(trackId).map((f) => f.id)).toContain('linux');
    }
  });

  it('gives no track every foundation', () => {
    // If one track needed all of them, the pool would not be doing any work.
    for (const track of TRACKS) {
      expect(track.foundations.length).toBeLessThan(FOUNDATIONS.length);
    }
  });

  it('reports which tracks demand each foundation', () => {
    const demand = new Map(foundationsWithDemand().map((f) => [f.id, f.requiredBy]));
    expect(demand.get('linux')).toContain('soc');
    expect(demand.get('linux')).not.toContain('privacy');
    expect(demand.get('risk-fundamentals')).toContain('risk-governance');
  });

  it('resolves a track to its playable packages, foundations first', () => {
    // SOC's first two foundations are the two packages that exist today.
    expect(trackPackages('soc')).toEqual(['1', '2']);
    // A track with no built foundations resolves to nothing rather than throwing.
    expect(trackPackages('privacy')).toEqual([]);
  });
});

describe('assessment structure', () => {
  it('only ever weights track ids that exist', () => {
    const unknown: string[] = [];
    for (const question of ASSESSMENT_QUESTIONS) {
      for (const option of question.options) {
        for (const trackId of Object.keys(option.weights ?? {})) {
          if (!trackIds.has(trackId)) unknown.push(`${question.id}/${option.id} -> ${trackId}`);
        }
      }
    }
    expect(unknown).toEqual([]);
  });

  it('gives every question at least two options and unique option ids', () => {
    for (const question of ASSESSMENT_QUESTIONS) {
      expect(question.options.length, `${question.id}`).toBeGreaterThanOrEqual(2);
      const ids = question.options.map((option) => option.id);
      expect(new Set(ids).size, `${question.id} has duplicate option ids`).toBe(ids.length);
    }
  });

  it('hides the government follow-ups unless government was chosen', () => {
    const govQuestion = ASSESSMENT_QUESTIONS.find((q) => q.id === 'q-gov-level')!;
    expect(shouldAsk(govQuestion, {})).toBe(false);
    expect(shouldAsk(govQuestion, { sector: 'private' })).toBe(false);
    expect(shouldAsk(govQuestion, { sector: 'government' })).toBe(true);
  });

  it('drops answered and irrelevant questions from what remains', () => {
    const remaining = remainingQuestions({ sector: 'private' }, new Set(['q-rhythm']));
    const ids = remaining.map((question) => question.id);
    expect(ids).not.toContain('q-rhythm');
    expect(ids).not.toContain('q-gov-level');
    expect(ids).not.toContain('q-clearance');
    expect(ids).toContain('q-org-size');
  });
});

/** Build an answer set from question/option pairs. */
function answers(...pairs: Array<[string, string]>): AssessmentAnswer[] {
  return pairs.map(([questionId, optionId]) => ({ questionId, optionIds: [optionId] }));
}

describe('assessment scoring routes people sensibly', () => {
  it('sends a hands-on, shift-tolerant, reactive person toward SOC or IR', () => {
    const result = recommend(
      answers(
        ['q-rhythm', 'reactive'],
        ['q-instinct', 'watch'],
        ['q-technical-depth', 'love'],
        ['q-shift', 'yes'],
        ['q-background', 'it_support'],
      ),
    );
    expect(['soc', 'incident-response']).toContain(result.topTrackId);
  });

  it('sends someone who dislikes terminals and comes from audit toward risk work', () => {
    const result = recommend(
      answers(
        ['q-rhythm', 'organising'],
        ['q-instinct', 'govern'],
        ['q-technical-depth', 'prefer-not'],
        ['q-writing', 'strength'],
        ['q-background', 'compliance_legal'],
      ),
    );
    expect(['risk-governance', 'compliance-audit', 'privacy']).toContain(result.topTrackId);
  });

  it('never recommends a terminal-heavy track to someone who ruled terminals out', () => {
    const result = recommend(
      answers(['q-technical-depth', 'prefer-not'], ['q-shift', 'no'], ['q-writing', 'strength']),
    );
    const hostile = ['pentest', 'incident-response', 'security-engineering'];
    expect(hostile).not.toContain(result.topTrackId);
  });

  it('respects a hard "no" on shift work', () => {
    const scores = new Map(
      scoreTracks(answers(['q-shift', 'no'])).map((entry) => [entry.trackId, entry.score]),
    );
    expect(scores.get('incident-response')!).toBeLessThan(0);
    expect(scores.get('risk-governance')!).toBeGreaterThan(0);
  });

  it('sends a developer toward application security', () => {
    const result = recommend(
      answers(['q-background', 'software'], ['q-instinct', 'break'], ['q-technical-depth', 'love']),
    );
    expect(['appsec', 'pentest']).toContain(result.topTrackId);
  });

  it('sends a teacher toward awareness work', () => {
    const result = recommend(
      answers(['q-background', 'education'], ['q-people', 'lots'], ['q-technical-depth', 'prefer-not']),
    );
    expect(result.topTrackId).toBe('awareness');
  });

  it('surfaces industrial security to someone from a trades background', () => {
    const result = recommend(answers(['q-background', 'trades_other'], ['q-physical', 'yes']));
    expect(result.topTrackId).toBe('ot-ics');
  });

  it('is deterministic', () => {
    const set = answers(['q-rhythm', 'reactive'], ['q-background', 'it_support']);
    expect(recommend(set)).toEqual(recommend(set));
  });

  it('always returns something, even with no answers', () => {
    const result = recommend([]);
    expect(trackIds.has(result.topTrackId)).toBe(true);
  });

  it('explains itself using the answers that actually moved the result', () => {
    const result = recommend(
      answers(['q-rhythm', 'organising'], ['q-technical-depth', 'prefer-not'], ['q-background', 'compliance_legal']),
    );
    expect(result.rationale.length).toBeGreaterThan(0);
    expect(result.rationale.some((line) => line.startsWith('You said:'))).toBe(true);
  });

  it('offers alternatives without padding out weak ones', () => {
    const result = recommend(answers(['q-background', 'trades_other'], ['q-physical', 'yes']));
    expect(result.alternativeTrackIds).not.toContain(result.topTrackId);
    expect(result.alternativeTrackIds.length).toBeLessThanOrEqual(3);
  });
});

describe('profile and sector guidance', () => {
  it('builds a profile from the sector answers', () => {
    const profile = profileFromAnswers(
      answers(['q-sector', 'government'], ['q-gov-level', 'federal'], ['q-clearance', 'eligible']),
    );
    expect(profile).toMatchObject({ sector: 'government', govLevel: 'federal', clearance: 'eligible' });
  });

  it('selects the right certification guidance for each world', () => {
    expect(sectorGuidanceKey({ sector: 'government', govLevel: 'federal' })).toBe('federal');
    expect(sectorGuidanceKey({ sector: 'government', govLevel: 'state_local' })).toBe('state_local');
    expect(sectorGuidanceKey({ sector: 'private', orgSize: 'large' })).toBe('private_large');
    expect(sectorGuidanceKey({ sector: 'private', orgSize: 'small' })).toBe('private_small');
    expect(sectorGuidanceKey({})).toBeNull();
  });

  it('shows a federal candidate a track whose notes cover mandated certification', () => {
    const soc = getTrack('soc')!;
    const federalNote = soc.sectorNotes?.find(
      (note) => note.when.sector === 'government' && note.when.govLevel === 'federal',
    );
    expect(federalNote?.note).toMatch(/Security\+|clearance/i);
  });
});

describe('certifications are described honestly', () => {
  it('flags the ones that are genuinely mandated, with a reason', () => {
    const mandated = CERTIFICATIONS.filter((cert) => cert.mandatedSomewhere);
    expect(mandated.length).toBeGreaterThan(0);
    for (const cert of mandated) {
      expect(cert.mandateNote, `${cert.id} claims a mandate with no explanation`).toBeTruthy();
    }
  });

  it('gives every certification a cost and a realistic study estimate', () => {
    for (const cert of CERTIFICATIONS) {
      expect(cert.approxCostUsd, cert.id).toBeGreaterThan(0);
      expect(cert.typicalStudyWeeks, cert.id).toBeGreaterThan(0);
    }
  });

  it('starts every track with an entry-level or core certification, never advanced', () => {
    for (const track of TRACKS) {
      const first = getCertification(track.certifications[0]!)!;
      expect(first.stage, `${track.id} opens with ${first.id}`).not.toBe('advanced');
    }
  });
});

describe('tool mappings set expectations correctly', () => {
  it('names industry tools and states the real differences', () => {
    for (const mapping of TOOL_MAPPINGS) {
      expect(mapping.industryTools.length, mapping.id).toBeGreaterThan(0);
      expect(mapping.differences.length, mapping.id).toBeGreaterThan(40);
      expect(mapping.skill.length, mapping.id).toBeGreaterThan(20);
    }
  });

  it('teaches Wireshark as itself rather than as a substitute', () => {
    const packet = getToolMapping('packet-analysis')!;
    expect(packet.teaches).toMatch(/Wireshark/);
    expect(packet.industryTools.join(' ')).toMatch(/same tool/i);
  });
});
