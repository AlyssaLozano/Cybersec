/**
 * Authentication routes: register, login, logout, and "who am I".
 */

import { Router } from 'express';
import { z } from 'zod';

import {
  API_ERROR_CODES,
  PASSWORD_MIN_LENGTH,
  USERNAME_PATTERN,
  type AuthResponse,
  type PublicUser,
  type UserRole,
} from '@soc/shared';

import { hashPassword, verifyPassword } from '../auth/password.js';
import { clearSession, issueSession, readSession } from '../auth/session.js';
import { prisma } from '../db/client.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';

export const authRouter = Router();

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(USERNAME_PATTERN, 'Use 3-32 characters: letters, numbers, dot, dash, or underscore.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`),
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Enter your username or email.'),
  password: z.string().min(1, 'Enter your password.'),
});

function toPublicUser(user: {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as UserRole,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
  };
}

/**
 * A small in-memory throttle on failed logins.
 *
 * Not a substitute for a real rate limiter behind a load balancer, but it stops
 * trivial password guessing against a classroom deployment. Keyed by identifier
 * rather than IP so that a shared classroom NAT does not lock out a whole room.
 */
const FAILURES = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

function throttleKey(identifier: string): string {
  return identifier.toLowerCase();
}

function isThrottled(identifier: string): boolean {
  const entry = FAILURES.get(throttleKey(identifier));
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    FAILURES.delete(throttleKey(identifier));
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function noteFailure(identifier: string): void {
  const key = throttleKey(identifier);
  const entry = FAILURES.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    FAILURES.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

authRouter.post(
  '/register',
  asyncRoute(async (request, response) => {
    const input = registerSchema.parse(request.body);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.username }, { email: input.email.toLowerCase() }],
      },
    });
    if (existing) {
      const takenField = existing.username === input.username ? 'username' : 'email';
      throw new HttpError(
        409,
        takenField === 'username' ? API_ERROR_CODES.usernameTaken : API_ERROR_CODES.emailTaken,
        takenField === 'username' ? 'That username is taken.' : 'That email is already registered.',
        { [takenField]: 'Already in use.' },
      );
    }

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        role: 'student',
        lastLoginAt: new Date(),
      },
    });

    issueSession(response, { sub: user.id, username: user.username, role: user.role as UserRole });
    const body: AuthResponse = { user: toPublicUser(user) };
    sendOk(response, body, 201);
  }),
);

authRouter.post(
  '/login',
  asyncRoute(async (request, response) => {
    const input = loginSchema.parse(request.body);

    if (isThrottled(input.identifier)) {
      throw new HttpError(
        429,
        API_ERROR_CODES.rateLimited,
        'Too many failed attempts. Wait 15 minutes and try again.',
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.identifier }, { email: input.identifier.toLowerCase() }],
      },
    });

    // Verify against a dummy hash when the user is missing, so that a wrong
    // username and a wrong password take the same time to answer. Otherwise the
    // response time itself reveals which accounts exist.
    const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu';
    const matches = await verifyPassword(input.password, hash);

    if (!user || !matches) {
      noteFailure(input.identifier);
      throw new HttpError(
        401,
        API_ERROR_CODES.invalidCredentials,
        'That username or password is not right.',
      );
    }

    FAILURES.delete(throttleKey(input.identifier));

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    issueSession(response, { sub: user.id, username: user.username, role: user.role as UserRole });
    const body: AuthResponse = { user: toPublicUser(updated) };
    sendOk(response, body);
  }),
);

authRouter.post('/logout', (_request, response) => {
  clearSession(response);
  sendOk(response, { ok: true });
});

authRouter.get(
  '/me',
  requireAuth,
  asyncRoute(async (request, response) => {
    const claims = readSession(request);
    if (!claims) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');

    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    if (!user) {
      // The token is valid but the account is gone; clear the stale cookie.
      clearSession(response);
      throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
    }

    const body: AuthResponse = { user: toPublicUser(user) };
    sendOk(response, body);
  }),
);
