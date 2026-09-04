/**
 * The content catalogue.
 *
 * Exercises live in code rather than the database so they are version
 * controlled, reviewable in a pull request, and type-checked. The database
 * stores only a student's progress *against* these ids.
 *
 * Adding a package means writing its module file and appending it to PACKAGES;
 * nothing else in the system changes.
 */

import type {
  AnswerFormat,
  Exercise,
  ExerciseKind,
  LearningModule,
  LearningPackage,
  PackageSummary,
  PracticeItem,
} from '@soc/shared';

import { queueForStudent } from '../services/alerts.js';
import { pointWithAnswers } from '../services/incidents.js';
import { analysisFor } from '../services/copilot.js';
import { modelCard, suite } from '../services/modelLab.js';

import { LINUX_FUNDAMENTALS } from './linux-fundamentals.js';
import { LOG_ANALYSIS } from './log-analysis.js';
import { INCIDENT_TRIAGE } from './incident-triage.js';
import { NETWORKING } from './networking.js';
import { INCIDENT_RESPONSE } from './incident-response.js';
import { AI_FOUNDATIONS } from './ai-foundations.js';
import { AI_SECURITY } from './ai-security.js';
import { RED_TEAM_FOUNDATIONS } from './red-team-foundations.js';
import { SOC_FOUNDATIONS } from './soc-foundations.js';
import { BLUE_TEAM_FOUNDATIONS } from './blue-team-foundations.js';
import { AI_SECURITY_PATHWAY } from './ai-security-pathway.js';
import { RISK_GOVERNANCE_PATHWAY } from './risk-governance-pathway.js';
import { OT_SECURITY_FOUNDATIONS } from './ot-security-foundations.js';
import { IDENTITY_FOUNDATIONS } from './identity-foundations.js';
import { HUMAN_RISK_FOUNDATIONS } from './human-risk-foundations.js';
import { MALWARE_ANALYSIS } from './malware-analysis.js';
import { THREAT_HUNTER_FOUNDATIONS } from './threat-hunter-foundations.js';
import { FORENSICS_FOUNDATIONS } from './forensics-foundations.js';
import { DETECTION_ENGINEERING_FOUNDATIONS } from './detection-engineering-foundations.js';
import { THREAT_INTEL_FOUNDATIONS } from './threat-intel-foundations.js';
import { ACTIVE_DIRECTORY_FOUNDATIONS } from './active-directory-foundations.js';
import { WINDOWS_AD_FOUNDATIONS } from './windows-ad-foundations.js';
import { HELPDESK_TICKETING_FOUNDATIONS } from './helpdesk-ticketing-foundations.js';
import { SIEM_FUNDAMENTALS } from './siem-fundamentals.js';
import { APPSEC_FOUNDATIONS } from './appsec-foundations.js';
import { CLOUD_SECURITY_FOUNDATIONS } from './cloud-security-foundations.js';
import { SECURITY_ENGINEERING_FOUNDATIONS } from './security-engineering-foundations.js';

/**
 * NAMING: every package id is a NAME, never a number.
 *
 * Numbers collide the moment two people add content at the same time, which is
 * exactly what happened while Networking and Incident Response were being
 * written in parallel -- both reached for "the next one". The original four
 * packages were migrated off numeric ids on 2026-08-31, progress rows and all,
 * so there is no longer a numbered half of the catalogue to collide with.
 *
 * `order` still controls where a package appears. The id is just an id.
 */
export const PACKAGES: LearningPackage[] = [
  LINUX_FUNDAMENTALS,
  LOG_ANALYSIS,
  INCIDENT_TRIAGE,
  NETWORKING,
  INCIDENT_RESPONSE,
  AI_FOUNDATIONS,
  AI_SECURITY,
  RED_TEAM_FOUNDATIONS,
  SOC_FOUNDATIONS,
  BLUE_TEAM_FOUNDATIONS,
  AI_SECURITY_PATHWAY,
  RISK_GOVERNANCE_PATHWAY,
  MALWARE_ANALYSIS,
  OT_SECURITY_FOUNDATIONS,
  IDENTITY_FOUNDATIONS,
  HUMAN_RISK_FOUNDATIONS,
  THREAT_HUNTER_FOUNDATIONS,
  FORENSICS_FOUNDATIONS,
  DETECTION_ENGINEERING_FOUNDATIONS,
  THREAT_INTEL_FOUNDATIONS,
  ACTIVE_DIRECTORY_FOUNDATIONS,
  WINDOWS_AD_FOUNDATIONS,
  HELPDESK_TICKETING_FOUNDATIONS,
  SIEM_FUNDAMENTALS,
  APPSEC_FOUNDATIONS,
  CLOUD_SECURITY_FOUNDATIONS,
  SECURITY_ENGINEERING_FOUNDATIONS,
];

