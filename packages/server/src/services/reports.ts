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
    audience:
      'The lead now, and detection engineering afterwards. The second half of this report is what ' +
      'somebody turns into a rule, so it has to be usable by a person who never saw the sample.',
    sections: [
      {
        id: 'what',
        heading: 'What it is',
        prompt:
          'File type, how it arrived, how it was packaged, and whether this is something known or ' +
          'something new. A hash on its own is not an identification.',
        minChars: 80,
        maxChars: 700,
        rubric: [['script', 'binary', 'executable', 'command', 'document', 'archive'],
                 ['known', 'new', 'variant', 'family', 'unknown', 'match']],
      },
      {
        id: 'how',
        heading: 'How it works',
        prompt:
          'The execution chain in order: what runs, what it calls, what it writes, what it talks ' +
          'to. Say where the capability actually lives, because a loader that fetches its payload ' +
          'has almost none of its own.',
        minChars: 120,
        maxChars: 1000,
        rubric: [['then', 'first', 'next', 'after', 'chain'],
                 ['download', 'fetch', 'execut', 'write', 'connect', 'spawn']],
      },
      {
        id: 'capability',
        heading: 'What it would have done',
        prompt:
          'Capability, not classification. If it had run to completion, what would you have lost? ' +
          'If you cannot say because the second stage was never retrieved, that is the answer.',
        minChars: 80,
        maxChars: 700,
        rubric: [['persist', 'steal', 'encrypt', 'exfil', 'credential', 'access', 'control'],
                 ['stage', 'payload', 'second', 'unknown', 'cannot']],
      },
      {
        id: 'detection',
        heading: 'How to catch it next time',
        prompt:
          'What detection engineering can actually build on. Prefer behaviour over indicators: a ' +
          'hash changes for free and a spawn pattern does not. Say which of these you expect to ' +
          'survive the attacker changing something.',
        minChars: 100,
        maxChars: 800,
        rubric: [['behaviour', 'behavior', 'pattern', 'parent', 'spawn', 'sequence'],
                 ['hash', 'domain', 'address', 'indicator', 'string', 'signature']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'detection-engineer',
    title: 'Detection proposal',
    audience:
      'The lead, and every operator who will work the queue this rule lands in. They will live ' +
      'with it long after this incident is closed.',
    sections: [
      {
        id: 'gap',
        heading: 'What we missed, and why',
        prompt:
          'Which stage went undetected, and whether that is because no rule covered it or because ' +
          'a rule fired and nobody believed it. Those have completely different fixes.',
        minChars: 100,
        maxChars: 800,
        rubric: [['no rule', 'not cover', 'gap', 'missed', 'undetect', 'fired', 'ignored'],
                 ['stage', 'step', 'movement', 'access', 'persist', 'exfil']],
      },
      {
        id: 'logic',
        heading: 'What the rule would look for',
        prompt:
          'The logic in plain terms: what condition, over what data, in what window. Somebody ' +
          'should be able to argue with it without reading a query language.',
        minChars: 100,
        maxChars: 900,
        rubric: [['when', 'if', 'condition', 'threshold', 'matches'],
                 ['window', 'minute', 'hour', 'within', 'count', 'repeat']],
      },
      {
        id: 'cost',
        heading: 'What it will cost the queue',
        prompt:
          'How often would this have fired over the last thirty days, and how many of those would ' +
          'have been nothing? A rule that catches this attack and fires four hundred times a day ' +
          'has made the queue worse. If you have not backtested it, say so.',
        minChars: 100,
        maxChars: 800,
        rubric: [['fired', 'would have', 'backtest', 'replay', 'historical', 'thirty'],
                 ['false positive', 'noise', 'benign', 'nothing', 'legitimate']],
      },
      {
        id: 'evasion',
        heading: 'How an attacker gets around it',
        prompt:
          'Assume they read your rule. What is the cheapest change that defeats it, and is your ' +
          'detection anchored to something they would have to give up?',
        minChars: 80,
        maxChars: 700,
        rubric: [['change', 'avoid', 'evade', 'bypass', 'defeat', 'around'],
                 ['cheap', 'easy', 'trivial', 'hard', 'expensive', 'cost']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'ir-lead',
    title: 'Incident executive summary',
    audience:
      'The executive team, legal, and possibly a regulator. People who were not in the room, will ' +
      'not read past the first section, and may have to answer for this in public.',
    sections: [
      {
        id: 'status',
        heading: 'Status, as of now',
        prompt:
          'Contained, ongoing, or resolved, and at what time. This is the first thing they will ' +
          'ask and the last thing they will remember. If you do not know whether it is over, say ' +
          'that: "ongoing" is an answer.',
        minChars: 40,
        maxChars: 300,
        // The status words are named in the prompt, because it is a controlled
        // vocabulary rather than an answer. So the rubric grades the part that
        // is NOT given away: whether they pinned it to a time. "Contained" with
        // no "as of" is the sentence that gets quoted back six months later.
        rubric: [['as of', 'at ', 'since', ':', 'time']],
      },
      {
        id: 'what-happened',
        heading: 'What happened',
        prompt:
          'Plain language, no jargon, three or four sentences. Somebody who has never heard of ' +
          'authorized_keys has to be able to repeat this accurately to a journalist.',
        minChars: 120,
        maxChars: 800,
        rubric: [
          ['account', 'credential', 'password', 'login'],
          ['access', 'entered', 'got in', 'compromis'],
        ],
      },
      {
        id: 'timeline',
        heading: 'How long, and how we found out',
        prompt:
          'First known activity, when it was detected, when it was contained. Dwell time is the ' +
          'number that gets quoted, so give it rather than letting somebody compute it wrongly. ' +
          'Say whether we found it or somebody told us.',
        minChars: 80,
        maxChars: 600,
        rubric: [
          ['first', 'earliest', 'began', 'started'],
          ['detect', 'noticed', 'found', 'alert'],
          ['contain', 'stopped', 'isolat'],
        ],
      },
      {
        id: 'impact',
        heading: 'What is affected, in their terms',
        prompt:
          '"Patient records", not "the database". Systems, data, people, and whether service was ' +
          'disrupted. Give numbers only where you can defend them.',
        minChars: 100,
        maxChars: 800,
        // Grades business language and scope. Deliberately does NOT require
        // "database" or "server": the section asks them to translate out of
        // system language, so rewarding system language contradicted it.
        rubric: [
          ['patient', 'record', 'customer', 'client', 'people'],
          ['disrupt', 'available', 'outage', 'access', 'affected', 'exposed'],
        ],
      },
      {
        id: 'obligations',
        heading: 'Regulatory and legal exposure',
        prompt:
          'Whether a notification clock has started, what it is, and who owns it. For regulated ' +
          'data this is the section that decides what the next seventy-two hours look like. If ' +
          'legal owns the decision rather than you, say so.',
        minChars: 80,
        maxChars: 700,
        rubric: [
          ['notif', 'report', 'disclos', 'regulat', 'legal', 'counsel'],
          ['clock', 'deadline', 'hours', 'days', 'obligation', 'requirement'],
        ],
      },
      {
        id: 'doing',
        heading: 'What we are doing, and who owns it',
        prompt:
          'Actions underway with a name against each. Separate what is already done from what is ' +
          'planned, because those get read as the same thing otherwise.',
        minChars: 100,
        maxChars: 800,
        rubric: [
          ['done', 'complete', 'already', 'has been'],
          ['next', 'will', 'plan', 'underway', 'ongoing'],
        ],
      },
      {
        id: 'asks',
        heading: 'What we need from you',
        prompt:
          'Decisions only they can make: an outage window, external help, a public statement, ' +
          'money. If you need nothing, say so plainly rather than leaving it blank.',
        minChars: 40,
        maxChars: 500,
        rubric: [['need', 'require', 'authoris', 'authoriz', 'decision', 'approve', 'nothing']],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'fusion-analyst',
    title: 'Fusion assessment',
    audience:
      'The lead, and only the lead. This is the one document assembled from all the others, so it ' +
      'is the only place the whole picture exists.',
    sections: [
      {
        id: 'picture',
        heading: 'What the floor collectively knows',
        prompt:
          'One account of the incident assembled from every seat, not a list of who said what. If ' +
          'two findings only make sense together, say so: that connection is the entire reason ' +
          'this seat exists.',
        minChars: 150,
        maxChars: 1200,
        rubric: [
          ['together', 'combined', 'connect', 'same', 'both', 'link'],
          ['network', 'log', 'forensic', 'cloud', 'intel', 'triage'],
        ],
      },
      {
        id: 'conflicts',
        heading: 'Where seats disagree, and which reading you take',
        prompt:
          'Two people looked at the same thing and concluded differently. Name it, take a side, ' +
          'and say why. Reporting the disagreement without resolving it hands the lead your job.',
        minChars: 80,
        maxChars: 800,
        rubric: [
          ['disagree', 'conflict', 'differ', 'contradict', 'versus', 'both read'],
          ['because', 'prefer', 'take', 'weight', 'stronger', 'evidence'],
        ],
      },
      {
        id: 'gaps',
        heading: 'What nobody looked at',
        prompt:
          'The questions no seat owns. This is the gap only somebody reading every report can see, ' +
          'and it is usually more useful than anything in them.',
        minChars: 80,
        maxChars: 700,
        rubric: [
          ['nobody', 'no one', 'not covered', 'unassigned', 'gap', 'missing'],
          ['should', 'need', 'worth', 'recommend', 'suggest'],
        ],
      },
      LIMITS_SECTION,
    ],
  },
  {
    role: 'ai-security',
    title: 'Detection integrity review',
    audience: 'The lead, and detection engineering. Answers whether the tooling can still be trusted.',
    sections: [
      {
        id: 'gaps',
        heading: 'What the tooling missed, and whether that is a gap or a blind spot',
        prompt:
          'A gap is a rule that should have fired and did not. A blind spot is data nobody is ' +
          'collecting. They have completely different fixes and get confused constantly.',
        minChars: 100,
        maxChars: 800,
        rubric: [
          ['gap', 'blind', 'not collect', 'no rule', 'no visibility', 'coverage'],
          ['fired', 'missed', 'detect', 'alert', 'raise'],
        ],
      },
      {
        id: 'evasion',
        heading: 'Whether anybody tried to evade detection',
        prompt:
          'Avoiding detection and evading it are different. Encoding a command to defeat a string ' +
          'match is evasion; simply doing something nothing watches is not. Say which you saw.',
        minChars: 80,
        maxChars: 700,
        rubric: [
          ['encod', 'obfusc', 'evade', 'evasion', 'bypass', 'defeat'],
          ['no evidence', 'did not', 'simply', 'unwatched', 'avoided'],
        ],
      },
      {
        id: 'trust',
        heading: 'Whether the monitoring can still be trusted',
        prompt:
          'The attacker had access. Could they have altered what the tooling sees, and how would ' +
          'you know? If you cannot rule it out, say so plainly.',
        minChars: 80,
        maxChars: 700,
        rubric: [
          ['trust', 'reliab', 'integrity', 'altered', 'tamper', 'modif'],
          ['cannot', 'unable', 'rule out', 'confirm', 'verif'],
        ],
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
