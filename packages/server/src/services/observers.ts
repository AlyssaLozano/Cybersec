/**
 * Admins dropping into a live floor.
 *
 * TWO MODES, AND WHY BOTH ARE LEGITIMATE
 *
 * Announced puts an observer on the floor with a name on it. That is the right
 * default: people are paying to work alongside strangers, and a supervisor who
 * is visible is a supervisor rather than a watcher.
 *
 * Stealth exists because an admin fixing a broken scenario mid-session should
 * not have to derail the exercise to do it. Announcing yourself to repair a
 * misfiring event costs the floor the thing they paid for.
 *
 * THE PART THAT MAKES STEALTH DEFENSIBLE
 *
 * Invisible to the floor is not the same as unrecorded. Every join writes an
 * audit entry whichever mode it used, and stealth writes the same entry as
 * announced. That is the whole difference between an admin tool and a back
 * door, and it is what you want to already have the first time an enterprise
 * customer or a cohort instructor asks who can watch whom.
 *
 * Observers are never seats. They cannot claim an event and they are not
 * scored, so nothing here can reach the claim pipeline.
 */

import type { SocRoleId } from '@soc/shared';

export const OBSERVER_MODES = ['announced', 'stealth'] as const;
export type ObserverMode = (typeof OBSERVER_MODES)[number];

export interface Observer {
  userId: string;
  /** Shown on the floor in announced mode. Never shown in stealth. */
  displayName: string;
  mode: ObserverMode;
  joinedAt: number;
  /** Why they came in. Required for stealth, because an unexplained silent
   *  join is exactly what the audit trail exists to prevent. */
  reason: string;
}

/** What a participant is allowed to know about who is watching. */
export interface ObserverBadge {
  displayName: string;
  joinedAt: number;
}

/** One immutable line in the record. Written for both modes. */
export interface ObserverAudit {
  userId: string;
  displayName: string;
  scenarioId: string;
  mode: ObserverMode;
  reason: string;
  at: number;
  /** Chat posted while present, so a stealth admin who speaks is on the record. */
  messages: number;
}

/**
 * Who the floor can see.
 *
 * Stealth observers are filtered here rather than at the UI, because a filter
 * in a component is one refactor away from leaking. A participant view that
 * cannot construct a stealth observer cannot accidentally render one.
 */
export function visibleObservers(observers: Observer[]): ObserverBadge[] {
  return observers
    .filter((o) => o.mode === 'announced')
    .map(({ displayName, joinedAt }) => ({ displayName, joinedAt }));
}

/**
 * The audit line. Written for every join, in both modes, always.
 *
 * There is deliberately no way to record a join without producing one of
 * these: the function that makes the observer makes the record.
 */
export function auditJoin(
  observer: Observer,
  scenarioId: string,
  messages = 0,
): ObserverAudit {
  return {
    userId: observer.userId,
    displayName: observer.displayName,
    scenarioId,
    mode: observer.mode,
    reason: observer.reason,
    at: observer.joinedAt,
    messages,
  };
}

/**
 * An admin joining. Returns the presence and its audit line together so the
 * two cannot come apart.
 */
export function join(
  scenarioId: string,
  userId: string,
  displayName: string,
  mode: ObserverMode,
  reason: string,
  at: number,
): { observer: Observer; audit: ObserverAudit } {
  if (mode === 'stealth' && reason.trim().length < 10) {
    throw new Error('A stealth join needs a stated reason. Silent and unexplained is not a mode.');
  }
  const observer: Observer = { userId, displayName, mode, joinedAt: at, reason };
  return { observer, audit: auditJoin(observer, scenarioId) };
}

/**
 * Chat as it reaches a participant.
 *
 * A stealth admin who speaks stops being invisible for that message, because a
 * message from nobody is worse than a message from an admin: the floor will
 * assume a teammate said it and act on it. So stealth attributes to a generic
 * facilitator label rather than to nothing, and the audit records who it was.
 */
export function attributeMessage(
  observer: Observer,
): { author: string; fromObserver: true } {
  return {
    author: observer.mode === 'announced' ? observer.displayName : 'Facilitator',
    fromObserver: true,
  };
}

/** Observers are not seats. Nothing here is claimable or scored. */
export function isSeat(_observer: Observer): _observer is Observer & { role: SocRoleId } {
  return false;
}
