/**
 * What `toStudentView` is allowed to put in front of a student.
 *
 * WHY THIS FILE EXISTS SEPARATELY
 *
 * CLAUDE.md names `toStudentView()` as "the one place that decides what a
 * student may see", and until now nothing tested it. That is the wrong shape of
 * risk to carry: it is an allow-list that four separate pieces of work have each
 * appended a field to (`queueId`, `decisionPointId`, `copilotEnabled`,
 * `modelId`, `suiteId`), every one of them a correct addition made without a
 * failing test to stop an incorrect one.
 *
 * The exact-key assertion below is the point. A leak here does not arrive as
 * somebody deliberately shipping `checks`; it arrives as a `...exercise` spread
 * added in a hurry, or a new field on `Exercise` that nobody thought about. An
 * allow-list pinned by test turns both of those into a red build instead of an
 * answer key in a browser devtools panel.
 */

import { describe, expect, it } from 'vitest';

import { ALL_EXERCISES, toStudentView } from './index.js';

/**
 * Every key the browser is permitted to receive.
 *
 * Adding to this list is a deliberate act. Read `toStudentView` in `index.ts`
 * first -- each field there carries a comment justifying why it is safe, and a
 * new one needs the same before it goes in here.
 */
const ALLOWED_KEYS = [
  // Length and shape of a free-text answer. Reveals no content -- see
  // `answerFormatFor`, which derives it from how many ideas the rubric wants.
  'answerFormat',
  'copilotEnabled',
  'decisionPointId',
  'defencesConfigurable',
  'goal',
  'hintCount',
  'id',
  'kind',
  'modelId',
  'moduleId',
  'options',
  'order',
  'packageId',
  'prompt',
  'queueId',
  'suiteId',
  'teach',
  'title',
].sort();

/** Fields that are an answer key, in whole or in part. */
const FORBIDDEN_KEYS = ['solution', 'checks', 'hints', 'expectedOutput', 'setup', 'practice'];

describe('toStudentView', () => {
  it('ships exactly the allow-listed fields and nothing else', () => {
    for (const exercise of ALL_EXERCISES) {
      const keys = Object.keys(toStudentView(exercise)).sort();
      expect(keys, `${exercise.id} ships an unexpected field set`).toEqual(ALLOWED_KEYS);
    }
  });

  it('never ships a field that is an answer key', () => {
    for (const exercise of ALL_EXERCISES) {
      const view = toStudentView(exercise) as Record<string, unknown>;
      for (const field of FORBIDDEN_KEYS) {
        expect(view, `${exercise.id} ships "${field}"`).not.toHaveProperty(field);
      }
    }
  });

  /*
   * CLAUDE.md: "Worked examples in `teach` must not be the exercise's own
   * answer. They teach the command's shape against a different target."
   *
   * The one principled exception is a command that has no other form to
   * demonstrate. `pwd` takes no arguments and no target, so exercise 1.1.1
   * cannot show it against a different one and there is nothing to hide -- that
   * exercise is graded on running it and reading the path, not on recalling it.
   * Expressed as a rule rather than an id so it stays true for the next such
   * command instead of quietly grandfathering a real leak.
   */
  it('never uses the exercise answer as its own worked example', () => {
    const offenders: string[] = [];
    for (const exercise of ALL_EXERCISES) {
      const solution = exercise.solution.trim();
      const takesNoArguments = !solution.includes(' ');
      if (takesNoArguments) continue;

      for (const example of exercise.teach.examples ?? []) {
        if (example.command.trim() === solution) {
          offenders.push(`${exercise.id}: worked example "${example.command}" is the answer`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('ships a hint count rather than the hint text', () => {
    for (const exercise of ALL_EXERCISES) {
      const view = toStudentView(exercise) as Record<string, unknown>;
      expect(view['hintCount'], exercise.id).toBe(exercise.hints.length);
      const payload = JSON.stringify(view);
      for (const hint of exercise.hints) {
        expect(payload.includes(hint), `${exercise.id} ships hint text`).toBe(false);
      }
    }
  });
});
