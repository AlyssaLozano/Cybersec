/**
 * Report templates, and marking what gets written into them.
 *
 * The rubric never reaches the writer. It is an answer key in exactly the way
 * exercise `checks` are, and a section that told you which four ideas it wanted
 * would be a fill-in-the-blanks form rather than a report.
 *
 * What the writer gets back afterwards is per concept rather than a mark, for
 * the same reason the exercise grader does: "you did not mention what you could
 * not prove" is actionable and "62%" is not.
 */

import type {
  LeadEngagement,
  ReportDraft,
  ReportScore,
  ReportTemplate,
  SectionScore,
  SocRoleId,
} from '@soc/shared';

/**
 * The section every template ends with.
 *
 * Shared because it is the one part of the job that does not vary, and it is
 * the part most often left out. A report that states only findings reads as
 * complete, and the reader cannot tell "we checked and it did not happen" from
 * "we did not check". Regulators, lawyers and the next shift all care about
 * that difference more than they care about what you did find.
 */
const LIMITS_SECTION = {
  id: 'limits',
  heading: 'What you cannot say',
  prompt:
    'What did you not establish, and is that because you checked and found nothing or because you ' +
    'did not get to it? Say which.',
  minChars: 60,
  maxChars: 600,
  rubric: [
    ['not', 'cannot', 'unable', 'unknown', 'unconfirmed', 'no evidence'],
    ['check', 'look', 'establish', 'confirm', 'prove', 'verif'],
  ],
};

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    role: 'soc-operator',
    title: 'Shift handover',
    audience: 'The next operator on the queue, and the lead if anything was escalated.',
    sections: [
      {
        id: 'disposition',
        heading: 'What you closed and why',
        prompt:
          'The alerts you dismissed or tuned, and the reason. A handover that lists only what you ' +
          'escalated leaves the next person re-reading everything you already decided.',
        minChars: 80,
        maxChars: 700,
        rubric: [['dismiss', 'clos', 'tune', 'noise'], ['because', 'history', 'fired', 'rule', 'baseline']],
      },
      {
        id: 'escalated',
        heading: 'What you raised, and what you want done with it',
        prompt:
          'Be specific about what you want the next person to find. "Investigate this" is not a task.',
        minChars: 60,
        maxChars: 600,
        rubric: [['escalat', 'rais', 'hand'], ['check', 'find', 'confirm', 'look']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'log-analyst',
    title: 'Timeline',
    audience: 'Everyone. This becomes what the rest of the floor argues from.',
    sections: [
      {
        id: 'sequence',
        heading: 'What happened, in order',
        prompt:
          'Each step tied to something you can point at. Distinguish what the logs show from what ' +
          'you infer between the lines.',
        minChars: 120,
        maxChars: 1200,
        rubric: [['first', 'then', 'after', 'followed', 'next'], ['log', 'line', 'entry', 'record', 'timestamp']],
      },
      {
        id: 'earliest',
        heading: 'The earliest event you can stand behind',
        prompt: 'Not the earliest you suspect. The earliest you could defend to somebody hostile.',
        minChars: 50,
        maxChars: 400,
        rubric: [['earliest', 'first', 'start', 'begin']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'network-analyst',
    title: 'Traffic assessment',
    audience: 'The lead, and whoever writes the breach notification if one is needed.',
    sections: [
      {
        id: 'movement',
        heading: 'What talked to what',
        prompt: 'Paths, direction, and whether each is in the baseline.',
        minChars: 80,
        maxChars: 800,
        rubric: [['outbound', 'inbound', 'egress', 'direction'], ['baseline', 'normal', 'never', 'first time', 'unusual']],
      },
      {
        id: 'volume',
        heading: 'What left, if anything',
        prompt:
          'Volume and destination if you can prove it. If you cannot prove it either way, say ' +
          'neither: that is a finding, not a gap.',
        minChars: 60,
        maxChars: 600,
        rubric: [['prove', 'cannot', 'unable', 'confirm', 'evidence'], ['transfer', 'left', 'outbound', 'exfil', 'gb', 'mb']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'forensics',
    title: 'Evidence record',
    audience: 'The lead now, and possibly counsel or law enforcement later.',
    sections: [
      {
        id: 'collected',
        heading: 'What you collected, and in what order',
        prompt: 'Order matters as much as content. Say why you took things in the order you did.',
        minChars: 80,
        maxChars: 800,
        rubric: [['memory', 'ram', 'volatil'], ['disk', 'image', 'file', 'artefact', 'artifact']],
      },
      {
        id: 'custody',
        heading: 'Custody',
        prompt: 'Who held it, when, and how you know it has not changed.',
        minChars: 50,
        maxChars: 500,
        rubric: [['hash', 'checksum', 'integrity', 'sealed', 'custody']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'threat-intel',
    title: 'Assessment',
    audience: 'The lead. This shapes what the floor expects to happen next.',
    sections: [
      {
        id: 'techniques',
        heading: 'Techniques observed',
        prompt: 'Map what you can evidence to ATT&CK. Separate what you mapped from what you inferred.',
        minChars: 80,
        maxChars: 800,
        rubric: [['t1', 'technique', 'att&ck', 'attack'], ['observ', 'evidence', 'saw', 'shown']],
      },
      {
        id: 'actor',
        heading: 'Actor class, motive, and your confidence',
        prompt:
          'What kind of adversary does this behave like, what do they appear to want, and how sure ' +
          'are you? State what would change your mind.',
        minChars: 100,
        maxChars: 900,
        rubric: [
          ['financial', 'espionage', 'opportunis', 'ransom', 'criminal', 'state'],
          ['confiden', 'likely', 'assess', 'probab', 'uncertain'],
        ],
      },
      {
        id: 'next',
        heading: 'Most likely next move',
        prompt: 'And what you would need to see to confirm it.',
        minChars: 60,
        maxChars: 600,
        rubric: [['next', 'expect', 'likely', 'follow'], ['confirm', 'watch', 'look for', 'indicat']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'cloud-security',
    title: 'Cloud findings',
    audience: 'The lead, and whoever owns the cloud account.',
    sections: [
      {
        id: 'principal',
        heading: 'Which principal, doing what, from where',
        prompt: 'And whether it had ever done that before.',
        minChars: 80,
        maxChars: 700,
        rubric: [['principal', 'account', 'role', 'credential', 'identity'], ['first', 'never', 'previous', 'baseline', 'history']],
      },
      {
        id: 'remediation',
        heading: 'What needs doing, in what order',
        prompt: 'Distinguish what stops it now from what stops it recurring.',
        minChars: 60,
        maxChars: 600,
        rubric: [['revoke', 'rotate', 'disable', 'restrict'], ['then', 'after', 'next', 'longer', 'recur']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'malware-analyst',
    title: 'Sample analysis',
    audience: 'The lead, and detection engineering afterwards.',
    sections: [
      {
        id: 'behaviour',
        heading: 'What it does',
        prompt: 'Capability, not just classification. What would it have done if it had run to completion?',
        minChars: 80,
        maxChars: 800,
        rubric: [['download', 'execut', 'fetch', 'connect', 'persist'], ['stage', 'payload', 'second', 'loader']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'ir-lead',
    title: 'Executive brief',
    audience: 'People who will not read past the first paragraph and may have to answer for this.',
    sections: [
      {
        id: 'bottom-line',
        heading: 'Bottom line',
        prompt:
          'What happened, what it means, and what you are doing. Three sentences. Everything else ' +
          'in this report supports these.',
        minChars: 80,
        maxChars: 500,
        rubric: [['incident', 'intrusion', 'compromis', 'breach'], ['contain', 'isolat', 'declar', 'respond']],
      },
      {
        id: 'impact',
        heading: 'What is affected, and what that means for the business',
        prompt: 'In their terms, not yours. "Patient records" rather than "the database".',
        minChars: 80,
        maxChars: 700,
        rubric: [['patient', 'record', 'data', 'service', 'portal'], ['risk', 'impact', 'affect', 'exposure', 'obligation']],
      },
      {
        id: 'asks',
        heading: 'What you need from them',
        prompt: 'Decisions only they can make. If you need nothing, say so.',
        minChars: 40,
        maxChars: 500,
        rubric: [['need', 'require', 'authoris', 'authoriz', 'decision', 'approve', 'nothing']],
      },
      LIMITS_SECTION,
    ],
  },
];

const BY_ROLE = new Map(REPORT_TEMPLATES.map((t) => [t.role, t]));

export function templateFor(role: SocRoleId): ReportTemplate | null {
  return BY_ROLE.get(role) ?? null;
}

/**
 * Mark a report.
 *
 * Per concept and per section, never a single number. A writer who is told 62%
 * learns nothing; one who is told the limits section never says whether they
 * checked can fix it in a sentence.
 */
export function scoreReport(draft: ReportDraft, engagements: LeadEngagement[] = []): ReportScore | null {
  const template = BY_ROLE.get(draft.role);
  if (!template) return null;

  const omitted: string[] = [];
  const sections: SectionScore[] = template.sections.map((section) => {
    const text = (draft.sections[section.id] ?? '').trim();
    const notes: string[] = [];

    if (text.length === 0) {
      omitted.push(section.heading);
      notes.push('Left empty. An unwritten section is a decision, and this one reads as an omission.');
    } else if (text.length < section.minChars) {
      notes.push(
        `Too short to assess at ${text.length} characters. This section needs at least ${section.minChars}.`,
      );
    } else if (text.length > section.maxChars) {
      notes.push(
        `Over length at ${text.length}. Compression is the skill: the reader stops before the end.`,
      );
    }

    const lower = text.toLowerCase();
    const concepts = (section.rubric ?? []).map((accepted) => ({
      accepted,
      hit: accepted.some((word) => lower.includes(word)),
    }));
    const missed = concepts.filter((c) => !c.hit).length;
    if (text.length > 0 && missed > 0) {
      notes.push(`${missed} of ${concepts.length} required ideas not covered.`);
    }

    return {
      sectionId: section.id,
      heading: section.heading,
      withinBounds: text.length >= section.minChars && text.length <= section.maxChars,
      concepts,
      notes,
    };
  });

  return {
    role: draft.role,
    sections,
    omitted,
    // Reported, not scored. Whether somebody read your report is not a fact
    // about your writing, but a floor where reports vanish teaches people that
    // writing them is ceremony, so it is surfaced.
    leadEngaged: engagements.some((e) => e.role === draft.role),
  };
}

/**
 * Whether the lead actually dealt with the floor's reports.
 *
 * Not scored against individual analysts. It is a fact about the lead, and it
 * is the one their debrief needs: a lead who accepted eleven reports without a
 * single question did not read them.
 */
export function unengagedReports(
  submitted: SocRoleId[],
  engagements: LeadEngagement[],
): SocRoleId[] {
  const seen = new Set(engagements.map((e) => e.role));
  return submitted.filter((role) => !seen.has(role));
}
