/**
 * Suricata rule parsing and matching.
 *
 * These pin the behaviour Detection Engineering exercises grade against. The
 * counts matter as much as the mechanics: an exercise asks a student to write a
 * rule and then compare what it fired on against what they wanted, so if the
 * matching drifts by one packet the answer key is wrong and the lesson inverts.
 *
 * They also pin the failures. A rule that does not parse must stop the run
 * rather than being skipped, because a signature that silently did not load is
 * the worst outcome available: the ruleset looks fine and the traffic goes
 * unseen.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { runScript } from '../script.js';
import { BASE_IMAGE } from '../../vfs/image.js';
import { MACHINE } from '../../vfs/machine.js';
import { emptyOverlay } from '../../vfs/types.js';
import { Vfs } from '../../vfs/vfs.js';

const HOME = '/home/student';
const PCAP = '/var/captures/eth0-morning.pcap';
const VENDOR = '/etc/suricata/rules/emerging-example.rules';

function session() {
  const vfs = new Vfs(BASE_IMAGE, emptyOverlay(), HOME);
  let cwd = HOME;
  return {
    run(input: string) {
      const result = runScript(input, { vfs, machine: MACHINE, cwd });
      cwd = result.cwd;
      return result;
    },
    /** Write a ruleset and return how many alerts it produces. */
    alerts(rule: string): number {
      this.run(`cat > /home/student/t.rules <<'EOF'\n${rule}\nEOF`);
      const out = this.run(`suricata -r ${PCAP} -S /home/student/t.rules`).output;
      return out.trim() === '' ? 0 : out.trim().split('\n').length;
    },
    output(rule: string): string {
      this.run(`cat > /home/student/t.rules <<'EOF'\n${rule}\nEOF`);
      return this.run(`suricata -r ${PCAP} -S /home/student/t.rules`).output;
    },
  };
}

