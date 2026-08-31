/**
 * File viewing, searching, and text-processing commands.
 *
 * This is where the curriculum actually lives: almost every log-analysis
 * exercise is grep plus a pipe. The implementations therefore aim for behavioural
 * fidelity on the flags students will meet -- exit codes included, because
 * `grep -q ... && echo found` depends on them.
 */

import {
  fail,
  fromLines,
  ok,
  readOrError,
  toLines,
  toolError,
  type CommandResult,
  type ExecContext,
} from '../context.js';
import { parseArgs } from '../parser.js';

/** Resolve operands into concrete paths, expanding globs. */
function resolveTargets(operands: string[], ctx: ExecContext): string[] {
  const paths: string[] = [];
  for (const operand of operands) paths.push(...ctx.vfs.expandGlob(ctx.cwd, operand));
  return paths;
}

export function cat(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const numbered = args.flags.has('n');

  // No operands means read stdin, which is how `grep x file | cat` works.
  if (args.positionals.length === 0) {
    const text = ctx.stdin;
    return ok(numbered ? numberLines(toLines(text)) : text);
  }

  const chunks: string[] = [];
  const errors: string[] = [];
  let lineNumber = 1;

  for (const path of resolveTargets(args.positionals, ctx)) {
    const result = readOrError(path, ctx, 'cat');
    if ('error' in result) {
      errors.push(result.error.stderr);
      continue;
    }
    if (numbered) {
      const lines = toLines(result.text);
      chunks.push(numberLines(lines, lineNumber));
      lineNumber += lines.length;
    } else {
      chunks.push(result.text);
    }
  }

  return {
    stdout: chunks.join(''),
    stderr: errors.join('\n'),
    exitCode: errors.length > 0 ? 1 : 0,
  };
}

function numberLines(lines: string[], start = 1): string {
  return fromLines(lines.map((line, index) => `${String(start + index).padStart(6)}\t${line}`));
}

/**
 * `less` and `more`.
 *
 * A browser terminal has no interactive pager, so this prints the file and says
 * what would have happened on a real system. Pretending to page would teach a
 * keystroke sequence (space, /search, q) that does nothing here -- worse than
 * being upfront about the limitation.
 */
export function less(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  if (args.positionals.length === 0 && ctx.stdin === '') {
    return toolError('less', 'missing filename');
  }

  const source =
    args.positionals.length === 0
      ? { text: ctx.stdin }
      : readOrError(ctx.vfs.resolvePath(ctx.cwd, args.positionals[0]!), ctx, 'less');
  if ('error' in source) return source.error;

  const lines = toLines(source.text);
  const PAGE = 40;
  const shown = lines.slice(0, PAGE);

  const footer =
    lines.length > PAGE
      ? `\n[ Showing lines 1-${PAGE} of ${lines.length}. This simulator has no interactive pager: on a real system you would scroll with the arrow keys or Space and quit with q. Use head, tail, or grep to narrow the file down. ]\n`
      : '\n(END)\n';

  return ok(fromLines(shown) + footer);
}

export function head(argv: string[], ctx: ExecContext): CommandResult {
  return headOrTail(argv, ctx, 'head');
}

export function tail(argv: string[], ctx: ExecContext): CommandResult {
  return headOrTail(argv, ctx, 'tail');
}

function headOrTail(argv: string[], ctx: ExecContext, tool: 'head' | 'tail'): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['n', 'c'], longValueFlags: ['lines'] });

  const countText = args.values.get('n') ?? (args.longFlags.get('lines') as string | undefined);
  let count = countText === undefined ? 10 : Number(countText);
  if (Number.isNaN(count)) {
    return toolError(tool, `invalid number of lines: '${countText}'`);
  }
  // `tail -n +5` means "from line 5 onward"; only tail supports it.
  const fromLine = typeof countText === 'string' && countText.startsWith('+') ? Number(countText.slice(1)) : null;
  count = Math.abs(count);

  const slice = (lines: string[]): string[] => {
    if (tool === 'head') return lines.slice(0, count);
    if (fromLine !== null) return lines.slice(fromLine - 1);
    return lines.slice(Math.max(0, lines.length - count));
  };

  if (args.positionals.length === 0) {
    return ok(fromLines(slice(toLines(ctx.stdin))));
  }

  const paths = resolveTargets(args.positionals, ctx);
  const chunks: string[] = [];
  const errors: string[] = [];

  for (const path of paths) {
    const result = readOrError(path, ctx, tool);
    if ('error' in result) {
      errors.push(result.error.stderr);
      continue;
    }
    // With several files, head and tail print a ==> name <== banner.
    if (paths.length > 1) chunks.push(`${chunks.length > 0 ? '\n' : ''}==> ${path} <==\n`);
    chunks.push(fromLines(slice(toLines(result.text))));
  }

  return {
    stdout: chunks.join(''),
    stderr: errors.join('\n'),
    exitCode: errors.length > 0 ? 1 : 0,
  };
}

