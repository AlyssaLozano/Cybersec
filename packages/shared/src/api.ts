/**
 * Envelope shared by every API response, so the client has exactly one
 * shape to unwrap and one place to surface errors.
 */

export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export interface ApiError {
  /** Stable machine-readable code, e.g. "invalid_credentials". */
  code: string;
  /** Human-readable message safe to show a student. */
  message: string;
  /** Field-level problems for form validation. */
  fields?: Record<string, string>;
}

export const API_ERROR_CODES = {
  unauthenticated: 'unauthenticated',
  invalidCredentials: 'invalid_credentials',
  usernameTaken: 'username_taken',
  emailTaken: 'email_taken',
  validationFailed: 'validation_failed',
  notFound: 'not_found',
  /**
   * Asked for something real that this person may not have.
   *
   * Distinct from notFound on purpose: a closed war room that refuses a wrong
   * join code is not missing, and telling somebody it is missing means the
   * client cannot offer them the code box.
   */
  forbidden: 'forbidden',
  exerciseLocked: 'exercise_locked',
  rateLimited: 'rate_limited',
  /** Registration was attempted without a valid entry code. */
  invalidEntryCode: 'invalid_entry_code',
  /** A free-tier account tried to use a paid feature. */
  paymentRequired: 'payment_required',
  internal: 'internal_error',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
