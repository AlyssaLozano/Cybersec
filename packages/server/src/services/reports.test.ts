import { describe, expect, it } from 'vitest';

import type { LeadEngagement, ReportDraft, SocRoleId } from '@soc/shared';

import { REPORT_TEMPLATES, scoreReport, templateFor, unengagedReports } from './reports.js';

function draft(role: SocRoleId, sections: Record<string, string>): ReportDraft {
  return { scenarioId: 'ridgeline', role, sections, submittedAt: 1 };
}

describe('templates', () => {
  it('gives every role a different document, not one findings box', () => {
    const headings = REPORT_TEMPLATES.map((t) =>
      t.sections.map((s) => s.heading).join('|'),
    );
    expect(new Set(headings).size).toBe(REPORT_TEMPLATES.length);
    expect(templateFor('threat-intel')!.title).toBe('Assessment');
    expect(templateFor('forensics')!.title).toBe('Evidence record');
  });

  it('ends every template with what you cannot say', () => {
    // The section most often missing in real reports, and the one that lets a
    // reader tell "we checked and found nothing" from "we did not check".
    for (const t of REPORT_TEMPLATES) {
      expect(t.sections[t.sections.length - 1]!.id, `${t.role}`).toBe('limits');
    }
  });

  it('never shows the writer the rubric', () => {
    // The prompt is what they read. If it listed the required ideas it would be
    // a form, not a report.
    for (const t of REPORT_TEMPLATES) {
      for (const s of t.sections) {
        for (const group of s.rubric ?? []) {
          for (const word of group) {
            expect(s.prompt.toLowerCase()).not.toContain(word.toLowerCase() + '"');
          }
        }
      }
    }
  });
});

describe('marking', () => {
  const good = draft('threat-intel', {
    techniques:
      'Observed and mapped: T1110.001 password guessing at the perimeter, and T1098.004 account ' +
      'manipulation for the key written to authorized_keys. The lateral movement I am inferring ' +
      'rather than evidencing.',
    actor:
      'Behaves as financially motivated rather than espionage: they went for backups before data ' +
      'volume, which is ransom preparation. Moderate confidence. I would revise if the staged ' +
      'archive turns out to be selectively chosen rather than bulk.',
    next:
      'Expect an extortion contact or an encryption attempt next. To confirm, watch for further ' +
      'credential use on the backup estate.',
    limits:
      'I cannot confirm whether the archive left the network, and I have not checked the other ' +
      'two regions at all.',
  });

  it('reports per concept rather than a mark', () => {
    const score = scoreReport(good)!;
    const actor = score.sections.find((s) => s.sectionId === 'actor')!;
    expect(actor.concepts.every((c) => c.hit)).toBe(true);
    expect(actor.withinBounds).toBe(true);
    expect(score.omitted).toEqual([]);
  });

  it('names an omitted section rather than silently zeroing it', () => {
    const score = scoreReport(draft('threat-intel', { techniques: good.sections.techniques! }))!;
    expect(score.omitted).toContain('What you cannot say');
    const limits = score.sections.find((s) => s.sectionId === 'limits')!;
    expect(limits.notes.join(' ')).toMatch(/unwritten section is a decision/i);
  });

  it('rejects a section too short to assess', () => {
    const score = scoreReport(draft('threat-intel', { ...good.sections, limits: 'None.' }))!;
    const limits = score.sections.find((s) => s.sectionId === 'limits')!;
    expect(limits.withinBounds).toBe(false);
    expect(limits.notes.join(' ')).toMatch(/too short/i);
  });

  it('rejects an essay, because compression is the skill', () => {
    const score = scoreReport(
      draft('threat-intel', { ...good.sections, next: 'word '.repeat(400) }),
    )!;
    const next = score.sections.find((s) => s.sectionId === 'next')!;
    expect(next.withinBounds).toBe(false);
    expect(next.notes.join(' ')).toMatch(/over length/i);
  });

  it('catches a report that states findings and never states its limits', () => {
    const score = scoreReport(
      draft('network-analyst', {
        movement: 'Outbound from the web host to an address that is not in the baseline at all.',
        volume: 'A large transfer left the database host to the same external address.',
        limits: 'The transfer went out over an encrypted channel to an external address.',
      }),
    )!;
    const limits = score.sections.find((s) => s.sectionId === 'limits')!;
    // It is prose in the right box that does not do the section's job.
    expect(limits.concepts.some((c) => !c.hit)).toBe(true);
  });
});

describe('the lead has to engage', () => {
  const engagements: LeadEngagement[] = [
    { role: 'threat-intel', response: 'questioned', note: 'What would change your confidence?', at: 1 },
  ];

  it('says whether anybody read it', () => {
    expect(scoreReport(draft('threat-intel', {}), engagements)!.leadEngaged).toBe(true);
    expect(scoreReport(draft('forensics', {}), engagements)!.leadEngaged).toBe(false);
  });

  it('names the reports the lead never dealt with', () => {
    const submitted: SocRoleId[] = ['threat-intel', 'forensics', 'network-analyst'];
    expect(unengagedReports(submitted, engagements)).toEqual(['forensics', 'network-analyst']);
  });

  it('treats accepting everything as engagement, which the lead debrief can judge', () => {
    // Deliberately not scored here. "Accepted eleven reports without a question"
    // is a fact about the lead, and it belongs in their debrief rather than in
    // an analyst's mark.
    const all: LeadEngagement[] = ['threat-intel', 'forensics'].map((role) => ({
      role: role as SocRoleId,
      response: 'accepted' as const,
      note: '',
      at: 1,
    }));
    expect(unengagedReports(['threat-intel', 'forensics'], all)).toEqual([]);
  });
});
