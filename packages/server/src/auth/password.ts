/**
 * Password hashing.
 *
 * bcrypt with a cost of 12: deliberately slow, which is the entire point. The
 * pure-JS implementation is used so the project needs no native build step on
 * any platform a student or instructor might install it on.
 */

import bcrypt from 'bcryptjs';

const COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
