/**
 * Unit tests for the grading engine's `answer-numeric` check.
 *
 * There is no dedicated grading-engine test file elsewhere: everything else
 * exercises `evaluate()` indirectly through a package's own golden tests.
 * `answer-numeric` is infrastructure with no content using it yet (see
 * commit history), so it needs its own direct coverage rather than riding
 * along with a package that happens to use it.
 */

import { describe, expect, it } from 'vitest';

import type { Check, Exercise } from '@soc/shared';

import { evaluate } from './validate.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

function exerciseWith(checks: Check[]): Exercise {
  return {
    id: 'test.numeric',
    moduleId: 'test',
    packageId: 'test',
    order: 1,
    title: 'test',
    kind: 'short-answer',
    goal: 'test',
    prompt: 'How much was the cake?',
    teach: { concept: 'test' },
    hints: ['test'],
    solution: '410',
    checks,
    practice: [],
  };
}

function grade(checks: Check[], answerText: string) {
  return evaluate(
    exerciseWith(checks),
    {
      input: '',
      output: '',
      exitCode: 0,
      cwd: HOME,
      vfs: new Vfs(BASE_IMAGE, emptyOverlay(), HOME),
      answerText,
    },
    1,
  );
}

describe('answer-numeric', () => {
  const equals410: Check[] = [{ type: 'answer-numeric', equals: 410, hint: 'It was $410.' }];

  it.each(['410', '$410', '$410.00', '410.00', ' 410 ', '$410.0'])(
    'accepts %s as equal to 410',
    (answerText) => {
      expect(grade(equals410, answerText).passed).toBe(true);
    },
  );

  it('accepts thousands separators', () => {
    const checks: Check[] = [{ type: 'answer-numeric', equals: 1847, hint: 'test' }];
    expect(grade(checks, '1,847').passed).toBe(true);
    expect(grade(checks, '$1,847.00').passed).toBe(true);
  });

  it.each(['411', '41', 'four hundred ten', ''])('rejects %s as not equal to 410', (answerText) => {
    expect(grade(equals410, answerText).passed).toBe(false);
  });

  it('rejects an answer with no number in it at all', () => {
    expect(grade(equals410, 'about four hundred dollars').passed).toBe(false);
  });

  it('supports a min/max range instead of an exact figure', () => {
    const checks: Check[] = [{ type: 'answer-numeric', min: 400, max: 420, hint: 'test' }];
    expect(grade(checks, '$405').passed).toBe(true);
    expect(grade(checks, '400').passed).toBe(true);
    expect(grade(checks, '420').passed).toBe(true);
    expect(grade(checks, '399').passed).toBe(false);
    expect(grade(checks, '421').passed).toBe(false);
  });

  it('reports the check-specific hint on failure', () => {
    const result = grade(equals410, '999');
    expect(result.passed).toBe(false);
    expect(result.failed).toContainEqual(
      expect.objectContaining({ type: 'answer-numeric', hint: 'It was $410.' }),
    );
  });
});
