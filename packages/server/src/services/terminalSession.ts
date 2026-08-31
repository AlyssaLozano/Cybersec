/**
 * Terminal sessions: one per student per exercise.
 *
 * A session owns the student's filesystem overlay, working directory, and
 * scrollback, all persisted after every command so closing the browser mid
 * exercise loses nothing.
 *
 * The whole engine runs here on the server. That is a security decision, not a
 * convenience one: if filesystem state lived in the browser, a student could
 * edit it and pass any exercise.
 */

import type {
  Evaluation,
  Exercise,
  RunCommandResponse,
  ScrollbackEntry,
  TerminalSessionState,
} from '@soc/shared';

import { getExercise } from '../content/index.js';
import { evaluate } from '../content/validate.js';
import { prisma } from '../db/client.js';
import { HttpError } from '../http.js';
import { runLine, runLines } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay, type Overlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { recordAttempt, recordPracticeAttempt } from './progress.js';

const HOME = '/home/student';

/** Cap the stored scrollback so a long session cannot grow a row without bound. */
const MAX_SCROLLBACK = 400;

/** Reject absurdly long input before it reaches the parser. */
const MAX_INPUT_LENGTH = 2_000;

function parseOverlay(json: string): Overlay {
  try {
    const parsed = JSON.parse(json) as Partial<Overlay>;
    return {
      writes: parsed.writes ?? {},
      deletes: Array.isArray(parsed.deletes) ? parsed.deletes : [],
    };
  } catch {
    // A corrupt overlay should cost the student their scratch files, not lock
    // them out of the exercise.
    return emptyOverlay();
  }
}

function parseScrollback(json: string): ScrollbackEntry[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as ScrollbackEntry[]) : [];
  } catch {
    return [];
  }
}

function requireExercise(exerciseId: string): Exercise {
  const exercise = getExercise(exerciseId);
  if (!exercise) {
    throw new HttpError(404, 'not_found', `No exercise with id "${exerciseId}".`);
  }
  return exercise;
}

/**
 * Fetch a session, creating it on first visit.
 *
 * Creation runs the exercise's setup commands, which put the student in the
 * state the prompt assumes -- "you have been dropped into /var/log" only works
 * if they actually have been.
 */
export async function openSession(
  userId: string,
  exerciseId: string,
): Promise<TerminalSessionState> {
  const exercise = requireExercise(exerciseId);

  const existing = await prisma.terminalSession.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } },
  });

  if (existing) {
    return {
      exerciseId,
      cwd: existing.cwd,
      scrollback: parseScrollback(existing.scrollbackJson),
    };
  }

  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  const setup = exercise.setup ?? [];
  const result = runLines(setup, { vfs, machine: MACHINE, cwd: HOME });

  const scrollback: ScrollbackEntry[] = [
    {
      kind: 'system',
      text: `Connected to rmg-web-02 as student. Type "help" to list available commands.`,
    },
  ];

  await prisma.terminalSession.create({
    data: {
      userId,
      exerciseId,
      cwd: result.cwd,
      overlayJson: JSON.stringify(vfs.getOverlay()),
      scrollbackJson: JSON.stringify(scrollback),
    },
  });

  return { exerciseId, cwd: result.cwd, scrollback };
}

export interface RunOptions {
  /** Grade against this practice drill instead of the exercise itself. */
  practiceId?: string;
  /**
   * Grade even though the exercise is already passed.
   *
   * Set when the student explicitly chose "try again". Without it, a student who
   * passes a navigation exercise with `cd ..` and then types `pwd` to look around
   * would be told they got it wrong.
   */
  regrade?: boolean;
}

/**
 * Run one command in a student's session and grade the attempt.
 *
 * Re-attempting is always allowed, and can only ever help: a passed exercise
 * never reverts to failed, so practising something again carries no risk.
 */
export async function runCommand(
  userId: string,
  exerciseId: string,
  input: string,
  options: RunOptions = {},
): Promise<RunCommandResponse> {
  const exercise = requireExercise(exerciseId);

  const drill = options.practiceId
    ? (exercise.practice.find((item) => item.id === options.practiceId) ?? null)
    : null;
  if (options.practiceId && !drill) {
    throw new HttpError(404, 'not_found', `No practice drill "${options.practiceId}".`);
  }

  if (input.length > MAX_INPUT_LENGTH) {
    throw new HttpError(400, 'validation_failed', 'That command is too long.');
  }

  await openSession(userId, exerciseId);
  const record = await prisma.terminalSession.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } },
  });
  if (!record) throw new HttpError(500, 'internal_error', 'Session vanished mid-request.');

  const vfs = new Vfs(BASE_IMAGE, parseOverlay(record.overlayJson), HOME);
  const result = runLine(input, { vfs, machine: MACHINE, cwd: record.cwd });

  // Grade against the state *after* the command ran.
  const progress = await prisma.exerciseProgress.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } },
  });
  const alreadyPassed = progress?.status === 'passed';

  const attempt = {
    input,
    output: result.output,
    exitCode: result.exitCode,
    cwd: result.cwd,
    vfs,
  };

  let evaluation: Evaluation | undefined;

  if (drill && input.trim() !== '') {
    // A drill is graded against its own checks, and never touches the parent
    // exercise's progress -- practice must not be able to change a pass.
    const drillProgress = await prisma.practiceProgress.findUnique({
      where: { userId_practiceId: { userId, practiceId: drill.id } },
    });
    const attemptNumber = (drillProgress?.attempts ?? 0) + 1;

    evaluation = evaluate({ ...exercise, checks: drill.checks }, attempt, attemptNumber);
    await recordPracticeAttempt(userId, exerciseId, drill.id, input, evaluation);
  } else if (input.trim() !== '' && (!alreadyPassed || options.regrade)) {
    const attemptNumber = (progress?.attempts ?? 0) + 1;
    evaluation = evaluate(exercise, attempt, attemptNumber);
    await recordAttempt(userId, exercise, input, evaluation);
  }

  const scrollback = parseScrollback(record.scrollbackJson);
  scrollback.push({ kind: 'command', text: input, cwd: record.cwd });
  if (result.output !== '') {
    scrollback.push({ kind: 'output', text: result.output, exitCode: result.exitCode });
  }

  await prisma.terminalSession.update({
    where: { id: record.id },
    data: {
      cwd: result.cwd,
      overlayJson: JSON.stringify(vfs.getOverlay()),
      scrollbackJson: JSON.stringify(scrollback.slice(-MAX_SCROLLBACK)),
    },
  });

  return {
    input,
    output: result.output,
    exitCode: result.exitCode,
    cwd: result.cwd,
    ...(evaluation ? { evaluation } : {}),
  };
}

/**
 * Discard a session and start the exercise over.
 *
 * Deliberately does NOT reset progress: attempts already made still count, so
 * resetting is a way to clear a messy filesystem, not to launder a score.
 */
export async function resetSession(userId: string, exerciseId: string): Promise<TerminalSessionState> {
  requireExercise(exerciseId);
  await prisma.terminalSession.deleteMany({ where: { userId, exerciseId } });
  return openSession(userId, exerciseId);
}
