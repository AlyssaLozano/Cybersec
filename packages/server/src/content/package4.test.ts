/**
 * Golden tests for Package 4: Networking Basics.
 *
 * Standalone rather than folded into catalogue.test.ts, because Package 4 is not
 * registered in the catalogue yet — another session owns index.ts while this was
 * written. Everything here validates PACKAGE_4 directly, so the content is proven
 * correct before it is wired in, and the catalogue tests will cover it as soon as
 * it is.
 *
 * The important test is the same one as for Packages 1 and 2: every exercise's
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
import { PACKAGE_4 } from './package4.js';
import { evaluate } from './validate.js';

const HOME = '/home/student';

const EXERCISES: Exercise[] = PACKAGE_4.modules.flatMap((module) => module.exercises);

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

describe('Package 4 structure', () => {
  it('has 15 exercises across 3 modules', () => {
    expect(PACKAGE_4.modules.length).toBe(3);
    expect(EXERCISES.length).toBe(15);
  });

  it('uses the 4.x id space, since 3.x belongs to Security Incident Concepts', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.id, `${exercise.id} is outside the 4.x space`).toMatch(/^4\.\d+\.\d+$/);
      expect(exercise.packageId).toBe('4');
    }
  });

  it('gives every exercise a unique id', () => {
    const ids = EXERCISES.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every drill a unique id', () => {
    const ids = EXERCISES.flatMap((exercise) => exercise.practice.map((drill) => drill.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(75);
  });

  it('satisfies the content rules the catalogue validator enforces', () => {
    for (const exercise of EXERCISES) {
      expect(exercise.teach.concept.length, exercise.id).toBeGreaterThan(40);
      expect(exercise.hints.length, exercise.id).toBeGreaterThan(0);
      expect(exercise.checks.length, exercise.id).toBeGreaterThan(0);
      expect(exercise.debrief, exercise.id).toBeTruthy();
      expect(exercise.practice.length, `${exercise.id} has no drills`).toBe(5);
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

describe('every Package 4 solution passes its own checks', () => {
  for (const exercise of EXERCISES) {
    it(`${exercise.id} — ${exercise.title}`, () => {
      const evaluation = attempt(exercise.solution, exercise.setup, exercise, exercise.checks);
      expect(evaluation.failed.map((f) => `${f.type}: ${f.hint}`)).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('every Package 4 drill passes its own checks', () => {
  const drills: Array<{ exercise: Exercise; drill: PracticeItem }> = EXERCISES.flatMap((exercise) =>
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
  for (const exercise of EXERCISES) {
    for (const example of exercise.teach.examples ?? []) {
      it(`${exercise.id}: ${example.command}`, () => {
        const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
        const result = runLine(example.command, { vfs, machine: MACHINE, cwd: HOME });
        expect(result.output).not.toContain('command not found');
        expect(result.output).not.toContain('bash:');
      });
    }

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
    // Package 1 with no way to see it. If this stops working, the arc is broken.
    const finale = EXERCISES.find((exercise) => exercise.id === '4.2.6')!;
    const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
    const result = runLine(finale.solution, { vfs, machine: MACHINE, cwd: HOME });

    expect(result.output).toContain('198.51.100.60');
    expect(result.output).toContain('curl');
    expect(result.output).not.toContain('127.0.0.1');
  });

  it('identifies the noisy monitoring host by reverse lookup', () => {
    // 4.3.2 turns the loudest thing in auth.log into a ticket for another team.
    const exercise = EXERCISES.find((e) => e.id === '4.3.2')!;
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
