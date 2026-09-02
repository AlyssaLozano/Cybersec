/**
 * The lobby: the room people arrive in, and everything that happens there.
 *
 * WHY THERE IS A LOBBY AT ALL
 *
 * The war rooms are the point of this product and they are also the loneliest
 * part of it. A SOC room needs six people at the same time; a red/blue match
 * needs an opponent. A student who clicks "SOC War Room" and finds an empty
 * schedule concludes the feature is dead, when the truth is that the four
 * people who would have joined them were each looking at their own empty
 * schedule ten minutes apart.
 *
 * So there is one door, and it opens into one room that everybody shares
 * regardless of which discipline they came for. Somebody heading for the risk
 * floor and somebody heading for a red/blue match stand in the same lobby, see
 * each other, and can say so. The war rooms are then doors off it.
 *
 * WHY IDENTITY HERE IS THE FLOOR IDENTITY
 *
 * The same call sign and avatar people use in a room. Two identities for one
 * person would mean the stranger you networked with in the lobby is not
 * visibly the same stranger who took the forensics chair, which is most of what
 * the lobby is for. See rooms.ts for why it is a handle rather than a name.
 */

import type { FloorIdentity } from './rooms.js';

/* --- the doors --------------------------------------------------------- */

/**
 * The war rooms reachable from the lobby.
 *
 * Listed here rather than discovered, because a door has to be visible before
 * it opens: "AI Security, not yet" is information somebody uses to decide what
 * to study, and a door that simply is not drawn tells them nothing.
 */
export const LOBBY_DOORS = [
  {
    id: 'soc',
    title: 'SOC War Room',
    blurb: 'Defend a live incident with a team on the floor. Six to eleven chairs, one shift.',
    state: 'open',
    accent: 'blue',
  },
  {
    id: 'redblue',
    title: 'Red / Blue War Room',
    blurb: 'Attack or defend, turn for turn, against a real opponent.',
    state: 'open',
    accent: 'red',
  },
  {
    id: 'grc',
    title: 'Risk War Room',
    blurb: 'Argue a risk call against the clock: accept, mitigate, or escalate.',
    state: 'soon',
    accent: 'amber',
  },
  {
    id: 'ai',
    title: 'AI Security War Room',
    blurb: 'Break the guardrails on a deployed model, or harden them, turn for turn.',
    state: 'soon',
    accent: 'violet',
  },
] as const;

export type LobbyDoorId = (typeof LOBBY_DOORS)[number]['id'];
export type LobbyDoorState = (typeof LOBBY_DOORS)[number]['state'];

export interface LobbyDoor {
  id: LobbyDoorId;
  title: string;
  blurb: string;
  state: LobbyDoorState;
  accent: string;
  /** How many people in the lobby say they are heading here. */
  heading: number;
}

export function isLobbyDoorId(value: string): value is LobbyDoorId {
  return LOBBY_DOORS.some((door) => door.id === value);
}

/* --- chat rooms -------------------------------------------------------- */

/**
 * CHAT ROOMS ARE ALWAYS PUBLIC.
 *
 * There is no private room, no invite code, and no direct message, and that is
 * a product decision rather than an unbuilt feature. A platform whose users are
 * strangers practising in public cannot moderate what it cannot see, and the
 * first thing a private channel becomes is the thing nobody wanted to be
 * responsible for. Everything said here is readable by anybody signed in, which
 * is stated on the way in so nobody is surprised by it.
 *
 * The war rooms are where scoped coordination belongs: a closed room with a
 * join code is one session, one scenario, and it ends.
 */
export const CHAT_ROOM_PUBLIC_NOTICE =
  'Every chat room here is public. Anybody signed in can read it, including staff. Do not post anything you would not put on a forum.';

/** Where a chat room came from. */
export const CHAT_ROOM_KINDS = ['core', 'community'] as const;
export type ChatRoomKind = (typeof CHAT_ROOM_KINDS)[number];

/**
 * Community rooms are requested and reviewed.
 *
 * Not because most requests are bad, but because a room list nobody curates
 * fills with six near-duplicates of the same idea inside a week and then reads
 * as abandoned. Review is the cheapest thing that keeps the list short enough
 * to be worth scanning.
 */
