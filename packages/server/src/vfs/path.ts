/**
 * POSIX path handling for the simulated filesystem.
 *
 * Deliberately independent of Node's `path` module: this must behave like Linux
 * regardless of the host OS, and the server runs on Windows during development.
 */

/** Collapse `.`, `..`, duplicate slashes, and trailing slashes. */
export function normalize(path: string): string {
  const absolute = path.startsWith('/');
  const parts: string[] = [];

  for (const segment of path.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      // Refusing to pop past the root mirrors the kernel: `cd /..` stays at `/`.
      if (parts.length > 0 && parts[parts.length - 1] !== '..') parts.pop();
      else if (!absolute) parts.push('..');
      continue;
    }
    parts.push(segment);
  }

  const joined = parts.join('/');
  if (absolute) return '/' + joined;
  return joined === '' ? '.' : joined;
}

/**
 * Turn whatever the student typed into an absolute path.
 * Handles `~`, `~/x`, relative paths, and already-absolute paths.
 */
export function resolve(cwd: string, path: string, home = '/home/student'): string {
  if (path === '' || path === '.') return normalize(cwd);
  if (path === '~') return normalize(home);
  if (path.startsWith('~/')) return normalize(home + '/' + path.slice(2));
  if (path.startsWith('/')) return normalize(path);
  return normalize(cwd + '/' + path);
}

/** Parent directory. `dirname('/a/b')` is `/a`; `dirname('/a')` is `/`. */
export function dirname(path: string): string {
  const normalized = normalize(path);
  if (normalized === '/') return '/';
  const index = normalized.lastIndexOf('/');
  if (index <= 0) return '/';
  return normalized.slice(0, index);
}

/** Final path segment. `basename('/a/b')` is `b`. */
export function basename(path: string): string {
  const normalized = normalize(path);
  if (normalized === '/') return '/';
  return normalized.slice(normalized.lastIndexOf('/') + 1);
}

/** Every ancestor of a path, root first: `/a/b/c` -> ['/', '/a', '/a/b']. */
export function ancestors(path: string): string[] {
  const normalized = normalize(path);
  const result: string[] = ['/'];
  const parts = normalized.split('/').filter(Boolean);
  let current = '';
  for (let i = 0; i < parts.length - 1; i += 1) {
    current += '/' + parts[i];
    result.push(current);
  }
  return result;
}

/** True when `child` sits anywhere beneath `parent`. */
export function isDescendant(parent: string, child: string): boolean {
  const p = normalize(parent);
  const c = normalize(child);
  if (p === '/') return c !== '/';
  return c.startsWith(p + '/');
}

/**
 * Match a filename against a shell glob supporting `*`, `?` and `[...]`.
 * Only the final path segment is matched, which is all the exercises need
 * (`/var/log/*.log`).
 */
export function matchGlob(pattern: string, name: string): boolean {
  let regex = '^';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i]!;
    if (char === '*') regex += '[^/]*';
    else if (char === '?') regex += '[^/]';
    else if (char === '[') {
      const close = pattern.indexOf(']', i + 1);
      if (close === -1) {
        // An unclosed bracket is a literal bracket, as in a real shell.
        regex += '\\[';
      } else {
        const body = pattern.slice(i + 1, close);
        regex += '[' + (body.startsWith('!') ? '^' + body.slice(1) : body) + ']';
        i = close;
      }
    } else regex += char.replace(/[.+^${}()|\\]/g, '\\$&');
  }
  regex += '$';
  return new RegExp(regex).test(name);
}

/** True when a path contains glob metacharacters needing expansion. */
export function hasGlob(path: string): boolean {
  return /[*?[]/.test(path);
}