/** Every exercise across every package, in curriculum order. */
export const ALL_EXERCISES: Exercise[] = PACKAGES.flatMap((pkg) =>
  pkg.modules.flatMap((module) => module.exercises),
);

const EXERCISE_BY_ID = new Map(ALL_EXERCISES.map((exercise) => [exercise.id, exercise]));
const PACKAGE_BY_ID = new Map(PACKAGES.map((pkg) => [pkg.id, pkg]));

/**
 * Fail loudly at startup if the catalogue is malformed.
 *
 * A duplicate exercise id would silently corrupt progress tracking, because
 * progress rows are keyed by id. Better to refuse to boot than to award a pass
 * against the wrong exercise.
 */
function validateCatalogue(): void {
  const seen = new Set<string>();
  for (const exercise of ALL_EXERCISES) {
    if (seen.has(exercise.id)) {
      throw new Error(`Duplicate exercise id "${exercise.id}" in the content catalogue.`);
    }
    seen.add(exercise.id);

    if (exercise.checks.length === 0) {
      throw new Error(`Exercise "${exercise.id}" has no checks, so it could never be failed.`);
    }
    // A student who cannot already do the task must have something to read.
    if (!exercise.teach?.concept) {
      throw new Error(`Exercise "${exercise.id}" has no teaching material.`);
    }
    if (exercise.hints.length === 0) {
      throw new Error(`Exercise "${exercise.id}" has no hints, leaving a stuck student nowhere to go.`);
    }
    if (exercise.kind === 'multiple-choice' && (exercise.options?.length ?? 0) === 0) {
      throw new Error(`Multiple-choice exercise "${exercise.id}" has no options.`);
    }

    if (exercise.kind === 'alert-triage') {
      if (!exercise.queueId) {
        throw new Error(`Triage exercise "${exercise.id}" names no alert queue.`);
      }
      const queue = queueForStudent(exercise.queueId);
      if (!queue) {
        throw new Error(
          `Triage exercise "${exercise.id}" points at alert queue "${exercise.queueId}", which does not exist.`,
        );
      }
      // An expected alert id that is not in the queue would fail every student
      // for a content bug. This is the failure mode the "compute, never
      // hardcode" rule exists to prevent, so it is checked at boot.
      const present = new Set(queue.alerts.map((alert) => alert.id));
      const referenced = exercise.checks.flatMap((check) =>
        check.type === 'triage-selection'
          ? check.alertIds
          : check.type === 'triage-justifies'
            ? [check.alertId]
            : check.type === 'copilot-override'
              ? check.alertIds
              : [],
      );
      for (const alertId of referenced) {
        if (!present.has(alertId)) {
          throw new Error(
            `Exercise "${exercise.id}" expects alert "${alertId}", which is not in queue "${exercise.queueId}". ` +
              'The alert corpus and the exercise content have drifted apart.',
          );
        }
      }

      // A copilot-override check naming an alert whose analysis is now sound
      // would demand that a student disagree with correct advice. That is the
      // opposite of the lesson, and it is what happens when the copilot corpus
      // is regenerated without revisiting the exercises, so it is caught here.
      for (const check of exercise.checks) {
        if (check.type !== 'copilot-override') continue;
        for (const alertId of check.alertIds) {
          const analysis = analysisFor(alertId);
          if (!analysis) {
            throw new Error(
              `Exercise "${exercise.id}" expects the copilot to have analysed alert "${alertId}", and it has not. ` +
                'Re-run: npm run gen:copilot --workspace @soc/server',
            );
          }
        }
      }
    }

    /*
     * Copilot checks outside a triage exercise would grade a student on their
     * use of a panel the exercise never shows them -- an unpassable exercise,
     * and a content bug rather than a user error.
     */
    const copilotChecks = exercise.checks.filter(
      (check) =>
        check.type === 'copilot-consulted' ||
        check.type === 'copilot-override' ||
        check.type === 'copilot-collaboration',
    );
    if (copilotChecks.length > 0 && exercise.kind !== 'alert-triage') {
      throw new Error(
        `Exercise "${exercise.id}" grades copilot collaboration but is a "${exercise.kind}" exercise, ` +
          'which never shows the copilot. Copilot checks belong on alert-triage exercises.',
      );
    }
    if (copilotChecks.length > 0 && !exercise.copilotEnabled) {
      throw new Error(
        `Exercise "${exercise.id}" grades copilot collaboration but does not enable the copilot, ` +
          'so no student could ever satisfy those checks.',
      );
    }

    if (exercise.kind === 'incident-decision') {
      if (!exercise.decisionPointId) {
        throw new Error(`Decision exercise "${exercise.id}" names no decision point.`);
      }
      const point = pointWithAnswers(exercise.decisionPointId);
      if (!point) {
        throw new Error(
          `Decision exercise "${exercise.id}" points at "${exercise.decisionPointId}", which does not exist.`,
        );
      }
      // An option id that is not on the decision point would fail every student
      // for a content bug -- the same failure the "derive, never hardcode" rule
      // exists to prevent, so it is caught at boot rather than by a learner.
      const present = new Set(point.options.map((option) => option.id));
      const referenced = exercise.checks.flatMap((check) =>
        check.type === 'decision-selects' ||
        check.type === 'decision-avoids' ||
        check.type === 'decision-orders'
          ? check.optionIds
          : [],
      );
      for (const optionId of referenced) {
        if (!present.has(optionId)) {
          throw new Error(
            `Exercise "${exercise.id}" expects option "${optionId}", which is not offered at ` +
              `"${exercise.decisionPointId}". The decision point and the exercise have drifted apart.`,
          );
        }
      }
      // An ordering check against a point that is not sequenced would ask the
      // student to order options that include ones they were meant to leave out.
      if (exercise.checks.some((check) => check.type === 'decision-orders') && !point.ordered) {
        throw new Error(
          `Exercise "${exercise.id}" grades an ordering, but decision point ` +
            `"${exercise.decisionPointId}" is not marked as sequenced.`,
        );
      }
    }

    /*
     * Decision checks outside a decision exercise would grade a student on a
     * console they were never shown. Same reasoning as the copilot guard above.
     */
    const decisionChecks = exercise.checks.filter(
      (check) =>
        check.type === 'decision-selects' ||
        check.type === 'decision-avoids' ||
        check.type === 'decision-orders' ||
        check.type === 'decision-justifies',
    );
    if (decisionChecks.length > 0 && exercise.kind !== 'incident-decision') {
      throw new Error(
        `Exercise "${exercise.id}" grades an incident decision but is a "${exercise.kind}" exercise, ` +
          'which never shows the incident console.',
      );
    }

    if (exercise.kind === 'model-probe') {
      if (!exercise.modelId) {
        throw new Error(`Model Lab exercise "${exercise.id}" names no model under test.`);
      }
      if (!modelCard(exercise.modelId)) {
        throw new Error(
          `Model Lab exercise "${exercise.id}" points at model "${exercise.modelId}", which does not exist.`,
        );
      }
      // A drill may target a different deployment. One naming a model that does
      // not exist would probe nothing and score nothing, so it is caught here
      // rather than by whoever tries the drill.
      for (const drill of exercise.practice) {
        if (drill.modelId && !modelCard(drill.modelId)) {
          throw new Error(
            `Practice drill "${drill.id}" points at model "${drill.modelId}", which does not exist.`,
          );
        }
      }
      // A suite id that does not resolve would score zero blocked out of zero
      // total and pass every student silently -- the same class of failure the
      // triage corpus check above exists to catch, so it is caught at boot.
      for (const check of exercise.checks) {
        if (check.type !== 'defence-blocks-suite') continue;
        if (!suite(check.suiteId)) {
          throw new Error(
            `Exercise "${exercise.id}" grades against attack suite "${check.suiteId}", which does not exist.`,
          );
        }
      }
    }

    /*
     * Model Lab checks outside a model-probe exercise would grade a student on a
     * lab they were never shown. Same reasoning as the copilot and decision
     * guards above.
     */
    const probeChecks = exercise.checks.filter(
      (check) =>
        check.type === 'probe-bypass' ||
        check.type === 'probe-carrier-variety' ||
        check.type === 'probe-all-blocked' ||
        check.type === 'probe-budget' ||
        check.type === 'defence-blocks-suite' ||
        check.type === 'defence-cost-budget' ||
        check.type === 'defence-includes',
    );
    if (probeChecks.length > 0 && exercise.kind !== 'model-probe') {
      throw new Error(
        `Exercise "${exercise.id}" grades Model Lab probes but is a "${exercise.kind}" exercise, ` +
          'which never opens the lab.',
      );
    }
  }
}
validateCatalogue();