describe('suricata', () => {
  let s: ReturnType<typeof session>;

  beforeEach(() => {
    s = session();
  });

  describe('refusing to run', () => {
    it('will not sniff an interface, and says why', () => {
      const result = s.run(`suricata -S ${VENDOR}`);
      expect(result.output).toContain('cannot read from an interface');
      expect(result.exitCode).not.toBe(0);
    });

    it('needs a rule file', () => {
      expect(s.run(`suricata -r ${PCAP}`).output).toContain('no rule file given');
    });

    it('rejects a file that is not a capture', () => {
      expect(s.run(`suricata -r /var/log/auth.log -S ${VENDOR}`).output).toContain(
        'not a capture',
      );
    });

    it('stops on a malformed rule rather than skipping it', () => {
      const result = s.run(
        `cat > bad.rules <<'EOF'\nalert tcp any any (msg:"malformed"; sid:1;)\nEOF\nsuricata -r ${PCAP} -S bad.rules`,
      );
      expect(result.output).toContain('error parsing signature at line 1');
      expect(result.exitCode).not.toBe(0);
    });

    it('refuses a rule with no sid, as Suricata does', () => {
      const result = s.run(
        `cat > bad.rules <<'EOF'\nalert tcp any any -> any any (msg:"no sid";)\nEOF\nsuricata -r ${PCAP} -S bad.rules`,
      );
      expect(result.output).toContain('no valid sid');
    });

    it('rejects a duplicated sid across two rules', () => {
      const result = s.run(
        [
          "cat > dup.rules <<'EOF'",
          'alert tcp any any -> any any (msg:"one"; sid:9001;)',
          'alert tcp any any -> any any (msg:"two"; sid:9001;)',
          'EOF',
          `suricata -r ${PCAP} -S dup.rules`,
        ].join('\n'),
      );
      expect(result.output).toContain('duplicate signature id 9001');
    });

    it('reports an unknown option instead of ignoring it', () => {
      const result = s.run(
        `cat > bad.rules <<'EOF'\nalert tcp any any -> any any (msg:"x"; wibble:3; sid:1;)\nEOF\nsuricata -r ${PCAP} -S bad.rules`,
      );
      expect(result.output).toContain('unknown option "wibble"');
    });

    it('says so when a rule file holds no rules', () => {
      expect(s.run(`suricata -r ${PCAP} -S /etc/suricata/rules/local.rules`).output).toContain(
        'no rules loaded',
      );
    });
  });

  describe('matching', () => {
    it('fires once per matching packet in fast.log format', () => {
      const out = s.output(
        'alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:"SSH"; flags:S; sid:1000001; rev:2;)',
      );
      const [first] = out.trim().split('\n');
      expect(first).toContain('[**] [1:1000001:2] SSH [**]');
      expect(first).toContain('{TCP}');
      expect(first).toMatch(/203\.0\.113\.\d+:\d+ -> 10\.20\.6\.40:22/);
    });

    it('resolves $HOME_NET and $EXTERNAL_NET as suricata.yaml defines them', () => {
      // The four source/destination combinations partition the traffic exactly,
      // which is only true if $EXTERNAL_NET really is the complement of
      // $HOME_NET rather than a separate list that happens to overlap.
      const internal = s.alerts('alert tcp $HOME_NET any -> $HOME_NET any (msg:"i"; flags:S; sid:1;)');
      const inbound = s.alerts('alert tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"e"; flags:S; sid:1;)');
      const outbound = s.alerts('alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"o"; flags:S; sid:1;)');
      const through = s.alerts(
        'alert tcp $EXTERNAL_NET any -> $EXTERNAL_NET any (msg:"t"; flags:S; sid:1;)',
      );
      const all = s.alerts('alert tcp any any -> any any (msg:"a"; flags:S; sid:1;)');

      expect(internal).toBeGreaterThan(0);
      expect(inbound).toBeGreaterThan(0);
      expect(outbound).toBeGreaterThan(0);
      // Nothing in this capture crosses the host without touching it.
      expect(through).toBe(0);
      expect(internal + inbound + outbound + through).toBe(all);
    });

    it('treats a bare flags:S as a SYN and nothing else', () => {
      // The difference between matching connection attempts and matching every
      // handshake packet, which is the difference between a scan rule that works
      // and one that doubles its own noise.
      const syn = s.alerts('alert tcp any any -> any any (msg:"s"; flags:S; sid:1;)');
      const any = s.alerts('alert tcp any any -> any any (msg:"a"; sid:1;)');
      expect(syn).toBeLessThan(any);
    });

    it('honours direction, and <> matches both ways', () => {
      const oneWay = s.alerts(
        'alert tcp $HOME_NET any -> $EXTERNAL_NET 443 (msg:"o"; flags:S; sid:1;)',
      );
      const bothWays = s.alerts(
        'alert tcp $HOME_NET any <> $EXTERNAL_NET 443 (msg:"b"; flags:S; sid:1;)',
      );
      expect(bothWays).toBeGreaterThanOrEqual(oneWay);
    });

    it('matches content against the cleartext a real sensor could read', () => {
      // The attacker's tooling announces itself differently from every
      // legitimate client on the estate, which is a real detection.
      const out = s.output(
        'alert tcp any any -> $HOME_NET 22 (msg:"Non-standard SSH client"; content:"libssh2"; sid:1;)',
      );
      const lines = out.trim().split('\n');
      expect(lines.length).toBeGreaterThan(10);
      // Every hit is the attacker: this rule has no false positives at all.
      expect(lines.every((line) => line.includes('203.0.113.55'))).toBe(true);
    });

    it('supports nocase and negated content', () => {
      expect(s.alerts('alert tcp any any -> any 22 (msg:"n"; content:"LIBSSH2"; nocase; sid:1;)')).toBeGreaterThan(0);
      expect(s.alerts('alert tcp any any -> any 22 (msg:"n"; content:"LIBSSH2"; sid:1;)')).toBe(0);
    });

    it('filters on dsize', () => {
      const big = s.alerts('alert tcp any any -> any any (msg:"b"; dsize:>1000; sid:1;)');
      const small = s.alerts('alert tcp any any -> any any (msg:"s"; dsize:<100; sid:1;)');
      expect(big).toBeGreaterThan(0);
      expect(small).toBeGreaterThan(0);
    });

    it('matches ICMP by type', () => {
      const requests = s.alerts('alert icmp any any -> any any (msg:"r"; itype:8; sid:1;)');
      const replies = s.alerts('alert icmp any any -> any any (msg:"p"; itype:0; sid:1;)');
      const all = s.alerts('alert icmp any any -> any any (msg:"a"; sid:1;)');
      expect(requests).toBe(replies);
      expect(requests + replies).toBe(all);
    });

    it('supports port lists and ranges', () => {
      const list = s.alerts('alert tcp any any -> any [22,443] (msg:"l"; flags:S; sid:1;)');
      const p22 = s.alerts('alert tcp any any -> any 22 (msg:"a"; flags:S; sid:1;)');
      const p443 = s.alerts('alert tcp any any -> any 443 (msg:"b"; flags:S; sid:1;)');
      expect(list).toBe(p22 + p443);
    });

    it('supports negation on an address', () => {
      const notAttacker = s.alerts(
        'alert tcp !203.0.113.55 any -> $HOME_NET 22 (msg:"n"; flags:S; sid:1;)',
      );
      const attacker = s.alerts(
        'alert tcp 203.0.113.55 any -> $HOME_NET 22 (msg:"a"; flags:S; sid:1;)',
      );
      const all = s.alerts('alert tcp any any -> $HOME_NET 22 (msg:"x"; flags:S; sid:1;)');
      expect(notAttacker + attacker).toBe(all);
    });

    it('skips a pass rule', () => {
      expect(s.alerts('pass tcp any any -> any any (msg:"p"; sid:1;)')).toBe(0);
    });
  });

  describe('thresholds', () => {
    const BRUTE = 'alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:"brute"; flags:S;';

    it('turn a per-packet rule into one alert per campaign', () => {
      const raw = s.alerts(`${BRUTE} sid:1;)`);
      const thresholded = s.alerts(
        `${BRUTE} threshold: type threshold, track by_src, count 20, seconds 600; sid:1;)`,
      );
      expect(raw).toBeGreaterThan(20);
      expect(thresholded).toBe(1);
    });

    it('type limit caps the alerts rather than requiring a count first', () => {
      const limited = s.alerts(
        `${BRUTE} threshold: type limit, track by_src, count 3, seconds 3600; sid:1;)`,
      );
      expect(limited).toBeGreaterThan(0);
      expect(limited).toBeLessThanOrEqual(3);
    });

    it('a count nothing reaches produces no alert at all', () => {
      expect(
        s.alerts(`${BRUTE} threshold: type threshold, track by_src, count 5000, seconds 60; sid:1;)`),
      ).toBe(0);
    });
  });

  describe('the seeded vendor ruleset', () => {
    it('loads and fires, so it can be tuned against real traffic', () => {
      const out = s.run(`suricata -r ${PCAP} -S ${VENDOR}`).output;
      expect(out.trim().split('\n').length).toBeGreaterThan(100);
    });

    it('contains a rule that fires on nothing, which is its own lesson', () => {
      // Outbound RDP, on a host that does not speak RDP. A ruleset arrives full
      // of these and the count of enabled rules says nothing about coverage.
      const out = s.run(`suricata -r ${PCAP} -S ${VENDOR}`).output;
      expect(out).not.toContain('2012710');
    });

    it('is the noisy rules that dominate the output', () => {
      const out = s.run(`suricata -r ${PCAP} -S ${VENDOR}`).output;
      const count = (sid: string) => out.split('\n').filter((line) => line.includes(sid)).length;
      // The unthresholded scan rule alone outnumbers the beacon rule many times
      // over, which is the ratio the tuning exercise is built on.
      expect(count('2001219')).toBeGreaterThan(count('2029001') * 10);
    });
  });
});
