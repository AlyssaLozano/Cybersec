/**
 * Every packet exercise and drill, run through the real engine and graded.
 *
 * This is the test that matters for this module. The counts in the exercises
 * are derived from the generated capture rather than typed in, but a derivation
 * can still be wrong -- it can measure something subtly different from what the
 * student's command measures -- and the only way to know is to run the stated
 * solution and grade it with the same evaluator the student's answer goes
 * through. A content file that type-checks and boots can still be full of
 * exercises nobody can pass.
 */

import { describe, expect, it } from 'vitest';

import { NETWORKING } from './networking.js';
import { evaluate } from './validate.js';
import { runLine } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

/** Run one line the way a student's submission runs, and grade it. */
function attemptOf(input: string) {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  const result = runLine(input, { vfs, machine: MACHINE, cwd: HOME });
  return { input, output: result.output, exitCode: result.exitCode, cwd: result.cwd, vfs };
}

const PACKET_MODULES = NETWORKING.modules.filter((module) =>
  ['4.6', '4.7', '4.8', '4.9'].includes(module.id),
);

const TERMINAL_EXERCISES = PACKET_MODULES.flatMap((module) => module.exercises).filter(
  (exercise) => exercise.kind === 'terminal',
);

const DRILLS = PACKET_MODULES.flatMap((module) => module.exercises).flatMap((exercise) =>
  (exercise.practice ?? []).map((drill) => ({ exercise: exercise.id, drill })),
);

describe('packet analysis modules exist and are wired in', () => {
  it('adds four modules to Networking', () => {
    expect(PACKET_MODULES.map((module) => module.id)).toEqual(['4.6', '4.7', '4.8', '4.9']);
  });

  it('adds twenty exercises', () => {
    expect(PACKET_MODULES.flatMap((module) => module.exercises)).toHaveLength(20);
  });
});

describe('every stated solution passes its own checks', () => {
  for (const exercise of TERMINAL_EXERCISES) {
    it(`${exercise.id}: ${exercise.title}`, () => {
      const attempt = attemptOf(exercise.solution);
      const evaluation = evaluate(exercise, attempt, 1);
      expect(
        evaluation.failed.map((failure) => failure.hint),
        `solution: ${exercise.solution}\noutput:\n${attempt.output.slice(0, 600)}`,
      ).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('every drill solution passes its own checks', () => {
  for (const { exercise, drill } of DRILLS) {
    it(`${drill.id}`, () => {
      const attempt = attemptOf(drill.solution);
      // A drill is graded against its own checks, exactly as submission.ts does.
      const parent = TERMINAL_EXERCISES.find((item) => item.id === exercise)!;
      const evaluation = evaluate({ ...parent, checks: drill.checks }, attempt, 1);
      expect(
        evaluation.failed.map((failure) => failure.hint),
        `solution: ${drill.solution}\noutput:\n${attempt.output.slice(0, 600)}`,
      ).toEqual([]);
      expect(evaluation.passed).toBe(true);
    });
  }
});

describe('drills teach rather than only test', () => {
  it('every packet drill carries a teaching note', () => {
    const untaught = DRILLS.filter(({ drill }) => !drill.teach?.note);
    expect(untaught.map(({ drill }) => drill.id)).toEqual([]);
  });

  it('a teaching note says something, rather than restating the prompt', () => {
    // Sixty characters is not a quality bar, but it does catch a note that was
    // added to satisfy the test above and left as a stub.
    const thin = DRILLS.filter(({ drill }) => (drill.teach?.note.length ?? 0) < 60);
    expect(thin.map(({ drill }) => drill.id)).toEqual([]);
  });
});

describe('the capture the exercises are built on', () => {
  it('is readable by tcpdump and not by grep', () => {
    const rendered = attemptOf('tcpdump -n -c 1 -r /var/captures/eth0-morning.pcap');
    expect(rendered.output).toContain(' IP ');

    const raw = attemptOf('head -n 1 /var/captures/eth0-morning.pcap');
    expect(raw.output).not.toContain(' IP ');
  });

  it('still holds the intrusion the exercises describe', () => {
    // If the generator changes shape, these fail before the exercises do, which
    // makes the cause obvious instead of leaving twenty broken answer keys.
    const beacons = attemptOf(
      "tcpdump -n -r /var/captures/eth0-morning.pcap 'src host 10.20.6.40 and dst host 203.0.113.55 and dst port 443' | grep -c 'Flags \\[S\\]'",
    );
    expect(Number(beacons.output.trim())).toBeGreaterThan(1);

    const transfer = attemptOf(
      "tcpdump -n -r /var/captures/eth0-morning.pcap 'src host 10.20.6.40 and dst host 198.51.100.60' | wc -l",
    );
    expect(Number(transfer.output.trim())).toBeGreaterThan(100);
  });
});
