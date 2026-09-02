/**
 * Promote an account to instructor or admin.
 *
 * WHY THIS IS A SCRIPT AND NOT A ROUTE
 *
 * There is no endpoint that changes a role, and there should not be: the only
 * thing standing between a student and the chat room review queue would be
 * whatever guarded that endpoint, and a privilege escalation route is a route
 * somebody can find. Promotion happens with a shell on the box.
 *
 *   npm run grant:role --workspace @soc/server -- <username|email> <role>
 *
 * Roles are "student", "instructor" and "admin". Instructors and admins can
 * approve chat room requests, hide messages, and cancel somebody else's event.
 */

import { USER_ROLES } from '@soc/shared';
import type { UserRole } from '@soc/shared';

import { prisma } from '../src/db/client.js';

const [identifier, requested] = process.argv.slice(2);

if (!identifier || !requested) {
  console.error('usage: grant-role <username|email> <student|instructor|admin>');
  process.exit(1);
}

if (!(USER_ROLES as readonly string[]).includes(requested)) {
  console.error(`"${requested}" is not a role. Pick one of: ${USER_ROLES.join(', ')}.`);
  process.exit(1);
}

const user = await prisma.user.findFirst({
  where: { OR: [{ username: identifier }, { email: identifier }] },
  select: { id: true, username: true, email: true, role: true },
});

if (!user) {
  console.error(`No account matching "${identifier}".`);
  process.exit(1);
}

if (user.role === requested) {
  console.log(`${user.username} is already ${requested}. Nothing to do.`);
  process.exit(0);
}

await prisma.user.update({ where: { id: user.id }, data: { role: requested as UserRole } });
console.log(`${user.username} (${user.email}): ${user.role} -> ${requested}`);
// The role is read from the database on every privileged request rather than
// from the session token, so this takes effect immediately. See routes/lobby.ts.
console.log('Takes effect on their next request; no sign-out needed.');
