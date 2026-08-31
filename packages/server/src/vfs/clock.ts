/**
 * The simulated machine is frozen at a single instant.
 *
 * Freezing time is what makes exercises reproducible: "files modified in the
 * last 24 hours" has to mean the same thing in January as it does in August, and
 * a student retrying an exercise next week must see identical output.
 *
 * Everything in the world is dated relative to WORLD_NOW.
 */

/** 15 August 2026, 11:50:00 UTC -- roughly 20 minutes after the intrusion. */
export const WORLD_NOW = Date.UTC(2026, 7, 15, 11, 50, 0);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A timestamp `seconds` before the frozen present. */
export function secondsAgo(seconds: number): number {
  return WORLD_NOW - seconds * 1000;
}

/** A timestamp `days` before the frozen present. */
export function daysAgo(days: number): number {
  return WORLD_NOW - days * 86_400_000;
}

/** A timestamp at a given clock time on 15 August 2026. */
export function onAugust15(hour: number, minute: number, second = 0): number {
  return Date.UTC(2026, 7, 15, hour, minute, second);
}

/**
 * Format a timestamp the way `ls -l` does.
 *
 * GNU ls shows "Mon DD HH:MM" for anything within the last six months and
 * "Mon DD  YYYY" for older entries, which is why archived logs look different
 * from live ones in a listing.
 */
export function formatLsTime(timestamp: number): string {
  const date = new Date(timestamp);
  const month = MONTHS[date.getUTCMonth()]!;
  const day = String(date.getUTCDate()).padStart(2, ' ');

  const sixMonths = 182 * 86_400_000;
  if (WORLD_NOW - timestamp > sixMonths) {
    return `${month} ${day}  ${date.getUTCFullYear()}`;
  }

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${month} ${day} ${hours}:${minutes}`;
}

/** Whole days between a timestamp and the frozen present, rounded down. */
export function ageInDays(timestamp: number): number {
  return Math.floor((WORLD_NOW - timestamp) / 86_400_000);
}
