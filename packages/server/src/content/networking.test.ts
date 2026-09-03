/**
 * Golden tests for Networking Basics.
 *
 * Standalone rather than folded into catalogue.test.ts, because this content was
 * written while another session owned index.ts. Everything here validates
 * NETWORKING directly, so the package is proven correct independently of how it
 * is wired in.
 *
 * The important test is the same one as for Linux Fundamentals and Log Analysis: every exercise's
 * own claimed answer, and every practice drill's, is run through the real
 * terminal engine and must satisfy that exercise's own checks. An exercise whose
 * solution fails its own grader is a trap.
 */

import { describe, expect, it } from 'vitest';

import type { Check, Exercise, PracticeItem } from '@soc/shared';

import { runLine, runLines } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { NETWORKING } from './networking.js';
import { evaluate } from './validate.js';

const HOME = '/home/student';

const EXERCISES: Exercise[] = NETWORKING.modules.flatMap((module) => module.exercises);

/**
 * The exercises whose solution is a command.
 *
 * Modules 4.1 to 4.5 are entirely terminal work, which is why this file
 * originally ran every solution through the shell. The packet modules added
 * multiple-choice and short-answer exercises, and running "A, C and E" through
 * bash asserts nothing except that bash does not recognise it.
 */
const TERMINAL: Exercise[] = EXERCISES.filter((exercise) => exercise.kind === 'terminal');

function attempt(solution: string, setup: string[] | undefined, exercise: Exercise, checks: Check[]) {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  let cwd = HOME;

  if (setup && setup.length > 0) {
    cwd = runLines(setup, { vfs, machine: MACHINE, cwd }).cwd;
  }

  const steps = solution.split('\n').map((line) => line.trim()).filter(Boolean);
  let result = runLine(steps[0]!, { vfs, machine: MACHINE, cwd });
  cwd = result.cwd;
  for (const step of steps.slice(1)) {
    result = runLine(step, { vfs, machine: MACHINE, cwd });
    cwd = result.cwd;
  }

  return evaluate(
    { ...exercise, checks },
    { input: solution, output: result.output, exitCode: result.exitCode, cwd: result.cwd, vfs },
    1,
  );
}

