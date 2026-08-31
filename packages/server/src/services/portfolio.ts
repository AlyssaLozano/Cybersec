/**
 * The AI Security portfolio.
 *
 * WHAT THIS IS FOR
 *
 * AI security is new enough that nobody has agreed what a good analyst looks
 * like on paper, and there is no respected certification to point at. So the
 * thing a student can actually show an employer is work: which vulnerability
 * classes they found, against which systems, and what they did about them.
 *
 * THE RULE THIS FILE IS BUILT AROUND: NEVER OVERSTATE IT
 *
 * Everything here is derived from what the platform can genuinely evidence: a
 * passed exercise, an attempt count, a suite that was blocked. Nothing is
 * asserted that the database does not record.
 *
 * And every rendering of it carries `caveat`, which says plainly that these are
 * findings against simulated systems in a training environment. That is not
 * false modesty. A portfolio that reads as though the student breached a real
 * production model is a portfolio that gets them caught out in the first
 * interview, and the honest version is worth more anyway: "I can show you the
 * reasoning that found this" survives questioning, and an inflated claim does
 * not.
 *
 * WHY SEVERITY IS COMPUTED FROM DEPLOYMENT STAGE
 *
 * Because that is the lesson the package teaches, and a portfolio that rated
 * every finding critical would contradict the exercise that taught the student
 * not to. The same bypass is informational against a development build and
 * serious against a production service, and the portfolio reflects that
 * automatically rather than letting anybody talk it up.
 */

import type {
  AiSecurityPortfolio,
  AttackCarrier,
  AttackIntent,
  Check,
  DeploymentStage,
  Exercise,
  FindingSeverity,
  ModelAssessment,
  ModelFinding,
} from '@soc/shared';

import { ALL_EXERCISES, getExercise } from '../content/index.js';
import { modelCard, suite } from './modelLab.js';
import { prisma } from '../db/client.js';

/**
 * Severity from where the system sits.
 *
 * Deliberately coarse. The point is the relationship: production exposure is
 * what makes a finding urgent, not how clever the technique was, and a finer
 * scale would imply a precision this does not have.
 */
const SEVERITY_BY_STAGE: Record<DeploymentStage, FindingSeverity> = {
  production: 'high',
  staging: 'medium',
  development: 'informational',
};

/** The technique an exercise required, read off its own checks. */
function techniqueOf(exercise: Exercise): { intent?: AttackIntent; carrier?: AttackCarrier } {
  for (const check of exercise.checks) {
    if (check.type !== 'probe-bypass') continue;
    if (check.intent || check.carrier) {
      return {
        ...(check.intent ? { intent: check.intent } : {}),
        ...(check.carrier ? { carrier: check.carrier } : {}),
      };
    }
  }
  return {};
}

function requiresBypass(checks: readonly Check[]): boolean {
  return checks.some((check) => check.type === 'probe-bypass');
}

function suiteIdsOf(checks: readonly Check[]): string[] {
  return checks.flatMap((check) => (check.type === 'defence-blocks-suite' ? [check.suiteId] : []));
}

/**
 * Build a student's portfolio from what they have actually passed.
 *
 * Nothing here is stored. It is recomputed on request from progress rows, which
 * means it cannot drift away from the truth and there is no second place a
 * claim could be edited.
 */
