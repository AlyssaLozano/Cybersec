/**
 * The badge case.
 *
 * WHY UNEARNED BADGES ARE ON THE SHELF
 *
 * A case that shows only what somebody holds is a trophy cabinet, and an empty
 * trophy cabinet in week one is discouraging in a way an empty page is not. A
 * case that shows the whole shelf, with what is outstanding written on each
 * unearned badge, is a map: the thing between you and "SOC Analyst" is two
 * packages, and it says which two.
 *
 * WHY THE CITATION IS PROMINENT
 *
 * The citation is written for somebody who did not do the work. It is the line
 * a person can put in front of an interviewer, and it is more use to them than
 * a percentage.
 */

import { useEffect, useState } from 'react';

import type { BadgeCase as BadgeCaseData, BadgeStanding, PinnedBadge } from '@soc/shared';

import { ApiCallError, badges as badgesApi } from '../lib/api';

/* --- emblems ------------------------------------------------------------ */

/**
 * A fixed set of shapes rather than per-badge art.
 *
 * The same reasoning as the avatars: a fixed set costs one afternoon and has no
 * moderation queue behind it. The shape carries meaning, so a case is readable
 * before any of the labels are: a shield is defensive work, a blade offensive.
 */
export function Emblem({ emblem }: { emblem: string }) {
  switch (emblem) {
    case 'blade':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <path d="M16 3 L20 13 L16 27 L12 13 Z" />
          <line x1="10" y1="13" x2="22" y2="13" />
        </svg>
      );
    case 'scope':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <circle cx="16" cy="16" r="9" fill="none" />
          <line x1="16" y1="3" x2="16" y2="9" />
          <line x1="16" y1="23" x2="16" y2="29" />
          <line x1="3" y1="16" x2="9" y2="16" />
          <line x1="23" y1="16" x2="29" y2="16" />
          <circle cx="16" cy="16" r="2.4" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <rect x="4" y="7" width="24" height="18" rx="2" fill="none" />
          <path d="M9 13 l4 3 l-4 3" fill="none" />
          <line x1="16" y1="19" x2="23" y2="19" />
        </svg>
      );
    case 'scales':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <line x1="16" y1="7" x2="16" y2="26" />
          <line x1="6" y1="10" x2="26" y2="10" />
          <line x1="11" y1="26" x2="21" y2="26" />
          <path d="M2 16 a5 3 0 0 0 10 0" fill="none" />
          <path d="M20 16 a5 3 0 0 0 10 0" fill="none" />
        </svg>
      );
    case 'chip':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <rect x="9" y="9" width="14" height="14" rx="2" fill="none" />
          <line x1="13" y1="9" x2="13" y2="5" />
          <line x1="19" y1="9" x2="19" y2="5" />
          <line x1="13" y1="23" x2="13" y2="27" />
          <line x1="19" y1="23" x2="19" y2="27" />
          <line x1="9" y1="14" x2="5" y2="14" />
          <line x1="9" y1="19" x2="5" y2="19" />
          <line x1="23" y1="14" x2="27" y2="14" />
          <line x1="23" y1="19" x2="27" y2="19" />
        </svg>
      );
    case 'beacon':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <circle cx="16" cy="16" r="3" />
          <path d="M9 16 a7 7 0 0 1 14 0" fill="none" />
          <path d="M5 16 a11 11 0 0 1 22 0" fill="none" />
          <line x1="16" y1="19" x2="16" y2="27" />
        </svg>
      );
    case 'key':
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <circle cx="11" cy="16" r="5" fill="none" />
          <line x1="16" y1="16" x2="28" y2="16" />
          <line x1="24" y1="16" x2="24" y2="21" />
          <line x1="28" y1="16" x2="28" y2="20" />
        </svg>
      );
    case 'shield':
    default:
      return (
        <svg viewBox="0 0 32 32" className="emblem" aria-hidden="true">
          <path d="M16 3 L27 7 V17 C27 23 22 27 16 29 C10 27 5 23 5 17 V7 Z" fill="none" />
          <path d="M11 16 l4 4 l7 -8" fill="none" />
        </svg>
      );
  }
}

