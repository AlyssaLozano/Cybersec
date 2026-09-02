/**
 * Engine tests.
 *
 * These assert the behaviour the exercises grade against. If a test here changes,
 * an exercise's correct answer has probably changed with it -- which is the
 * point of pinning them.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import { emptyOverlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';
import { normalizeCommand, parse, parseArgs } from './parser.js';
import { runLine } from './shell.js';

const HOME = '/home/student';

/** A fresh session, as a student gets when they open an exercise. */
function session() {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  let cwd = HOME;

  return {
    vfs,
    get cwd() {
      return cwd;
    },
    run(input: string) {
      const result = runLine(input, { vfs, machine: MACHINE, cwd });
      cwd = result.cwd;
      return result;
    },
  };
}

describe('parser', () => {
  it('splits a pipeline into stages', () => {
    const pipeline = parse('grep "Failed" /var/log/auth.log | wc -l');
    expect(pipeline?.stages).toHaveLength(2);
    expect(pipeline?.stages[0]?.argv).toEqual(['grep', 'Failed', '/var/log/auth.log']);
    expect(pipeline?.stages[1]?.argv).toEqual(['wc', '-l']);
  });

  it('keeps quoted spaces together', () => {
    expect(parse('grep "invalid user" f')?.stages[0]?.argv).toEqual(['grep', 'invalid user', 'f']);
  });

  it('reports an unterminated quote instead of guessing', () => {
    expect(() => parse('grep "oops')).toThrow(/unexpected EOF/);
  });

  it('captures redirection', () => {
    const pipeline = parse('ls > out.txt');
    expect(pipeline?.redirect).toEqual({ path: 'out.txt', append: false });
  });

  it('treats grouped and separated short flags identically', () => {
    expect(parseArgs(['ls', '-la']).flags).toEqual(parseArgs(['ls', '-l', '-a']).flags);
  });

  it('reads a value flag written either way', () => {
    expect(parseArgs(['head', '-n', '5'], { valueFlags: ['n'] }).values.get('n')).toBe('5');
    expect(parseArgs(['head', '-n5'], { valueFlags: ['n'] }).values.get('n')).toBe('5');
  });

  it('normalises equivalent commands to the same string', () => {
    expect(normalizeCommand('grep -i "failed"  /var/log/auth.log')).toBe(
      normalizeCommand('grep -i failed /var/log/auth.log'),
    );
  });
});

describe('navigation', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('starts in the home directory', () => {
    expect(s.run('pwd').output).toBe('/home/student\n');
  });

  it('changes directory and reports the new location', () => {
    s.run('cd /var');
    expect(s.run('pwd').output).toBe('/var\n');
  });

  it('walks up with ..', () => {
    s.run('cd /var/log');
    s.run('cd ..');
    expect(s.run('pwd').output).toBe('/var\n');
  });

  it('goes home with ~', () => {
    s.run('cd /etc');
    s.run('cd ~');
    expect(s.run('pwd').output).toBe('/home/student\n');
  });

  it('refuses to descend into a file', () => {
    const result = s.run('cd /etc/hostname');
    expect(result.output).toContain('Not a directory');
    expect(result.exitCode).not.toBe(0);
  });

  it('reports a missing directory', () => {
    expect(s.run('cd /nope').output).toContain('No such file or directory');
  });
});

describe('ls', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('lists the home directory', () => {
    const output = s.run('ls').output;
    expect(output).toContain('Desktop');
    expect(output).toContain('Documents');
    expect(output).toContain('Downloads');
  });

  it('hides dotfiles unless -a is given', () => {
    expect(s.run('ls').output).not.toContain('.bashrc');
    expect(s.run('ls -a').output).toContain('.bashrc');
  });

  it('shows a permission string with -l', () => {
    expect(s.run('ls -l').output).toMatch(/[d-]rwx/);
  });

  it('marks setuid binaries with an s', () => {
    expect(s.run('ls -l /usr/bin/passwd').output).toContain('rwsr-xr-x');
  });

  it('expands a wildcard', () => {
    const output = s.run('ls /var/log/*.log').output;
    expect(output).toContain('/var/log/auth.log');
    expect(output).toContain('/var/log/kern.log');
    // *.log must not match the rotated auth.log.1 archive.
    expect(output).not.toContain('auth.log.1');
  });

  it('reports a missing path on stderr with a non-zero status', () => {
    const result = s.run('ls /nope');
    expect(result.output).toContain("cannot access '/nope'");
    expect(result.exitCode).toBe(2);
  });
});