export async function portfolioFor(userId: string): Promise<AiSecurityPortfolio> {
  const labExercises = ALL_EXERCISES.filter((exercise) => exercise.kind === 'model-probe');
  const labIds = labExercises.map((exercise) => exercise.id);

  const [progress, attempts] = await Promise.all([
    prisma.exerciseProgress.findMany({
      where: { userId, exerciseId: { in: labIds }, status: 'passed' },
    }),
    prisma.attemptLog.groupBy({
      by: ['exerciseId'],
      where: { userId, exerciseId: { in: labIds }, practiceId: null },
      _count: { _all: true },
    }),
  ]);

  const attemptsById = new Map(attempts.map((row) => [row.exerciseId, row._count._all]));
  const passedIds = new Set(progress.map((row) => row.exerciseId));

  const findings: ModelFinding[] = [];
  const suiteUse = new Map<string, Set<string>>();

  for (const row of progress) {
    const exercise = getExercise(row.exerciseId);
    if (!exercise?.modelId) continue;
    const card = modelCard(exercise.modelId);
    if (!card) continue;

    // Suites the student successfully hardened against, collected as the
    // "tools built" section rather than as findings: blocking a suite is not
    // a vulnerability discovery and should not be presented as one.
    for (const suiteId of suiteIdsOf(exercise.checks)) {
      const used = suiteUse.get(suiteId) ?? new Set<string>();
      used.add(card.name);
      suiteUse.set(suiteId, used);
    }

    // Only the exercises that required getting THROUGH something are findings.
    // A hardening exercise is real work and belongs in the portfolio, but it is
    // not a discovered vulnerability, and conflating the two is exactly the
    // kind of inflation this file exists to avoid.
    if (!requiresBypass(exercise.checks)) continue;

    const { intent, carrier } = techniqueOf(exercise);
    findings.push({
      id: `finding-${exercise.id}`,
      modelId: card.id,
      title: `${exercise.title}: ${card.name} ${card.version}`,
      severity: SEVERITY_BY_STAGE[card.stage],
      intent: intent ?? 'direct-override',
      carrier: carrier ?? 'none',
      // The honest numbers: how many graded submissions it took, and the fact
      // that the passing one worked. Not "15 payloads, 12 succeeded" unless the
      // database says so.
      attempts: attemptsById.get(exercise.id) ?? row.attempts,
      successes: 1,
      description: exercise.goal,
      recommendation: exercise.debrief ?? '',
      foundAt: (row.completedAt ?? row.lastAttemptedAt ?? new Date()).toISOString(),
    });
  }

  // A model counts as assessed once every lab exercise against it has passed.
  // Partial work is real work and is visible in the findings; calling it a
  // completed assessment would not be true.
  const byModel = new Map<string, Exercise[]>();
  for (const exercise of labExercises) {
    if (!exercise.modelId) continue;
    byModel.set(exercise.modelId, [...(byModel.get(exercise.modelId) ?? []), exercise]);
  }

  const assessments: ModelAssessment[] = [];
  for (const [modelId, exercises] of byModel) {
    const card = modelCard(modelId);
    if (!card) continue;
    const done = exercises.filter((exercise) => passedIds.has(exercise.id));
    if (done.length !== exercises.length) continue;

    const modelFindings = findings.filter((finding) => finding.modelId === modelId);
    assessments.push({
      modelId,
      modelName: `${card.name} ${card.version}`,
      assessedAt:
        modelFindings[0]?.foundAt ??
        (progress.find((row) => done.some((e) => e.id === row.exerciseId))?.completedAt ??
          new Date()
        ).toISOString(),
      verdict:
        modelFindings.length === 0
          ? 'approved'
          : card.stage === 'production'
            ? 'hold'
            : 'approved-with-monitoring',
      findingIds: modelFindings.map((finding) => finding.id),
      summary:
        modelFindings.length === 0
          ? `No bypass found on the paths tested. ${card.dailyQueries.toLocaleString()} queries a day.`
          : `${modelFindings.length} confirmed bypass ${
              modelFindings.length === 1 ? 'class' : 'classes'
            } against a ${card.stage} system taking ${card.dailyQueries.toLocaleString()} queries a day.`,
    });
  }

  const suites = [...suiteUse.entries()]
    .map(([suiteId, models]) => {
      const found = suite(suiteId);
      return found
        ? {
            id: suiteId,
            title: found.title,
            payloadCount: found.payloads.length,
            usedAgainst: [...models],
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    findings,
    assessments,
    suites,
    caveat:
      'Every finding above is against a simulated model in a training environment. The systems are ' +
      'fictional, the deployments are a rule engine rather than a language model, and nothing here ' +
      'was discovered against a real product. What it does evidence is the reasoning: which class ' +
      'of technique each system was weak against, why, and what control would close it. Present it ' +
      'that way. An interviewer who asks "walk me through how you found this" is asking about the ' +
      'reasoning, and the reasoning is the part that transfers.',
  };
}
