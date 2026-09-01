import { describe, expect, it } from 'vitest';

import { runLine } from '../terminal/shell.js';
import { BASE_IMAGE } from '../vfs/image.js';
import { MACHINE } from '../vfs/machine.js';
import type { Overlay } from '../vfs/types.js';
import { Vfs } from '../vfs/vfs.js';

/**
 * The load-bearing assumption of the defender terminal: Red's activity, layered
 * onto the seeded host as one overlay file, is readable with the ordinary shell.
 * If this holds, `runTerminal` in `matches.ts` gives Blue a real investigation.
 */
const HOST_LOG = '/var/log/edge.log';

function overlayWith(lines: string[]): Overlay {
  return {
    writes: {
      [HOST_LOG]: {
        kind: 'file',
        mode: 0o644,
        owner: 'root',
        group: 'adm',
        mtime: 0,
        content: ['# Edge appliance log', ...lines].join('\n') + '\n',
      },
    },
    deletes: [],
  };
}

describe('defender terminal reads the injected host log', () => {
  const overlay = overlayWith([
    'Sep 01 14:09:03 edge kernel: [UFW BLOCK] SRC=203.0.113.9 horizontal scan',
    'Sep 01 14:02:11 edge nginx: 203.0.113.9 "GET / HTTP/1.1" 200 "curl/8.4.0"',
  ]);

  function run(command: string) {
    const vfs = new Vfs(BASE_IMAGE, overlay, '/home/student');
    return runLine(command, { vfs, machine: MACHINE, cwd: '/home/student' });
  }

  it('cats the log Red wrote to', () => {
    const res = run(`cat ${HOST_LOG}`);
    expect(res.exitCode).toBe(0);
    expect(res.output).toContain('UFW BLOCK');
  });

  it('greps it like a real appliance log', () => {
    const res = run(`grep BLOCK ${HOST_LOG}`);
    expect(res.exitCode).toBe(0);
    expect(res.output).toContain('horizontal scan');
    expect(res.output).not.toContain('nginx');
  });

  it('tails it', () => {
    const res = run(`tail -n 1 ${HOST_LOG}`);
    expect(res.output).toContain('nginx');
  });
});
