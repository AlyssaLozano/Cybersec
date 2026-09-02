/**
 * Here-documents and multi-line submissions.
 *
 * These pin the behaviour the rule-authoring exercises depend on. A student
 * writing a YARA or Sigma rule types a here-document and expects the file on
 * disk to contain exactly what they typed; if the body gains a blank line, loses
 * its indentation, or stops at the wrong terminator, every check downstream of
 * it grades the wrong text.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { runScript, splitScript } from './script.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

const HOME = '/home/student';

function session() {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  let cwd = HOME;
  return {
    vfs,
    run(input: string) {
      const result = runScript(input, { vfs, machine: MACHINE, cwd });
      cwd = result.cwd;
      return result;
    },
  };
}

describe('splitScript', () => {
  it('leaves ordinary lines alone', () => {
    expect(splitScript('ls -l\npwd')).toEqual([{ command: 'ls -l' }, { command: 'pwd' }]);
  });

  it('folds a here-document body into the command that opened it', () => {
    expect(splitScript("cat > f <<'EOF'\none\ntwo\nEOF")).toEqual([
      { command: 'cat > f', stdin: 'one\ntwo\n' },
    ]);
  });

  it('accepts bare, single-quoted and double-quoted delimiters alike', () => {
    const bare = splitScript('cat > f <<EOF\nx\nEOF');
    const single = splitScript("cat > f <<'EOF'\nx\nEOF");
    const double = splitScript('cat > f <<"EOF"\nx\nEOF');
    expect(bare).toEqual(single);
    expect(double).toEqual(single);
  });

  it('honours a custom terminator and ignores lines that merely contain it', () => {
    const [entry] = splitScript('cat > f <<END\nthe END is nigh\nEND');
    expect(entry!.stdin).toBe('the END is nigh\n');
  });

  it('strips leading tabs with <<- and leaves spaces alone', () => {
    const [tabs] = splitScript('cat > f <<-EOF\n\tindented\n\tEOF');
    expect(tabs!.stdin).toBe('indented\n');

    const [spaces] = splitScript('cat > f <<-EOF\n    indented\nEOF');
    expect(spaces!.stdin).toBe('    indented\n');
  });

  it('produces an empty body rather than a blank line for an empty here-document', () => {
    const [entry] = splitScript("cat > f <<'EOF'\nEOF");
    expect(entry!.stdin).toBe('');
  });

  it('keeps blank lines inside a body', () => {
    const [entry] = splitScript("cat > f <<'EOF'\none\n\ntwo\nEOF");
    expect(entry!.stdin).toBe('one\n\ntwo\n');
  });

  it('runs an unterminated here-document with what it has', () => {
    // bash would sit at a continuation prompt. There is no prompt to sit at
    // here, so the honest fallback is to use the body that was supplied.
    const [entry] = splitScript("cat > f <<'EOF'\nonly line");
    expect(entry!.stdin).toBe('only line\n');
  });
});

describe('runScript', () => {
  let s: ReturnType<typeof session>;

  beforeEach(() => {
    s = session();
  });

  it('writes a multi-line file exactly as typed', () => {
    s.run(
      ["cat > rule.yar <<'EOF'", 'rule Example', '{', '    condition:', '        true', '}', 'EOF'].join('\n'),
    );
    expect(s.run('cat rule.yar').output).toBe(
      'rule Example\n{\n    condition:\n        true\n}\n',
    );
  });

  it('preserves indentation, which YARA and Sigma both depend on', () => {
    s.run(["cat > f <<'EOF'", 'a:', '  b: 1', '    c: 2', 'EOF'].join('\n'));
    expect(s.run('cat f').output).toBe('a:\n  b: 1\n    c: 2\n');
  });

  it('appends with >> rather than truncating', () => {
    s.run("cat > f <<'EOF'\nfirst\nEOF");
    s.run("cat >> f <<'EOF'\nsecond\nEOF");
    expect(s.run('cat f').output).toBe('first\nsecond\n');
  });

  it('threads the working directory across lines in one submission', () => {
    const result = s.run('cd /var/log\npwd');
    expect(result.output.trim()).toBe('/var/log');
    expect(result.cwd).toBe('/var/log');
  });

  it('reports the last command exit code, as a shell does', () => {
    expect(s.run('pwd\nnosuchcommand').exitCode).toBe(127);
    expect(s.run('nosuchcommand\npwd').exitCode).toBe(0);
  });

  it('marks the run as mutating when a here-document created a file', () => {
    expect(s.run("cat > f <<'EOF'\nx\nEOF").mutated).toBe(true);
  });

  it('leaves single-line behaviour untouched', () => {
    expect(s.run('grep -c "Failed password" /var/log/auth.log').output.trim()).toBe('718');
    expect(s.run('echo hello | cat').output).toBe('hello\n');
  });

  it('does not leak a here-document body into the next command', () => {
    s.run("cat > f <<'EOF'\nbody\nEOF");
    // A bare `cat` with nothing piped in must print nothing, not the body above.
    expect(s.run('cat').output).toBe('');
  });

  it('can build a rule file large enough to be realistic', () => {
    const body = Array.from({ length: 40 }, (_, i) => `    $s${i} = "indicator_${i}" ascii`);
    s.run(["cat > big.yar <<'EOF'", 'rule Big', '{', '  strings:', ...body, '}', 'EOF'].join('\n'));
    expect(s.run('wc -l big.yar').output.trim().split(/\s+/)[0]).toBe('44');
  });
});