export const CHAT_ROOM_STATUSES = ['pending', 'approved', 'rejected', 'closed'] as const;
export type ChatRoomStatus = (typeof CHAT_ROOM_STATUSES)[number];

export interface ChatRoom {
  /** Slug, stable and permanent: messages reference it. */
  id: string;
  title: string;
  /**
   * What this room is for, in the requester's own words.
   *
   * Required, including for core rooms. A room list of bare names makes
   * everybody guess, and the guess is what produces the six near-duplicates.
   */
  topic: string;
  kind: ChatRoomKind;
  status: ChatRoomStatus;
  /** Null for core rooms, which nobody requested. */
  requestedBy: FloorIdentity | null;
  /** ISO 8601. */
  createdAt: string;
  /** Set once reviewed. Null while pending. */
  reviewedAt: string | null;
  /** Shown to the requester on a rejection, so a no comes with a reason. */
  reviewNote: string | null;
  /** Rough activity, so a newcomer can find the room people are actually in. */
  messageCount: number;
  lastMessageAt: string | null;
}

/**
 * The rooms that exist before anybody asks for one.
 *
 * A lobby whose room list starts empty is a lobby nobody talks in: the first
 * person to arrive has nowhere to put a sentence, so they leave, so the second
 * person also arrives to silence. These are seeded, are not reviewable, and
 * nobody can close them.
 */
export const CORE_CHAT_ROOMS: ReadonlyArray<{ id: string; title: string; topic: string }> = [
  {
    id: 'main-hall',
    title: 'Main hall',
    topic: 'Everybody, from every war room. Say hello, find people for a session, talk shop.',
  },
  {
    id: 'newcomers',
    title: 'First week',
    topic:
      'New here, or new to security. No question is too basic in this room, and answering them is how people learn to explain things.',
  },
  {
    id: 'blue-floor',
    title: 'Blue floor',
    topic: 'SOC work: triage, detections, log analysis, and the shifts they happen on.',
  },
  {
    id: 'red-side',
    title: 'Red side',
    topic: 'Offensive work: red/blue matches, tradecraft, and what the defenders caught.',
  },
  {
    id: 'risk-desk',
    title: 'Risk desk',
    topic: 'GRC, audit, privacy, and policy. The path into security that never opens a terminal.',
  },
  {
    id: 'model-lab',
    title: 'Model lab',
    topic: 'AI security: prompt injection, model abuse, and defending deployed models.',
  },
  {
    id: 'the-hunt',
    title: 'The hunt',
    topic:
      'Job hunting: openings people have seen, interviews they have sat, and what actually worked. No recruiting spam.',
  },
];

/* --- what somebody may say --------------------------------------------- */

export const MESSAGE_MAX = 600;
/**
 * A ceiling, not a target.
 *
 * Twelve messages a minute is faster than anybody types in a real conversation
 * and slow enough that a script cannot flood a room before somebody notices.
 */
export const MESSAGES_PER_MINUTE = 12;

export interface MessageCheck {
  ok: boolean;
  /** Written to be shown to the person, so it says how to fix it. */
  problem: string | null;
}

export function checkMessage(raw: string): MessageCheck {
  const value = raw.trim();
  if (value.length === 0) return { ok: false, problem: 'Say something first.' };
  if (value.length > MESSAGE_MAX) {
    return {
      ok: false,
      problem: `That is ${value.length} characters. Keep it under ${MESSAGE_MAX}.`,
    };
  }
  return { ok: true, problem: null };
}

export const CHAT_ROOM_TITLE_MAX = 40;
export const CHAT_ROOM_TOPIC_MIN = 20;
export const CHAT_ROOM_TOPIC_MAX = 240;

