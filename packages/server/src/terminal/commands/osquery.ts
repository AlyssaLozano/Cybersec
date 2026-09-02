/**
 * osquery: the host as a set of SQL tables.
 *
 * WHAT THIS IS FOR
 *
 * Threat hunting is the seat that starts from a hypothesis rather than an alert,
 * and the question it lives on is "show me every host where X". osquery is how
 * that question gets asked in practice, and its whole premise is that operating
 * system state is easier to reason about as rows than as the output of nine
 * different commands.
 *
 * It also teaches something `ps` and `ss` cannot. A hunt is rarely one lookup;
 * it is a filter, a comparison, a count, and then the same query again with one
 * clause changed. SQL makes that iteration visible and repeatable, which is the
 * difference between a hunt somebody else can run and a hunt that lived in one
 * analyst's terminal history.
 *
 * WHAT IS FAITHFUL
 *
 * The tables below carry the real osquery column names, so a query written here
 * is a query that runs against a real endpoint. The SQL subset is genuine SQL:
 * SELECT with columns or count(*), FROM, WHERE with AND/OR/NOT and parentheses,
 * comparison operators, LIKE, IN, ORDER BY and LIMIT. Output defaults to the
 * box table osqueryi prints, with --json, --csv and --line as it has.
 *
 * The `file` table refuses to run without a path or directory constraint, which
 * is exactly what real osquery does: it is not an index of the filesystem, and a
 * query with no constraint would have to walk every inode on the machine.
 *
 * WHAT IS NOT
 *
 * There are no JOINs, no subqueries and no GROUP BY. Those are real osquery and
 * they are a much larger parser; nothing here pretends otherwise, and a query
 * using them says so rather than returning something subtly wrong.
 */

import { canRead, fromLines, ok, toolError, type CommandResult, type ExecContext } from '../context.js';
import { parseArgs } from '../parser.js';
import { formatMode } from '../context.js';

type Value = string | number;
type Row = Record<string, Value>;

interface Table {
  columns: string[];
  /** Built lazily, because walking the filesystem for suid_bin is not free. */
  rows: (ctx: ExecContext, constraints: Constraint[]) => Row[];
  /** Columns at least one of which must be constrained, as in real osquery. */
  requires?: string[];
}

// --- the tables ---------------------------------------------------------------

/** Parse /etc/passwd into the columns the users table exposes. */
function passwdRows(ctx: ExecContext): Row[] {
  const text = ctx.vfs.stat('/etc/passwd')?.content ?? '';
  const rows: Row[] = [];
  for (const line of text.split('\n')) {
    const parts = line.split(':');
    if (parts.length < 7) continue;
    rows.push({
      uid: Number(parts[2]),
      gid: Number(parts[3]),
      username: parts[0]!,
      description: parts[4]!,
      directory: parts[5]!,
      shell: parts[6]!,
    });
  }
  return rows;
}

function uidFor(ctx: ExecContext, username: string): number {
  const match = passwdRows(ctx).find((row) => row['username'] === username);
  return match ? (match['uid'] as number) : -1;
}

/** Split a command line into the binary and the rest, the way osquery does. */
function splitCommand(command: string): { path: string; name: string } {
  // nginx and friends rewrite argv[0] to a status string with no path in it.
  const first = command.split(/\s+/)[0] ?? '';
  if (!first.startsWith('/')) return { path: '', name: first.replace(/:$/, '') };
  return { path: first, name: first.slice(first.lastIndexOf('/') + 1) };
}

