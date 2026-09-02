/**
 * osquery table contents and SQL behaviour.
 *
 * The tables have to agree with the rest of the engine, because a student will
 * cross-check them: `SELECT count(*) FROM processes` and `ps aux | wc -l` are
 * the same question asked twice, and if they disagree the student learns that
 * one of their tools is lying without learning which. Several tests below assert
 * exactly that agreement rather than a hardcoded number.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { runScript } from '../script.js';
import { BASE_IMAGE } from '../../vfs/image.js';
import { MACHINE } from '../../vfs/machine.js';
import { emptyOverlay } from '../../vfs/types.js';
import { Vfs } from '../../vfs/vfs.js';

const HOME = '/home/student';

function session() {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  return {
    run(input: string) {
      return runScript(input, { vfs, machine: MACHINE, cwd: HOME });
    },
    /** A count(*) query, as a number. */
    count(sql: string): number {
      const out = this.run(`osqueryi --csv "SELECT count(*) FROM ${sql}" | tail -n 1`).output;
      return Number(out.trim());
    },
    /** Rows of a --csv query, excluding the header. */
    rows(sql: string): string[] {
      const out = this.run(`osqueryi --csv "${sql}"`).output.trim();
      if (out === '') return [];
      return out.split('\n').slice(1);
    },
  };
}

