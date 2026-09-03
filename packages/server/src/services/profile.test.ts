import { describe, expect, it } from 'vitest';

import {
  EMPTY_PROFILE,
  PROFILE_VISIBILITIES,
  checkProfile,
  githubUrl,
  linkedinUrl,
  parseGithubHandle,
  parseLinkedinHandle,
} from '@soc/shared';

/*
 * The parser is the security-relevant part of the profile, so it gets the
 * tests. A field labelled "LinkedIn" that accepts any URL is not a LinkedIn
 * field: it is a place to put a link, on a page strangers read.
 */

describe('taking a GitHub handle out of whatever somebody pasted', () => {
  it('accepts a bare handle', () => {
    expect(parseGithubHandle('octocat').handle).toBe('octocat');
  });

  it('accepts the full address, which is what is actually in the clipboard', () => {
    expect(parseGithubHandle('https://github.com/octocat').handle).toBe('octocat');
    expect(parseGithubHandle('github.com/octocat').handle).toBe('octocat');
    expect(parseGithubHandle('https://www.github.com/octocat/').handle).toBe('octocat');
  });

  it('accepts a leading at sign, and trailing path or query', () => {
    expect(parseGithubHandle('@octocat').handle).toBe('octocat');
    expect(parseGithubHandle('https://github.com/octocat?tab=repositories').handle).toBe('octocat');
    expect(parseGithubHandle('https://github.com/octocat/some-repo').handle).toBe('octocat');
  });

  /*
   * The case the whole function exists for. Every one of these looks like a
   * profile link at a glance and none of them is on GitHub.
   */
  it('refuses a link on any other host', () => {
    for (const attempt of [
      'https://github.com.example.net/octocat',
      'https://evil.example/github.com/octocat',
      'https://glthub.com/octocat',
      'http://192.0.2.10/octocat',
    ]) {
      expect(parseGithubHandle(attempt).handle).toBeNull();
      expect(parseGithubHandle(attempt).problem).not.toBeNull();
    }
  });

  it('refuses anything that is not a handle shape', () => {
    for (const attempt of ['-leading', 'trailing-', 'two--hyphens', 'has space', 'a'.repeat(40)]) {
      expect(parseGithubHandle(attempt).handle).toBeNull();
    }
  });

  it('treats empty as unset rather than as wrong', () => {
    expect(parseGithubHandle('')).toEqual({ handle: null, problem: null });
    expect(parseGithubHandle('   ')).toEqual({ handle: null, problem: null });
  });
});

describe('taking a LinkedIn handle out of whatever somebody pasted', () => {
  it('accepts a profile address', () => {
    expect(parseLinkedinHandle('https://www.linkedin.com/in/some-person').handle).toBe('some-person');
    expect(parseLinkedinHandle('linkedin.com/in/some-person/').handle).toBe('some-person');
  });

  /*
   * A company page and a post are both on linkedin.com and neither is a
   * person. Requiring the /in/ segment is what tells them apart, and without
   * it the field quietly accepts a link to an advert.
   */
  it('refuses a company page or a post, which are not people', () => {
    expect(parseLinkedinHandle('https://www.linkedin.com/company/some-firm').handle).toBeNull();
    expect(parseLinkedinHandle('https://www.linkedin.com/feed/update/123').handle).toBeNull();
  });

  it('refuses a link on any other host', () => {
    expect(parseLinkedinHandle('https://linkedin.com.example.net/in/someone').handle).toBeNull();
    expect(parseLinkedinHandle('https://example.net/in/someone').handle).toBeNull();
  });
});

describe('the address a handle turns back into', () => {
  /*
   * Rebuilt against a fixed host rather than stored, which is what makes the
   * host impossible to change through the field.
   */
  it('is always on the right host', () => {
    expect(githubUrl('octocat')).toBe('https://github.com/octocat');
    expect(linkedinUrl('some-person')).toBe('https://www.linkedin.com/in/some-person');
  });

  it('escapes whatever it is given, even a handle that should not exist', () => {
    expect(githubUrl('a/../b')).not.toContain('/../');
  });
});

describe('checking a whole profile', () => {
  it('passes an empty one, because a profile is optional', () => {
    expect(checkProfile({}).ok).toBe(true);
  });

  it('names the field that is wrong, so the message lands beside its input', () => {
    const result = checkProfile({ github: 'https://example.net/octocat', headline: 'x'.repeat(200) });
    expect(result.ok).toBe(false);
    expect(Object.keys(result.problems).sort()).toEqual(['github', 'headline']);
  });
});

describe('the default profile', () => {
  /*
   * The floor is pseudonymous on purpose. Somebody may choose to attach a real
   * name and a GitHub account to it; nobody should find out later that they
   * did so by default.
   */
  it('is private', () => {
    expect(EMPTY_PROFILE.visibility).toBe('private');
    expect(PROFILE_VISIBILITIES[0]).toBe('private');
  });

  it('is not open to work, which is a claim somebody makes deliberately', () => {
    expect(EMPTY_PROFILE.openToWork).toBe(false);
  });
});
