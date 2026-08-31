import { basename, dirname, hasGlob, matchGlob, normalize, resolve } from './path.js';
import { onAugust15 } from './clock.js';
import { emptyOverlay, type BaseImage, type Overlay, type VNode } from './types.js';

/** A path plus the node found there, as returned by directory listings. */
export interface Entry {
  path: string;
  name: string;
  node: VNode;
}

export type VfsErrorCode =
  | 'ENOENT'
  | 'ENOTDIR'
  | 'EISDIR'
  | 'EEXIST'
  | 'ENOTEMPTY'
  | 'EACCES'
  | 'EINVAL';

/** Carries a POSIX errno so command implementations can print authentic errors. */
export class VfsError extends Error {
  constructor(
    readonly code: VfsErrorCode,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = 'VfsError';
  }
}

/**
 * A student's view of the filesystem: the shared immutable base image plus that
 * student's copy-on-write overlay.
 *
 * The base image is never mutated, so one parsed copy is shared across every
 * concurrent session. Only the overlay is per-student, and only the overlay is
 * persisted between commands.
 */
export class Vfs {
  /** Children of each base-image directory, built once per base image. */
  private static baseChildIndex = new WeakMap<object, Map<string, string[]>>();

  constructor(
    private readonly base: BaseImage,
    private overlay: Overlay = emptyOverlay(),
    readonly home = '/home/student',
  ) {}

  /** The overlay, for persisting to the database. */
  getOverlay(): Overlay {
    return this.overlay;
  }

  /** Discard all student mutations, e.g. when an exercise is restarted. */
  reset(): void {
    this.overlay = emptyOverlay();
  }

  /** Absolute path for whatever the student typed, relative to `cwd`. */
  resolvePath(cwd: string, path: string): string {
    return resolve(cwd, path, this.home);
  }

  /**
   * Look up a node. Returns null when the path does not exist.
   *
   * Resolution order matters: a delete shadows the base image, and a write
   * shadows both.
   */
  stat(path: string): VNode | null {
    const key = normalize(path);
    if (key === '/') {
      return { kind: 'dir', mode: 0o755, owner: 'root', group: 'root', mtime: onAugust15(9, 0) };
    }

    const written = this.overlay.writes[key];
    if (written) return written;
    if (this.isDeleted(key)) return null;
    return this.base.get(key) ?? null;
  }

  exists(path: string): boolean {
    return this.stat(path) !== null;
  }

  isDir(path: string): boolean {
    return this.stat(path)?.kind === 'dir';
  }

  /**
   * A path is gone if it was deleted directly, or if any ancestor directory was
   * deleted: removing /var/log must also hide /var/log/auth.log.
   */
  private isDeleted(path: string): boolean {
    for (const deleted of this.overlay.deletes) {
      if (deleted === path || path.startsWith(deleted + '/')) return true;
    }
    return false;
  }