export function getPackage(packageId: string): LearningPackage | null {
  return PACKAGE_BY_ID.get(packageId) ?? null;
}

export function getExercise(exerciseId: string): Exercise | null {
  return EXERCISE_BY_ID.get(exerciseId) ?? null;
}

export function getModule(moduleId: string): LearningModule | null {
  for (const pkg of PACKAGES) {
    const found = pkg.modules.find((module) => module.id === moduleId);
    if (found) return found;
  }
  return null;
}

/** Exercise ids in the order a student works through them. */
export function orderedExerciseIds(packageId?: string): string[] {
  const packages = packageId ? PACKAGES.filter((pkg) => pkg.id === packageId) : PACKAGES;
  return packages.flatMap((pkg) => pkg.modules.flatMap((module) => module.exercises.map((e) => e.id)));
}

/** The exercise after this one, or null at the end of the curriculum. */
export function nextExerciseId(exerciseId: string): string | null {
  const ids = orderedExerciseIds();
  const index = ids.indexOf(exerciseId);
  if (index === -1 || index === ids.length - 1) return null;
  return ids[index + 1]!;
}

/** Lightweight package list for menus, without shipping every exercise body. */
export function packageSummaries(): PackageSummary[] {
  return PACKAGES.map((pkg) => ({
    id: pkg.id,
    order: pkg.order,
    title: pkg.title,
    summary: pkg.summary,
    outcomes: pkg.outcomes,
    prerequisites: pkg.prerequisites,
    moduleCount: pkg.modules.length,
    exerciseCount: pkg.modules.reduce((sum, module) => sum + module.exercises.length, 0),
  }));
}

