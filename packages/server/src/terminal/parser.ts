/**
 * Shell input parsing.
 *
 * This is a deliberately small subset of shell grammar: quoting, pipes, and
 * output redirection. That covers every exercise in the curriculum without
 * pretending to be bash, which matters because anything this parser accepts is
 * something the simulator has to behave correctly for.
 *
 * Flag parsing is NOT done here. Whether `-n` takes a value depends entirely on
 * the command (`head -n 10` versus `grep -n`), so each command parses its own
 * argv with `parseArgs` below.
 */

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

/** One stage of a pipeline: a command name plus its raw arguments. */
export interface Stage {
  argv: string[];
  /** The stage as the student typed it, for feedback and logging. */
  raw: string;
}

export interface Pipeline {
  stages: Stage[];
  /** Present when the student redirected output with `>` or `>>`. */
  redirect?: { path: string; append: boolean };
  /** The whole line as typed. */
  raw: string;
}

type TokenKind = 'word' | 'pipe' | 'redirect' | 'redirect-append';

interface Token {
  kind: TokenKind;
  value: string;
  /** True when the word arrived quoted, so it must not be glob-expanded. */
  quoted: boolean;
}

/**
 * Split a line into tokens, honouring single quotes, double quotes, and
 * backslash escapes.
 *
 * Single quotes are literal; double quotes allow backslash escapes. Variable
 * expansion is not supported, and that is intentional: no exercise needs it, and
 * a half-working `$VAR` would teach students something false.
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = '';
  let hasContent = false;
  let quoted = false;

  const flush = () => {
    if (hasContent) {
      tokens.push({ kind: 'word', value: current, quoted });
      current = '';
      hasContent = false;
      quoted = false;
    }
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]!;

    if (char === "'" || char === '"') {
      const closing = input.indexOf(char, i + 1);
      if (closing === -1) {
        throw new ParseError(`unexpected EOF while looking for matching \`${char}'`);
      }
      let body = input.slice(i + 1, closing);
      if (char === '"') body = body.replace(/\\(["\\$`])/g, '$1');
      current += body;
      hasContent = true;
      quoted = true;
      i = closing;
      continue;
    }

    if (char === '\\' && i + 1 < input.length) {
      current += input[i + 1];
      hasContent = true;
      i += 1;
      continue;
    }

    if (char === ' ' || char === '\t') {
      flush();
      continue;
    }

    if (char === '|') {
      flush();
      tokens.push({ kind: 'pipe', value: '|', quoted: false });
      continue;
    }

    if (char === '>') {
      flush();
      if (input[i + 1] === '>') {
        tokens.push({ kind: 'redirect-append', value: '>>', quoted: false });
        i += 1;
      } else {
        tokens.push({ kind: 'redirect', value: '>', quoted: false });
      }
      continue;
    }

    current += char;
    hasContent = true;
  }

  flush();
  return tokens;
}

/** Parse a full command line. Returns null for an empty or comment-only line. */
export function parse(input: string): Pipeline | null {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed.startsWith('#')) return null;

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return null;

  const stages: Stage[] = [];
  let currentArgv: string[] = [];
  let redirect: Pipeline['redirect'];

  const pushStage = () => {
    if (currentArgv.length > 0) {
      stages.push({ argv: currentArgv, raw: currentArgv.join(' ') });
      currentArgv = [];
    }
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;

    if (token.kind === 'pipe') {
      if (currentArgv.length === 0) throw new ParseError('syntax error near unexpected token `|\'');
      pushStage();
      continue;
    }

    if (token.kind === 'redirect' || token.kind === 'redirect-append') {
      const target = tokens[i + 1];
      if (!target || target.kind !== 'word') {
        throw new ParseError('syntax error near unexpected token `newline\'');
      }
      redirect = { path: target.value, append: token.kind === 'redirect-append' };
      i += 1;
      continue;
    }

    currentArgv.push(token.value);
  }

  pushStage();
  if (stages.length === 0) throw new ParseError('syntax error near unexpected token `|\'');

  return { stages, redirect, raw: trimmed };
}

