/**
 * The AI Security Pathway's hands-on exercises, run against the real engine.
 *
 * Same rule as everywhere: every stated solution is executed and graded by the
 * evaluator a student's answer goes through, because a derived count can still
 * measure something subtly different from what the student's command measures.
 *
 * The last block is different in kind. It asserts that the decoys are still
 * decoys: that the contractor feed carries more innocent rows than poisoned
 * ones, that genuinely urgent tickets outnumber fake ones, and that the busiest
 * account is not simply the attacker. Those relationships are what make the
 * exercises investigations rather than greps, and a change to the generator
 * could quietly remove them while every count still passed.
 */

import { describe, expect, it } from 'vitest';

import type { Exercise } from '@soc/shared';

import { AI_SECURITY_PATHWAY } from './ai-security-pathway.js';
import { evaluate } from './validate.js';
import { runScript } from '../terminal/script.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

function attemptOf(input: string) {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  const result = runScript(input, { vfs, machine: MACHINE, cwd: HOME });
  return { input, output: result.output, exitCode: result.exitCode, cwd: result.cwd, vfs };
}

const EXERCISES: Exercise[] = AI_SECURITY_PATHWAY.modules.flatMap((module) => module.exercises);
const TERMINAL = EXERCISES.filter((exercise) => exercise.kind === 'terminal');

function shellOutput(command: string): string {
  return attemptOf(command).output;
}

describe('the pathway now contains work', () => {
  it('has hands-on exercises at all', () => {
    expect(TERMINAL.length).toBeGreaterThanOrEqual(8);
  });

  it('puts them in the modules that teach the matching idea', () => {
    const modules = new Set(TERMINAL.map((exercise) => exercise.moduleId));
    expect(modules).toContain('aisp.3');
    expect(modules).toContain('aisp.10');
    expect(modules).toContain('aisp.11');
  });

  it('gives every hands-on exercise five drills', () => {
    for (const exercise of TERMINAL) {
      expect(exercise.practice.length, `${exercise.id}`).toBe(5);
    }
  });
});

describe('every stated solution passes its own checks', () => {
  for (const exercise of TERMINAL) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const attempt = attemptOf(exercise.solution);
      const evaluation = evaluate(exercise, attempt, 1);
      expect(
        evaluation.failed.map((failure) => failure.hint),
        `solution: ${exercise.solution}\noutput:\n${attempt.output.slice(0, 500)}`,
      ).toEqual([]);
    });
  }
});

describe('every drill solution passes its own checks', () => {
  for (const exercise of TERMINAL) {
    for (const drill of exercise.practice) {
      it(`${drill.id}`, () => {
        const attempt = attemptOf(drill.solution);
        const evaluation = evaluate({ ...exercise, checks: drill.checks }, attempt, 1);
        expect(
          evaluation.failed.map((failure) => failure.hint),
          `solution: ${drill.solution}\noutput:\n${attempt.output.slice(0, 500)}`,
        ).toEqual([]);
      });
    }
  }
});

describe('the seeded artefacts are readable by a student', () => {
  it('the corpus, the inference log and the registry all open', () => {
    for (const path of [
      '/srv/ml/corpus/tickets.csv',
      '/srv/ml/logs/inference.log',
      '/srv/ml/registry.csv',
    ]) {
      const output = shellOutput(`head -n 1 ${path}`);
      expect(output, path).not.toContain('Permission denied');
      expect(output, path).not.toContain('No such file');
      expect(output.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not disturb the /var/log counts Linux Fundamentals grades', () => {
    // The inference log deliberately lives outside /var/log. Several Linux
    // drills count the files there, and this is what stops a future move from
    // silently breaking a package that has nothing to do with AI.
    expect(shellOutput('find /var/log -type f | wc -l').trim()).toBe('10');
    expect(shellOutput("find /var/log -name '*.log' | wc -l").trim()).toBe('5');
  });
});

describe('the decoys are still decoys', () => {
  const count = (command: string) => Number(shellOutput(command).trim());
  const CORPUS = '/srv/ml/corpus/tickets.csv';
  const LOG = '/srv/ml/logs/inference.log';

  it('most of the contractor feed is innocent, so the feed is not the finding', () => {
    const poisoned = count(`grep -c "ref#QX-" ${CORPUS}`);
    const contractor = count(`grep -c "contractor-feed" ${CORPUS}`);
    expect(contractor).toBeGreaterThan(poisoned * 3);
  });

  it('genuinely urgent tickets outnumber the poisoned ones', () => {
    const poisoned = count(`grep -c "ref#QX-" ${CORPUS}`);
    const urgent = count(`grep -c ",urgent," ${CORPUS}`);
    // Otherwise "grep urgent" is the whole exercise and there is no judgement in it.
    expect(urgent - poisoned).toBeGreaterThan(poisoned / 2);
  });

  it('the corpus carries a second, unrelated problem nobody was looking for', () => {
    expect(count(`grep -c "@ridgelinemed.example" ${CORPUS}`)).toBeGreaterThan(0);
  });

  it('the injection attempts are worded differently from each other', () => {
    const refused = shellOutput(`grep "verdict=refused" ${LOG} | cut -d '"' -f 2`)
      .trim()
      .split('\n');
    expect(refused.length).toBeGreaterThan(3);
    // A rule keyed on "ignore" must catch a minority of them, or the exercise
    // teaches that one keyword is a sufficient detection.
    const withIgnore = refused.filter((line) => line.includes('ignore')).length;
    expect(withIgnore).toBeLessThan(refused.length / 2);
  });

  it('the busiest account is busy enough to stand out but is not the attacker', () => {
    const sweep = count(`grep -c "user=awilkins" ${LOG}`);
    const normal = count(`grep -c "user=jmartel" ${LOG}`);
    expect(sweep).toBeGreaterThan(normal * 2);
    // It made no refused requests, so volume alone has to be what raises it.
    expect(count(`grep "user=awilkins" ${LOG} | grep -c "verdict=refused"`)).toBe(0);
  });

  it('the registry has an arguable finding beside an unarguable one', () => {
    const unapproved = shellOutput('grep ",production," /srv/ml/registry.csv | grep ",no,"');
    expect(unapproved).toContain('canary');
    expect(unapproved).toContain('docsearch');
  });
});
