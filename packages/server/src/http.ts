/**
 * HTTP plumbing shared by every route: the response envelope, the authentication
 * guard, and the error handler.
 */

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { API_ERROR_CODES, type ApiError, type ApiResponse, type UserRole } from '@soc/shared';

import { readSession, type SessionClaims } from './auth/session.js';
import { isProduction } from './env.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session?: SessionClaims;
    }
  }
}

export function sendOk<T>(response: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { ok: true, data };
  response.status(status).json(body);
}

export function sendError(response: Response, status: number, error: ApiError): void {
  const body: ApiResponse<never> = { ok: false, error };
  response.status(status).json(body);
}

/**
 * An error carrying the status and machine-readable code to return.
 *
 * Throwing this from a route keeps the happy path free of response plumbing.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Wraps an async handler so a rejected promise reaches the error middleware. */
export function asyncRoute(
  handler: (request: Request, response: Response) => Promise<void>,
): (request: Request, response: Response, next: NextFunction) => void {
  return (request, response, next) => {
    handler(request, response).catch(next);
  };
}

/** Rejects unauthenticated requests before any handler runs. */
export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const session = readSession(request);
  if (!session) {
    sendError(response, 401, {
      code: API_ERROR_CODES.unauthenticated,
      message: 'You need to sign in to do that.',
    });
    return;
  }
  request.session = session;
  next();
}

/** Restricts a route to particular roles. Must run after requireAuth. */
export function requireRole(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.session || !roles.includes(request.session.role)) {
      sendError(response, 403, {
        code: API_ERROR_CODES.unauthenticated,
        message: 'You do not have access to that.',
      });
      return;
    }
    next();
  };
}

/**
 * Final error handler.
 *
 * Unexpected errors are logged in full and reported to the client as a generic
 * message: internal details (stack traces, SQL, file paths) must not reach a
 * browser.
 */
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    sendError(response, error.status, {
      code: error.code,
      message: error.message,
      ...(error.fields ? { fields: error.fields } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) {
      fields[issue.path.join('.') || 'form'] = issue.message;
    }
    sendError(response, 400, {
      code: API_ERROR_CODES.validationFailed,
      message: 'Please check the highlighted fields.',
      fields,
    });
    return;
  }

  console.error('[unhandled]', error);
  sendError(response, 500, {
    code: API_ERROR_CODES.internal,
    message: isProduction
      ? 'Something went wrong on our end.'
      : `Something went wrong: ${error instanceof Error ? error.message : String(error)}`,
  });
}
