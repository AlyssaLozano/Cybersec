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

describe('tcpdump', () => {
  const PCAP = '/var/captures/eth0-morning.pcap';
  let s: ReturnType<typeof session>;

  beforeEach(() => {
    s = session();
  });

  const lines = (input: string) =>
    s.run(input).output.split('\n').filter((line) => line !== '');

  it('refuses to sniff an interface and says why', () => {
    const result = s.run(`tcpdump ${PCAP}`);
    expect(result.output).toContain('cannot sniff an interface');
    expect(result.exitCode).not.toBe(0);
  });

  it('rejects a file that is not a capture', () => {
    const result = s.run('tcpdump -r /var/log/auth.log');
    expect(result.output).toContain('unknown file format');
    expect(result.exitCode).not.toBe(0);
  });

  it('prints one line per packet, so wc -l counts packets', () => {
    const count = Number(s.run(`tcpdump -n -r ${PCAP} | wc -l`).output.trim());
    const stored = Number(s.run(`cat ${PCAP} | wc -l`).output.trim());
    expect(count).toBe(stored);
  });

  it('stores records rather than rendered output, so grep is not a shortcut', () => {
    // The exercises depend on this: if `cat` showed tcpdump lines, every
    // filtering question could be answered without a filter.
    const raw = s.run(`head -n 1 ${PCAP}`).output;
    expect(raw).toContain('|');
    expect(raw).not.toContain(' IP ');
  });

  it('resolves names and services unless -n is given', () => {
    const named = s.run(`tcpdump -c 1 -r ${PCAP}`).output;
    const numeric = s.run(`tcpdump -n -c 1 -r ${PCAP}`).output;
    expect(named).toContain('rmg-web-02.ridgelinemed.example');
    expect(named).toContain('.jetdirect');
    expect(numeric).toContain('10.20.6.40');
    expect(numeric).not.toContain('rmg-web-02.ridgelinemed.example');
  });

  it('limits output with -c', () => {
    expect(lines(`tcpdump -n -c 5 -r ${PCAP}`)).toHaveLength(5);
  });

  it('drops the timestamp with -t', () => {
    const [first] = lines(`tcpdump -n -t -c 1 -r ${PCAP}`);
    expect(first!.startsWith('IP ')).toBe(true);
  });

  it('matches a host in either direction', () => {
    const both = lines(`tcpdump -n -r ${PCAP} 'host 203.0.113.55'`).length;
    const inbound = lines(`tcpdump -n -r ${PCAP} 'src host 203.0.113.55'`).length;
    const outbound = lines(`tcpdump -n -r ${PCAP} 'dst host 203.0.113.55'`).length;
    expect(inbound + outbound).toBe(both);
    expect(inbound).toBeGreaterThan(0);
    expect(outbound).toBeGreaterThan(0);
  });

  it('honours pcap precedence: not binds tighter than and, and than or', () => {
    // `tcp and port 22 or port 443` must mean `(tcp and port 22) or port 443`.
    const grouped = lines(`tcpdump -n -r ${PCAP} '(tcp and port 22) or port 443'`).length;
    const bare = lines(`tcpdump -n -r ${PCAP} 'tcp and port 22 or port 443'`).length;
    expect(bare).toBe(grouped);
  });

  it('filters by protocol', () => {
    const total = lines(`tcpdump -n -r ${PCAP}`).length;
    const tcp = lines(`tcpdump -n -r ${PCAP} 'tcp'`).length;
    const udp = lines(`tcpdump -n -r ${PCAP} 'udp'`).length;
    const icmp = lines(`tcpdump -n -r ${PCAP} 'icmp'`).length;
    expect(tcp + udp + icmp).toBe(total);
  });

  it('supports net with and without a mask', () => {
    const short = lines(`tcpdump -n -r ${PCAP} 'src net 10.20'`).length;
    const masked = lines(`tcpdump -n -r ${PCAP} 'src net 10.20.0.0/16'`).length;
    expect(short).toBe(masked);
  });

  it('reports a syntax error instead of silently matching nothing', () => {
    const result = s.run(`tcpdump -n -r ${PCAP} 'porp 22'`);
    expect(result.output).toContain('syntax error');
    expect(result.exitCode).not.toBe(0);
  });

  it('shows the DNS question rather than a byte count', () => {
    const [first] = lines(`tcpdump -n -c 1 -r ${PCAP} 'udp and port 53'`);
    expect(first).toContain('A? ');
  });

  it('pairs an ICMP reply with its request', () => {
    const [request, reply] = lines(`tcpdump -n -c 2 -r ${PCAP} 'icmp'`);
    const id = /id (\d+), seq (\d+)/.exec(request!);
    expect(id).not.toBeNull();
    expect(reply).toContain(`id ${id![1]}, seq ${id![2]}`);
    expect(request).toContain('echo request');
    expect(reply).toContain('echo reply');
  });

  it('advances the sequence number by the bytes sent', () => {
    // Without this an exercise cannot ask which end opened a connection, and a
    // student would learn that sequence numbers are decoration.
    const [syn, , ack] = lines(`tcpdump -n -c 3 -r ${PCAP}`);
    const seqOf = (line: string) => Number(/seq (\d+)/.exec(line)![1]);
    expect(syn).toContain('Flags [S]');
    expect(seqOf(ack!)).toBe(seqOf(syn!) + 1);
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