/**
 * How much text an exercise's free-text answer may be, and what shape.
 *
 * DERIVED FROM THE RUBRIC RATHER THAN AUTHORED
 *
 * The bound has to scale with what is being asked: "was this a false positive"
 * needs two sentences, the incident timeline in ir.4.3 needs six ideas in
 * order. Deriving the ceiling from the number of concepts the rubric requires
 * keeps those in proportion automatically, and means the 24 existing free-text
 * exercises became bounded without anyone hand-authoring 24 limits that would
 * then drift from the rubrics they are supposed to match.
 *
 * An exercise can still override with `answerFormat` where the default is
 * wrong. Nothing here reveals content -- only length and shape.
 */
/**
 * The answer surface a practice drill needs, which is not always its parent's.
 *
 * A drill on a multiple-choice exercise is usually free text: the parent offers
 * four options and the drill asks the student to work the same thing out and say
 * it, which removes the guess floor that makes five multiple-choice repetitions
 * worth so little. That only works if the client renders a text box for the
 * drill rather than the parent's checkboxes.
 *
 * Before this existed the client rendered the parent's surface for every drill,
 * so those drills could be submitted only as option ticks and their
 * `answer-mentions` checks never saw any text. They were unpassable, and their
 * tests still went green because a test can hand the grader an answer that the
 * interface gives a student no way to type.
 */
export function practiceKindOf(drill: PracticeItem, exercise: Exercise): ExerciseKind {
  const types = new Set(drill.checks.map((check) => check.type));

  if (types.has('answer-mentions') || types.has('answer-numeric')) return 'short-answer';
  if (types.has('choice-equals')) return 'multiple-choice';
  if (drill.modelId !== undefined) return 'model-probe';
  for (const type of types) {
    if (type.startsWith('probe-') || type.startsWith('defence-')) return 'model-probe';
    if (type.startsWith('triage-')) return 'alert-triage';
  }
  // Anything grading output, a command or the filesystem is terminal work.
  return exercise.kind === 'terminal' ? 'terminal' : 'terminal';
}

/** The length and shape guidance for a drill, computed from its own checks. */
export function practiceAnswerFormatFor(
  drill: PracticeItem,
  exercise: Exercise,
): AnswerFormat | undefined {
  return answerFormatFor({ ...exercise, checks: drill.checks });
}