  /** Read a file, raising the same errors the real tools would. */
  readFile(path: string): string {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) throw new VfsError('ENOENT', key, key + ': No such file or directory');
    if (node.kind === 'dir') throw new VfsError('EISDIR', key, key + ': Is a directory');
    return node.content ?? '';
  }

  /** Byte length as reported by `ls -l` and `du`. */
  sizeOf(node: VNode): number {
    if (node.size !== undefined) return node.size;
    if (node.kind === 'dir') return 4096;
    return Buffer.byteLength(node.content ?? '', 'utf8');
  }

  /** Directory entries, sorted the way `ls` sorts them. */
  readDir(path: string): Entry[] {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) throw new VfsError('ENOENT', key, key + ': No such file or directory');
    if (node.kind !== 'dir') throw new VfsError('ENOTDIR', key, key + ': Not a directory');

    const names = new Set<string>();

    for (const childPath of this.baseChildrenOf(key)) {
      if (!this.isDeleted(childPath) && !this.overlay.writes[childPath]) {
        names.add(basename(childPath));
      }
    }
    for (const writtenPath of Object.keys(this.overlay.writes)) {
      if (dirname(writtenPath) === key) names.add(basename(writtenPath));
    }

    const entries: Entry[] = [];
    for (const name of names) {
      const childPath = key === '/' ? '/' + name : key + '/' + name;
      const childNode = this.stat(childPath);
      if (childNode) entries.push({ path: childPath, name, node: childNode });
    }

    // `ls` sorts by name, ignoring a leading dot when comparing.
    return entries.sort((a, b) =>
      a.name.replace(/^\./, '').localeCompare(b.name.replace(/^\./, ''), 'en'),
    );
  }

  /** Children of a base-image directory, using a lazily built index. */
  private baseChildrenOf(dir: string): string[] {
    let index = Vfs.baseChildIndex.get(this.base as object);
    if (!index) {
      index = new Map<string, string[]>();
      for (const path of this.base.keys()) {
        const parent = dirname(path);
        const bucket = index.get(parent);
        if (bucket) bucket.push(path);
        else index.set(parent, [path]);
      }
      Vfs.baseChildIndex.set(this.base as object, index);
    }
    return index.get(dir) ?? [];
  }

  /**
   * Expand a shell glob into matching paths.
   *
   * When nothing matches, the pattern is returned unchanged. That is what a real
   * shell does, and it is why `ls *.nope` reports "No such file or directory".
   */
  expandGlob(cwd: string, pattern: string): string[] {
    if (!hasGlob(pattern)) return [this.resolvePath(cwd, pattern)];

    const absolute = this.resolvePath(cwd, pattern);
    const dir = dirname(absolute);
    const namePattern = basename(absolute);

    let entries: Entry[];
    try {
      entries = this.readDir(dir);
    } catch {
      return [absolute];
    }

    const matches = entries
      .filter((entry) => matchGlob(namePattern, entry.name))
      // A glob never matches dotfiles unless the pattern itself starts with a dot.
      .filter((entry) => !entry.name.startsWith('.') || namePattern.startsWith('.'))
      .map((entry) => entry.path);

    return matches.length > 0 ? matches.sort() : [absolute];
  }

  // --- mutations ------------------------------------------------------------

  /** Create or overwrite a file. The parent must exist, as with real tools. */
  writeFile(path: string, content: string, options: Partial<VNode> = {}): void {
    const key = normalize(path);
    this.requireParentDir(key);

    const existing = this.stat(key);
    if (existing?.kind === 'dir') throw new VfsError('EISDIR', key, key + ': Is a directory');

    this.write(key, {
      kind: 'file',
      mode: existing?.mode ?? 0o644,
      owner: existing?.owner ?? 'student',
      group: existing?.group ?? 'student',
      mtime: MUTATION_MTIME,
      content,
      ...options,
    });
  }

  /** `touch`: create an empty file, or leave an existing one alone. */
  touch(path: string): void {
    const key = normalize(path);
    if (this.exists(key)) return;
    this.writeFile(key, '');
  }

  mkdir(path: string, recursive = false): void {
    const key = normalize(path);
    if (this.exists(key)) {
      if (recursive) return;
      throw new VfsError('EEXIST', key, "cannot create directory '" + key + "': File exists");
    }

    if (recursive) {
      const parent = dirname(key);
      if (parent !== key && !this.exists(parent)) this.mkdir(parent, true);
    } else {
      this.requireParentDir(key);
    }

    this.write(key, {
      kind: 'dir',
      mode: 0o755,
      owner: 'student',
      group: 'student',
      mtime: MUTATION_MTIME,
    });
  }

  /** Remove a file, or a directory when `recursive` is set. */
  remove(path: string, recursive = false): void {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) {
      throw new VfsError('ENOENT', key, "cannot remove '" + key + "': No such file or directory");
    }
    if (node.kind === 'dir' && !recursive) {
      throw new VfsError('EISDIR', key, "cannot remove '" + key + "': Is a directory");
    }
    this.markDeleted(key);
  }

  /** `rmdir`: refuses to remove a directory that still has entries. */
  removeDir(path: string): void {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) {
      throw new VfsError('ENOENT', key, "failed to remove '" + key + "': No such file or directory");
    }
    if (node.kind !== 'dir') {
      throw new VfsError('ENOTDIR', key, "failed to remove '" + key + "': Not a directory");
    }
    if (this.readDir(key).length > 0) {
      throw new VfsError('ENOTEMPTY', key, "failed to remove '" + key + "': Directory not empty");
    }
    this.markDeleted(key);
  }

  /** Copy a file. Directory copies require `recursive`, as with `cp -r`. */
  copy(from: string, to: string, recursive = false): void {
    const source = normalize(from);
    const node = this.stat(source);
    if (!node) {
      throw new VfsError('ENOENT', source, "cannot stat '" + source + "': No such file or directory");
    }

    const destination = this.copyDestination(source, to);

    if (node.kind === 'dir') {
      if (!recursive) {
        throw new VfsError('EISDIR', source, "-r not specified; omitting directory '" + source + "'");
      }
      this.write(destination, { ...node, mtime: MUTATION_MTIME });
      for (const entry of this.readDir(source)) {
        this.copy(entry.path, destination + '/' + entry.name, true);
      }
      return;
    }

    this.write(destination, { ...node, mtime: MUTATION_MTIME });
  }

  /** Move or rename. */
  move(from: string, to: string): void {
    const source = normalize(from);
    const node = this.stat(source);
    if (!node) {
      throw new VfsError('ENOENT', source, "cannot stat '" + source + "': No such file or directory");
    }

    const destination = this.copyDestination(source, to);
    if (node.kind === 'dir') {
      // Copy the subtree first, so the recursive read still sees the original.
      this.copy(source, destination, true);
      this.markDeleted(source);
      return;
    }
    this.write(destination, { ...node, mtime: MUTATION_MTIME });
    this.markDeleted(source);
  }

  /** Change permission bits. */
  chmod(path: string, mode: number): void {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) {
      throw new VfsError('ENOENT', key, "cannot access '" + key + "': No such file or directory");
    }
    this.write(key, { ...node, mode });
  }

  /** Walk a subtree depth-first, yielding the root itself first. */
  walk(path: string): Entry[] {
    const key = normalize(path);
    const node = this.stat(key);
    if (!node) throw new VfsError('ENOENT', key, "'" + key + "': No such file or directory");

    const results: Entry[] = [{ path: key, name: basename(key), node }];
    if (node.kind !== 'dir') return results;

    for (const entry of this.readDir(key)) {
      results.push(...this.walk(entry.path));
    }
    return results;
  }

  // --- internals ------------------------------------------------------------

  /** `cp a b/` and `cp a b` differ: the first copies *into* an existing dir. */
  private copyDestination(source: string, to: string): string {
    const target = normalize(to);
    if (this.isDir(target)) return (target === '/' ? '' : target) + '/' + basename(source);
    this.requireParentDir(target);
    return target;
  }

  private requireParentDir(path: string): void {
    const parent = dirname(path);
    const parentNode = this.stat(parent);
    if (!parentNode) {
      throw new VfsError('ENOENT', path, "cannot create '" + path + "': No such file or directory");
    }
    if (parentNode.kind !== 'dir') {
      throw new VfsError('ENOTDIR', path, "cannot create '" + path + "': Not a directory");
    }
  }

  private write(path: string, node: VNode): void {
    this.overlay.writes[path] = node;
    // Writing to a previously deleted path revives it.
    this.overlay.deletes = this.overlay.deletes.filter((deleted) => deleted !== path);
  }

  private markDeleted(path: string): void {
    delete this.overlay.writes[path];
    // Any overlay entries beneath a removed directory are now unreachable.
    for (const key of Object.keys(this.overlay.writes)) {
      if (key.startsWith(path + '/')) delete this.overlay.writes[key];
    }
    if (!this.overlay.deletes.includes(path)) this.overlay.deletes.push(path);
  }
}

/**
 * Timestamp stamped on anything the student creates.
 *
 * Dated just after the seeded events so student-created files sort last in
 * `ls -lt`, which is what a student would expect from a real shell.
 */
const MUTATION_MTIME = onAugust15(11, 42);