export function checkChatRoomRequest(title: string, topic: string): MessageCheck {
  const name = title.trim();
  const purpose = topic.trim();
  if (name.length < 3) return { ok: false, problem: 'Give the room a name, at least 3 characters.' };
  if (name.length > CHAT_ROOM_TITLE_MAX) {
    return { ok: false, problem: `Room names are at most ${CHAT_ROOM_TITLE_MAX} characters.` };
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9 '&/+-]*$/.test(name)) {
    return {
      ok: false,
      problem:
        'Letters, numbers, spaces and simple punctuation only, starting with a letter or number.',
    };
  }
  // The topic is the whole basis on which somebody approves or refuses the
  // room, and "chat" is not a basis. The floor is set high enough that a
  // one-word answer cannot pass.
  if (purpose.length < CHAT_ROOM_TOPIC_MIN) {
    return {
      ok: false,
      problem: `Say what the room is for in at least ${CHAT_ROOM_TOPIC_MIN} characters. This is what gets it approved.`,
    };
  }
  if (purpose.length > CHAT_ROOM_TOPIC_MAX) {
    return { ok: false, problem: `Keep the topic under ${CHAT_ROOM_TOPIC_MAX} characters.` };
  }
  return { ok: true, problem: null };
}

/**
 * Turn a requested name into a room id.
 *
 * Ids are permanent because messages carry them, so this runs once at approval
 * and never again. Collisions are resolved by the caller, which is the only
 * thing that knows what already exists.
 */
export function slugifyRoomTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

/* --- messages ---------------------------------------------------------- */

export interface ChatMessage {
  id: string;
  roomId: string;
  /**
   * Who said it, captured at the time.
   *
   * Denormalised rather than joined, because a call sign can change and a
   * transcript that rewrites itself when somebody renames is a transcript
   * nobody can follow. What is on the row is what was on the screen.
   */
  author: FloorIdentity;
  body: string;
  /** ISO 8601. */
  sentAt: string;
  /**
   * Set when an event was shared into the room, so the client draws a card
   * rather than a line of text. See events.ts.
   */
  eventId: string | null;
}

/* --- presence ---------------------------------------------------------- */

/**
 * Presence is a heartbeat, not a connection.
 *
 * The alternative is a socket, and a socket means connection state, reconnect
 * logic, and a deployment story this product does not have yet. A heartbeat
 * every twenty seconds costs one small row per person and is wrong for at most
 * a minute, which for "who is in the lobby" is close enough to true.
 */
export const PRESENCE_HEARTBEAT_SECONDS = 20;
/** Three missed beats. Long enough to survive a throttled tab or a slow network. */
export const PRESENCE_STALE_SECONDS = 75;

/** One badge as the lobby shows it, next to a name. */
export interface PinnedBadge {
  id: string;
  title: string;
  emblem: string;
  accent: string;
  kind: string;
}

export interface LobbyOccupant {
  identity: FloorIdentity;
  /** ISO 8601 of when they walked in. Drives the arrival animation. */
  arrivedAt: string;
  /** ISO 8601 of their last heartbeat. */
  lastSeenAt: string;
  /** Which door they say they are heading for, or null for "just here". */
  headingFor: LobbyDoorId | null;
  /** Track badges first. See pinnedBadges in badges.ts. */
  badges: PinnedBadge[];
}

export function isPresent(occupant: { lastSeenAt: string }, now: Date): boolean {
  return now.getTime() - new Date(occupant.lastSeenAt).getTime() < PRESENCE_STALE_SECONDS * 1000;
}

/**
 * Who walked in since the client last looked.
 *
 * Pure and client-side on purpose: an arrival is something the viewer watches
 * happen, not a fact worth a database row. Writing "Cinder walked in" into the
 * transcript would fill every room with door noise and leave it there forever.
 */
export function arrivalsBetween(
  previous: readonly LobbyOccupant[],
  current: readonly LobbyOccupant[],
): LobbyOccupant[] {
  const seen = new Set(previous.map((occupant) => occupant.identity.userId));
  return current.filter((occupant) => !seen.has(occupant.identity.userId));
}

export interface LobbyView {
  /** Everybody currently in the lobby, newest arrival last. */
  occupants: LobbyOccupant[];
  doors: LobbyDoor[];
  /** Approved rooms only. A pending room is not a place yet. */
  rooms: ChatRoom[];
  /** This viewer, so the client can draw them walking in. */
  me: LobbyOccupant;
  /** How many requests are waiting. Zero for anybody who cannot review. */
  pendingRoomCount: number;
  /** Whether this viewer may approve a room request. */
  canReview: boolean;
}