describe('osqueryi', () => {
  let s: ReturnType<typeof session>;

  beforeEach(() => {
    s = session();
  });

  describe('agreeing with the rest of the engine', () => {
    it('counts the same processes ps does', () => {
      const viaPs = Number(s.run('ps aux | tail -n +2 | wc -l').output.trim());
      expect(s.count('processes')).toBe(viaPs);
    });

    it('lists the same listening ports ss does', () => {
      const port = s.rows("SELECT port FROM listening_ports WHERE port = 5432");
      expect(port.length).toBeGreaterThan(0);
      // postgres is loopback-bound, which several exercises depend on.
      const address = s.rows("SELECT address FROM listening_ports WHERE port = 5432");
      expect(address[0]).toContain('127.0.0.1');
    });

    it('reads the same accounts /etc/passwd holds', () => {
      const viaGrep = Number(s.run('grep -c "" /etc/passwd').output.trim());
      expect(s.count('users')).toBe(viaGrep);
    });

    it('finds the backdoor account the intrusion created', () => {
      expect(s.rows("SELECT username FROM users WHERE uid = 1501")).toEqual(['sysmon']);
    });

    it('finds the outbound session to the exfiltration address', () => {
      const rows = s.rows(
        "SELECT remote_address, path FROM process_open_sockets WHERE remote_address = '198.51.100.60'",
      );
      expect(rows).toHaveLength(1);
      expect(rows[0]).toContain('curl');
    });

    it('finds the attacker cron entry', () => {
      const rows = s.rows("SELECT command FROM crontab WHERE command LIKE '%198.51.100.60%'");
      expect(rows).toHaveLength(1);
    });

    it('reads shell history the file mode allows, as cat does', () => {
      const viaCat = s.run('cat /home/testuser/.bash_history | wc -l').output.trim();
      expect(s.count("shell_history WHERE username = 'testuser'")).toBe(Number(viaCat));
    });
  });

  describe('SQL', () => {
    it('supports WHERE with comparison operators', () => {
      expect(s.count('users WHERE uid >= 1000')).toBeGreaterThan(0);
      expect(s.count('users WHERE uid >= 1000') + s.count('users WHERE uid < 1000')).toBe(
        s.count('users'),
      );
    });

    it('supports LIKE and NOT LIKE, which partition the rows', () => {
      const shells = s.count("users WHERE shell LIKE '%nologin'");
      const interactive = s.count("users WHERE shell NOT LIKE '%nologin'");
      expect(shells + interactive).toBe(s.count('users'));
    });

    it('supports IN and NOT IN', () => {
      expect(s.count("users WHERE username IN ('root','sysmon')")).toBe(2);
      expect(s.count("users WHERE username NOT IN ('root','sysmon')")).toBe(s.count('users') - 2);
    });

    it('supports AND, OR and parentheses with correct precedence', () => {
      // (a AND b) OR c must differ from a AND (b OR c) on this data, or the
      // test proves nothing about precedence.
      const grouped = s.count("users WHERE (uid >= 1000 AND shell = '/bin/bash') OR username = 'root'");
      const other = s.count("users WHERE uid >= 1000 AND (shell = '/bin/bash' OR username = 'root')");
      expect(grouped).not.toBe(other);
    });

    it('supports ORDER BY in both directions', () => {
      const ascending = s.rows('SELECT uid FROM users ORDER BY uid LIMIT 1');
      const descending = s.rows('SELECT uid FROM users ORDER BY uid DESC LIMIT 1');
      expect(Number(ascending[0])).toBeLessThan(Number(descending[0]));
    });

    it('supports LIMIT', () => {
      expect(s.rows('SELECT username FROM users LIMIT 3')).toHaveLength(3);
    });

    it('renders json, csv and line formats', () => {
      expect(s.run(`osqueryi --json "SELECT hostname FROM system_info"`).output).toContain(
        '"hostname": "rmg-web-02"',
      );
      expect(s.run(`osqueryi --csv "SELECT hostname FROM system_info"`).output).toContain(
        'hostname\nrmg-web-02',
      );
      expect(s.run(`osqueryi --line "SELECT hostname FROM system_info"`).output).toContain(
        'hostname = rmg-web-02',
      );
    });

    it('prints a box table by default, as osqueryi does', () => {
      const out = s.run(`osqueryi "SELECT hostname FROM system_info"`).output;
      const lines = out.trim().split('\n');
      // Columns are sized to the widest value, not to the header, so the rule
      // width is asserted by shape rather than by a fixed count.
      expect(lines[0]).toMatch(/^\+-+\+$/);
      expect(lines[1]).toMatch(/^\|\s+hostname\s+\|$/);
      expect(lines[3]).toContain('rmg-web-02');
      expect(lines[0]).toBe(lines[4]);
    });
  });

  describe('refusing clearly', () => {
    it('names the tables it has when one is missing', () => {
      const out = s.run(`osqueryi "SELECT * FROM nonesuch"`).output;
      expect(out).toContain('no such table: nonesuch');
      expect(out).toContain('processes');
    });

    it('names the columns it has when one is missing', () => {
      const out = s.run(`osqueryi "SELECT bogus FROM users"`).output;
      expect(out).toContain('no such column: bogus');
      expect(out).toContain('username');
    });

    it('reports an unsupported clause as unsupported, not as a syntax error', () => {
      // A student who writes valid SQL should be told the build does not do it,
      // rather than being pointed at a word they spelled correctly.
      const out = s.run(`osqueryi "SELECT * FROM users JOIN groups"`).output;
      expect(out).toContain('no JOIN or GROUP BY');
      expect(out).not.toContain('unexpected');
    });

    it('reports a genuine syntax error', () => {
      expect(s.run(`osqueryi "SELCT * FROM users"`).output).toContain('expected SELECT');
    });

    it('requires a constraint on the file table, as real osquery does', () => {
      const out = s.run(`osqueryi "SELECT path FROM file"`).output;
      expect(out).toContain('constraint required');
      expect(s.count("file WHERE directory = '/var/log'")).toBeGreaterThan(0);
    });

    it('explains itself when given no query at all', () => {
      expect(s.run('osqueryi').output).toContain('no interactive shell');
    });
  });

  describe('hunting queries the Threat Hunter material is built on', () => {
    it('finds interactive accounts, which is where a hunt usually starts', () => {
      const rows = s.rows(
        "SELECT username FROM users WHERE shell NOT LIKE '%nologin' AND shell NOT LIKE '%false' AND uid >= 1000",
      );
      expect(rows).toContain('sysmon');
      expect(rows).toContain('testuser');
    });

    it('finds every process not owned by root', () => {
      expect(s.count("processes WHERE username != 'root'")).toBeGreaterThan(0);
      expect(s.count("processes WHERE username != 'root'")).toBeLessThan(s.count('processes'));
    });

    it('finds setuid binaries', () => {
      expect(s.count('suid_bin')).toBeGreaterThan(0);
      expect(s.rows('SELECT permissions FROM suid_bin LIMIT 1')[0]).toContain('s');
    });

    it('separates external sessions from internal ones', () => {
      const external = s.count(
        "process_open_sockets WHERE remote_address NOT LIKE '10.%' AND remote_address NOT LIKE '127.%' AND remote_address != '0.0.0.0'",
      );
      expect(external).toBe(1);
    });
  });
});
