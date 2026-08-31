/** Node kinds the simulator supports. Symlinks are intentionally out of scope. */
export type VKind = 'file' | 'dir';

/** A file or directory in the immutable base image. */
export interface VNode {
  kind: VKind;
  /** Octal permission bits, e.g. 0o644. Setuid (0o4000) is set on a few
   *  binaries so the SUID-hunting exercise has something to find. */
  mode: number;
  owner: string;
  group: string;
  /** Modification time in epoch milliseconds, relative to the frozen
   *  WORLD_NOW. Stored as a number rather than a display string so that
   *  `find -mtime` and `ls -lt` can actually compare and sort. */
  mtime: number;
  /** File contents. Undefined for directories. */
  content?: string;
  /** Explicit size for pseudo-files whose reported size differs from their
   *  content length (e.g. entries under /proc). */
  size?: number;
}

/** Base image: an absolute-path-keyed map. Flat storage keeps lookup O(1) and
 *  makes the copy-on-write overlay trivial to merge. */
export type BaseImage = ReadonlyMap<string, VNode>;

/**
 * A student's mutations against the base image.
 *
 * Storing only the diff matters: the seeded logs are hundreds of kilobytes, and
 * this is serialised into a database row after every single command.
 */
export interface Overlay {
  /** Created or modified nodes, keyed by absolute path. */
  writes: Record<string, VNode>;
  /** Absolute paths removed by the student. Shadows the base image. */
  deletes: string[];
}

export function emptyOverlay(): Overlay {
  return { writes: {}, deletes: [] };
}

/** A simulated running process, for `ps` / `top` / `netstat -p`. */
export interface VProcess {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  vsz: number;
  rss: number;
  tty: string;
  stat: string;
  start: string;
  time: string;
  command: string;
}

/** A simulated network socket, for `netstat` / `ss`. */
export interface VSocket {
  proto: 'tcp' | 'tcp6' | 'udp';
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: 'LISTEN' | 'ESTABLISHED' | 'TIME_WAIT' | 'CLOSE_WAIT' | '';
  pid: number | null;
  program: string;
}

/** A network interface, for `ip addr` / `ifconfig`. */
export interface VInterface {
  name: string;
  mac: string;
  ipv4: string | null;
  netmask: string | null;
  ipv6: string | null;
  mtu: number;
  up: boolean;
  rxPackets: number;
  txPackets: number;
  rxBytes: number;
  txBytes: number;
}

/** Everything the simulated machine is, beyond its filesystem. */
export interface MachineState {
  hostname: string;
  /** Shown by `uptime` and `/proc/loadavg`. */
  loadAverage: [number, number, number];
  uptimeText: string;
  processes: VProcess[];
  sockets: VSocket[];
  interfaces: VInterface[];
  /** Resolvable names for `ping` / `dig` / `nslookup`. */
  dns: Record<string, string>;
  /** Reverse lookups keyed by IP. */
  reverseDns: Record<string, string>;
}
