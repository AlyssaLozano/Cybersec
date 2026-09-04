/**
 * What a superadmin does, recorded once per action.
 *
 * Kept as its own small module rather than folded into auth.ts, because it is
 * a log vocabulary (see `SuperadminAction` in the Prisma schema) rather than a
 * permission: `USER_ROLES` says who can act, this says what "acting" means.
 */
export const SUPERADMIN_ACTION_KINDS = [
  'suspend',
  'ban',
  'reinstate',
  'observe-room',
  'observe-match',
  'stage-review',
] as const;
export type SuperadminActionKind = (typeof SUPERADMIN_ACTION_KINDS)[number];
