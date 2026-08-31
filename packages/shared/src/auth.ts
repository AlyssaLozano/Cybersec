/** Roles are stored as strings for SQLite/Postgres portability. */
export const USER_ROLES = ['student', 'instructor', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
}

export interface AuthResponse {
  user: PublicUser;
}

/** Enforced on the server; mirrored in the client for instant feedback. */
export const PASSWORD_MIN_LENGTH = 10;
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_.-]{2,31}$/i;