const TABLES: Record<string, Table> = {
  processes: {
    columns: ['pid', 'name', 'path', 'cmdline', 'uid', 'username', 'state', 'cpu_percent', 'memory_percent', 'resident_size'],
    rows: (ctx) =>
      ctx.machine.processes.map((process) => {
        const { path, name } = splitCommand(process.command);
        return {
          pid: process.pid,
          name,
          path,
          cmdline: process.command,
          uid: uidFor(ctx, process.user),
          username: process.user,
          state: process.stat,
          cpu_percent: process.cpu,
          memory_percent: process.mem,
          resident_size: process.rss * 1024,
        };
      }),
  },

  listening_ports: {
    columns: ['pid', 'port', 'protocol', 'family', 'address', 'path'],
    rows: (ctx) =>
      ctx.machine.sockets
        .filter((socket) => socket.state === 'LISTEN')
        .map((socket) => ({
          pid: socket.pid ?? -1,
          port: socket.localPort,
          protocol: socket.proto === 'udp' ? 17 : 6,
          family: socket.proto === 'tcp6' ? 10 : 2,
          address: socket.localAddress,
          path: socket.program,
        })),
  },

  process_open_sockets: {
    columns: ['pid', 'family', 'protocol', 'local_address', 'local_port', 'remote_address', 'remote_port', 'state', 'path'],
    rows: (ctx) =>
      ctx.machine.sockets
        .filter((socket) => socket.state !== 'LISTEN')
        .map((socket) => ({
          pid: socket.pid ?? -1,
          family: socket.proto === 'tcp6' ? 10 : 2,
          protocol: socket.proto === 'udp' ? 17 : 6,
          local_address: socket.localAddress,
          local_port: socket.localPort,
          remote_address: socket.remoteAddress,
          remote_port: socket.remotePort,
          state: socket.state,
          path: socket.program,
        })),
  },

  users: {
    columns: ['uid', 'gid', 'username', 'description', 'directory', 'shell'],
    rows: passwdRows,
  },

  groups: {
    columns: ['gid', 'groupname'],
    rows: (ctx) => {
      const text = ctx.vfs.stat('/etc/group')?.content ?? '';
      const rows: Row[] = [];
      for (const line of text.split('\n')) {
        const parts = line.split(':');
        if (parts.length < 3) continue;
        rows.push({ gid: Number(parts[2]), groupname: parts[0]! });
      }
      return rows;
    },
  },

  crontab: {
    columns: ['event', 'minute', 'hour', 'day_of_month', 'month', 'day_of_week', 'command', 'path'],
    rows: (ctx) => {
      const rows: Row[] = [];
      const files = ['/etc/crontab'];
      for (const entry of safeReadDir(ctx, '/var/spool/cron/crontabs')) {
        files.push(`/var/spool/cron/crontabs/${entry}`);
      }

      for (const path of files) {
        const node = ctx.vfs.stat(path);
        if (!node?.content) continue;
        for (const line of node.content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed === '' || trimmed.startsWith('#')) continue;
          if (/^[A-Z_]+=/.test(trimmed)) continue;

          const fields = trimmed.split(/\s+/);
          if (fields.length < 6) continue;
          // /etc/crontab carries a user field between the schedule and the
          // command; a user crontab does not. osquery folds both into `command`.
          const isSystem = path === '/etc/crontab';
          const command = fields.slice(isSystem ? 6 : 5).join(' ');
          rows.push({
            event: '',
            minute: fields[0]!,
            hour: fields[1]!,
            day_of_month: fields[2]!,
            month: fields[3]!,
            day_of_week: fields[4]!,
            command,
            path,
          });
        }
      }
      return rows;
    },
  },

  suid_bin: {
    columns: ['path', 'username', 'groupname', 'permissions'],
    rows: (ctx) => {
      const rows: Row[] = [];
      for (const entry of safeWalk(ctx, '/usr')) {
        if (entry.node.kind !== 'file') continue;
        if ((entry.node.mode & 0o4000) === 0) continue;
        rows.push({
          path: entry.path,
          username: entry.node.owner,
          groupname: entry.node.group,
          permissions: formatMode(entry.node),
        });
      }
      return rows;
    },
  },

  shell_history: {
    columns: ['uid', 'username', 'command', 'history_file'],
    rows: (ctx) => {
      const rows: Row[] = [];
      for (const user of passwdRows(ctx)) {
        const file = `${user['directory']}/.bash_history`;
        const node = ctx.vfs.stat(file);
        if (!node?.content) continue;
        // Permissions are enforced, and enforced the way `cat` enforces them:
        // whatever the mode allows. A history file left world-readable is
        // readable, which is the actual state of most home directories and the
        // reason this table finds anything without an agent running as root. A
        // file the mode protects stays protected, and the student meets that
        // wall the same way they would on a real host.
        if (!canRead(node, ctx)) continue;
        for (const command of node.content.split('\n')) {
          if (command.trim() === '') continue;
          rows.push({
            uid: user['uid'] as number,
            username: user['username'] as string,
            command,
            history_file: file,
          });
        }
      }
      return rows;
    },
  },

  os_version: {
    columns: ['name', 'version', 'platform'],
    rows: (ctx) => {
      const text = ctx.vfs.stat('/etc/os-release')?.content ?? '';
      const field = (key: string) => {
        const match = new RegExp(`^${key}="?([^"\\n]*)"?`, 'm').exec(text);
        return match?.[1] ?? '';
      };
      return [{ name: field('NAME'), version: field('VERSION'), platform: field('ID') }];
    },
  },

  system_info: {
    columns: ['hostname', 'uptime'],
    rows: (ctx) => [{ hostname: ctx.machine.hostname, uptime: ctx.machine.uptimeText }],
  },

  file: {
    columns: ['path', 'directory', 'filename', 'size', 'mode', 'uid', 'gid', 'type'],
    requires: ['path', 'directory'],
    rows: (ctx, constraints) => {
      const rows: Row[] = [];
      const directory = constraints.find((c) => c.column === 'directory' && c.operator === '=');
      const pathEquals = constraints.find((c) => c.column === 'path' && c.operator === '=');
      const pathLike = constraints.find((c) => c.column === 'path' && c.operator === 'like');

      const push = (path: string) => {
        const node = ctx.vfs.stat(path);
        if (!node) return;
        rows.push({
          path,
          directory: path.slice(0, Math.max(path.lastIndexOf('/'), 1)),
          filename: path.slice(path.lastIndexOf('/') + 1),
          size: ctx.vfs.sizeOf(node),
          mode: formatMode(node),
          uid: uidFor(ctx, node.owner),
          gid: -1,
          type: node.kind === 'dir' ? 'directory' : 'regular',
        });
      };

      if (pathEquals) {
        push(String(pathEquals.value));
      } else if (directory) {
        const base = String(directory.value).replace(/\/$/, '') || '/';
        for (const entry of safeReadDir(ctx, base)) push(`${base === '/' ? '' : base}/${entry}`);
      } else if (pathLike) {
        // A LIKE constraint walks from the fixed prefix before the first wildcard,
        // which is how the real table keeps this bounded.
        const pattern = String(pathLike.value);
        const prefix = pattern.slice(0, pattern.indexOf('%'));
        const base = prefix.slice(0, Math.max(prefix.lastIndexOf('/'), 1)) || '/';
        for (const entry of safeWalk(ctx, base)) push(entry.path);
      }
      return rows;
    },
  },
};