/** The small form, for beside a name in the lobby. */
export function BadgePip({ badge }: { badge: PinnedBadge }) {
  return (
    <span className={`pip pip--${badge.accent}`} title={badge.title}>
      <Emblem emblem={badge.emblem} />
      <span className="pip__label">{badge.title}</span>
    </span>
  );
}

/* --- the case ----------------------------------------------------------- */

export function BadgeCase({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<BadgeCaseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void badgesApi
      .case()
      .then(setData)
      .catch((caught: unknown) =>
        setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load badges.'),
      );
  }, []);

  if (error) return <p className="seat-note seat-note--bad">{error}</p>;
  if (!data) return <p className="seat-note">Loading…</p>;

  const tracks = data.badges.filter((badge) => badge.kind === 'track');
  const packages = data.badges.filter((badge) => badge.kind === 'package');

  return (
    <div className="badgecase">
      <header className="badgecase__head">
        <button type="button" className="linkish" onClick={onBack}>
          &larr; Back
        </button>
        <div>
          <h1>Your badges</h1>
          <p className="badgecase__meta">
            {data.earnedCount} of {data.total} earned. A badge you have earned is yours for good,
            even when the track it came from grows.
          </p>
        </div>
      </header>

      <h2 className="badgecase__h">Career tracks</h2>
      <p className="lobby__hint">
        The one an interviewer cares about. Each is every module of that track built today.
      </p>
      <div className="badgegrid">
        {tracks.map((badge) => (
          <BadgeTile key={badge.id} badge={badge} />
        ))}
      </div>

      <h2 className="badgecase__h">Modules</h2>
      <p className="lobby__hint">The steps on the way. One per package you finish.</p>
      <div className="badgegrid">
        {packages.map((badge) => (
          <BadgeTile key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

function BadgeTile({ badge }: { badge: BadgeStanding }) {
  const held = badge.earnedAt !== null;
  return (
    <article
      className={`badgetile badgetile--${badge.accent}${held ? ' badgetile--held' : ''}${
        badge.kind === 'track' ? ' badgetile--track' : ''
      }`}
    >
      <span className="badgetile__disc">
        <Emblem emblem={badge.emblem} />
      </span>
      <h3 className="badgetile__title">{badge.title}</h3>
      <p className="badgetile__citation">{badge.citation}</p>

      {held ? (
        <p className="badgetile__earned">
          Earned {new Date(badge.earnedAt!).toLocaleDateString()}
        </p>
      ) : (
        <>
          {/* What is between somebody and this badge, said in packages rather
              than as a bare percentage: a number tells you how far, a list
              tells you what to open next. */}
          <div className="badgetile__bar" aria-hidden="true">
            <span style={{ width: `${badge.percent}%` }} />
          </div>
          <p className="badgetile__todo">
            {badge.done.length} of {badge.requires.length} done.{' '}
            {badge.outstanding.length <= 3
              ? `Left: ${badge.outstanding
                  .map((id) => badge.requirementTitles[id] ?? id)
                  .join(', ')}.`
              : `${badge.outstanding.length} modules left.`}
          </p>
        </>
      )}
    </article>
  );
}

/**
 * The banner that fires the moment a badge lands.
 *
 * Driven by the `earnedBadges` a pass carries back, not by a poll of the case:
 * finishing a package is the moment worth marking, and a shelf somebody has no
 * reason to open that evening is not that moment.
 */
export function BadgeToast({
  badges: earned,
  onDismiss,
}: {
  badges: Array<{ id: string; title: string; citation: string; emblem: string; accent: string }>;
  onDismiss: () => void;
}) {
  if (earned.length === 0) return null;
  return (
    <div className="badgetoast" role="status">
      {earned.map((badge) => (
        <div className={`badgetoast__item badgetoast__item--${badge.accent}`} key={badge.id}>
          <span className="badgetoast__disc">
            <Emblem emblem={badge.emblem} />
          </span>
          <span className="badgetoast__text">
            <strong>Badge earned: {badge.title}</strong>
            <span>{badge.citation}</span>
          </span>
        </div>
      ))}
      <button type="button" className="badgetoast__close" onClick={onDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}
