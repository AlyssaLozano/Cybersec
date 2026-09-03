/**
 * The profile somebody builds as they work.
 *
 * WHY LINKS ARE STORED AS HANDLES AND NOT AS URLS
 *
 * A field labelled "LinkedIn" that accepts any URL is not a LinkedIn field.
 * It is a place to put a link, on a page other people read, in a product where
 * strangers meet: exactly the surface somebody uses to send people somewhere
 * they did not intend to go, and no amount of rendering care fixes a stored
 * value that was never checked.
 *
 * So what is stored is the handle. The URL is rebuilt from it at render time
 * against a fixed host, which means the host cannot be anything else, and it
 * also means a profile survives either site changing its URL shape.
 *
 * People paste URLs, because that is what is in their clipboard. The parser
 * below accepts a pasted URL and keeps the handle out of it, rather than
 * refusing and making somebody edit a string by hand.
 *
 * WHY THE DEFAULT IS PRIVATE
 *
 * The floor is pseudonymous on purpose: a career changer practising in public
 * should not have to attach their real name to the hour where they missed the
 * exfiltration. A profile carrying a GitHub account and a LinkedIn page
 * undoes that, which is fine when somebody chooses it and is not fine as a
 * default they discover later. See `PROFILE_VISIBILITIES`.
 */

/**
 * Who can see a profile.
 *
 * PRIVATE   nobody but the person. The default.
 * MEMBERS   anybody signed in to the platform. The useful setting: it is how
 *           somebody you sat a shift with looks you up afterwards, without
 *           putting a name and a face on the open internet.
 * PUBLIC    anybody with the link, signed in or not. For somebody actively
 *           job hunting who wants the link in an application.
 */
export const PROFILE_VISIBILITIES = ['private', 'members', 'public'] as const;
export type ProfileVisibility = (typeof PROFILE_VISIBILITIES)[number];

export const PROFILE_VISIBILITY_LABELS: Record<ProfileVisibility, { label: string; detail: string }> = {
  private: {
    label: 'Only me',
    detail: 'Nobody else sees it. You can still fill it in and change your mind later.',
  },
  members: {
    label: 'People on the platform',
    detail: 'Anybody signed in can find it, which is how somebody you ran a shift with looks you up.',
  },
  public: {
    label: 'Anybody with the link',
    detail: 'Signed in or not. Pick this if you want to put the link in an application.',
  },
};

export const HEADLINE_MAX = 90;
export const ABOUT_MAX = 1200;
export const DISPLAY_NAME_MAX = 60;
export const LOCATION_MAX = 60;

/**
 * GitHub's own rule: alphanumeric or single hyphens, cannot start or end with
 * a hyphen, up to 39 characters.
 */
export const GITHUB_HANDLE_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

/**
 * A LinkedIn public profile slug. Deliberately narrower than what LinkedIn
 * itself allows, which includes non-ASCII: everything this accepts round-trips
 * through a URL unchanged, and somebody with a slug this refuses can paste
 * their full URL, which is what they have anyway.
 */
export const LINKEDIN_SLUG_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{1,98})[A-Za-z0-9]$/;

export const GITHUB_HOST = 'https://github.com/';
export const LINKEDIN_HOST = 'https://www.linkedin.com/in/';

export interface HandleParse {
  handle: string | null;
  /** Written to the person, and says how to fix it. Null when it parsed. */
  problem: string | null;
}

/**
 * Take a handle out of whatever somebody pasted.
 *
 * Accepts a bare handle, a full URL, a URL without a scheme, a leading @, and
 * a trailing slash or query string, because all five turn up. What it does not
 * accept is a URL on a different host, which is the case the whole function
 * exists for: a value that looks like a profile link and is not.
 */
export function parseGithubHandle(raw: string): HandleParse {
  return parseHandle(raw, {
    hosts: ['github.com', 'www.github.com'],
    pathPrefixes: [],
    pattern: GITHUB_HANDLE_PATTERN,
    what: 'GitHub username',
    shape: 'Letters, numbers and single hyphens, up to 39 characters.',
  });
}

export function parseLinkedinHandle(raw: string): HandleParse {
  return parseHandle(raw, {
    hosts: ['linkedin.com', 'www.linkedin.com'],
    // LinkedIn public profiles live under /in/, and a company or post URL is
    // not a person. Requiring the segment is what tells those apart.
    pathPrefixes: ['in'],
    pattern: LINKEDIN_SLUG_PATTERN,
    what: 'LinkedIn profile',
    shape: 'Paste the address of your profile page, the one with /in/ in it.',
  });
}