function safeReadDir(ctx: ExecContext, path: string): string[] {
  try {
    return ctx.vfs.readDir(path).map((entry) => entry.name);
  } catch {
    return [];
  }
}

function safeWalk(ctx: ExecContext, path: string) {
  try {
    return ctx.vfs.walk(path);
  } catch {
    return [];
  }
}

// --- SQL ----------------------------------------------------------------------

interface Constraint {
  column: string;
  operator: string;
  value: Value;
}

class SqlError extends Error {}

interface Query {
  columns: string[];
  countStar: boolean;
  countAlias: string;
  table: string;
  where?: Expression;
  orderBy?: { column: string; descending: boolean };
  limit?: number;
}

type Expression =
  | { kind: 'compare'; column: string; operator: string; value: Value }
  | { kind: 'in'; column: string; values: Value[]; negated: boolean }
  | { kind: 'and' | 'or'; left: Expression; right: Expression }
  | { kind: 'not'; inner: Expression };

function tokenize(sql: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < sql.length) {
    const char = sql[i]!;
    if (/\s/.test(char)) {
      i += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      const close = sql.indexOf(char, i + 1);
      if (close === -1) throw new SqlError('unterminated string literal');
      tokens.push(sql.slice(i, close + 1));
      i = close + 1;
      continue;
    }
    const two = sql.slice(i, i + 2);
    if (['<=', '>=', '!=', '<>'].includes(two)) {
      tokens.push(two);
      i += 2;
      continue;
    }
    if ('(),=<>*'.includes(char)) {
      tokens.push(char);
      i += 1;
      continue;
    }
    let word = '';
    while (i < sql.length && !/[\s(),=<>]/.test(sql[i]!)) {
      word += sql[i]!;
      i += 1;
    }
    tokens.push(word);
  }
  return tokens;
}

class Parser {
  private position = 0;

  constructor(private readonly tokens: string[]) {}

  private peek(): string {
    return this.tokens[this.position] ?? '';
  }

  private next(): string {
    const token = this.tokens[this.position];
    if (token === undefined) throw new SqlError('unexpected end of query');
    this.position += 1;
    return token;
  }

  private expect(word: string): void {
    const token = this.next();
    if (token.toLowerCase() !== word.toLowerCase()) {
      throw new SqlError(`expected ${word.toUpperCase()} but found "${token}"`);
    }
  }

