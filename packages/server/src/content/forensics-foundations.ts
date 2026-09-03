/**
 * Forensics Foundations: evidence that holds up.
 *
 * Grounded in the Forensics Analyst role in roles.ts: recovers and preserves
 * evidence to a standard that survives a courtroom, where order of operations
 * (memory before disk, hash before touch) matters because evidence collected
 * wrongly is evidence that cannot be used at all.
 *
 * Standalone and NOT registered in content/index.ts, to avoid colliding with a
 * second session building pathways into the same PACKAGES array. Register in one
 * pass: import it, add to PACKAGES with a real `order`, then typecheck and test.
 * House style: no apostrophes in the copy, to stay clear of the smart-quote
 * hazard that has broken answer keys before.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

const EVIDENCE_TEACH = {
  concept:
    'Forensics recovers what was done and preserves it to a standard that survives challenge. The ' +
    'work is slow and procedural because the value of evidence is fragile: evidence collected the ' +
    'wrong way is not weaker evidence, it is unusable evidence. The discipline is not about being ' +
    'clever, it is about doing every step in the right order and being able to prove you did.',
} as const;

const VOLATILITY_TEACH = {
  concept:
    'Data disappears at different speeds, and you capture it fastest-fading first. Memory, and the ' +
    'live state of a running system, are gone the moment it is powered off, so they come before the ' +
    'disk, which persists. This is the order of volatility, and getting it backwards means reaching ' +
    'for the durable evidence while the fragile evidence you needed most evaporates.',
} as const;

const INTEGRITY_TEACH = {
  concept:
    'Two rules keep evidence trustworthy. Hash before you touch: take a cryptographic hash of an ' +
    'artefact before and after handling, so anyone can prove it did not change in your hands. And ' +
    'chain of custody: an unbroken record of who held the evidence, when, and what they did, with ' +
    'no gaps. A single unexplained gap, or a hash that does not match, can throw out an entire ' +
    'case, however true the underlying finding is.',
} as const;

const CUSTODY_TEACH = {
  concept:
    'Chain of custody is not a form, it is an argument: everyone who has ever handled a piece of ' +
    'evidence, when they had it, and what they did with it, can be named, in order, with no ' +
    'unexplained interval. That is what an unbroken chain looks like. TRANSFER means the moment ' +
    'evidence moves from one person control to another, and it is the event the record exists to ' +
    'capture: hand a drive to a colleague without logging it and, for legal purposes, nobody can say ' +
    'where it was for that stretch. MINIMUM HANDLING is the discipline of keeping the list of people ' +
    'who ever touch the evidence as short as the case allows, because every additional name is ' +
    'another person whose actions have to be accounted for and, if necessary, defended under ' +
    'questioning. SEALING, tamper-evident bags and numbered tape, exists so a break in the seal is ' +
    'visible without anyone needing to trust anyone word about it. And the log itself needs to ' +
    'answer four questions for every entry: who, when, what was done, and where the item went next. ' +
    'Leave any of the four blank and the record does not document a transfer, it documents that ' +
    'something happened.',
} as const;

const HASH_LIMITS_TEACH = {
  concept:
    'A hash is a fixed-length fingerprint of a file exact bytes: change one bit anywhere in the ' +
    'input and the output is completely different, which is what makes a match meaningful. Forensic ' +
    'tools have converged on SHA-256 as the default primary hash, because MD5 and SHA-1 both have ' +
    'known COLLISION weaknesses, meaning two different inputs can, with enough deliberate effort, be ' +
    'made to produce the same hash. That has never been shown to matter in an ordinary case, where ' +
    'nobody is trying to forge a matching file, but "has never happened here" is not a standard a ' +
    'methodology can rest on, so tools default to the stronger algorithm and often compute a second ' +
    'one, commonly MD5 alongside SHA-256, purely so a system or a court built around the older ' +
    'standard still has something it recognises.\n\n' +
    'What a hash proves is narrow and worth stating precisely: identical hashes before and after ' +
    'handling mean the bytes did not change in that stretch. What it does NOT prove is who had the ' +
    'item, whether it was seized lawfully, or whether the thing first hashed was itself the genuine ' +
    'original rather than an already-substituted copy. A hash is a check on integrity from the ' +
    'moment it was first computed onward. It has nothing to say about anything before that moment.',
} as const;

const PREFETCH_TEACH = {
  concept:
    'Windows keeps a small file in the Prefetch folder for many programs the first several times ' +
    'they run, recording which executable ran, how many times, and the last several run timestamps, ' +
    'purely so Windows can load the program faster next time. An examiner reads it for a different ' +
    'reason: a Prefetch entry is evidence a specific program executed on this machine, at roughly a ' +
    'given time, and it survives even after the program own executable has been deleted, because it ' +
    'lives in a completely separate location. It answers one question precisely: did this program ' +
    'run, and roughly when and how often, not what the program did once it was running.',
} as const;

const RUNKEY_TEACH = {
  concept:
    'A handful of registry locations, commonly grouped under the name Run keys, list programs ' +
    'Windows starts automatically at boot or at logon. Legitimate software uses them constantly, an ' +
    'antivirus agent, a cloud sync client, so their presence alone means nothing; what an examiner ' +
    'looks for is an entry pointing somewhere it should not, a script in a temp folder, an ' +
    'executable with a name close to but not quite a real Windows process. Run keys answer a ' +
    'persistence question: what did this attacker, or this software, arrange to survive a reboot and ' +
    'start again unattended? They say nothing about a one-off action that ran once and left no ' +
    'persistence behind.',
} as const;

const TIMESTAMP_TEACH = {
  concept:
    'NTFS keeps four timestamps per file, commonly abbreviated MACB. MODIFIED is when the file ' +
    'content last changed. ACCESSED is when it was last opened or read, though many modern systems ' +
    'update this only loosely, so treat it as approximate. CHANGED, sometimes called Entry Modified, ' +
    'is when the file own metadata, permissions, name, size record, last changed, which is distinct ' +
    'from the content itself changing. And BIRTH, or CREATED, is when the file first appeared on ' +
    'this volume, which is not necessarily when it was first created anywhere: copying a file to a ' +
    'new drive gives it a new birth time there. Read together, and cross-checked against other ' +
    'artefacts, these four numbers are the backbone of most timelines; read in isolation, especially ' +
    'ACCESSED, they are one of the easiest things for an attacker to falsify.',
} as const;

const BROWSER_TEACH = {
  concept:
    'A browser history, downloads, and cache are, in effect, a log of what a machine asked the ' +
    'internet for and what came back. Search terms can show intent or knowledge a person otherwise ' +
    'denies: searching how to clear an event log is a very different fact from having merely visited ' +
    'a news site. Download records tie a specific file to a specific moment it entered the system, ' +
    'often with the source URL still attached. And cached pages and cookies can corroborate exactly ' +
    'when a session happened, even after the live page has changed or vanished. None of it proves ' +
    'who was physically at the keyboard: a compromised account, a shared login, or a scheduled task ' +
    'can generate identical records, so browser artefacts answer "what did this profile request and ' +
    'when", not "who pressed the keys".',
} as const;

const ARTEFACT_ATTRIBUTION_TEACH = {
  concept:
    'Each host artefact in this module answers a narrow, specific question: did a program run ' +
    '(Prefetch), what was arranged to survive a reboot (Run keys), when did a file content or ' +
    'metadata change (NTFS timestamps), or what did a browser profile request (history). None of ' +
    'them, individually or together, places a named human being hands on the keyboard. Attribution ' +
    'to a specific person is a separate, harder problem than establishing what happened on the ' +
    'machine, and conflating the two is one of the most common overreaches in a forensic report.',
} as const;

const MEMORY_ONLY_TEACH = {
  concept:
    'Order of volatility says capture memory before disk. This module is about a sharper version of ' +
    'that idea: some categories of evidence exist ONLY in memory and have no equivalent on disk at ' +
    'all, so if memory is never captured, they are not delayed, they are gone permanently. RUNNING ' +
    'PROCESSES AND NETWORK CONNECTIONS: which programs are executing right now, and which remote ' +
    'hosts they are talking to, is a live fact about a live system; once it is powered off there is ' +
    'no file anywhere holding "the process list at this moment", because that was never a file, it ' +
    'was a state. DECRYPTED SECRETS: an encryption key that is unlocked and sitting in RAM so a ' +
    'mounted volume can be read is, by design, never written to disk in that unlocked form, that is ' +
    'the whole point of the encryption. FILELESS MALWARE: code injected directly into a legitimate ' +
    'process memory, with no executable ever written to disk, leaves nothing for a disk image to ' +
    'find, because there genuinely is nothing there. And smaller things, like clipboard contents, ' +
    'are transient in the same way. None of this argues against imaging the disk. It argues for ' +
    'capturing memory FIRST, and for recognising that a host powered off before that capture has ' +
    'already destroyed evidence no later analysis can recover.',
} as const;

const IMAGING_TEACH = {
  concept:
    'A write-blocker sits between a suspect drive and the examiner machine and refuses to pass any ' +
    'write command through, whether the examiner intends to write something or not. That last part ' +
    'matters: modern operating systems write to a drive as a side effect of simply mounting it, ' +
    'updating access metadata, sometimes more, without anyone choosing to. A write-blocker removes ' +
    'the possibility entirely rather than relying on the examiner discipline not to click the wrong ' +
    'thing.\n\n' +
    'A forensic IMAGE is a bit-for-bit copy of the whole device: every sector, including unallocated ' +
    'space and file-system slack, not just the files an operating system would show. That is the ' +
    'difference between an image and an ordinary file copy. A file copy only grabs what the file ' +
    'system currently considers live files, so a deleted file, or data sitting in the unused tail ' +
    'end of a disk sector, is invisible to it and absent from the copy. A raw image captures all of ' +
    'it, because deleted-but-not-yet-overwritten data and slack space are often exactly where the ' +
    'interesting evidence survives.\n\n' +
    'Procedure follows from both facts: hash the original before imaging, hash the resulting image ' +
    'and confirm the two match, then seal and store the original and do every subsequent examination ' +
    'against the verified copy. If the copy is ever challenged, the sealed original is still there ' +
    'to re-image and re-verify against.',
} as const;

const TIMELINE_TEACH = {
  concept:
    'A timeline is what turns a pile of disconnected artefacts, a Prefetch entry here, an event log ' +
    'there, a file timestamp somewhere else, into a narrative: what happened, in what order. It is ' +
    'built by pulling timestamps from many independent sources and lining them up against each ' +
    'other, and its power comes specifically from that independence. A single artefact can be wrong, ' +
    'missing, or deliberately altered without anyone knowing. When a file modified time, a login ' +
    'event in the security log, and a browser history entry all agree on the same twenty-minute ' +
    'window, that agreement is much harder to challenge than any one of the three would be alone, ' +
    'precisely because faking all three consistently is a much larger job than faking one.\n\n' +
    'The useful corollary is that DISAGREEMENT between sources is itself a finding. A file that ' +
    'claims to have been modified before it was created, or a login the security log has no record ' +
    'of despite other artefacts showing activity, does not mean the timeline is broken, it means ' +
    'something is wrong with one of the sources, and figuring out which one, and why, is often where ' +
    'the real story is.',
} as const;

const ANTIFORENSICS_TEACH = {
  concept:
    'Anti-forensics is the set of techniques used to defeat exactly the kind of timeline the last ' +
    'module described, and examiners are trained to look for its tells rather than assume a ' +
    'clean-looking system means nothing happened. TIMESTOMPING is deliberately rewriting a file MACB ' +
    'timestamps to mislead a timeline, for example backdating a malicious file to look like it has ' +
    'been on the system for years. LOG CLEARING removes the record of specific actions, but on ' +
    'Windows the act of clearing the Security event log itself generates a new event, ID 1102, so a ' +
    'cleared log is not silence, it is a labeled event that now needs its own explanation. SECURE ' +
    'WIPING overwrites deleted data specifically so it cannot be recovered from unallocated space, ' +
    'defeating the file-recovery techniques a raw image would otherwise support.\n\n' +
    'The examiner mindset here inverts the usual one: a suspiciously clean or suspiciously gapped ' +
    'record is not evidence of nothing, it is itself evidence of something, and the job becomes ' +
    'explaining the gap or the inconsistency rather than accepting it at face value.',
} as const;

const REPORT_TEACH = {
  concept:
    'A forensic report and a witness testimony both face the same test eventually: can someone ' +
    'hostile to the finding take it apart? A report survives that test when it documents exactly ' +
    'which tools and versions were used, so another examiner could repeat the work and reach the ' +
    'same result; when it keeps factual findings, what the data shows, separate from the analyst ' +
    'interpretation of what that means; when it references the chain of custody and hash values for ' +
    'every piece of evidence discussed, so provenance is never left implicit; and when every ' +
    'conclusion traces back to a specific, named piece of evidence rather than to the analyst ' +
    'general experience or gut feeling. What does not survive is confidence used as a substitute for ' +
    'any of that: a report or a witness who sounds certain but cannot point to documented, ' +
    'repeatable steps has given the other side nothing to attack except the person, which is exactly ' +
    'what a good report and a well-prepared witness make unnecessary.\n\n' +
    'Courts that scrutinise expert methodology closely, the kind of challenge associated with the ' +
    'Daubert standard in the United States though the underlying questions are asked in some form ' +
    'nearly everywhere, tend to circle three questions: has the method been tested and does it have ' +
    'a known error rate, has it been peer-reviewed or is it generally accepted in the field, and ' +
    'could another qualified examiner reproduce the finding from the same evidence and ' +
    'documentation. An examiner who can answer all three honestly, including admitting a method real ' +
    'limitations, is far harder to discredit than one who simply asserts certainty.',
} as const;

// --- Module fx.2: chain of custody in practice -------------------------------

const MODULE_FX_2: Exercise[] = [
  {
    id: 'fx.2.1',
    moduleId: 'fx.2',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'What belongs on a custody log',
    kind: 'multiple-choice',
    goal: 'Know what a custody record has to capture at every handoff.',
    prompt:
      'You are designing the custody log template for a new case. Which of the following belong on ' +
      'every entry? Select all that apply.',
    teach: CUSTODY_TEACH,
    options: [
      { id: 'a', label: 'The date and time the item changed hands.' },
      { id: 'b', label: 'The name of the person taking custody.' },
      { id: 'c', label: 'What was done to the item while in that person custody (imaged, examined, stored).' },
      { id: 'd', label: 'The hash of the item recorded at that handoff, so a later mismatch can be traced to a point in the chain.' },
      { id: 'e', label: 'The analyst personal opinion of whether the suspect is guilty.' },
    ],
    hints: [
      'Four of these establish who, when, what and where. One does not belong in an evidence record at all.',
      'A custody log is a factual record of handling, not an assessment of the case.',
      'Ask which entry a defence lawyer would most want read aloud in court, and why.',
    ],
    solution:
      'A, B, C, and D. Together they answer who held the item, when, what happened to it, and give a ' +
      'hash checkpoint that pins any later mismatch to a specific transfer. E does not belong on a ' +
      'custody record at all: an opinion about guilt is not a fact about handling, and including it ' +
      'hands the defence a document that reads as though the analyst had already decided the case ' +
      'before the evidence was examined.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option is an opinion about the case rather than a fact about handling the evidence.',
      },
    ],
    debrief:
      'A custody log is boring on purpose. The moment it starts reading like an opinion, it stops ' +
      'being a record of what happened to the evidence and starts being a target.',
    practice: [],
  },
  {
    id: 'fx.2.2',
    moduleId: 'fx.2',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'Keeping the chain short',
    kind: 'multiple-choice',
    goal: 'Recognise practices that reduce custody risk.',
    prompt: 'Which of the following practices reduce custody risk on a case? Select all that apply.',
    teach: CUSTODY_TEACH,
    options: [
      { id: 'a', label: 'Assigning a single named custodian, rather than leaving the evidence in a shared, unattended space.' },
      { id: 'b', label: 'Sealing evidence in tamper-evident bags before it moves anywhere.' },
      { id: 'c', label: 'Letting whichever team member is free at the time retrieve evidence from storage, to keep the case moving.' },
      { id: 'd', label: 'Requiring a signature for every transfer, including ones between two people on the same team.' },
      { id: 'e', label: 'Labeling every container with the case number and evidence tag before it goes into storage.' },
    ],
    hints: [
      'Four of these keep the list of people who touched the evidence short and accountable. One treats convenience as more important than the record.',
      'Every additional untracked hand is one more person whose actions have to be explained later.',
      'Which option removes the "who" from an entry rather than adding it?',
    ],
    solution:
      'A, B, D, and E. A single named custodian, sealed containers, a signature at every transfer ' +
      'including internal ones, and clear labeling all keep the record complete and the list of ' +
      'handlers short. C trades that away for convenience: "whoever is free" is exactly the phrase ' +
      'that turns into an unexplained gap when somebody later asks who had the drive on a given ' +
      'afternoon.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'One option prioritises speed over knowing exactly who has the evidence at any moment.',
      },
    ],
    debrief:
      'Convenience is the enemy chain of custody is built to resist. Every shortcut that saves five ' +
      'minutes now costs an argument in court later.',
    practice: [],
  },
  {
    id: 'fx.2.3',
    moduleId: 'fx.2',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'Six hours nobody can account for',
    kind: 'multiple-choice',
    goal: 'See why a matching hash does not close a custody gap.',
    prompt:
      'A drive is seized at 09:00. The custody log first entry is not made until 15:00, by which ' +
      'point the drive has already passed through two more people hands. What is the most accurate ' +
      'assessment?',
    teach: CUSTODY_TEACH,
    options: [
      { id: 'a', label: 'No real problem, since the drive was hashed and the hash still matches.' },
      { id: 'b', label: 'This is a custody gap: six hours and two handoffs happened with no record, and a matching hash does not account for who had the drive or what they could have done during that window.' },
      { id: 'c', label: 'Only a problem if the drive was actually altered.' },
      { id: 'd', label: 'Not a problem, since the people involved can be trusted to remember accurately later.' },
    ],
    hints: [
      'A hash proves the bytes match. It does not prove who had the drive, or when.',
      'Six hours and two handoffs with nothing written down is exactly what a gap looks like.',
      'Memory, recalled months later under questioning, is not a record.',
    ],
    solution:
      'B. A gap is a gap regardless of what the hash later shows: the record cannot say who held the ' +
      'drive or what happened to it for six hours and two handoffs, and that absence is itself the ' +
      'vulnerability, independent of whether anything was actually altered. A matching hash answers ' +
      '"did the bytes change", not "can you account for the drive the whole time", and a defence only ' +
      'needs the second question to have no answer.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'What can a matching hash tell you, and what does it stay silent about?',
      },
    ],
    debrief:
      'The gap is the finding. Nobody has to prove something bad happened in it, they only have to ' +
      'point out that nobody can prove it did not.',
    practice: [],
  },
  {
    id: 'fx.2.4',
    moduleId: 'fx.2',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'Real challenges versus normal storage',
    kind: 'multiple-choice',
    goal: 'Separate genuine custody problems from ordinary facts about storage.',
    prompt:
      'Which of the following are legitimate grounds for a defence to challenge evidence based on ' +
      'its custody record? Select all that apply.',
    teach: CUSTODY_TEACH,
    options: [
      { id: 'a', label: 'An unexplained span of time where no entry names who had the item.' },
      { id: 'b', label: 'A person appears in a later transfer who was never listed as receiving the item.' },
      { id: 'c', label: 'Evidence tags on the transfer form do not match the tag on the container.' },
      { id: 'd', label: 'The evidence was stored in the same evidence room as material from other, unrelated cases.' },
    ],
    hints: [
      'Three of these are real gaps or contradictions in the record. One describes an ordinary, unremarkable storage arrangement.',
      'Sharing a storage room with other cases is normal as long as each item is tagged and logged correctly.',
      'Ask which option describes a hole in the paperwork versus one that just describes a building.',
    ],
    solution:
      'A, B, and C. A missing span of custody, a handler who appears from nowhere, and mismatched ' +
      'tags are all genuine contradictions the record cannot explain away. D is not a problem by ' +
      'itself: evidence from unrelated cases sharing a secure room is completely normal, as long as ' +
      'each item own tag, log, and container integrity are intact.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option describes a building arrangement, not a contradiction in the paperwork.',
      },
    ],
    debrief:
      'Not every fact about storage is a vulnerability. The ones that matter are the ones where the ' +
      'paperwork contradicts itself or goes silent.',
    practice: [],
  },
  {
    id: 'fx.2.5',
    moduleId: 'fx.2',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'What custody has to establish',
    kind: 'short-answer',
    goal: 'Put the custody record and the limits of a hash into your own words.',
    prompt:
      'In two or three sentences, explain what a chain of custody record needs to establish, and why ' +
      'a matching hash does not repair a gap in it.',
    teach: CUSTODY_TEACH,
    hints: [
      'Say what the record has to show for every handoff: who, when, what, where next.',
      'Then say what a hash actually proves, and what it does not touch.',
      'A good answer says the bytes are unchanged since the hash was first taken, and names at least one thing outside that, such as who held the item during an unrecorded stretch.',
    ],
    solution:
      'A chain of custody record has to show, for every point the evidence changed hands, who took it, ' +
      'when, what was done to it, and where it went next, with no gaps in that account. A matching ' +
      'hash only proves the bytes have not changed since the hash was taken; it says nothing about ' +
      'who actually held the item or what they could have done to it during a stretch of time nobody ' +
      'logged, so it cannot repair a gap in the record, it can only confirm the contents on either ' +
      'side of it.',
    expectedOutput:
      'An answer naming who, when, what and where for every handoff, and explaining that a matching ' +
      'hash confirms content but not custody.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['who', 'when', 'transfer', 'handoff', 'custody', 'handler'],
          ['gap', 'unexplained', 'unaccounted', 'unbroken', 'continuous'],
          ['hash', 'match', 'bytes', 'content', 'does not prove', 'does not account', 'does not establish'],
        ],
        hint:
          'Three ideas: what the record has to show for every handoff, what an unexplained gap does ' +
          'to it, and what a hash does and does not prove about custody.',
      },
    ],
    debrief:
      'Forensics is not only about what happened to the data. It is equally about what happened to ' +
      'the story of who touched it, and a hash only ever answers half of that.',
    practice: [],
  },
];

// --- Module fx.3: hashing and integrity, beyond the basics -------------------

const MODULE_FX_3: Exercise[] = [
  {
    id: 'fx.3.1',
    moduleId: 'fx.3',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'Why compute more than one hash',
    kind: 'multiple-choice',
    goal: 'Understand why forensic tools often compute two hash algorithms.',
    prompt: 'Why do forensic tools commonly compute more than one hash algorithm for the same evidence? Select all that apply.',
    teach: HASH_LIMITS_TEACH,
    options: [
      { id: 'a', label: 'MD5 is kept around because some case management systems, tools, and standards still expect it, and having it avoids relitigating the tool choice.' },
      { id: 'b', label: 'SHA-256 offers much stronger collision resistance and is treated as the primary integrity guarantee.' },
      { id: 'c', label: 'If MD5 or SHA-1 were ever shown to be spoofed in a way relevant to a case, having a second, stronger hash on record protects the finding.' },
      { id: 'd', label: 'Computing a second hash is legally mandated in every jurisdiction on earth.' },
    ],
    hints: [
      'Three of these describe real reasons a second hash is kept. One asserts a universal legal requirement that does not exist.',
      'Practices like this usually spread because they are useful and cheap, not because a single law demands them everywhere.',
      'Ask which claim would need to be true in every jurisdiction on earth to hold up.',
    ],
    solution:
      'A, B, and C. Backward compatibility with older systems, SHA-256 as the stronger primary ' +
      'guarantee, and insurance against a future weakness in the older algorithm are all real, ' +
      'practical reasons. D overstates it: practice varies by jurisdiction and organisation, and ' +
      'while many standards recommend or require specific algorithms, there is no single universal ' +
      'legal mandate that computing two hashes satisfies everywhere.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option claims a universal legal requirement that does not actually exist.',
      },
    ],
    debrief:
      'Redundancy here is cheap insurance, not superstition. Computing a second hash costs almost ' +
      'nothing and closes an argument before it opens.',
    practice: [],
  },
  {
    id: 'fx.3.2',
    moduleId: 'fx.3',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'What a mismatch actually tells you',
    kind: 'multiple-choice',
    goal: 'Know the narrow, honest claim a hash mismatch supports.',
    prompt: 'A working copy hash does not match the original evidence hash. What does that mismatch tell you?',
    teach: HASH_LIMITS_TEACH,
    options: [
      { id: 'a', label: 'Exactly which bytes changed, and why.' },
      { id: 'b', label: 'That something changed between the two hashes, though not what changed or why.' },
      { id: 'c', label: 'That the evidence is automatically inadmissible in every case.' },
      { id: 'd', label: 'That the analyst who handled it made an error, always.' },
    ],
    hints: [
      'A hash is a single number. It cannot point at a location or a cause.',
      'It tells you THAT something differs, never WHAT or WHY.',
      'A mismatch can come from careless handling, a hardware fault, or deliberate tampering. The hash alone cannot tell you which.',
    ],
    solution:
      'B. A hash collapses an entire file into one fixed value, so a mismatch only tells you the two ' +
      'versions differ somewhere; it cannot localise the change or explain its cause. A is wrong ' +
      'because a hash carries no positional information. C overstates the consequence: a mismatch ' +
      'demands an explanation, it does not automatically end a case. D assumes the worst explanation ' +
      'is always the true one, when a hardware fault or a legitimate reprocessing step can also ' +
      'produce a mismatch.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'A hash is one number. What kind of information can one number possibly carry about a difference?',
      },
    ],
    debrief:
      'Treat a mismatch as a question, not a verdict. The investigation into why it happened is where ' +
      'the real finding lives.',
    practice: [],
  },
  {
    id: 'fx.3.3',
    moduleId: 'fx.3',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'What a match does not prove',
    kind: 'multiple-choice',
    goal: 'Name the real limits of a matching hash.',
    prompt: 'Which of the following does a matching hash NOT prove? Select all that apply.',
    teach: HASH_LIMITS_TEACH,
    options: [
      { id: 'a', label: 'That the item now in evidence storage is the same physical item originally seized, rather than an identical clone made before the first hash was taken.' },
      { id: 'b', label: 'That the evidence was collected lawfully in the first place.' },
      { id: 'c', label: 'That whoever handled the item before the first hash treated it correctly.' },
      { id: 'd', label: 'That the file bytes are identical to what they were when the hash was first taken.' },
      { id: 'e', label: 'That the analyst overall methodology on the case, not just this one artefact, would survive scrutiny.' },
    ],
    hints: [
      'Four of these are real limits on what a hash can tell you. One describes exactly what a hash IS built to prove, so it does not belong in a list of things it fails to prove.',
      'A hash only ever speaks to content, from the moment it was first computed onward.',
      'Which option is the hash actual job, rather than a gap in it?',
    ],
    solution:
      'A, B, C, and E. A hash cannot rule out an identical clone substituted before anyone ever ' +
      'touched the item, cannot speak to whether the seizure itself was lawful, cannot vouch for ' +
      'handling that happened before the first hash, and says nothing about whether the rest of the ' +
      'analyst methodology holds up. D is the trap: proving the bytes match what they were at first ' +
      'hash is precisely what a matching hash DOES establish, so it does not belong on a list of what ' +
      'it fails to prove.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option describes exactly what a hash match is built to prove, not a limit on it.',
      },
    ],
    debrief:
      'A hash is a narrow, powerful tool. The mistake is not distrusting it, it is asking it to answer ' +
      'questions it was never built to answer.',
    practice: [],
  },
  {
    id: 'fx.3.4',
    moduleId: 'fx.3',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'Choosing a primary hash today',
    kind: 'multiple-choice',
    goal: 'Pick the algorithm that resists deliberate forgery.',
    prompt: 'You are choosing a hashing algorithm for a new evidence-handling workflow. Which is generally the safest choice as a primary integrity hash today?',
    teach: HASH_LIMITS_TEACH,
    options: [
      { id: 'a', label: 'MD5, because it is fast.' },
      { id: 'b', label: 'SHA-1, because it has historically been the standard.' },
      { id: 'c', label: 'SHA-256, because it offers strong collision resistance and is the accepted modern default.' },
      { id: 'd', label: 'Whichever algorithm the device under examination happens to use internally.' },
    ],
    hints: [
      'Speed and history are not the deciding factors here. Strength against deliberate forgery is.',
      'Both MD5 and SHA-1 have documented collision weaknesses that make them a poor primary choice today.',
      'The device being examined has no bearing on which hash algorithm the examiner should use to verify it.',
    ],
    solution:
      'C. SHA-256 is the accepted modern default specifically because it resists the kind of ' +
      'deliberate collision attack that has been demonstrated against both MD5 and SHA-1. Speed (A) ' +
      'is not the relevant property for an integrity check, historical precedent (B) is not a ' +
      'security argument, and the algorithm choice has nothing to do with what device the evidence ' +
      'came from (D).',
    expectedOutput: 'Option C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['c'],
        hint: 'Which algorithm actually resists deliberate, engineered collisions today?',
      },
    ],
    debrief:
      'Choosing a hash algorithm is one of the few purely technical decisions in this package, and it ' +
      'still comes down to picking the one hardest to defeat on purpose.',
    practice: [],
  },
  {
    id: 'fx.3.5',
    moduleId: 'fx.3',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'What a match establishes, and what it does not',
    kind: 'short-answer',
    goal: 'State precisely what hashing does and does not prove.',
    prompt: 'In two or three sentences, explain what a matching hash actually establishes about a piece of evidence, and name one thing it does not establish.',
    teach: HASH_LIMITS_TEACH,
    hints: [
      'State the narrow, positive claim a match makes about content.',
      'Then name a limit: custody, lawful collection, or an already-substituted original are all fair game.',
      'A good answer says the bytes are unchanged since the hash was first taken, and names at least one thing outside that, such as who held the item or whether it was seized lawfully.',
    ],
    solution:
      'A matching hash establishes that the evidence bytes have not changed since the hash was first ' +
      'computed, which is a narrow but very useful integrity guarantee. It does not establish who ' +
      'held the item during any period before or after that first hash, whether it was seized ' +
      'lawfully, or that the item first hashed was genuinely the original rather than an ' +
      'already-substituted copy, so a hash match answers a question about content, not about custody ' +
      'or origin.',
    expectedOutput:
      'An answer stating that a match confirms unchanged content, and naming custody or lawful ' +
      'collection as something it does not establish.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['unchanged', 'identical', 'bytes', 'content', 'integrity', 'fingerprint'],
          ['custody', 'who held', 'handled', 'possession'],
          ['lawfully', 'seized', 'original', 'authentic', 'substitut'],
        ],
        hint:
          'Three ideas: what a match says about content, and two separate things it says nothing ' +
          'about, custody and lawful or authentic origin.',
      },
    ],
    debrief:
      'Keep this distinction sharp for the rest of the package: integrity and custody are two ' +
      'different guarantees, proven two different ways, and only one of them is a hash job.',
    practice: [],
  },
];

// --- Module fx.4: host artefacts and what they answer ------------------------

const MODULE_FX_4: Exercise[] = [
  {
    id: 'fx.4.1',
    moduleId: 'fx.4',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'What Prefetch actually records',
    kind: 'multiple-choice',
    goal: 'Know what a Prefetch entry can and cannot show.',
    prompt: 'Which of the following are true about what a Windows Prefetch file records? Select all that apply.',
    teach: PREFETCH_TEACH,
    options: [
      { id: 'a', label: 'It records that an executable ran and approximately when, even if the executable itself is later deleted.' },
      { id: 'b', label: 'It stores the actual network packets the program sent while running.' },
      { id: 'c', label: 'It is one of the artefacts examiners check for proof of execution when the program binary itself is gone.' },
      { id: 'd', label: 'The run count and timestamps it holds can suggest how often, and how recently, a program ran.' },
    ],
    hints: [
      'Three of these are true about what Prefetch records. One describes something Prefetch was never built to hold.',
      'Prefetch exists to make programs launch faster, not to capture network traffic.',
      'Ask what question Prefetch answers: did something run, or what did it send?',
    ],
    solution:
      'A, C, and D. Prefetch is a small execution record: it shows a program ran, roughly when, and ' +
      'how many times, and it survives deletion of the program itself because it lives in its own ' +
      'folder. B is the trap: Prefetch has nothing to do with network content, it never captures ' +
      'packets, only the fact and timing of local execution.',
    expectedOutput: 'Options A, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c', 'd'],
        hint: 'One option describes something no local execution artefact would ever contain.',
      },
    ],
    debrief:
      'Prefetch is one of the cheapest wins in host forensics: a tiny file that keeps answering "did ' +
      'this run here" long after the evidence you would expect, the program itself, is gone.',
    practice: [],
  },
  {
    id: 'fx.4.2',
    moduleId: 'fx.4',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'What a Run key answers',
    kind: 'multiple-choice',
    goal: 'Identify the persistence question Run keys answer.',
    prompt: 'An examiner finds an unfamiliar entry in a Windows Run registry key, pointing to a script in a temporary folder. What question does that entry primarily help answer?',
    teach: RUNKEY_TEACH,
    options: [
      { id: 'a', label: 'What websites the user visited.' },
      { id: 'b', label: 'What launches automatically at startup or logon, meaning what an attacker arranged to survive a reboot.' },
      { id: 'c', label: 'What files were permanently deleted.' },
      { id: 'd', label: 'What printers are configured on the machine.' },
    ],
    hints: [
      'Run keys are about persistence, not browsing, deletion, or hardware.',
      'The question is: what starts itself, unattended, every time this machine boots or a user logs in?',
      'An attacker who wants to survive a reboot needs exactly this kind of entry.',
    ],
    solution:
      'B. Run keys list what Windows starts automatically at boot or logon, so an unfamiliar entry ' +
      'pointing at a script is a strong persistence indicator: something has arranged to run again ' +
      'every time the machine starts, without anyone choosing to launch it. Browsing history, file ' +
      'deletion, and hardware configuration are recorded elsewhere and answer different questions ' +
      'entirely.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'What does an attacker gain by placing an entry in a Run key specifically?',
      },
    ],
    debrief:
      'Persistence is what separates a one-off compromise from an ongoing one. A Run key is one of ' +
      'the first places that difference shows up.',
    practice: [],
  },
  {
    id: 'fx.4.3',
    moduleId: 'fx.4',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'The four letters in MACB',
    kind: 'multiple-choice',
    goal: 'Name the standard NTFS timestamp set correctly.',
    prompt: 'Which of the following are part of the standard NTFS timestamp set, often abbreviated MACB, that examiners use to build a timeline? Select all that apply.',
    teach: TIMESTAMP_TEACH,
    options: [
      { id: 'a', label: 'Modified: when the file content itself last changed.' },
      { id: 'b', label: 'Accessed: when the file was last opened or read (though many systems update this loosely).' },
      { id: 'c', label: 'Changed: when the file metadata, such as permissions or size record, last changed, separately from content.' },
      { id: 'd', label: 'Birth (Created): when the file first appeared on this volume.' },
      { id: 'e', label: 'Deleted: when the file was removed from the volume.' },
    ],
    hints: [
      'Four of these are the actual letters in MACB. One names an event NTFS does not record as a standard timestamp at all.',
      'MACB stands for Modified, Accessed, Changed, Birth. Count the letters against the options.',
      'Deletion can sometimes be inferred from other artefacts, but it is not one of the four MACB timestamps.',
    ],
    solution:
      'A, B, C, and D, exactly the four letters in MACB. E is the trap: there is no standard "Deleted" ' +
      'timestamp in this set. Deletion can sometimes be inferred from other artefacts, like an $MFT ' +
      'entry marked unallocated, but it is not one of the four timestamps examiners read directly off ' +
      'a live file.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option names an event that is not one of the four MACB timestamps.',
      },
    ],
    debrief:
      'Learn MACB cold. Almost every timeline in this field starts by lining these four numbers up ' +
      'against every other artefact available.',
    practice: [],
  },
  {
    id: 'fx.4.4',
    moduleId: 'fx.4',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'What browser artefacts show, and what they do not',
    kind: 'multiple-choice',
    goal: 'Use browser evidence for what it can prove, not for attribution.',
    prompt: 'Why do examiners treat browser history, downloads, and cache as valuable artefacts? Select all that apply.',
    teach: BROWSER_TEACH,
    options: [
      { id: 'a', label: 'Search terms can show intent or knowledge, such as searching how to clear an event log.' },
      { id: 'b', label: 'Download records tie a specific file to the moment it entered the system, often with the source URL attached.' },
      { id: 'c', label: 'History shows what pages were requested even after the underlying page has changed or the file itself is gone.' },
      { id: 'd', label: 'Cached pages and cookies can corroborate the timing of a session independently of other logs.' },
      { id: 'e', label: 'Browser history proves conclusively which named person was physically at the keyboard.' },
    ],
    hints: [
      'Four of these describe what browser artefacts genuinely show. One claims a certainty about attribution that no browser log can provide on its own.',
      'A browser records what a profile or session requested, not who was physically pressing keys.',
      'Shared accounts, remote access, and scheduled tasks can all produce identical browser records.',
    ],
    solution:
      'A, B, C, and D. Search intent, download provenance, surviving history, and cache-based timing ' +
      'corroboration are all genuine, well-used artefacts. E overreaches: a browser record ties ' +
      'activity to a profile or session, not to a specific human body at the keyboard, and a ' +
      'compromised account, shared login, or remote session can generate identical history.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option claims a certainty about who was physically present that no browser log alone can give you.',
      },
    ],
    debrief:
      'Browser artefacts are rich and easy to over-trust. They tell you what happened on the machine ' +
      'with real precision, and almost nothing about who was sitting in front of it.',
    practice: [],
  },
  {
    id: 'fx.4.5',
    moduleId: 'fx.4',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'What machine evidence cannot tell you',
    kind: 'short-answer',
    goal: 'Name the attribution gap in host artefacts.',
    prompt:
      'Pick two artefacts from this module (Prefetch, Run keys, NTFS timestamps, or browser history) ' +
      'and, in two or three sentences, say what question each answers, and why neither one, by ' +
      'itself, proves who was at the keyboard.',
    teach: ARTEFACT_ATTRIBUTION_TEACH,
    hints: [
      'Name two artefacts and the specific question each one answers.',
      'Then explain the attribution gap: a machine-level record is not the same as knowing who was physically present.',
      'A good answer names two artefacts, states the question each answers, and explains that machine activity is not the same fact as a specific human identity.',
    ],
    solution:
      'Prefetch answers whether a specific program executed and roughly when, even after the ' +
      'executable itself is deleted, while Run keys answer what was arranged to start automatically ' +
      'and survive a reboot, which is a persistence question rather than a one-off action. Neither ' +
      'one, nor any combination of host artefacts, proves who was physically at the keyboard, because ' +
      'a compromised account, a scheduled task, or remote access can produce identical records to a ' +
      'person typing directly, so attribution to a specific individual has to come from evidence ' +
      'outside the machine itself.',
    expectedOutput:
      'An answer naming two artefacts, the question each answers, and explaining the gap between ' +
      'machine activity and a specific human identity.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['prefetch', 'run key', 'registry', 'timestamp', 'macb', 'browser', 'history'],
          ['run', 'execut', 'persist', 'startup', 'timeline', 'modif', 'access', 'request', 'visit'],
          ['who was', 'keyboard', 'physically', 'attribut', 'account', 'shared', 'remote', 'person'],
        ],
        hint:
          'Name at least two artefacts, say what question each answers, and explain the gap between ' +
          'machine activity and knowing who was physically present.',
      },
    ],
    debrief:
      'Keep this gap in every report you write. "The machine did X" and "this named person did X" ' +
      'are two different claims, and only one of them is what host artefacts alone can prove.',
    practice: [],
  },
];

// --- Module fx.5: what only lives in memory -----------------------------------

const MODULE_FX_5: Exercise[] = [
  {
    id: 'fx.5.1',
    moduleId: 'fx.5',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'Evidence with no disk equivalent',
    kind: 'multiple-choice',
    goal: 'Name the categories of evidence that exist only in memory.',
    prompt: 'Which of the following exist only in memory, with no equivalent that survives on disk after power-off? Select all that apply.',
    teach: MEMORY_ONLY_TEACH,
    options: [
      { id: 'a', label: 'An actively open network connection and which process owns it.' },
      { id: 'b', label: 'Malware that injected itself into a legitimate running process without ever writing an executable to disk.' },
      { id: 'c', label: 'An encryption key currently unlocked in RAM to decrypt a mounted volume.' },
      { id: 'd', label: 'The list of programs installed on the machine.' },
      { id: 'e', label: 'The current contents of the clipboard.' },
    ],
    hints: [
      'Four of these are live states that vanish at power-off with nothing on disk to recover them from. One is recorded persistently and would still be there after a reboot.',
      'Installed-program lists live in the registry and on disk; they survive a shutdown just fine.',
      'For each option, ask whether a disk image taken an hour after shutdown could still show it.',
    ],
    solution:
      'A, B, C, and E are all live-only states: an open connection, memory-resident injected code ' +
      'with no file counterpart, an unlocked key, and clipboard contents are each gone the instant ' +
      'the machine loses power, with nothing on disk to reconstruct them from. D is the trap: the ' +
      'installed-program list is written to the registry and disk, and survives a clean shutdown and ' +
      'a later disk image without any trouble.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option describes something that is written durably to disk and survives a reboot.',
      },
    ],
    debrief:
      'This is the list worth memorising. Every item on it is a reason a live memory capture, done ' +
      'before shutdown, can be worth more than a perfect disk image done after.',
    practice: [],
  },
  {
    id: 'fx.5.2',
    moduleId: 'fx.5',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'Fileless malware and where it lives',
    kind: 'multiple-choice',
    goal: 'Understand why fileless malware demands a memory capture.',
    prompt: 'Why does an examiner prioritise a live memory capture over disk imaging when malware is suspected to be fileless?',
    teach: MEMORY_ONLY_TEACH,
    options: [
      { id: 'a', label: 'Because disk imaging takes longer to complete.' },
      { id: 'b', label: 'Because fileless malware runs entirely in memory and never writes an executable to disk, so imaging the disk afterward would find nothing of it.' },
      { id: 'c', label: 'Because memory images are easier to hash and verify.' },
      { id: 'd', label: 'Because more jurisdictions legally require a memory capture.' },
    ],
    hints: [
      'The word "fileless" is the clue.',
      'If nothing was ever written to disk, no amount of disk imaging can recover it.',
      'This is about where the evidence physically exists, not about speed, hashing convenience, or law.',
    ],
    solution:
      'B. Fileless malware, by definition, never writes its own executable to disk, it runs entirely ' +
      'as code injected into legitimate processes in memory. A disk image taken after the fact, ' +
      'however carefully done, has nothing to find, because the evidence was never there to begin ' +
      'with. Speed (A), hashing convenience (C), and legal mandate (D) are not the reason; the reason ' +
      'is that the evidence exists in exactly one place, and that place is volatile.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Where does fileless malware actually live, and what does that mean for a disk image?',
      },
    ],
    debrief:
      'Fileless techniques exist specifically because they defeat disk-only forensics. Memory capture ' +
      'is not an extra step for these cases, it is the only step that can see them at all.',
    practice: [],
  },
  {
    id: 'fx.5.3',
    moduleId: 'fx.5',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'The active session versus the record after shutdown',
    kind: 'multiple-choice',
    goal: 'Separate live-state evidence from durable, disk-based records.',
    prompt: 'What can a memory capture reveal about an attacker active session that a disk image, taken after the host is shut down, cannot? Select all that apply.',
    teach: MEMORY_ONLY_TEACH,
    options: [
      { id: 'a', label: 'Plaintext credentials or session tokens that were only ever decrypted in RAM.' },
      { id: 'b', label: 'Which remote IP addresses currently had open connections to the host.' },
      { id: 'c', label: 'The complete browsing history going back several months.' },
      { id: 'd', label: 'Processes an attacker hid by unlinking them from the normal process list, but which are still resident in memory.' },
    ],
    hints: [
      'Three of these are things that exist only in the live, running state of the machine. One is a record that persists on disk and would show up in a disk image just as well.',
      'Months of browsing history has to be stored somewhere durable to still exist months later.',
      'Hidden, unlinked processes are a memory-forensics classic: invisible to a normal process listing but still occupying RAM.',
    ],
    solution:
      'A, B, and D. Decrypted credentials, live connections, and deliberately hidden but still ' +
      'memory-resident processes are exactly the kind of state a shutdown destroys and a disk image ' +
      'never captured in the first place. C is the trap: months of browsing history is, by necessity, ' +
      'stored durably on disk, so a disk image would show it perfectly well; it is not a ' +
      'memory-exclusive artefact.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'One option describes a durable record that a disk image, taken after shutdown, would show just as well.',
      },
    ],
    debrief:
      'Notice the pattern: memory is where the ACTIVE, in-progress state of an attack lives. Disk is ' +
      'where the DURABLE record of past activity lives. Good forensics uses both, in the right order.',
    practice: [],
  },
  {
    id: 'fx.5.4',
    moduleId: 'fx.5',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'The cost of switching it off',
    kind: 'multiple-choice',
    goal: 'Predict what an immediate shutdown destroys.',
    prompt: 'A host is suspected of being actively exploited right now. Powering it down immediately, before any capture, would guarantee losing which of the following?',
    teach: MEMORY_ONLY_TEACH,
    options: [
      { id: 'a', label: 'The disk contents, since power loss corrupts drives.' },
      { id: 'b', label: 'The running process list, open network connections, and any memory-only malware, none of which have a disk counterpart.' },
      { id: 'c', label: 'The installed patch history, which is only ever tracked in memory.' },
      { id: 'd', label: 'Nothing of consequence, since a nightly backup exists.' },
    ],
    hints: [
      'Disk contents generally survive a power loss just fine; that is the whole premise of "disk before memory" being the wrong order.',
      'Patch history is a durable, disk-based record, not a memory-only one.',
      'A nightly backup captures files, not the live state of a running attack.',
    ],
    solution:
      'B. Powering down destroys exactly the state that has no disk counterpart: the running process ' +
      'list, live network connections, and any memory-resident malware. A is wrong, disks survive a ' +
      'clean or even an abrupt shutdown in almost all cases. C is wrong, patch history lives on disk. ' +
      'D is wrong because a backup captures files at rest, never the live, in-memory state of an ' +
      'ongoing compromise.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which category of evidence has genuinely no equivalent anywhere on disk?',
      },
    ],
    debrief:
      'This is the exercise to remember under pressure. The instinct to just switch it off and stop ' +
      'the bleeding is exactly the instinct that destroys the evidence you most needed.',
    practice: [],
  },
  {
    id: 'fx.5.5',
    moduleId: 'fx.5',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'Naming what memory alone holds',
    kind: 'short-answer',
    goal: 'Explain why memory capture can matter more than a perfect disk image.',
    prompt:
      'Name two categories of evidence that exist only in memory, and in one more sentence explain ' +
      'why capturing memory before shutting a compromised host down can matter more than getting a ' +
      'perfect disk image.',
    teach: MEMORY_ONLY_TEACH,
    hints: [
      'Pick two from: running processes, open network connections, decrypted keys, fileless or injected malware, clipboard contents.',
      'Then explain the core reason: these have no equivalent that a disk image, however perfect, could ever contain.',
      'A good answer names two memory-only categories and states plainly that they have no disk counterpart to fall back on.',
    ],
    solution:
      'Two categories that exist only in memory are the live process and network-connection list, and ' +
      'any fileless malware injected directly into a running process without ever touching disk. ' +
      'Capturing memory before shutdown matters more than a perfect disk image in these cases because ' +
      'a disk image, no matter how carefully taken, simply has nothing to show for evidence that was ' +
      'never written to disk in the first place; once the host is powered off, that state is gone ' +
      'permanently, not just delayed.',
    expectedOutput:
      'An answer naming two memory-only categories and explaining that they have no disk counterpart.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['process', 'network connection', 'key', 'clipboard', 'fileless', 'inject'],
          ['memory', 'ram', 'volatile', 'live'],
          ['disk', 'no equivalent', 'never written', 'gone permanently', 'cannot recover', 'no counterpart'],
        ],
        hint:
          'Name two memory-only categories, then explain that they have no disk counterpart and are ' +
          'lost permanently at power-off.',
      },
    ],
    debrief:
      'This is the sharpest form of order-of-volatility in the whole package: not just capture this ' +
      'first, but capture this or lose it forever.',
    practice: [],
  },
];

// --- Module fx.6: write-blockers and forensic imaging ------------------------

const MODULE_FX_6: Exercise[] = [
  {
    id: 'fx.6.1',
    moduleId: 'fx.6',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'What a write-blocker actually does',
    kind: 'multiple-choice',
    goal: 'Understand why a write-blocker is used, and what it does not replace.',
    prompt: 'Why does an examiner use a write-blocker when connecting a suspect drive? Select all that apply.',
    teach: IMAGING_TEACH,
    options: [
      { id: 'a', label: 'It physically or logically blocks any write command from reaching the original media, even ones the operating system sends without being asked.' },
      { id: 'b', label: 'Without one, simply attaching a drive to an ordinary operating system can alter access metadata as a side effect of mounting it.' },
      { id: 'c', label: 'It lets the examiner later prove, via a matching hash, that the source drive was never altered during examination.' },
      { id: 'd', label: 'It is standard practice specifically because "I did not intend to change anything" is not a defence once the drive has changed.' },
      { id: 'e', label: 'It makes imaging unnecessary, since the original can now be examined directly without risk.' },
    ],
    hints: [
      'Four of these explain the actual purpose of a write-blocker. One claims it replaces imaging entirely, which is backwards.',
      'A write-blocker protects the original while it is being imaged. It does not turn the original into something safe to work on directly.',
      'Even with a write-blocker attached, examination still happens on the copy, never the original.',
    ],
    solution:
      'A, B, C, and D. A write-blocker removes the possibility of an accidental write, including the ' +
      'operating system own side effects, lets the examiner prove the source was untouched, and ' +
      'exists precisely because good intentions do not undo a change once it happens. E is backwards: ' +
      'a write-blocker protects the original while it is being imaged, it does not replace imaging or ' +
      'license working on the original directly, examination always happens on the verified copy.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a write-blocker as a substitute for imaging, rather than as protection during it.',
      },
    ],
    debrief:
      'A write-blocker and a forensic image are not two competing options. The write-blocker is what ' +
      'makes the image trustworthy in the first place.',
    practice: [],
  },
  {
    id: 'fx.6.2',
    moduleId: 'fx.6',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'A physical image versus a file copy',
    kind: 'multiple-choice',
    goal: 'Know why an image captures more than a file copy ever could.',
    prompt: 'How does a bit-for-bit (physical, or raw) forensic image differ from copying the drive visible files onto a new disk?',
    teach: IMAGING_TEACH,
    options: [
      { id: 'a', label: 'A physical image also captures unallocated space and file-system slack, so data invisible to the operating system, including some deleted files, can still be recovered.' },
      { id: 'b', label: 'A logical file copy also captures deleted files just as completely.' },
      { id: 'c', label: 'They are functionally identical, just different names for the same process.' },
      { id: 'd', label: 'A physical image is defined mainly by being smaller, since it compresses unused space.' },
    ],
    hints: [
      'Think about what a normal file copy simply cannot see: anything the file system currently considers empty or deleted.',
      'A raw image works at the sector level, below the file system entirely.',
      'Size and compression are implementation details, not the defining difference.',
    ],
    solution:
      'A. A physical image reads every sector of the device, including unallocated space and slack, ' +
      'which is exactly where deleted-but-not-yet-overwritten data tends to survive; a logical copy ' +
      'only sees what the live file system currently exposes as files, and misses all of that. B is ' +
      'wrong for the same reason, a file copy cannot see what the file system has marked as deleted. ' +
      'C understates a real, important difference. D describes an implementation detail that is not ' +
      'what defines a physical image.',
    expectedOutput: 'Option A selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a'],
        hint: 'What can a physical image see that an ordinary file copy cannot see at all?',
      },
    ],
    debrief:
      'This is why "just copy the files" is never an acceptable substitute for imaging. It is not a ' +
      'shortcut to the same result, it is a different, much smaller result.',
    practice: [],
  },
  {
    id: 'fx.6.3',
    moduleId: 'fx.6',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'Correct imaging procedure',
    kind: 'multiple-choice',
    goal: 'Recognise the steps that make an image trustworthy.',
    prompt: 'Which of the following are part of correct forensic imaging procedure? Select all that apply.',
    teach: IMAGING_TEACH,
    options: [
      { id: 'a', label: 'Hash the original drive before imaging begins.' },
      { id: 'b', label: 'Hash the resulting image and confirm it matches the original hash.' },
      { id: 'c', label: 'Store the original in evidence and perform all further examination on the verified copy.' },
      { id: 'd', label: 'If time is short, it is acceptable to examine the original directly and image it once there is time.' },
      { id: 'e', label: 'Document the imaging tool, its version, and the settings used.' },
    ],
    hints: [
      'Four of these are exactly the procedure this module has described. One trades correctness for convenience under time pressure.',
      'Time pressure is a reason to prioritise imaging, not a reason to skip it.',
      'What happens to the original the moment anyone examines it directly?',
    ],
    solution:
      'A, B, C, and E, hashing before and after, working only from the verified copy, and documenting ' +
      'the tooling, are the actual procedure. D is the trap: time pressure is never a legitimate ' +
      'reason to examine the original first, because the moment it is touched, the same risks a ' +
      'write-blocker and imaging-first procedure exist to prevent are back on the table.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option treats time pressure as a reason to skip protecting the original, rather than a reason to image it faster.',
      },
    ],
    debrief:
      'There is no fast path that skips imaging. Under time pressure, image faster, do not examine ' +
      'the original instead.',
    practice: [],
  },
  {
    id: 'fx.6.4',
    moduleId: 'fx.6',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'A quick look before imaging',
    kind: 'multiple-choice',
    goal: 'See why browsing the original, even briefly, is a mistake.',
    prompt:
      'An examiner, confident in their skill, plugs a suspect drive directly into their laptop and ' +
      'opens a few folders to get a feel for the case before imaging it. What is wrong with this?',
    teach: IMAGING_TEACH,
    options: [
      { id: 'a', label: 'Nothing, provided nothing is copied off the drive.' },
      { id: 'b', label: 'Opening folders on an unprotected connection can alter access metadata and other artefacts on the original evidence, which is exactly what a write-blocker and imaging-first procedure exist to prevent.' },
      { id: 'c', label: 'Nothing is wrong, since experienced examiners are trusted to browse safely.' },
      { id: 'd', label: 'The drive should have been reformatted before connecting it.' },
    ],
    hints: [
      'Merely opening a folder can be enough to change metadata, no copying required.',
      'Experience does not change what an operating system does automatically when a drive is mounted.',
      'Reformatting a suspect drive would destroy the evidence entirely, which is the opposite of the goal.',
    ],
    solution:
      'B. Simply browsing a drive on an ordinary, unprotected connection can alter access timestamps ' +
      'and other metadata as a side effect of the operating system doing its normal job, with no ' +
      'intentional copying required. A and C both assume skill or intent is what matters; it is not, ' +
      'the operating system does this regardless of who is at the keyboard. D is nonsensical, ' +
      'reformatting would destroy the evidence outright.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Does browsing a drive require intentional copying to change something about it?',
      },
    ],
    debrief:
      'Curiosity before imaging is one of the most common, and most avoidable, ways an examiner ' +
      'contaminates their own case.',
    practice: [],
  },
  {
    id: 'fx.6.5',
    moduleId: 'fx.6',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'Protecting the original after it is imaged',
    kind: 'short-answer',
    goal: 'Explain what a write-blocker protects against, and why the original stays sealed.',
    prompt:
      'In two or three sentences, explain what a write-blocker protects against, and why an examiner ' +
      'never works on the original drive even after it has been imaged.',
    teach: IMAGING_TEACH,
    hints: [
      'Say what a write-blocker actually stops, including side effects the examiner did not intend.',
      'Then explain what stays true of the original even after a successful, verified image exists.',
      'A good answer covers both: the protection a write-blocker provides, and why the original stays sealed and stored rather than being worked on, even post-image.',
    ],
    solution:
      'A write-blocker prevents any write, intentional or an unintended side effect of the operating ' +
      'system mounting the drive, from ever reaching the original media. Even after a successful ' +
      'image is taken and its hash verified against the original, the examiner still works only from ' +
      'that verified copy and keeps the original sealed in storage, because doing so preserves a ' +
      'provably unchanged reference that can be re-imaged or re-verified if the copy, the process, or ' +
      'the finding is ever challenged.',
    expectedOutput:
      'An answer stating what a write-blocker prevents, and why the original stays sealed even after imaging.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['write-blocker', 'write', 'prevent', 'block', 'side effect', 'mounting'],
          ['original', 'sealed', 'storage', 'preserve', 'untouched'],
          ['copy', 'image', 'verified', 're-image', 'reverify', 'challenge'],
        ],
        hint:
          'Three ideas: what a write-blocker prevents, why the original stays sealed, and what re-verification requires.',
      },
    ],
    debrief:
      'The original is not evidence you examine, it is evidence you protect so the examination can be ' +
      'checked. That distinction is the entire reason imaging exists.',
    practice: [],
  },
];

// --- Module fx.7: timelines and the tells of a scrubbed system ---------------

const MODULE_FX_7: Exercise[] = [
  {
    id: 'fx.7.1',
    moduleId: 'fx.7',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'Why a timeline needs more than one source',
    kind: 'multiple-choice',
    goal: 'Understand why independent corroboration strengthens a timeline.',
    prompt: 'Why do examiners build a timeline from multiple independent artefact sources rather than trusting a single one? Select all that apply.',
    teach: TIMELINE_TEACH,
    options: [
      { id: 'a', label: 'A single source can be wrong, silent, or deliberately altered without anyone else knowing.' },
      { id: 'b', label: 'When file timestamps, event logs, and network records all agree, the finding is much harder to challenge than any one source alone.' },
      { id: 'c', label: 'Combining several sources is generally faster than carefully checking any one of them.' },
      { id: 'd', label: 'A disagreement between two sources is itself a finding, and sometimes reveals tampering.' },
      { id: 'e', label: 'A timeline turns disconnected artefacts into a narrative a non-technical audience, like a jury, can follow.' },
    ],
    hints: [
      'Four of these describe real reasons independence matters. One claims a speed benefit that is not actually why this is done, and is usually false besides.',
      'Building a proper cross-source timeline is typically slower than trusting one artefact, not faster.',
      'Ask which option is about SPEED rather than about TRUST.',
    ],
    solution:
      'A, B, D, and E. Independence protects against a single wrong or altered source, agreement ' +
      'across sources strengthens a finding, disagreement is itself informative, and a timeline makes ' +
      'the story followable by a non-technical audience. C is the trap: cross-checking several ' +
      'sources is almost always slower, not faster, than trusting one; the value is in reliability, ' +
      'not speed.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'One option is about saving time rather than about trusting the finding.',
      },
    ],
    debrief:
      'Never let a single artefact carry the whole weight of a finding if a second, independent one ' +
      'can corroborate it. That habit is most of what a timeline is for.',
    practice: [],
  },
  {
    id: 'fx.7.2',
    moduleId: 'fx.7',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'A cleared log is not silence',
    kind: 'multiple-choice',
    goal: 'Recognise that clearing a log generates evidence of its own.',
    prompt: 'An examiner finds that the Windows Security event log was cleared. What does this most likely represent?',
    teach: ANTIFORENSICS_TEACH,
    options: [
      { id: 'a', label: 'Routine disk cleanup with no evidentiary value.' },
      { id: 'b', label: 'A possible anti-forensic action, since clearing the log itself generates a new loggable event that now needs its own explanation.' },
      { id: 'c', label: 'Proof beyond doubt that the system was compromised.' },
      { id: 'd', label: 'Something that only ever happens due to hardware failure.' },
    ],
    hints: [
      'Clearing this particular log is not a silent act. It leaves a record of its own.',
      'The clearing event itself is now a data point in the timeline, worth explaining.',
      'Neither certainty of compromise nor hardware failure is the honest reading here, a cleared log is a lead to follow, not a conclusion.',
    ],
    solution:
      'B. Clearing the Windows Security event log generates its own new event, commonly logged as ' +
      'Event ID 1102, so the clearing is never silent, it becomes a labeled entry in the timeline ' +
      'that itself needs an explanation. C overstates it: a cleared log is suspicious and worth ' +
      'investigating, not proof on its own. D is simply not how log clearing works, it is an ' +
      'administrative action, not a hardware fault, and A dismisses exactly the kind of gap examiners ' +
      'are trained to chase down.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Does clearing this particular log leave a trace of the clearing itself?',
      },
    ],
    debrief:
      'A cleared log is one of the clearest tells in this whole package: the attempt to hide an ' +
      'action leaves a trace of the attempt itself.',
    practice: [],
  },
  {
    id: 'fx.7.3',
    moduleId: 'fx.7',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'Recognised anti-forensic techniques',
    kind: 'multiple-choice',
    goal: 'Separate anti-forensic techniques from honest analyst practice.',
    prompt: 'Which of the following are recognised anti-forensic techniques an examiner watches for? Select all that apply.',
    teach: ANTIFORENSICS_TEACH,
    options: [
      { id: 'a', label: 'Timestomping: deliberately altering a file MACB timestamps to mislead a timeline.' },
      { id: 'b', label: 'Clearing event logs to remove the record of specific actions.' },
      { id: 'c', label: 'Using secure-wipe tools to overwrite deleted data so it cannot be recovered from unallocated space.' },
      { id: 'd', label: 'Keeping detailed, contemporaneous notes of every command an analyst ran.' },
    ],
    hints: [
      'Three of these are things an attacker does to hide activity. One is something an analyst does to document their own work honestly, and belongs on the opposite side of this list.',
      'Anti-forensics is about defeating an investigation, not about supporting one.',
      'Which option would a careful, honest examiner do as part of their own procedure?',
    ],
    solution:
      'A, B, and C. Timestomping, log clearing, and secure wiping are all deliberate attempts to ' +
      'defeat or mislead an investigation. D is the trap and belongs to the opposite category ' +
      'entirely: an analyst keeping careful notes is exactly the kind of transparent documentation ' +
      'this whole package has been building toward, not something to be suspicious of.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option describes an analyst documenting their own work, not an attacker hiding theirs.',
      },
    ],
    debrief:
      'Notice that two very similar-sounding activities, an attacker covering tracks and an analyst ' +
      'documenting their own work, sit on opposite ends of the honesty this field is built around.',
    practice: [],
  },
  {
    id: 'fx.7.4',
    moduleId: 'fx.7',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'Modified before created',
    kind: 'multiple-choice',
    goal: 'Spot the internal inconsistency timestomping leaves behind.',
    prompt: 'A file MODIFIED timestamp is dated a year before its CREATED (Birth) timestamp, on the same volume. What does this most likely indicate?',
    teach: ANTIFORENSICS_TEACH,
    options: [
      { id: 'a', label: 'Normal disk behaviour that needs no explanation.' },
      { id: 'b', label: 'A strong indicator of timestomping, since these timestamps should be internally consistent under ordinary use.' },
      { id: 'c', label: 'A corrupted hash value.' },
      { id: 'd', label: 'A benign side effect of a daylight-saving-time change.' },
    ],
    hints: [
      'Under normal conditions, a file cannot be modified before it exists.',
      'Hashes and timestamps are unrelated mechanisms; one has nothing to do with the other.',
      'Daylight saving shifts an hour, not a year, and shifts all timestamps together rather than reversing their order.',
    ],
    solution:
      'B. A file cannot legitimately be modified a full year before it was created on the same ' +
      'volume, so a MODIFIED time earlier than the BIRTH time is a strong, specific tell that someone ' +
      'deliberately altered one or both timestamps, exactly the kind of inconsistency timestomping ' +
      'produces. C confuses two unrelated mechanisms. D does not fit either the scale of the ' +
      'discrepancy or how a daylight-saving shift actually behaves.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Can a file be modified before it was created, under any ordinary explanation?',
      },
    ],
    debrief:
      'This is the kind of internal inconsistency a timeline exists to surface. The finding is not ' +
      'the timestamps themselves, it is that they contradict each other.',
    practice: [],
  },
  {
    id: 'fx.7.5',
    moduleId: 'fx.7',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'A gap is a finding, not a dead end',
    kind: 'short-answer',
    goal: 'Explain why examiners chase inconsistencies rather than accept them.',
    prompt:
      'In two or three sentences, explain why an examiner treats an inconsistency between two ' +
      'artefact sources, or a gap where a record should be, as a finding worth investigating rather ' +
      'than a dead end.',
    teach: ANTIFORENSICS_TEACH,
    hints: [
      'Say what an inconsistency or a gap can indicate, beyond simple error.',
      'Mention that independent sources are meant to corroborate each other, so disagreement is informative.',
      'A good answer treats the gap or mismatch itself as evidence needing explanation, not as a place the investigation simply stops.',
    ],
    solution:
      'An inconsistency between two independent artefacts, or a gap where a record should exist, is ' +
      'itself a finding because it can indicate tampering, such as timestomping or log clearing, that ' +
      'a single trusted source would never reveal on its own. Independent sources are meant to ' +
      'corroborate each other, so when they disagree, or when an expected record is simply missing, ' +
      'the honest response is to investigate why, since the explanation is often more informative ' +
      'than either source would have been if it had matched cleanly.',
    expectedOutput:
      'An answer explaining that a gap or inconsistency can indicate tampering and needs investigation rather than dismissal.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['inconsistency', 'disagree', 'gap', 'missing', 'contradict'],
          ['tamper', 'timestomp', 'anti-forensic', 'cover', 'clear'],
          ['investigate', 'explain', 'finding', 'worth', 'follow up'],
        ],
        hint:
          'Three ideas: what a gap or inconsistency can indicate, naming a tampering technique, and why it needs following up rather than being dismissed.',
      },
    ],
    debrief:
      'A clean, uncontested record is comfortable. An examiner job is to be suspicious of comfort and ' +
      'curious about contradiction.',
    practice: [],
  },
];

// --- Module fx.8: reports and testimony ---------------------------------------

const MODULE_FX_8: Exercise[] = [
  {
    id: 'fx.8.1',
    moduleId: 'fx.8',
    packageId: 'forensics-foundations',
    order: 1,
    title: 'What makes a report survive challenge',
    kind: 'multiple-choice',
    goal: 'Identify the practices that make a report defensible.',
    prompt: 'What makes a forensic report likely to survive challenge in court? Select all that apply.',
    teach: REPORT_TEACH,
    options: [
      { id: 'a', label: 'It documents exactly which tools and versions were used, so another examiner could repeat the work.' },
      { id: 'b', label: 'It separates factual findings, what the data shows, from the analyst interpretation of them.' },
      { id: 'c', label: 'It references the chain of custody and hash values for each piece of evidence discussed.' },
      { id: 'd', label: 'It is written to sound as confident and authoritative as possible, regardless of how strong the underlying finding actually is.' },
      { id: 'e', label: 'Each conclusion traces back to specific evidence, not to the analyst general experience alone.' },
    ],
    hints: [
      'Four of these are things that make a report genuinely defensible. One describes performing confidence rather than earning it.',
      'Tone is not a substitute for documentation, separation of fact from opinion, provenance, or traceability.',
      'A report that sounds certain but cannot show its work has given a challenger something easy to attack.',
    ],
    solution:
      'A, B, C, and E. Reproducible methodology, fact-versus-interpretation separation, documented ' +
      'provenance, and evidence-traced conclusions are what actually hold up. D is the trap: ' +
      'projecting confidence is not the same as having earned it, and a report that leans on tone ' +
      'rather than documentation invites exactly the kind of challenge those other four practices are ' +
      'designed to prevent.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'One option describes tone rather than documentation, and tone is not what makes a report defensible.',
      },
    ],
    debrief:
      'A report that reads modestly and documents everything will outlast one that reads persuasively ' +
      'and documents nothing.',
    practice: [],
  },
  {
    id: 'fx.8.2',
    moduleId: 'fx.8',
    packageId: 'forensics-foundations',
    order: 2,
    title: 'Answering "could you be wrong"',
    kind: 'multiple-choice',
    goal: 'Recognise the honest, defensible response under cross-examination.',
    prompt: 'During testimony, an expert witness is asked whether their method could be wrong. Which response best reflects good practice?',
    teach: REPORT_TEACH,
    options: [
      { id: 'a', label: 'Insist the method is infallible and cannot be wrong.' },
      { id: 'b', label: 'Explain the method known limitations and error rate honestly, and why it was still the appropriate method for this evidence.' },
      { id: 'c', label: 'Refuse to answer, since the question undermines the case.' },
      { id: 'd', label: 'Deflect by citing years of general experience instead of addressing the specific method used.' },
    ],
    hints: [
      'A method with no acknowledged limitations is not more credible, it is less believable.',
      'Honesty about a known error rate is a sign of a defensible methodology, not a weakness in it.',
      'General experience is not a substitute for answering a specific, methodological question.',
    ],
    solution:
      'B. Acknowledging a method real limitations and known error rate, while explaining why it was ' +
      'still the right tool for this evidence, is exactly the kind of answer that survives scrutiny, ' +
      'because it treats the limitation as already accounted for rather than as something to hide. A ' +
      'invites easy rebuttal the moment any limitation is shown. C looks evasive and damages ' +
      'credibility more than an honest limitation ever would. D avoids the actual question.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which response treats a known limitation as already accounted for, rather than as something to hide?',
      },
    ],
    debrief:
      'The witnesses who hold up under cross-examination are usually the ones who already said the ' +
      'hard part out loud before anybody asked.',
    practice: [],
  },
  {
    id: 'fx.8.3',
    moduleId: 'fx.8',
    packageId: 'forensics-foundations',
    order: 3,
    title: 'The questions a methodology has to survive',
    kind: 'multiple-choice',
    goal: 'Name the real pillars a methodology is judged against.',
    prompt: 'Which of the following are among the questions a forensic methodology needs to survive under close scrutiny, of the kind associated with the Daubert standard? Select all that apply.',
    teach: REPORT_TEACH,
    options: [
      { id: 'a', label: 'Has this method been tested, and is there a known error rate?' },
      { id: 'b', label: 'Has it been subject to peer review, or is it generally accepted in the field?' },
      { id: 'c', label: 'Could another qualified examiner reproduce the finding from the same evidence and documentation?' },
      { id: 'd', label: 'Is the examiner personal certainty about the conclusion, on its own, sufficient?' },
    ],
    hints: [
      'Three of these are genuine questions examiners are trained to expect and answer honestly. One asks whether pure confidence is enough, and the answer to that one is no, which is why it does not belong on this list.',
      'Testing, peer review or acceptance, and reproducibility are the three real pillars.',
      'Personal certainty is exactly what these questions exist to look past.',
    ],
    solution:
      'A, B, and C are the real questions: testing and error rate, peer review or general acceptance, ' +
      'and reproducibility by another examiner. D is the trap, phrased to look like a fourth ' +
      'legitimate question, but the honest answer to it is no, personal certainty alone is never ' +
      'sufficient, which is precisely why the other three questions exist in the first place.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'One option asks whether pure confidence is enough on its own. It is not, so it does not belong with the real pillars.',
      },
    ],
    debrief:
      'These three questions are worth having ready before ever taking a stand, not composing for the ' +
      'first time under cross-examination.',
    practice: [],
  },
  {
    id: 'fx.8.4',
    moduleId: 'fx.8',
    packageId: 'forensics-foundations',
    order: 4,
    title: 'Why "I am sure" is not enough',
    kind: 'multiple-choice',
    goal: 'Explain the reproducibility standard in your own understanding.',
    prompt: 'Why is "I am sure" not, by itself, an acceptable basis for a forensic conclusion in court?',
    teach: REPORT_TEACH,
    options: [
      { id: 'a', label: 'Because expressing any certainty is never allowed.' },
      { id: 'b', label: 'Because a conclusion needs to be reproducible from documented methodology, not merely asserted, so another examiner working from the same record could reach the same finding.' },
      { id: 'c', label: 'Because judges generally distrust confident witnesses.' },
      { id: 'd', label: 'Because only written reports matter, and spoken testimony carries no weight.' },
    ],
    hints: [
      'The issue is not confidence itself, it is what stands behind the confidence.',
      'A conclusion needs to be checkable by someone else, using the same documented steps.',
      'This has nothing to do with a general dislike of confidence, and nothing to do with written versus spoken evidence.',
    ],
    solution:
      'B. The standard a forensic conclusion has to meet is reproducibility: another qualified ' +
      'examiner, working from the same evidence and the same documented methodology, should be able ' +
      'to reach the same finding. "I am sure" names a feeling, not a method, and cannot be checked by ' +
      'anyone else, which is exactly the gap documentation and reproducible methodology exist to ' +
      'close. A, C, and D all misdiagnose the actual requirement.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'What standard does a conclusion actually have to meet, beyond how it feels to the examiner?',
      },
    ],
    debrief:
      'Certainty is not the enemy here. Certainty with nothing reproducible behind it is.',
    practice: [],
  },
  {
    id: 'fx.8.5',
    moduleId: 'fx.8',
    packageId: 'forensics-foundations',
    order: 5,
    title: 'What survives cross-examination',
    kind: 'short-answer',
    goal: 'State what a report needs, and why confidence alone falls short.',
    prompt:
      'In two or three sentences, describe what a forensic report needs in order to withstand ' +
      'cross-examination, and explain why an examiner confidence alone is not enough.',
    teach: REPORT_TEACH,
    hints: [
      'Name at least two things a defensible report documents: methodology, tools and versions, chain of custody, or traceability to specific evidence.',
      'Then explain what confidence alone is missing.',
      'A good answer names documented, reproducible methodology and explains that confidence cannot be independently checked the way documentation can.',
    ],
    solution:
      'A forensic report needs to document the exact tools, versions, and methodology used, reference ' +
      'the chain of custody and hash values for the evidence involved, and trace every conclusion ' +
      'back to specific evidence rather than to the analyst general experience, so that another ' +
      'qualified examiner could reproduce the finding from the record alone. An examiner confidence ' +
      'is not enough on its own because it cannot be checked by anyone else: only documented, ' +
      'reproducible methodology can be tested, challenged, and confirmed independently, which is the ' +
      'actual standard a conclusion has to meet.',
    expectedOutput:
      'An answer naming documented, reproducible methodology and explaining why confidence alone cannot be independently checked.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['methodology', 'tools', 'version', 'document', 'chain of custody', 'hash'],
          ['reproduc', 'another examiner', 'repeat', 'independently'],
          ['confidence', 'certainty', 'sure', 'alone', 'not enough', 'cannot be checked'],
        ],
        hint:
          'Three ideas: what a defensible report documents, why that makes it reproducible, and why confidence alone cannot be checked the same way.',
      },
    ],
    debrief:
      'This closes the loop on the whole package: every rule about volatility, hashing, and custody ' +
      'exists so that, at the end, a report can say exactly this and mean it.',
    practice: [],
  },
];

export const FORENSICS_FOUNDATIONS: LearningPackage = {
  id: 'forensics-foundations',
  order: 18,
  title: 'Forensics Foundations',
  summary:
    'How evidence is recovered and preserved so it holds up: the order of volatility, hashing ' +
    'before you touch, chain of custody, and why a shortcut destroys the thing it was meant to save.',
  outcomes: [
    'Capture evidence in order of volatility, memory before disk.',
    'Say why hashing and chain of custody make evidence trustworthy.',
    'Recognise the shortcuts that make evidence unusable.',
    'Explain why forensics is procedural rather than clever.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'fx.1',
      packageId: 'forensics-foundations',
      order: 1,
      title: 'Evidence that holds up',
      summary: 'Volatility, integrity, custody, and the cost of a shortcut.',
      exercises: [
        {
          id: 'fx.1.1',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 1,
          title: 'What to capture first',
          kind: 'multiple-choice',
          goal: 'Put the order of volatility in the right direction.',
          prompt:
            'You arrive at a running, compromised host that is still powered on. Which do you ' +
            'capture first?',
          teach: VOLATILITY_TEACH,
          options: [
            { id: 'a', label: 'A full copy of the hard disk.' },
            { id: 'b', label: 'The contents of memory and the live system state.' },
            { id: 'c', label: 'The installed software list.' },
            { id: 'd', label: 'Pull the power first, to freeze the machine.' },
          ],
          hints: [
            'One of these is gone the instant the machine loses power. That is the one that cannot wait.',
            'The disk persists after shutdown. Memory does not.',
            'Capture fastest-fading first: memory before disk.',
          ],
          solution:
            'B. Memory and live state are the most volatile: they vanish the moment the host is ' +
            'powered off, so they come first. The disk (A) persists and can wait. Pulling the power ' +
            '(D) is the classic mistake, it destroys exactly the volatile evidence you came for.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which of these is destroyed the instant the machine is powered off?',
            },
          ],
          debrief:
            'Order of volatility is the first thing a forensics analyst internalises. Memory holds ' +
            'running processes, network connections, and keys that never touch the disk, and it is ' +
            'gone the moment somebody helpfully switches the machine off.',
          practice: [],
        },
        {
          id: 'fx.1.2',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 2,
          title: 'Hash before you touch',
          kind: 'multiple-choice',
          goal: 'Understand what a hash proves.',
          prompt: 'Why does a forensics analyst hash an artefact before and after handling it?',
          teach: INTEGRITY_TEACH,
          options: [
            { id: 'a', label: 'To compress it so it takes less space.' },
            { id: 'b', label: 'To prove the artefact did not change while it was in their hands.' },
            { id: 'c', label: 'To encrypt it so nobody else can read it.' },
            { id: 'd', label: 'To speed up searching through it.' },
          ],
          hints: [
            'A hash is a fingerprint. Two matching hashes mean the thing did not change.',
            'It is not about size, secrecy, or speed. It is about integrity.',
            'If the before and after hashes match, the analyst can prove they altered nothing.',
          ],
          solution:
            'B. A hash is a fingerprint of the exact bytes. Taking it before and after handling, and ' +
            'showing the two match, proves the artefact was not altered in the analyst hands. It does ' +
            'not compress (A), encrypt (C), or index (D) anything.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'What can two identical hashes, taken before and after, prove?',
            },
          ],
          debrief:
            'Integrity is what makes evidence evidence. A defence lawyer only has to raise the ' +
            'possibility that a file was altered; a matching hash closes that door before it opens.',
          practice: [],
        },
        {
          id: 'fx.1.3',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 3,
          title: 'A gap in custody',
          kind: 'multiple-choice',
          goal: 'See what breaks admissibility.',
          prompt: 'Which of the following is most likely to make otherwise-solid evidence unusable?',
          teach: INTEGRITY_TEACH,
          options: [
            { id: 'a', label: 'A stretch of hours where nobody can say who held the evidence or where it was.' },
            { id: 'b', label: 'The evidence being stored on an encrypted drive.' },
            { id: 'c', label: 'The analyst taking detailed notes at every step.' },
            { id: 'd', label: 'A second analyst reviewing the work.' },
          ],
          hints: [
            'Three of these are good practice. One is a hole in the record.',
            'Chain of custody is an unbroken account of who held the evidence and when.',
            'An unexplained gap in custody is exactly the thing that gets evidence thrown out.',
          ],
          solution:
            'A. A gap where nobody can account for the evidence breaks the chain of custody, and a ' +
            'broken chain lets anyone argue the evidence was tampered with. Encryption (B), careful ' +
            'notes (C), and peer review (D) all strengthen a case rather than weaken it.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint: 'Which option is a hole in the record of who held the evidence?',
            },
          ],
          debrief:
            'Chain of custody is boring and it is everything. The finding can be perfect; if there is ' +
            'an hour nobody can account for, the other side has all the doubt they need.',
          practice: [],
        },
        {
          id: 'fx.1.4',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 4,
          title: 'Shortcuts that destroy evidence',
          kind: 'multiple-choice',
          goal: 'Name the moves that ruin the thing they were meant to save.',
          prompt:
            'Which of these actions would damage or destroy forensic evidence? Select all that apply.',
          teach: EVIDENCE_TEACH,
          options: [
            { id: 'a', label: 'Pulling the power on a live host before capturing memory.' },
            { id: 'b', label: 'Investigating on the original disk instead of a verified copy.' },
            { id: 'c', label: 'Working from a hashed, bit-for-bit image of the disk.' },
            { id: 'd', label: 'Opening files on the suspect system to look around, changing their access times.' },
            { id: 'e', label: 'Recording every step in a contemporaneous log.' },
          ],
          hints: [
            'Three of these change or destroy the evidence. Two are the correct, careful way to work.',
            'Anything done to the ORIGINAL, live or at rest, risks altering it.',
            'A, B, and D all touch the original. C and E are how it is done right.',
          ],
          solution:
            'A, B, and D. Pulling power destroys volatile memory; working on the original disk risks ' +
            'altering it; browsing files on the suspect system changes timestamps that are themselves ' +
            'evidence. C (working from a verified image) and E (logging every step) are exactly the ' +
            'correct procedure.',
          expectedOutput: 'Options A, B, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'd'],
              hint: 'Two options describe working on a safe copy and keeping records. The other three touch the original.',
            },
          ],
          debrief:
            'Every one of these mistakes is easy and well-meant, which is why procedure exists. The ' +
            'analyst who wants to just take a quick look at the live box has already changed it.',
          practice: [],
        },
        {
          id: 'fx.1.5',
          moduleId: 'fx.1',
          packageId: 'forensics-foundations',
          order: 5,
          title: 'Why the order matters',
          kind: 'short-answer',
          goal: 'Put volatility and integrity into your own words.',
          prompt:
            'In two or three sentences, explain the order of volatility, and say why forensics is ' +
            'described as procedural and unforgiving of shortcuts.',
          teach: EVIDENCE_TEACH,
          hints: [
            'Start with what fades fastest and what persists.',
            'Then explain what a shortcut costs: not weaker evidence, but unusable evidence.',
            'Your answer needs both ideas: capture memory before disk, and why a wrong step ruins the evidence.',
          ],
          solution:
            'The order of volatility means capturing the fastest-fading evidence first: memory and ' +
            'live system state, which vanish at power-off, before the disk, which persists. Forensics ' +
            'is procedural because a step done in the wrong order or on the original can alter or ' +
            'destroy evidence, and evidence collected wrongly is not weaker, it is unusable, so the ' +
            'discipline is doing each step correctly and being able to prove it.',
          expectedOutput:
            'An answer naming memory-before-disk volatility and explaining that a wrong step makes ' +
            'evidence unusable rather than merely weaker.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['volatil', 'memory', 'power', 'fades', 'disappear', 'live'],
                ['disk', 'persist', 'first', 'before', 'order'],
                ['unusable', 'inadmiss', 'destroy', 'ruin', 'cannot be used', 'thrown out', 'preserve'],
              ],
              hint:
                'Three ideas: memory is volatile, the disk persists so it comes after, and a wrong ' +
                'step makes evidence unusable rather than just weaker.',
            },
          ],
          debrief:
            'Forensics rewards the patient and punishes the quick. The whole job is being able to ' +
            'stand behind every step, in order, months later, in front of people whose job is to find ' +
            'the one you skipped.',
          practice: [],
        },
      ],
    },
    {
      id: 'fx.2',
      packageId: 'forensics-foundations',
      order: 2,
      title: 'Chain of custody in practice',
      summary: 'What belongs on a custody log, keeping the chain short, and the difference between a real gap and an ordinary storage fact.',
      exercises: MODULE_FX_2,
    },
    {
      id: 'fx.3',
      packageId: 'forensics-foundations',
      order: 3,
      title: 'Hashing and integrity, beyond the basics',
      summary: 'Why tools compute more than one hash, what a mismatch can and cannot tell you, and choosing an algorithm that resists forgery.',
      exercises: MODULE_FX_3,
    },
    {
      id: 'fx.4',
      packageId: 'forensics-foundations',
      order: 4,
      title: 'Host artefacts and what they answer',
      summary: 'Prefetch, Run keys, NTFS timestamps, and browser history: the narrow question each one answers, and the attribution gap none of them close.',
      exercises: MODULE_FX_4,
    },
    {
      id: 'fx.5',
      packageId: 'forensics-foundations',
      order: 5,
      title: 'What only lives in memory',
      summary: 'Running processes, live connections, decrypted keys, and fileless malware: evidence with no disk counterpart, and why that changes the order of capture.',
      exercises: MODULE_FX_5,
    },
    {
      id: 'fx.6',
      packageId: 'forensics-foundations',
      order: 6,
      title: 'Write-blockers and forensic imaging',
      summary: 'Why a write-blocker is used, how a bit-for-bit image differs from a file copy, and why the original stays sealed even after imaging.',
      exercises: MODULE_FX_6,
    },
    {
      id: 'fx.7',
      packageId: 'forensics-foundations',
      order: 7,
      title: 'Timelines and the tells of a scrubbed system',
      summary: 'Why independent sources corroborate a timeline, and the anti-forensic techniques, timestomping, log clearing, wiping, an examiner learns to spot.',
      exercises: MODULE_FX_7,
    },
    {
      id: 'fx.8',
      packageId: 'forensics-foundations',
      order: 8,
      title: 'Reports and testimony: what survives cross-examination',
      summary: 'What makes a report defensible, how to answer a challenge to methodology, and why confidence alone is never enough.',
      exercises: MODULE_FX_8,
    },
  ],
};
