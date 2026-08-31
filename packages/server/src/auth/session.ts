/**
 * Session issuing and verification.
 *
 * Sessions are signed JWTs carried in an httpOnly cookie. httpOnly means page
 * scripts cannot read the token, so an XSS bug in the terminal renderer cannot
 * be escalated into stolen sessions -- which matters more than usual here,
 * because this app deliberately renders attacker-controlled strings from log
 * files back to the user.
 */

import type { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { UserRole } from '@soc/shared';

import { env } from '../env.js';

export const SESSION_COOKIE = 'soc_session';

export interface SessionClaims {
  /** User id. */
  sub: string;
  username: string;
  role: UserRole;
}

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    // 'lax' still sends the cookie on top-level navigation, while blocking the
    // cross-site POSTs that make CSRF possible.
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function issueSession(response: Response, claims: SessionClaims): void {
  const token = jwt.sign(claims, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
  response.cookie(SESSION_COOKIE, token, cookieOptions());
}

export function clearSession(response: Response): void {
  response.clearCookie(SESSION_COOKIE, { ...cookieOptions(), maxAge: undefined });
}

/** Verify the cookie on a request. Returns null for missing or invalid tokens. */
export function readSession(request: Request): SessionClaims | null {
  const token = request.cookies?.[SESSION_COOKIE];
  if (typeof token !== 'string' || token === '') return null;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string') return null;
    const { sub, username, role } = decoded as jwt.JwtPayload & Partial<SessionClaims>;
    if (typeof sub !== 'string' || typeof username !== 'string' || typeof role !== 'string') {
      return null;
    }
    return { sub, username, role: role as UserRole };
  } catch {
    // Expired or tampered tokens are simply "not logged in".
    return null;
  }
}