  parse(): Query {
    this.expect('select');

    const columns: string[] = [];
    let countStar = false;
    let countAlias = 'count(*)';

    if (this.peek().toLowerCase() === 'count') {
      this.next();
      this.expect('(');
      this.expect('*');
      this.expect(')');
      countStar = true;
      if (this.peek().toLowerCase() === 'as') {
        this.next();
        countAlias = stripQuotes(this.next());
      }
    } else if (this.peek() === '*') {
      this.next();
      columns.push('*');
    } else {
      for (;;) {
        columns.push(this.next());
        if (this.peek() !== ',') break;
        this.next();
      }
    }

    this.expect('from');
    const table = this.next();

    const query: Query = { columns, countStar, countAlias, table };

    if (this.peek().toLowerCase() === 'where') {
      this.next();
      query.where = this.parseOr();
    }

    if (this.peek().toLowerCase() === 'order') {
      this.next();
      this.expect('by');
      const column = this.next();
      let descending = false;
      const direction = this.peek().toLowerCase();
      if (direction === 'asc' || direction === 'desc') {
        this.next();
        descending = direction === 'desc';
      }
      query.orderBy = { column, descending };
    }

    if (this.peek().toLowerCase() === 'limit') {
      this.next();
      query.limit = Number(this.next());
    }

    const trailing = this.peek().replace(/;$/, '');
    if (trailing !== '' && this.position < this.tokens.length) {
      const rest = this.tokens.slice(this.position).join(' ').replace(/;\s*$/, '');
      if (rest !== '') throw new SqlError(`unexpected "${rest}"`);
    }

    return query;
  }

  private parseOr(): Expression {
    let left = this.parseAnd();
    while (this.peek().toLowerCase() === 'or') {
      this.next();
      left = { kind: 'or', left, right: this.parseAnd() };
    }
    return left;
  }

  private parseAnd(): Expression {
    let left = this.parseTerm();
    while (this.peek().toLowerCase() === 'and') {
      this.next();
      left = { kind: 'and', left, right: this.parseTerm() };
    }
    return left;
  }

  private parseTerm(): Expression {
    if (this.peek() === '(') {
      this.next();
      const inner = this.parseOr();
      if (this.next() !== ')') throw new SqlError('expected )');
      return inner;
    }

    if (this.peek().toLowerCase() === 'not') {
      this.next();
      return { kind: 'not', inner: this.parseTerm() };
    }

    const column = this.next();
    let operator = this.next().toLowerCase();
    let negated = false;

    if (operator === 'not') {
      negated = true;
      operator = this.next().toLowerCase();
    }

    if (operator === 'in') {
      if (this.next() !== '(') throw new SqlError('expected ( after IN');
      const values: Value[] = [];
      for (;;) {
        values.push(literal(this.next()));
        const separator = this.next();
        if (separator === ')') break;
        if (separator !== ',') throw new SqlError('expected , or ) in IN list');
      }
      return { kind: 'in', column, values, negated };
    }

    const value = literal(this.next());
    const expression: Expression = { kind: 'compare', column, operator, value };
    return negated ? { kind: 'not', inner: expression } : expression;
  }
}

function stripQuotes(token: string): string {
  if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith('"') && token.endsWith('"'))) {
    return token.slice(1, -1);
  }
  return token;
}

function literal(token: string): Value {
  const stripped = stripQuotes(token);
  if (stripped !== token) return stripped;
  const asNumber = Number(token);
  return Number.isFinite(asNumber) && token.trim() !== '' ? asNumber : token;
}