describe('file operations persist across commands', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('creates, copies, renames, and removes a file', () => {
    s.run('touch test.txt');
    expect(s.run('ls').output).toContain('test.txt');

    s.run('cp test.txt test_backup.txt');
    expect(s.run('ls').output).toContain('test_backup.txt');

    s.run('mv test_backup.txt backup.txt');
    const afterMove = s.run('ls').output;
    expect(afterMove).toContain('backup.txt');
    expect(afterMove).not.toContain('test_backup.txt');

    s.run('rm test.txt');
    expect(s.run('ls').output).not.toContain('test.txt');
  });

  it('creates and removes a directory', () => {
    s.run('mkdir logs');
    expect(s.run('ls').output).toContain('logs');
    s.run('rmdir logs');
    expect(s.run('ls').output).not.toContain('logs');
  });

  it('refuses to rmdir a directory that is not empty', () => {
    s.run('mkdir logs');
    s.run('touch logs/a.txt');
    expect(s.run('rmdir logs').output).toContain('Directory not empty');
  });

  it('refuses to rm a directory without -r', () => {
    s.run('mkdir logs');
    expect(s.run('rm logs').output).toContain('Is a directory');
  });

  it('removes a directory tree with -r, hiding its contents', () => {
    s.run('mkdir -p wiped/inner');
    s.run('touch wiped/inner/c.txt');
    s.run('rm -r wiped');
    // Split on whitespace: a substring check would match "wiped" inside nothing,
    // but single-letter names would match half the listing.
    expect(s.run('ls').output.trim().split(/\s+/)).not.toContain('wiped');
    // Deleting the parent must hide descendants too, not just the directory.
    expect(s.run('cat wiped/inner/c.txt').output).toContain('No such file');
  });

  it('leaves the shared base image untouched for the next student', () => {
    s.run('rm /home/student/notes.txt');
    expect(s.run('ls').output).not.toContain('notes.txt');
    // A brand-new session must still see the original file.
    expect(session().run('ls').output).toContain('notes.txt');
  });
});

describe('reading files', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('cats a small file', () => {
    expect(s.run('cat /etc/hostname').output).toBe('rmg-web-02\n');
  });

  it('honours file permissions', () => {
    const result = s.run('cat /etc/shadow');
    expect(result.output).toContain('Permission denied');
    expect(result.exitCode).not.toBe(0);
  });

  it('head -n 10 returns exactly ten lines', () => {
    const output = s.run('head -n 10 /var/log/auth.log').output;
    expect(output.trimEnd().split('\n')).toHaveLength(10);
  });

  it('tail -n 5 returns exactly five lines', () => {
    const output = s.run('tail -n 5 /var/log/auth.log').output;
    expect(output.trimEnd().split('\n')).toHaveLength(5);
  });

  it('tail returns the end of the file, not the start', () => {
    const head = s.run('head -n 1 /var/log/auth.log').output;
    const tail = s.run('tail -n 1 /var/log/auth.log').output;
    expect(head).not.toBe(tail);
  });

  it('explains that less cannot page in a browser', () => {
    expect(s.run('less /var/log/syslog').output).toContain('no interactive pager');
  });
});

describe('grep', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('finds failed password lines', () => {
    const result = s.run('grep "Failed password" /var/log/auth.log');
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain('Failed password for');
  });

  it('-c returns a bare count', () => {
    const output = s.run('grep -c "Failed password" /var/log/auth.log').output.trim();
    expect(output).toMatch(/^\d+$/);
    expect(Number(output)).toBeGreaterThan(100);
  });

  it('-c and a wc -l pipe agree', () => {
    const counted = s.run('grep -c "Failed password" /var/log/auth.log').output.trim();
    const piped = s.run('grep "Failed password" /var/log/auth.log | wc -l').output.trim();
    expect(piped).toBe(counted);
  });

  it('-i is case insensitive', () => {
    const sensitive = Number(s.run('grep -c "failed" /var/log/auth.log').output.trim());
    const insensitive = Number(s.run('grep -ci "failed" /var/log/auth.log').output.trim());
    expect(insensitive).toBeGreaterThan(sensitive);
  });

  it('-n prefixes line numbers', () => {
    expect(s.run('grep -n "sudo" /var/log/auth.log').output).toMatch(/^\d+:/m);
  });

  it('-v inverts the match', () => {
    expect(s.run('grep -v "nagios" /var/log/auth.log').output).not.toContain('nagios');
  });

  it('-o prints only the matched text', () => {
    const output = s.run("grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' /var/log/auth.log").output;
    expect(output.split('\n')[0]).toMatch(/^\d{1,3}(\.\d{1,3}){3}$/);
  });

  it('extracts a field with -oP and \\K', () => {
    const output = s.run("grep -oP 'user=\\K[^ ]*' /var/log/auth.log").output;
    expect(output).toContain('nagios');
    expect(output).not.toContain('user=');
  });

  it('treats | as a literal without -E, and as alternation with it', () => {
    const basic = s.run('grep -c "started|stopped" /var/log/syslog').output.trim();
    const extended = s.run('grep -cE "Started|Succeeded" /var/log/syslog').output.trim();
    expect(Number(basic)).toBe(0);
    expect(Number(extended)).toBeGreaterThan(0);
  });

  it('prefixes the filename when searching several files', () => {
    const output = s.run('grep "testuser" /var/log/auth.log /var/log/syslog').output;
    expect(output).toContain('/var/log/auth.log:');
    expect(output).toContain('/var/log/syslog:');
  });

  it('exits 1 when nothing matches', () => {
    const result = s.run('grep "zzzznotpresent" /var/log/auth.log');
    expect(result.exitCode).toBe(1);
    expect(result.output).toBe('');
  });
});

