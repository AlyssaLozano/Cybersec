/**
 * Here-documents, and running more than one line at a time.
 *
 * WHY THIS EXISTS
 *
 * The engine could not create a file with more than one line in it. Redirection
 * writes whatever the last stage printed, and there is no editor, no `sed`, and
 * no way to append a second line except by running `echo ... >>` again and
 * again. That is fine for a Suricata rule, which is one line, and it makes YARA
 * rules, Sigma rules and Ansible tasks impossible to author at all -- which
 * rules out the tooling half of several careers.
 *
 * A here-document is the real shell answer to this, it is what people actually
 * type when they write a config file from a terminal or a script, and it needs
 * no new commands: `cat > rules.yar <<'EOF'` works because `cat` with no
 * operands already reads stdin and `>` already redirects. All that was missing
 * was somewhere for the body to come from.
 *
 * WHAT IS FAITHFUL AND WHAT IS NOT
 *
 * Quoted (`<<'EOF'`) and unquoted (`<<EOF`) delimiters behave identically here.
 * In bash the difference is that an unquoted delimiter expands variables and
 * command substitutions inside the body; this engine has no variable expansion
 * anywhere, so there is nothing to expand and the two cannot differ. Writing the
 * quoted form is still the right habit and the teaching material uses it, but
 * nobody should be told the engine is enforcing something it is not.
 *
 * `<<-` is supported and strips leading tabs from the body and the terminator,
 * as it does in bash. Leading spaces are not stripped, which is also bash.
 */

import { runLine, type ShellOptions, type ShellResult } from './shell.js';

/** One command, plus the here-document body attached to it, if any. */
interface ScriptLine {
  command: string;
  stdin?: string;
}

/**
 * Matches a here-document operator and captures its delimiter.
 *
 * The delimiter may be bare, single-quoted or double-quoted, and `<<-` is the
 * tab-stripping variant. Anchored to the end of the line because a here-doc
 * operator is always the last thing on the command that opens it.
 */
const HEREDOC = /<<(-?)\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_][A-Za-z0-9_]*))\s*$/;

/**
 * Split multi-line input into commands, folding here-document bodies into the
 * command that opened them.
 *
 * An unterminated here-document is not an error: bash would sit at a
 * continuation prompt, and the closest honest equivalent here is to run the
 * command with whatever body was supplied. Reporting "unexpected EOF" would be
 * more bash-like and less useful, because the student cannot see a prompt to
 * realise they are still inside one.
 */
export function splitScript(input: string): ScriptLine[] {
  const lines = input.split('\n');
  const out: ScriptLine[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;
    if (line.trim() === '') continue;

    const match = HEREDOC.exec(line);
    if (!match) {
      out.push({ command: line });
      continue;
    }

    const stripTabs = match[1] === '-';
    const delimiter = match[2] ?? match[3] ?? match[4]!;
    const command = line.slice(0, match.index).trimEnd();

    const body: string[] = [];
    i += 1;
    for (; i < lines.length; i += 1) {
      const candidate = stripTabs ? lines[i]!.replace(/^\t+/, '') : lines[i]!;
      if (candidate === delimiter) break;
      body.push(candidate);
    }

    // A here-document body always ends with a newline, including when empty:
    // `cat > f <<EOF` immediately followed by `EOF` produces an empty file in
    // bash, not a file containing one blank line.
    out.push({ command, stdin: body.length === 0 ? '' : body.join('\n') + '\n' });
  }

  return out;
}

/**
 * Run a whole submission, which may be several lines and may contain
 * here-documents.
 *
 * Threads the working directory through, so `cd /etc` on one line affects the
 * next, and concatenates output the way a terminal would. The exit code is the
 * last command's, as in a shell.
 */
export function runScript(input: string, options: ShellOptions): ShellResult {
  const script = splitScript(input);

  let cwd = options.cwd;
  let output = '';
  let exitCode = 0;
  let mutated = false;

  for (const { command, stdin } of script) {
    const result = runLine(command, { ...options, cwd, stdin });
    cwd = result.cwd;
    output += result.output;
    exitCode = result.exitCode;
    mutated = mutated || result.mutated;
  }

  return { output, exitCode, cwd, mutated };
}