/** Translate a SQL LIKE pattern into a regular expression. */
function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/%/g, '.*').replace(/_/g, '.')}$`, 'i');
}

function compare(left: Value, operator: string, right: Value): boolean {
  switch (operator) {
    case '=':
    case '==':
      return String(left) === String(right);
    case '!=':
    case '<>':
      return String(left) !== String(right);
    case '<':
      return Number(left) < Number(right);
    case '<=':
      return Number(left) <= Number(right);
    case '>':
      return Number(left) > Number(right);
    case '>=':
      return Number(left) >= Number(right);
    case 'like':
      return likeToRegExp(String(right)).test(String(left));
    default:
      throw new SqlError(`unsupported operator "${operator}"`);
  }
}

function evaluate(expression: Expression, row: Row): boolean {
  switch (expression.kind) {
    case 'compare':
      return compare(row[expression.column] ?? '', expression.operator, expression.value);
    case 'in': {
      const found = expression.values.some((value) => String(row[expression.column] ?? '') === String(value));
      return expression.negated ? !found : found;
    }
    case 'and':
      return evaluate(expression.left, row) && evaluate(expression.right, row);
    case 'or':
      return evaluate(expression.left, row) || evaluate(expression.right, row);
    case 'not':
      return !evaluate(expression.inner, row);
  }
}

/** Flatten the top-level ANDed comparisons, for tables that need a constraint. */
function collectConstraints(expression: Expression | undefined): Constraint[] {
  if (!expression) return [];
  if (expression.kind === 'compare') {
    return [{ column: expression.column, operator: expression.operator, value: expression.value }];
  }
  if (expression.kind === 'and') {
    return [...collectConstraints(expression.left), ...collectConstraints(expression.right)];
  }
  return [];
}

// --- rendering ----------------------------------------------------------------

function renderTable(columns: string[], rows: Row[]): string[] {
  if (rows.length === 0) return [];

  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => String(row[column] ?? '').length)),
  );
  const divider = `+${widths.map((width) => '-'.repeat(width + 2)).join('+')}+`;
  const line = (cells: string[]) =>
    `| ${cells.map((cell, index) => cell.padEnd(widths[index]!)).join(' | ')} |`;

  return [
    divider,
    line(columns),
    divider,
    ...rows.map((row) => line(columns.map((column) => String(row[column] ?? '')))),
    divider,
  ];
}

// --- the command --------------------------------------------------------------

export function osqueryi(argv: string[], ctx: ExecContext): CommandResult {
  const args = parseArgs(argv);

  if (args.longFlags.has('version') || args.flags.has('V')) {
    return ok('osqueryi version 5.12.1 (simulated)\n');
  }

  const sql = args.positionals.join(' ').trim().replace(/;$/, '');
  if (sql === '') {
    return toolError(
      'osqueryi',
      'this build has no interactive shell. Pass a query as an argument, e.g. osqueryi "SELECT * FROM users LIMIT 5".',
    );
  }

  // Checked before parsing, so an unsupported clause is reported as
  // unsupported rather than as a syntax error pointing at a word the student
  // spelled correctly.
  if (/\bjoin\b|\bgroup\s+by\b/i.test(sql)) {
    return toolError(
      'osqueryi',
      'Error: this build supports one table per query, with no JOIN or GROUP BY.',
    );
  }

  let query: Query;
  try {
    query = new Parser(tokenize(sql)).parse();
  } catch (error) {
    const message = error instanceof SqlError ? error.message : 'could not parse query';
    return toolError('osqueryi', `Error: ${message}`);
  }

  const table = TABLES[query.table];
  if (!table) {
    const known = Object.keys(TABLES).sort().join(', ');
    return toolError('osqueryi', `Error: no such table: ${query.table}. This build has: ${known}`);
  }

  const constraints = collectConstraints(query.where);
  if (table.requires && !table.requires.some((column) => constraints.some((c) => c.column === column))) {
    return toolError(
      'osqueryi',
      `Error: constraint required for the ${query.table} table: one of ${table.requires.join(', ')}. ` +
        'It is not an index of the filesystem, so an unconstrained query would have to walk every path on the host.',
    );
  }

  const unknown = query.columns.filter((column) => column !== '*' && !table.columns.includes(column));
  if (unknown.length > 0) {
    return toolError(
      'osqueryi',
      `Error: no such column: ${unknown[0]}. ${query.table} has: ${table.columns.join(', ')}`,
    );
  }

  let rows = table.rows(ctx, constraints);
  if (query.where) {
    try {
      rows = rows.filter((row) => evaluate(query.where!, row));
    } catch (error) {
      const message = error instanceof SqlError ? error.message : 'could not evaluate WHERE';
      return toolError('osqueryi', `Error: ${message}`);
    }
  }

  if (query.orderBy) {
    const { column, descending } = query.orderBy;
    rows = [...rows].sort((a, b) => {
      const left = a[column] ?? '';
      const right = b[column] ?? '';
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
      return descending ? -result : result;
    });
  }

  if (query.limit !== undefined) rows = rows.slice(0, query.limit);

  if (query.countStar) {
    const columns = [query.countAlias];
    const counted: Row[] = [{ [query.countAlias]: rows.length }];
    return ok(fromLines(render(args, columns, counted)));
  }

  const columns = query.columns[0] === '*' ? table.columns : query.columns;
  return ok(fromLines(render(args, columns, rows)));
}

function render(
  args: ReturnType<typeof parseArgs>,
  columns: string[],
  rows: Row[],
): string[] {
  if (args.longFlags.has('json')) {
    return JSON.stringify(
      rows.map((row) => Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '')]))),
      null,
      2,
    ).split('\n');
  }

  if (args.longFlags.has('csv')) {
    return [columns.join(','), ...rows.map((row) => columns.map((column) => String(row[column] ?? '')).join(','))];
  }

  if (args.longFlags.has('line')) {
    const width = Math.max(...columns.map((column) => column.length));
    return rows.flatMap((row, index) => [
      ...(index > 0 ? [''] : []),
      ...columns.map((column) => `${column.padStart(width)} = ${String(row[column] ?? '')}`),
    ]);
  }

  return renderTable(columns, rows);
}