// --- per-command argument parsing --------------------------------------------

export interface ParsedArgs {
  /** Short boolean flags, stored without the dash: `-la` yields 'l' and 'a'. */
  flags: Set<string>;
  /** Long flags without the dashes: `--color=auto` yields key 'color'. */
  longFlags: Map<string, string | true>;
  /** Values for flags declared in `valueFlags`, e.g. `-n 10` yields n -> "10". */
  values: Map<string, string>;
  /** Everything that was not a flag. */
  positionals: string[];
}

export interface ParseArgsOptions {
  /** Short flags that consume the next token as their value, e.g. head's `-n`. */
  valueFlags?: string[];
  /** Long flags that consume the next token as their value. */
  longValueFlags?: string[];
}

/**
 * Parse one command's arguments.
 *
 * `argv` is the FULL argument vector including the command name at index 0, as
 * handed to a command handler. That element is skipped: without this, `id
 * student` would parse "id" as a positional and look up a user by that name.
 *
 * Handles the grouping students actually type: `-la`, `-l -a`, `-n10`, `-n 10`,
 * `--color=auto`, and a bare `--` terminator. Unknown short flags are collected
 * rather than rejected, so the command itself decides what to complain about.
 */
export function parseArgs(argv: string[], options: ParseArgsOptions = {}): ParsedArgs {
  const valueFlags = new Set(options.valueFlags ?? []);
  const longValueFlags = new Set(options.longValueFlags ?? []);

  const flags = new Set<string>();
  const longFlags = new Map<string, string | true>();
  const values = new Map<string, string>();
  const positionals: string[] = [];

  let onlyPositionals = false;

  for (let i = 1; i < argv.length; i += 1) {
    const token = argv[i]!;

    if (onlyPositionals) {
      positionals.push(token);
      continue;
    }

    if (token === '--') {
      onlyPositionals = true;
      continue;
    }

    if (token.startsWith('--')) {
      const body = token.slice(2);
      const equals = body.indexOf('=');
      if (equals !== -1) {
        longFlags.set(body.slice(0, equals), body.slice(equals + 1));
      } else if (longValueFlags.has(body) && i + 1 < argv.length) {
        longFlags.set(body, argv[i + 1]!);
        i += 1;
      } else {
        longFlags.set(body, true);
      }
      continue;
    }

    // A lone "-" is a positional (it means stdin), not a flag.
    if (token.startsWith('-') && token.length > 1) {
      const body = token.slice(1);
      for (let j = 0; j < body.length; j += 1) {
        const flag = body[j]!;
        if (valueFlags.has(flag)) {
          const inline = body.slice(j + 1);
          if (inline !== '') {
            // `-n10`
            values.set(flag, inline);
          } else if (i + 1 < argv.length) {
            // `-n 10`
            values.set(flag, argv[i + 1]!);
            i += 1;
          }
          flags.add(flag);
          break;
        }
        flags.add(flag);
      }
      continue;
    }

    positionals.push(token);
  }

  return { flags, longFlags, values, positionals };
}

/**
 * Normalise a command line for comparison against an exercise's expected answer.
 *
 * Two students who type `grep -i "failed" f` and `grep -i failed f` have done
 * the identical thing, and the grader must agree. This collapses whitespace and
 * strips quotes that do not change meaning, while leaving quotes intact when the
 * quoted text contains a space (where they genuinely matter).
 */
export function normalizeCommand(input: string): string {
  let pipeline: Pipeline | null;
  try {
    pipeline = parse(input);
  } catch {
    return input.trim().replace(/\s+/g, ' ');
  }
  if (!pipeline) return '';

  const renderStage = (stage: Stage) =>
    stage.argv.map((token) => (/[\s|>]/.test(token) ? JSON.stringify(token) : token)).join(' ');

  let result = pipeline.stages.map(renderStage).join(' | ');
  if (pipeline.redirect) {
    result += ` ${pipeline.redirect.append ? '>>' : '>'} ${pipeline.redirect.path}`;
  }
  return result;
}
