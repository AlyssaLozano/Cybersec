/** Roles are stored as strings for SQLite/Postgres portability. */
export const USER_ROLES = ['student', 'instructor', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Access tier. Everyone who registers with an entry code is `free`: the whole
 * learning platform and the war rooms are open to them. `paid` unlocks the
 * career pack -- the assessment, the portfolio, and the simulation interview --
 * the parts that map directly to "I am trying to get hired". Granted manually
 * for now; a payment flow replaces the granting later.
 */
export const USER_TIERS = ['free', 'paid'] as const;
export type UserTier = (typeof USER_TIERS)[number];

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface LoginRequest {
  /** Username or email; the server accepts either. */
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  /** The access code that gates registration. Every new account needs one. */
  entryCode: string;
}

export interface AuthResponse {
  user: PublicUser;
}

/** Enforced on the server; mirrored in the client for instant feedback. */
export const PASSWORD_MIN_LENGTH = 10;
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_.-]{2,31}$/i;