describe('pipelines and redirection', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('chains three stages', () => {
    const output = s.run(
      "grep 'sshd' /var/log/auth.log | grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' | sort -u",
    ).output;
    const addresses = output.trim().split('\n');
    expect(addresses.length).toBeGreaterThan(3);
    // sort -u must leave the list unique and ordered.
    expect(new Set(addresses).size).toBe(addresses.length);
  });

  it('ranks counted output numerically, which is the whole point of uniq -c | sort -rn', () => {
    /*
     * Regression. `sort -n` parsed the key with Number(line), which is NaN for
     * every line uniq -c produces ("    288 rhost=..."), so every line scored
     * zero, the sort did nothing, and -r returned a reversed alphabetical list.
     * It looked like a ranking and ranked nothing: a student following the
     * standard "who hit us hardest" recipe read the wrong address off the top.
     */
    const output = s.run(
      "grep -oE 'rhost=[0-9.]+' /var/log/auth.log | sort | uniq -c | sort -rn",
    ).output;
    const counts = output
      .trim()
      .split('\n')
      .map((line) => Number(line.trim().split(/\s+/)[0]));

    expect(counts.length).toBeGreaterThan(3);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('writes stdout to a file with >', () => {
    s.run('grep -c "Accepted" /var/log/auth.log > count.txt');
    expect(s.run('cat count.txt').output.trim()).toBe('9');
  });

  it('appends with >>', () => {
    s.run('echo one > f.txt');
    s.run('echo two >> f.txt');
    expect(s.run('cat f.txt').output).toBe('one\ntwo\n');
  });
});

describe('system and network views', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('ps aux lists processes with a header', () => {
    const output = s.run('ps aux').output;
    expect(output).toContain('USER');
    expect(output).toContain('nginx');
  });

  it('finds the process listening on port 22', () => {
    expect(s.run('netstat -tlnp | grep :22').output).toContain('sshd');
  });

  it('shows established connections only when asked', () => {
    expect(s.run('netstat -tn | grep ESTABLISHED').output).toContain('ESTABLISHED');
  });

  it('reports the host address', () => {
    expect(s.run('ip addr show').output).toContain('10.20.6.40');
  });

  it('requires a packet count for ping so it terminates', () => {
    expect(s.run('ping google.com').output).toContain('requires a packet count');
    expect(s.run('ping -c 3 google.com').output).toContain('3 packets transmitted');
  });

  it('resolves a name and its reverse', () => {
    expect(s.run('dig example.com').output).toContain('192.0.2.10');
    expect(s.run('dig -x 8.8.8.8').output).toContain('dns.google');
  });

  it('reads identity out of the same passwd file the student can cat', () => {
    expect(s.run('id student').output).toContain('uid=1000(student)');
    expect(s.run('cat /etc/passwd').output).toContain('student:x:1000');
  });
});

describe('find', () => {
  let s: ReturnType<typeof session>;
  beforeEach(() => {
    s = session();
  });

  it('finds setuid binaries', () => {
    const output = s.run('find /usr/bin -perm -4000').output;
    expect(output).toContain('/usr/bin/passwd');
    expect(output).toContain('/usr/bin/sudo');
  });

  it('filters by owner', () => {
    expect(s.run('find /home -owner jmartel').output).toContain('/home/jmartel');
  });

  it('filters by type and name', () => {
    expect(s.run('find /var/log -type f -name "*.log"').output).toContain('/var/log/auth.log');
  });

  it('says plainly that -exec is unsupported instead of ignoring it', () => {
    const result = s.run('find /home -type f -exec ls -lh {} ;');
    expect(result.output).toContain('not supported');
    expect(result.exitCode).not.toBe(0);
  });
});

describe('unknown input', () => {
  it('reports command not found with status 127', () => {
    const result = session().run('sl -la');
    expect(result.output).toBe('sl: command not found\n');
    expect(result.exitCode).toBe(127);
  });

  it('does nothing on a blank line', () => {
    const result = session().run('   ');
    expect(result.output).toBe('');
    expect(result.exitCode).toBe(0);
  });
});