// --- grep --------------------------------------------------------------------

/**
 * Translate a POSIX basic regular expression into a JavaScript one.
 *
 * Without -E, grep treats `+`, `?`, `|`, `(` and `)` as literal characters, and
 * requires them backslash-escaped to act as operators. Getting this right is
 * what makes `grep -E "started|stopped"` behave differently from the same
 * pattern without -E, which is a distinction the exercises actually test.
 */
function bcToJsRegex(pattern: string): string {
  let out = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i]!;
    if (char === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1]!;
      // In BRE, backslash *enables* these operators.
      if ('+?|(){}'.includes(next)) {
        out += next;
      } else {
        out += char + next;
      }
      i += 1;
      continue;
    }
    // Unescaped, these are literals in BRE.
    if ('+?|(){}'.includes(char)) {
      out += '\\' + char;
      continue;
    }
    out += char;
  }
  return out;
}

export function grep(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['e', 'm', 'A', 'B', 'C'] });

  const ignoreCase = args.flags.has('i');
  const countOnly = args.flags.has('c');
  const showLineNumbers = args.flags.has('n');
  const invert = args.flags.has('v');
  const onlyMatching = args.flags.has('o');
  const filesWithMatches = args.flags.has('l');
  const quiet = args.flags.has('q');
  const recursive = args.flags.has('r') || args.flags.has('R');
  const extended = args.flags.has('E');
  // -P is PCRE. For the patterns in this curriculum PCRE and ERE agree, apart
  // from \K, which is handled below.
  const perl = args.flags.has('P');
  const fixedStrings = args.flags.has('F');

  let pattern = args.values.get('e');
  const operands = [...args.positionals];
  if (pattern === undefined) {
    pattern = operands.shift();
  }
  if (pattern === undefined) {
    return fail('Usage: grep [OPTION]... PATTERNS [FILE]...\n', 2);
  }

  // \K in a PCRE pattern discards everything matched so far. It is common in
  // log-parsing one-liners (`grep -oP 'user=\K[^ ]*'`) so it is worth handling
  // rather than failing: rewrite it as a lookbehind, which JavaScript supports.
  let source = pattern;
  if (perl && source.includes('\\K')) {
    const [before, after] = source.split('\\K') as [string, string];
    source = `(?<=${before})${after}`;
  } else if (fixedStrings) {
    source = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  } else if (!extended && !perl) {
    source = bcToJsRegex(source);
  }

  let regex: RegExp;
  try {
    regex = new RegExp(source, ignoreCase ? 'gi' : 'g');
  } catch {
    return fail(`grep: Invalid regular expression: ${pattern}\n`, 2);
  }
  const test = (line: string) => {
    regex.lastIndex = 0;
    return regex.test(line);
  };

  // Gather the files to search.
  let paths: string[];
  if (operands.length === 0) {
    paths = [];
  } else if (recursive) {
    paths = [];
    for (const operand of resolveTargets(operands, ctx)) {
      try {
        paths.push(...ctx.vfs.walk(operand).filter((e) => e.node.kind === 'file').map((e) => e.path));
      } catch {
        paths.push(operand);
      }
    }
  } else {
    paths = resolveTargets(operands, ctx);
  }

  const showFilename = paths.length > 1 || recursive;
  const outputLines: string[] = [];
  const errors: string[] = [];
  let matchCount = 0;

  const searchText = (text: string, label: string | null): void => {
    const lines = toLines(text);
    let fileMatches = 0;

    lines.forEach((line, index) => {
      const matched = test(line);
      if (matched === invert) return;

      fileMatches += 1;
      matchCount += 1;
      if (countOnly || filesWithMatches || quiet) return;

      const prefix =
        (label !== null && showFilename ? `${label}:` : '') +
        (showLineNumbers ? `${index + 1}:` : '');

      if (onlyMatching && !invert) {
        regex.lastIndex = 0;
        for (const match of line.matchAll(regex)) {
          outputLines.push(prefix + match[0]);
        }
        return;
      }
      outputLines.push(prefix + line);
    });

    if (countOnly) {
      outputLines.push((label !== null && showFilename ? `${label}:` : '') + String(fileMatches));
    }
    if (filesWithMatches && fileMatches > 0 && label !== null) {
      outputLines.push(label);
    }
  };

  if (paths.length === 0) {
    searchText(ctx.stdin, null);
  } else {
    for (const path of paths) {
      const node = ctx.vfs.stat(path);
      if (node?.kind === 'dir') {
        errors.push(`grep: ${path}: Is a directory`);
        continue;
      }
      const result = readOrError(path, ctx, 'grep');
      if ('error' in result) {
        errors.push(result.error.stderr);
        continue;
      }
      searchText(result.text, path);
    }
  }

  // grep exits 0 when it matched, 1 when it did not, 2 on error.
  const exitCode = errors.length > 0 && matchCount === 0 ? 2 : matchCount > 0 ? 0 : 1;

  return {
    stdout: quiet ? '' : fromLines(outputLines),
    stderr: errors.join('\n'),
    exitCode,
  };
}