function parseHandle(
  raw: string,
  spec: { hosts: string[]; pathPrefixes: string[]; pattern: RegExp; what: string; shape: string },
): HandleParse {
  const value = raw.trim();
  if (value.length === 0) return { handle: null, problem: null };

  let candidate = value;

  if (candidate.includes('/') || candidate.includes('.')) {
    // Anything that looks like an address is parsed as one. A bare handle
    // cannot contain either character, so this cannot swallow a valid one.
    const withScheme = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
    let url: URL;
    try {
      url = new URL(withScheme);
    } catch {
      return { handle: null, problem: `That does not look like a ${spec.what}. ${spec.shape}` };
    }
    if (!spec.hosts.includes(url.hostname.toLowerCase())) {
      return {
        handle: null,
        problem: `That link is not on ${spec.hosts[spec.hosts.length - 1]}. Paste your own profile address.`,
      };
    }
    const segments = url.pathname.split('/').filter((s) => s.length > 0);
    for (const prefix of spec.pathPrefixes) {
      if (segments[0]?.toLowerCase() !== prefix) {
        return { handle: null, problem: `That is not a profile page. ${spec.shape}` };
      }
      segments.shift();
    }
    candidate = segments[0] ?? '';
  }

  candidate = candidate.replace(/^@/, '');

  if (!spec.pattern.test(candidate)) {
    return { handle: null, problem: `That is not a ${spec.what}. ${spec.shape}` };
  }
  return { handle: candidate, problem: null };
}

/** The address to link to, rebuilt rather than stored. */
export function githubUrl(handle: string): string {
  return GITHUB_HOST + encodeURIComponent(handle);
}

export function linkedinUrl(handle: string): string {
  return LINKEDIN_HOST + encodeURIComponent(handle);
}

/**
 * What somebody writes about themselves.
 *
 * The call sign and avatar are not here: those belong to the floor, are chosen
 * at the door of the first room, and are the one part of the identity that
 * cannot be private, because the room says them out loud.
 */
export interface ProfileFields {
  /**
   * A real name, or whatever they want on it, and optional.
   *
   * Separate from the call sign rather than replacing it, because somebody
   * linking a LinkedIn page has already decided to be findable and somebody
   * who has not should keep the handle they run shifts under.
   */
  displayName: string;
  /** One line. What they are working towards, usually. */
  headline: string;
  about: string;
  location: string;
  /** Bare handles. Never URLs; see the header. */
  githubHandle: string | null;
  linkedinHandle: string | null;
  /**
   * Shown as a badge, and the one field somebody actually job hunting wants
   * other people to see.
   */
  openToWork: boolean;
  visibility: ProfileVisibility;
}

export const EMPTY_PROFILE: ProfileFields = {
  displayName: '',
  headline: '',
  about: '',
  location: '',
  githubHandle: null,
  linkedinHandle: null,
  openToWork: false,
  visibility: 'private',
};

/**
 * A profile as somebody else sees it.
 *
 * The earned half is not editable and is the reason the page is worth reading:
 * anybody can write a headline, and the badges, the packages finished and the
 * shifts actually run are the part that took the work.
 */
export interface PublicProfile extends ProfileFields {
  userId: string;
  callSign: string | null;
  avatarId: string | null;
  joinedAt: string;
  badgeIds: string[];
  packagesCompleted: number;
  shiftsRun: number;
  /** Seats they have actually sat in, commonest first. */
  seatsPlayed: string[];
}

export interface ProfileCheck {
  ok: boolean;
  /** Field name to message, so each problem lands next to its own input. */
  problems: Record<string, string>;
}

export function checkProfile(fields: {
  displayName?: string;
  headline?: string;
  about?: string;
  location?: string;
  github?: string;
  linkedin?: string;
}): ProfileCheck {
  const problems: Record<string, string> = {};

  if ((fields.displayName ?? '').length > DISPLAY_NAME_MAX) {
    problems.displayName = `Too long. At most ${DISPLAY_NAME_MAX} characters.`;
  }
  if ((fields.headline ?? '').length > HEADLINE_MAX) {
    problems.headline = `Too long. At most ${HEADLINE_MAX} characters, so it fits on one line.`;
  }
  if ((fields.about ?? '').length > ABOUT_MAX) {
    problems.about = `Too long. At most ${ABOUT_MAX} characters.`;
  }
  if ((fields.location ?? '').length > LOCATION_MAX) {
    problems.location = `Too long. At most ${LOCATION_MAX} characters.`;
  }

  const github = parseGithubHandle(fields.github ?? '');
  if (github.problem) problems.github = github.problem;

  const linkedin = parseLinkedinHandle(fields.linkedin ?? '');
  if (linkedin.problem) problems.linkedin = linkedin.problem;

  return { ok: Object.keys(problems).length === 0, problems };
}