export function answerFormatFor(exercise: Exercise): AnswerFormat | undefined {
  if (exercise.answerFormat) return exercise.answerFormat;

  const groups = exercise.checks.flatMap((check) =>
    check.type === 'answer-mentions' || check.type === 'decision-justifies'
      ? check.conceptGroups
      : [],
  );
  if (groups.length === 0) {
    // A purely numeric answer has no concept groups to size a paragraph
    // around, but it still deserves a shape hint: without one, a student has
    // no way to know that formatting is forgiving before they submit.
    if (exercise.checks.some((check) => check.type === 'answer-numeric')) {
      return {
        maxChars: 40,
        minChars: 1,
        shape: 'A number. Currency symbols, commas, and decimal places are all fine to include.',
      };
    }
    return undefined;
  }

  const ideas = groups.length;
  return {
    // Roughly a sentence of room per idea, plus a little to connect them.
    maxChars: 240 + 160 * ideas,
    // Enough that a bare noun cannot satisfy a multi-part question.
    minChars: 40 + 20 * ideas,
    shape:
      ideas <= 2
        ? 'One or two sentences. Make a claim and say why.'
        : `${ideas <= 4 ? 'Two to four' : 'Four to six'} sentences covering ${ideas} distinct points. Compression is the skill here -- an essay is not a better answer.`,
  };
}

/**
 * The student-facing view of an exercise.
 *
 * Teaching material and hints ship freely -- they are the point, and withholding
 * them from someone who has never used a shell would just make them guess.
 *
 * The solution and the check definitions do NOT ship. Sending checks would hand
 * over the answer key, and the solution is released only on an explicit request
 * or after a pass, so a student always knows when they chose to be told.
 */
export function toStudentView(exercise: Exercise) {
  return {
    id: exercise.id,
    moduleId: exercise.moduleId,
    packageId: exercise.packageId,
    order: exercise.order,
    title: exercise.title,
    kind: exercise.kind,
    goal: exercise.goal,
    prompt: exercise.prompt,
    teach: exercise.teach,
    /** Only the count ships up front; the text arrives one hint at a time. */
    hintCount: exercise.hints.length,
    options: exercise.options,
    /**
     * Which alert queue to load, for triage exercises.
     *
     * Safe to ship: the queue it names is what an operator would see in a real
     * console. The ground truth lives in a separate structure that no route
     * assembles -- see services/alerts.ts.
     */
    queueId: exercise.queueId,
    /** Which decision point to load, for incident-decision exercises. */
    decisionPointId: exercise.decisionPointId,
    /**
     * Whether to offer the copilot panel.
     *
     * Safe to ship, and it has to: the client cannot render an affordance it is
     * not told about. What the copilot actually says still arrives one alert at
     * a time, from a route that records the asking.
     */
    copilotEnabled: exercise.copilotEnabled ?? false,
    /**
     * Which model to load into the Model Lab, for model-probe exercises.
     *
     * Safe to ship: it names a card, and a `ModelCard` has no field capable of
     * carrying a defence. The answer key -- which controls that deployment
     * actually has -- lives on `ModelDeployment`, which no route assembles.
     * See services/modelLab.ts.
     */
    modelId: exercise.modelId,
    /**
     * Which attack suite the student's defences will be measured against.
     *
     * Also safe, and shipped deliberately: the payloads are ones a tester would
     * write themselves, and knowing them reveals nothing about which controls
     * stop them. Hiding the suite would mean grading somebody against a test set
     * they were not allowed to see.
     */
    suiteId: exercise.suiteId,
    /**
     * Whether this exercise lets the student rebuild the deployment.
     *
     * DERIVED from the checks rather than declared as a content field, because a
     * declared flag can drift: an exercise that grades a defence set but forgot
     * to set the flag would be unpassable, and one that sets it without grading
     * anything would offer a control panel that does nothing. Neither is
     * possible if the flag is a consequence of the grading.
     *
     * Note that it is NOT the same question as "has a suite". Exercise ais.4.4
     * asks the student to deploy a control and then break their own fix with
     * their own payloads, so it configures defences and names no suite.
     */
    defencesConfigurable: exercise.checks.some(
      (check) =>
        check.type === 'defence-blocks-suite' ||
        check.type === 'defence-cost-budget' ||
        check.type === 'defence-includes',
    ),
    /**
     * How long a free-text answer may be, and the shape asked for.
     *
     * Safe to ship, and it has to ship: a limit the browser cannot see is a
     * limit the student discovers by having their answer rejected after
     * writing it. States length and shape only, never content.
     */
    answerFormat: answerFormatFor(exercise),
  };
}