describe('Networking structure', () => {
  it('has 55 exercises across 11 modules', () => {
    expect(NETWORKING.modules.length).toBe(11);
    expect(EXERCISES.length).toBe(55);
  });

  it('covers packet analysis as well as host sockets', () => {
    // Modules 4.1 to 4.5 ask the host what it is doing. 4.6 to 4.9 read the
    // wire, which is the half that still works when the host is lying.
    const packetModules = NETWORKING.modules.filter((module) =>
      ['4.6', '4.7', '4.8', '4.9'].includes(module.id),
    );
    expect(packetModules).toHaveLength(4);
    expect(packetModules.flatMap((module) => module.exercises)).toHaveLength(20);
  });

  it('uses the net.x id space, so no other package can collide with it', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.id, `${exercise.id} is outside the net.x space`).toMatch(/^net\.\d+\.\d+$/);
      expect(exercise.packageId).toBe('networking');
    }
  });

  it('gives every exercise a unique id', () => {
    const ids = EXERCISES.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every drill a unique id', () => {
    const ids = EXERCISES.flatMap((exercise) => exercise.practice.map((drill) => drill.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(200);
  });

  it('satisfies the content rules the catalogue validator enforces', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.teach.concept.length, exercise.id).toBeGreaterThan(40);
      expect(exercise.hints.length, exercise.id).toBeGreaterThan(0);
      expect(exercise.checks.length, exercise.id).toBeGreaterThan(0);
      expect(exercise.debrief, exercise.id).toBeTruthy();
    }
  });

  it('gives every terminal exercise a full set of drills', () => {
    // Repetition is the point of a drill and it only makes sense where there is
    // a command to repeat. A multiple-choice question has one answer, and five
    // ways of asking it is a quiz, not practice.
    for (const exercise of TERMINAL) {
      expect(exercise.practice.length, `${exercise.id} has ${exercise.practice.length} drills`).toBe(5);
    }
  });

  it('gives every drill in the packet modules a teaching note', () => {
    // The rest of the package predates PracticeTeach. New drills carry it, and
    // this stops the next batch quietly going back to bare prompts.
    const packetDrills = NETWORKING.modules
      .filter((module) => ['4.6', '4.7', '4.8', '4.9'].includes(module.id))
      .flatMap((module) => module.exercises)
      .flatMap((exercise) => exercise.practice);

    expect(packetDrills.length).toBeGreaterThan(0);
    for (const drill of packetDrills) {
      expect(drill.teach?.note, `${drill.id} has no teaching note`).toBeTruthy();
    }
  });

  it('only uses RFC 5737 documentation ranges for external addresses', () => {
    // Internal 10.x is fine; anything external must be non-routable by design.
    const allowed = /^(10\.|127\.|192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|0\.0\.0\.0|255\.)/;
    const offenders: string[] = [];

    for (const exercise of EXERCISES) {
      const text = [exercise.prompt, exercise.solution, exercise.expectedOutput, exercise.debrief ?? '']
        .concat(exercise.practice.map((drill) => `${drill.prompt} ${drill.solution}`))
        .join(' ');
      for (const match of text.matchAll(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)) {
        if (!allowed.test(match[0]) && !/^[0-9]\.[0-9]/.test(match[0])) {
          offenders.push(`${exercise.id}: ${match[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('every Networking solution passes its own checks', () => {
  for (const exercise of TERMINAL) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const evaluation = attempt(exercise.solution, exercise.setup, exercise, exercise.checks);
      expect(evaluation.failed.map((f) => `${f.type}: ${f.hint}`)).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('every Networking drill passes its own checks', () => {
  const drills: Array<{ exercise: Exercise; drill: PracticeItem }> = TERMINAL.flatMap((exercise) =>
    exercise.practice.map((drill) => ({ exercise, drill })),
  );

  for (const { exercise, drill } of drills) {
    it(`${drill.id}`, () => {
      const evaluation = attempt(drill.solution, drill.setup, exercise, drill.checks);
      expect(evaluation.failed.map((f) => `${f.type}: ${f.hint}`)).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('worked examples are runnable and are never the answer', () => {
  // Only for terminal exercises. On a multiple-choice exercise `command` holds
  // the thing being illustrated -- a packet line, a pair of counters -- which is
  // the same convention Incident Triage uses, and none of it is shell input.
  for (const exercise of TERMINAL) {
    for (const example of exercise.teach.examples ?? []) {
      it(`${exercise.id}: ${example.command}`, () => {
        const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
        const result = runLine(example.command, { vfs, machine: MACHINE, cwd: HOME });
        expect(result.output).not.toContain('command not found');
        expect(result.output).not.toContain('bash:');
      });
    }

  }

  for (const exercise of EXERCISES) {
    it(`${exercise.id} does not give away its own answer`, () => {
      const normalise = (text: string) => text.trim().replace(/\s+/g, ' ');
      const examples = (exercise.teach.examples ?? []).map((e) => normalise(e.command));
      expect(examples).not.toContain(normalise(exercise.solution));
    });
  }
});

describe('the package tells its intended story', () => {
  it('ends by surfacing the exfiltration connection', () => {
    // 4.2.6 is the payoff: the connection has been in the simulated host since
    // Linux Fundamentals with no way to see it. If this stops working, the arc is broken.
    const finale = EXERCISES.find((exercise) => exercise.id === 'net.2.6')!;
    const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
    const result = runLine(finale.solution, { vfs, machine: MACHINE, cwd: HOME });

    expect(result.output).toContain('198.51.100.60');
    expect(result.output).toContain('curl');
    expect(result.output).not.toContain('127.0.0.1');
  });

  it('identifies the noisy monitoring host by reverse lookup', () => {
    // 4.3.2 turns the loudest thing in auth.log into a ticket for another team.
    const exercise = EXERCISES.find((e) => e.id === 'net.3.2')!;
    const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
    const result = runLine(exercise.solution, { vfs, machine: MACHINE, cwd: HOME });
    expect(result.output).toContain('rmg-monitor-01');
  });

  it('shows that the database is not reachable from the network', () => {
    // The lesson in 4.2.2's debrief depends on postgres being loopback-bound.
    const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
    const result = runLine('netstat -tln', { vfs, machine: MACHINE, cwd: HOME });
    expect(result.output).toContain('127.0.0.1:5432');
    expect(result.output).not.toContain('0.0.0.0:5432');
  });
});
