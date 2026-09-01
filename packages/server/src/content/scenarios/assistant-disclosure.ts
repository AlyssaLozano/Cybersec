/**
 * Scenario 59: Ask It Nicely.
 *
 * A member service assistant read one member's case notes to a different
 * member, because it was asked politely and nothing checked.
 *
 * WHAT THIS TEACHES
 *
 * That an AI incident is usually an authorisation incident wearing a new hat.
 *
 * Nothing was jailbroken here. There is no clever phrasing in the transcript,
 * no hidden instruction, no attempt to talk the model out of its rules. The
 * caller said a case reference out loud and the assistant looked it up, which
 * is exactly what it was built to do. The failure is one layer down: the
 * assistant was given a lookup tool that runs under its own service identity,
 * that identity can read every case in the society, and the member's identity
 * was never passed to it. The conversation was authenticated. The tool call was
 * not.
 *
 * WHY THAT IS THE LESSON AND NOT THE MODEL
 *
 * A floor that treats this as a model problem goes looking for a prompt to fix,
 * and a prompt is not a permission. The same weakness returns the next time
 * anybody attaches a tool, with better wording in front of it. The question to
 * carry away from this incident and ask about every assistant thereafter is not
 * what the model was told, it is what the model is able to do, and on whose
 * behalf.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'ask-it-nicely';

export const ASK_IT_NICELY: Scenario = {
  id: ID,
  title: 'Ask It Nicely',
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 14:20 at Fenmarch Credit Union. A member has complained that the online assistant read ' +
    'out somebody else\'s complaint file to them.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'ai-security',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'The assistant returned a case file that does not belong to the signed-in member',
      detail:
        'A monitoring rule compares the case reference in an assistant response against the cases ' +
        'linked to the signed-in member. At 13:52 the assistant returned the full text of case ' +
        'FCU-88214 in a session signed in as member 41773, who has no connection to that case. The ' +
        'rule was added in July after a similar complaint and has fired twice since. Both previous ' +
        'firings were staff sessions.',
      source: 'member assistant',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'alert-queue',
      summary: 'The transcript contains no trick, just a case number',
      detail:
        'The session transcript reads: member asks about a complaint, assistant asks for a ' +
        'reference, member gives FCU-88214, assistant retrieves and summarises it, then reads out ' +
        'the complainant name, address, account balance and the handler notes. There is no unusual ' +
        'phrasing anywhere in the conversation, no instruction aimed at the assistant, and no ' +
        'attempt to change its behaviour. Fourteen exchanges, all in plain English.',
      source: 'session 41773-8812',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 260,
      surface: 'process-tree',
      summary: 'The lookup tool ran as the assistant, not as the member',
      detail:
        'The tool call chain shows the assistant invoking case_lookup with a single argument, the ' +
        'case reference. The call executes under the service principal svc-fen-assistant. The ' +
        'signed-in member identity appears nowhere in the call, in the query the tool issues, or ' +
        'in the response filtering. The tool returns whatever case matches the reference it is ' +
        'given.',
      source: 'svc-fen-assistant',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 400,
      surface: 'cloud-audit',
      summary: 'The assistant service principal can read every case in the society',
      detail:
        'svc-fen-assistant holds the CaseReader role on the complaints platform, which grants read ' +
        'access to all 61,400 case records. The role was granted at build time in April so that ' +
        'the assistant could answer questions about any member\'s own case. No row-level or ' +
        'member-scoped restriction exists on it. Nine other service principals hold the same role, ' +
        'all of them batch reporting jobs.',
      source: 'complaints platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 540,
      surface: 'raw-log',
      summary: 'Three hundred and forty mismatches in thirty days, and almost all are fine',
      detail:
        'Across thirty days the assistant returned a case whose owner differs from the signed-in ' +
        'identity 340 times. 338 of those are staff sessions, where handlers look up member cases ' +
        'all day and the mismatch is correct behaviour. Two are member sessions: the one at 13:52 ' +
        'today, and one on 19 August in a different member session that was never reported.',
      source: 'member assistant',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 680,
      surface: 'network-flow',
      summary: 'Seven sessions in an hour from one address, each with a different reference',
      detail:
        'The member 41773 sessions today all originate from 198.51.100.88. Seven sessions were ' +
        'opened between 13:31 and 14:04, each asking about a single case reference, and the ' +
        'references run FCU-88210, 88212, 88214, 88216, 88218, 88220, 88222. Five returned nothing ' +
        'because no case exists at those references. Two returned a case. The member has used the ' +
        'assistant four times in the previous six months.',
      source: '198.51.100.88',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 820,
      surface: 'alert-queue',
      summary: 'The assistant handles most member contact and the queue behind it is four days deep',
      detail:
        'The assistant answers around 3,100 member conversations a day, which is 62 per cent of ' +
        'all member contact. Turning it off routes all of that to a telephone team of eleven ' +
        'people currently running a four day callback backlog. The complaints platform is also ' +
        'used by 90 staff handlers who rely on the same lookup tool through a separate interface.',
      source: 'member operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 960,
      surface: 'alert-queue',
      summary: 'The assistant refused a request for a spouse\'s account earlier the same day',
      detail:
        'At 11:14 a member asked the assistant about her husband\'s account balance. The assistant ' +
        'declined, explained that it can only discuss accounts held by the signed-in member, and ' +
        'offered the joint mandate process. The rule fired because the response text contained an ' +
        'account number: the member\'s own, quoted back to her. No other member\'s data appears in ' +
        'the session.',
      source: 'session 39104-2277',
      claimedSeverity: 'medium',
    },
  ],
};

export const ASK_IT_NICELY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Fenmarch gave its member assistant a case lookup tool in April so it could answer questions about a member\'s own complaint.',
    'The tool takes a case reference and returns the case. It runs under the assistant\'s own service principal, which holds a role granting read access to all 61,400 cases, and the signed-in member\'s identity is never passed to it.',
    'So the conversation is authenticated and the tool call is not. Anybody who can name a case reference can have that case read to them.',
    'Between 13:31 and 14:04 somebody signed in as member 41773, from 198.51.100.88, opened seven sessions and asked about seven case references two apart: 88210, 88212, 88214, 88216, 88218, 88220, 88222.',
    'Five references matched nothing. Two returned a case, including FCU-88214, whose complainant name, address, balance and handler notes were read out.',
    'Nothing was jailbroken. The transcript contains fourteen plain English exchanges, no unusual phrasing and no instruction aimed at the assistant. It did what it was built to do.',
    'The same mismatch has occurred 340 times in thirty days, of which 338 are staff handlers doing their jobs correctly and one is an unreported member session on 19 August.',
    'The fix is not a prompt. The member identity has to reach the tool, and the tool has to filter on it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ai-security', 'ir-lead'],
      why:
        'One member\'s file read to another member is a personal data disclosure whether or not ' +
        'anybody meant it, and that makes it an incident from the first minute rather than a bug ' +
        'report. The rule fired twice before and both were staff sessions, which is the detail ' +
        'that matters: staff looking up member cases is the whole of their job, and this is a ' +
        'member session, which is a different thing entirely. Declare it and get somebody onto how ' +
        'the assistant is able to do this at all. Do not reach for the tuning ticket, which is the ' +
        'reflex when a rule has mostly fired on benign activity; the rule is working and it has ' +
        'just caught the thing it was written for.',
      standIn:
        'The assistant read case FCU-88214 to a member with no connection to it. That is a personal ' +
        'data disclosure and I am declaring on it. The rule has fired twice before and both were ' +
        'staff sessions, which is normal because that is what handlers do all day. This is a ' +
        'member session, which is not. The rule is fine, it just caught what it was built for.',
      commandOptions: [
        { command: "awk -F, '$3==\"CASE_MISMATCH\" {print $1, $4, $5}' /var/log/assistant/alerts.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep FCU-88214 /var/log/assistant/responses.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fen-assistant', ...STATUS_CHECK },
        { command: 'cat /var/log/assistant/responses.log', ...DUMP_ALL },
        { command: 'grep -c CASE_MISMATCH /var/log/assistant/alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether the earlier firings of this rule were member sessions or staff sessions.',
      guidance:
        'The rule has fired before and been fine. Ask what is different about this one.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.tune', 'act.reset-password'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'Read the transcript expecting to find the trick, and then notice that there is not one. ' +
        'Fourteen exchanges in plain English, no unusual phrasing, no instruction aimed at the ' +
        'assistant, no attempt to talk it out of anything. A member asked about a complaint, the ' +
        'assistant asked for a reference, the member gave one, and the assistant looked it up and ' +
        'read out a name, an address, a balance and the handler\'s notes. That absence is the most ' +
        'important observation available in the first five minutes, because it decides where the ' +
        'rest of the hour goes. If there were a jailbreak here the answer would be about wording. ' +
        'There is not, so the assistant did precisely what it was built to do, and the fault is ' +
        'underneath it in something that was supposed to say no and did not exist.',
      standIn:
        'I went in looking for the trick and there is not one. Fourteen exchanges, plain English, ' +
        'nothing aimed at the assistant, nobody trying to talk it out of its rules. He asked about ' +
        'a complaint, it asked for a reference, he gave one, and it read out a name, an address, a ' +
        'balance and the handler notes. That absence is the finding. There is no wording to fix ' +
        'here. It did what we built it to do and something underneath it should have said no.',
      commandOptions: [
        { command: 'jq -r \'.turns[] | "\\(.role): \\(.text)"\' /var/log/assistant/sessions/41773-8812.json', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A2 -B2 "FCU-88214" /var/log/assistant/sessions/41773-8812.json', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fen-assistant', ...STATUS_CHECK },
        { command: 'cat /var/log/assistant/sessions/41773-8812.json', ...DUMP_ALL },
        { command: 'grep -c turns /var/log/assistant/sessions/41773-8812.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the whole conversation and look for anything aimed at changing the assistant\'s ' +
        'behaviour.',
      guidance:
        'Before you assume somebody tricked it, read what they actually said.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['cloud-security', 'mitigation-specialist'],
      why:
        'The whole incident is in one line of a tool call. case_lookup takes one argument, the case ' +
        'reference, and executes as svc-fen-assistant. The signed-in member appears nowhere: not ' +
        'in the call, not in the query the tool issues, not in any filtering of the response. So ' +
        'the conversation is authenticated and the tool call is anonymous, and everything the ' +
        'assistant can reach, any member talking to it can reach. This is the sentence worth ' +
        'carrying to every assistant this society ever builds: a model with a tool has the tool\'s ' +
        'permissions and not the user\'s, unless somebody deliberately made it otherwise. Nobody ' +
        'did here, and it would not have looked like an omission in April, because at build time ' +
        'the tool works perfectly for every honest question.',
      standIn:
        'The whole thing is one tool call. case_lookup takes one argument, the case reference, and ' +
        'runs as the assistant\'s own service principal. The member identity is not in the call, ' +
        'not in the query, not in the filtering. The conversation is authenticated and the tool ' +
        'call is anonymous. A model with a tool has the tool\'s permissions, not the user\'s, ' +
        'unless somebody deliberately made it otherwise, and nobody did. It works perfectly for ' +
        'every honest question, which is why it shipped.',
      commandOptions: [
        { command: 'jq \'.tool_calls[] | {name, args, principal}\' /var/log/assistant/sessions/41773-8812.json', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "case_lookup" /var/log/assistant/toolcalls.log | tail -5', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status case-api', ...STATUS_CHECK },
        { command: 'cat /var/log/assistant/toolcalls.log', ...DUMP_ALL },
        { command: 'grep -c case_lookup /var/log/assistant/toolcalls.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what arguments the lookup tool was given, and which identity it ran as.',
      guidance:
        'The conversation knew who the member was. Ask whether the tool did.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.reset-password', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Sixty-one thousand four hundred cases, readable by the thing on the front page of the ' +
        'website. The role was granted in April for a reason that sounded right at the time, which ' +
        'was that the assistant needed to answer questions about any member\'s own case, and the ' +
        'word that did the damage in that sentence is own. Nothing enforces it. Note who else ' +
        'holds this role: nine batch reporting jobs, which run overnight, reach no member and have ' +
        'no conversation attached. The assistant was given a back office permission and put in ' +
        'front of the public, and that mismatch is the thing to look for the next time anybody ' +
        'proposes a tool. Resist revoking the role on the spot, because ninety staff handlers work ' +
        'through the same platform and the blast radius of a hasty revocation is the complaints ' +
        'function.',
      standIn:
        'Sixty-one thousand four hundred cases, all readable by the assistant. The role was granted ' +
        'in April so it could answer questions about a member\'s own case, and nothing anywhere ' +
        'enforces the word own. The other nine principals with this role are overnight batch ' +
        'reports that never talk to anybody. We gave a back office permission to something ' +
        'standing in the front window. Not revoking it yet, ninety handlers use that platform.',
      commandOptions: [
        { command: "awk -F, '$3==\"CaseReader\" {print $1, $2}' /var/log/iam/role-assignments.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "svc-fen-assistant" /var/log/iam/role-assignments.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status complaints-api', ...STATUS_CHECK },
        { command: 'cat /var/log/iam/role-assignments.csv', ...DUMP_ALL },
        { command: 'az role assignment delete --assignee svc-fen-assistant --role CaseReader', ...MUTATE },
      ],
      commandNudge:
        'Find out how many cases that service principal can read, and who else holds the same ' +
        'role.',
      guidance:
        'Ask what the assistant is allowed to see, not what it was asked to see.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Three hundred and forty is a frightening number and it is almost entirely innocent, which ' +
        'is why the count is only half the work. Splitting it by session type is the whole ' +
        'exercise: 338 are staff handlers, for whom looking at a member\'s case while not being ' +
        'that member is the job, and two are member sessions. Reporting 340 disclosures would be ' +
        'wrong by a factor of a hundred and seventy and would be believed, because it is a big ' +
        'number from a log. The genuinely useful finding is the second member session, on 19 ' +
        'August, which nobody reported and which nobody has looked at. It moves the earliest known ' +
        'date back thirteen days, and that date is what the notification conversation with legal ' +
        'actually turns on.',
      standIn:
        'Three hundred and forty mismatches in thirty days, and 338 of them are staff handlers ' +
        'doing exactly their job. Two are member sessions. If I had reported the 340 it would have ' +
        'been believed and it would have been wrong by a factor of a hundred and seventy. The ' +
        'useful part is the second member session on 19 August that nobody reported. That moves ' +
        'our earliest date back thirteen days, which is the bit legal will care about.',
      commandOptions: [
        { command: "awk -F, '$3==\"CASE_MISMATCH\" {print $6}' /var/log/assistant/alerts.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"CASE_MISMATCH\" && $6==\"MEMBER\"' /var/log/assistant/alerts.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'grep -c CASE_MISMATCH /var/log/assistant/alerts.csv', ...COUNT_ONLY },
        { command: 'cat /var/log/assistant/alerts.csv', ...DUMP_ALL },
        { command: 'systemctl status fen-assistant', ...STATUS_CHECK },
      ],
      commandNudge:
        'Count the mismatches, then split them by whether the session was a member or a member of ' +
        'staff.',
      guidance:
        'A big number is not a finding until you know what is in it. Break it up.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1213'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The references settle intent, and they settle it without anybody having to guess at a ' +
        'state of mind. 88210, 88212, 88214, 88216, 88218, 88220, 88222: seven sessions in ' +
        'thirty-three minutes from one address, walking a counter two at a time. Five of them ' +
        'matched nothing at all, which is the part that removes the innocent reading, because a ' +
        'member chasing their own complaint has one reference and gets it right. Somebody trying ' +
        'references until one works is not confused, they are looking. Set against an account that ' +
        'has used the assistant four times in six months, this is the difference between a member ' +
        'who was accidentally shown something and a person who came to find out what they could ' +
        'get. Say it in exactly those terms and stop: this establishes deliberate enumeration and ' +
        'it does not establish who was at the keyboard.',
      standIn:
        'Look at the references. 88210, 88212, 88214, 88216, 88218, 88220, 88222. Seven sessions in ' +
        'thirty-three minutes from one address, walking a counter two at a time, and five of them ' +
        'matched nothing. A member chasing their own complaint has one reference and gets it ' +
        'right. This account has used the assistant four times in six months. That is deliberate ' +
        'enumeration, and it does not tell us who was typing.',
      commandOptions: [
        { command: "awk -F, '$2==\"41773\" {print $1, $5}' /var/log/assistant/sessions.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -o "FCU-[0-9]*" /var/log/assistant/responses.log | sort -u', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.88', ...WRONG_TARGET },
        { command: 'cat /var/log/assistant/sessions.csv', ...DUMP_ALL },
        { command: 'grep -c 41773 /var/log/assistant/sessions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every case reference that member asked about today, in order.',
      guidance:
        'One wrong lookup is a mistake. Ask how many they tried.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'collection',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.revoke-key', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Two obvious moves and both are worse than they look. Turning the assistant off pushes ' +
        '3,100 conversations a day onto eleven people who are already four days behind, and a ' +
        'four day callback backlog at a credit union means members who cannot resolve a payment ' +
        'problem. Revoking CaseReader breaks ninety staff handlers who reach the same platform ' +
        'through a different interface, which stops the complaints function outright. The narrow ' +
        'move is neither: disable the single case_lookup tool while leaving the assistant running, ' +
        'so it keeps answering the balance, payment and branch questions that are most of its ' +
        'traffic and simply cannot fetch a case any more. Put a compensating control on the gap it ' +
        'leaves, which is a handoff to the callback queue for case questions only, and that is a ' +
        'small number of conversations rather than all of them. The real fix is not a containment ' +
        'and should not be rushed tonight: the member identity has to be passed into the tool and ' +
        'the tool has to filter on it, which is a change to the platform and needs testing against ' +
        'the ninety handlers who depend on the unfiltered behaviour. Write the rollback for the ' +
        'tool being disabled before touching it, and say plainly what is left undone: every other ' +
        'tool this assistant holds still runs as the assistant, and nobody has looked at those ' +
        'yet.',
      standIn:
        'Do not turn it off and do not revoke the role. Off means 3,100 conversations a day onto ' +
        'eleven people who are four days behind. Revoking breaks ninety handlers on the same ' +
        'platform. Narrow move: disable the case_lookup tool only. The assistant keeps answering ' +
        'balances, payments and branch questions, which is most of its traffic, and it simply ' +
        'cannot fetch a case. Case questions hand off to the callback queue, which is a small ' +
        'number rather than all of them. The real fix is passing member identity into the tool and ' +
        'filtering on it, and that is a platform change I am not rushing tonight with ninety ' +
        'handlers relying on the current behaviour. Rollback written first. Left undone: every ' +
        'other tool this thing holds still runs as itself and nobody has looked at those.',
      commandNudge:
        'Find out what else the assistant answers, and whether the case tool is most of it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: [],
      why:
        'The assistant behaving correctly, alerted on because the rule looks for an account number ' +
        'in a response and found one. A member asked about her husband\'s balance, the assistant ' +
        'declined, explained that it can only discuss accounts held by the signed-in member, and ' +
        'pointed her at the joint mandate process, which is exactly right. The account number in ' +
        'the response is her own, quoted back to her, and no other member\'s data appears anywhere ' +
        'in the session. Close it. It is worth noticing what this row shows about the assistant, ' +
        'because it is easy to leave today believing the thing is simply unsafe: where a rule ' +
        'exists it follows it, and it refused a request far more sympathetic than the one that ' +
        'succeeded. The difference between the two sessions is not the assistant\'s judgement, it ' +
        'is that one request went through a check and the other went through a tool.',
      standIn:
        'This one is the assistant getting it right. She asked about her husband\'s balance, it ' +
        'declined, explained it can only discuss the signed-in member\'s accounts, and offered the ' +
        'joint mandate process. The account number that tripped the rule is her own, read back to ' +
        'her. Closing it. And worth saying: it refused a much more sympathetic request than the ' +
        'one that worked. The difference is not its judgement, it is that one went through a check ' +
        'and the other went through a tool.',
      commandOptions: [
        { command: 'jq -r \'.turns[] | "\\(.role): \\(.text)"\' /var/log/assistant/sessions/39104-2277.json', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -o "FCU-[0-9]*\\|[0-9]\\{8\\}" /var/log/assistant/sessions/39104-2277.json | sort -u', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fen-assistant', ...STATUS_CHECK },
        { command: 'cat /var/log/assistant/sessions/39104-2277.json', ...DUMP_ALL },
        { command: 'grep -c account /var/log/assistant/sessions/39104-2277.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whose account number is actually in that response.',
      guidance:
        'The rule found an account number. Ask whose it was.',
    },
  ],
};