// --- counting and reshaping --------------------------------------------------

export function wc(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const wantLines = args.flags.has('l');
  const wantWords = args.flags.has('w');
  const wantChars = args.flags.has('c') || args.flags.has('m');
  const showAll = !wantLines && !wantWords && !wantChars;

  const measure = (text: string) => ({
    lines: toLines(text).length,
    words: text.split(/\s+/).filter(Boolean).length,
    chars: text.length,
  });

  const render = (counts: ReturnType<typeof measure>, label?: string) => {
    const parts: string[] = [];
    if (showAll || wantLines) parts.push(String(counts.lines).padStart(showAll ? 7 : 0));
    if (showAll || wantWords) parts.push(String(counts.words).padStart(showAll ? 7 : 0));
    if (showAll || wantChars) parts.push(String(counts.chars).padStart(showAll ? 7 : 0));
    return parts.join(' ') + (label ? ` ${label}` : '');
  };

  if (args.positionals.length === 0) {
    return ok(render(measure(ctx.stdin)) + '\n');
  }

  const lines: string[] = [];
  const errors: string[] = [];
  const totals = { lines: 0, words: 0, chars: 0 };
  const paths = resolveTargets(args.positionals, ctx);

  for (const path of paths) {
    const result = readOrError(path, ctx, 'wc');
    if ('error' in result) {
      errors.push(result.error.stderr);
      continue;
    }
    const counts = measure(result.text);
    totals.lines += counts.lines;
    totals.words += counts.words;
    totals.chars += counts.chars;
    lines.push(render(counts, path));
  }

  if (paths.length > 1) lines.push(render(totals, 'total'));

  return {
    stdout: fromLines(lines),
    stderr: errors.join('\n'),
    exitCode: errors.length > 0 ? 1 : 0,
  };
}

export function sort(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['k', 't'] });
  const numeric = args.flags.has('n');
  const human = args.flags.has('h');
  const reverse = args.flags.has('r');
  const unique = args.flags.has('u');

  let text = ctx.stdin;
  if (args.positionals.length > 0) {
    const result = readOrError(ctx.vfs.resolvePath(ctx.cwd, args.positionals[0]!), ctx, 'sort');
    if ('error' in result) return result.error;
    text = result.text;
  }

  // -k selects a field; without -t, fields are whitespace-separated.
  const keyText = args.values.get('k');
  const separator = args.values.get('t');
  const keyIndex = keyText ? Number(keyText.split(',')[0]) - 1 : null;

  const fieldOf = (line: string): string => {
    if (keyIndex === null) return line;
    const fields = separator ? line.split(separator) : line.trim().split(/\s+/);
    return fields[keyIndex] ?? '';
  };

  /** Parse "4.1G" style sizes so `sort -h` orders them by magnitude. */
  const humanValue = (value: string): number => {
    const match = /^([\d.]+)\s*([KMGTP]?)/i.exec(value.trim());
    if (!match) return Number.NEGATIVE_INFINITY;
    const scale = { '': 1, K: 1024, M: 1024 ** 2, G: 1024 ** 3, T: 1024 ** 4, P: 1024 ** 5 };
    return Number(match[1]) * (scale[(match[2] ?? '').toUpperCase() as keyof typeof scale] ?? 1);
  };

  let lines = toLines(text);
  lines = [...lines].sort((a, b) => {
    const left = fieldOf(a);
    const right = fieldOf(b);
    if (human) return humanValue(left) - humanValue(right);
    if (numeric) return (Number(left) || 0) - (Number(right) || 0);
    return left.localeCompare(right, 'en');
  });

  if (reverse) lines.reverse();
  if (unique) lines = lines.filter((line, index) => index === 0 || line !== lines[index - 1]);

  return ok(fromLines(lines));
}

export function uniq(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);
  const showCounts = args.flags.has('c');
  const onlyDuplicates = args.flags.has('d');

  let text = ctx.stdin;
  if (args.positionals.length > 0) {
    const result = readOrError(ctx.vfs.resolvePath(ctx.cwd, args.positionals[0]!), ctx, 'uniq');
    if ('error' in result) return result.error;
    text = result.text;
  }

  // uniq only collapses *adjacent* duplicates, which is why it is nearly always
  // preceded by sort. Reproducing that faithfully teaches the pipeline.
  const groups: Array<{ line: string; count: number }> = [];
  for (const line of toLines(text)) {
    const last = groups[groups.length - 1];
    if (last && last.line === line) last.count += 1;
    else groups.push({ line, count: 1 });
  }

  const selected = onlyDuplicates ? groups.filter((group) => group.count > 1) : groups;
  const lines = selected.map((group) =>
    showCounts ? `${String(group.count).padStart(7)} ${group.line}` : group.line,
  );
  return ok(fromLines(lines));
}

export function cut(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv, { valueFlags: ['d', 'f', 'c'] });
  const delimiter = args.values.get('d') ?? '\t';
  const fieldSpec = args.values.get('f');
  const charSpec = args.values.get('c');

  if (fieldSpec === undefined && charSpec === undefined) {
    return fail('cut: you must specify a list of bytes, characters, or fields\n', 1);
  }

  /** Expand "1-3,5" into zero-based indices. */
  const parseRanges = (spec: string): number[] => {
    const indices: number[] = [];
    for (const part of spec.split(',')) {
      const [startText, endText] = part.split('-');
      const start = Number(startText);
      if (endText === undefined) {
        indices.push(start - 1);
      } else if (endText === '') {
        // "3-" means from field 3 to the end; 64 columns is plenty here.
        for (let i = start; i <= 64; i += 1) indices.push(i - 1);
      } else {
        for (let i = start; i <= Number(endText); i += 1) indices.push(i - 1);
      }
    }
    return indices;
  };

  let text = ctx.stdin;
  if (args.positionals.length > 0) {
    const result = readOrError(ctx.vfs.resolvePath(ctx.cwd, args.positionals[0]!), ctx, 'cut');
    if ('error' in result) return result.error;
    text = result.text;
  }

  const indices = parseRanges((fieldSpec ?? charSpec)!);

  const lines = toLines(text).map((line) => {
    if (charSpec !== undefined) {
      return indices.map((index) => line[index] ?? '').join('');
    }
    // Real cut passes through lines with no delimiter untouched.
    if (!line.includes(delimiter)) return line;
    const fields = line.split(delimiter);
    return indices
      .filter((index) => index < fields.length)
      .map((index) => fields[index])
      .join(delimiter);
  });

  return ok(fromLines(lines));
}

export function echo(argv: string[], ctx: ExecContext): CommandResult {
  const args = argv.slice(1);
  const noNewline = args[0] === '-n';
  const body = (noNewline ? args.slice(1) : args).join(' ');
  void ctx;
  return ok(noNewline ? body : body + '\n');
}
