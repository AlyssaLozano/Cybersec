/**
 * The certification study offer, shown at the end of a career track.
 *
 * Rendered from the server's offer object rather than written into the markup,
 * so the price and the window cannot drift away from `content/pricing.ts`, and
 * so `status` is what decides whether this looks buyable. While it is
 * 'coming-soon' there is deliberately no button: an interface that offers a
 * purchase for something unbuilt is the same lie as a track that looks playable
 * and is not.
 */

import type { CertStudyOffer } from '@soc/shared';

interface CertStudyNoteProps {
  offer: CertStudyOffer;
  /** Compact form for the track cards; the full form carries the detail. */
  compact?: boolean;
}

export function CertStudyNote({ offer, compact = false }: CertStudyNoteProps) {
  const price = `$${offer.amountUsd} for ${offer.windowDays} days, per certification`;

  if (compact) {
    return (
      <p className="cert-study compact">
        <span className="badge planned">Coming soon</span>
        <span>
          {offer.headline} {price}.
        </span>
      </p>
    );
  }

  return (
    <aside className="cert-study">
      <header>
        <h3>{offer.headline}</h3>
        <span className={`badge ${offer.status === 'coming-soon' ? 'planned' : 'ready'}`}>
          {offer.status === 'coming-soon' ? 'Coming soon' : 'Available'}
        </span>
      </header>
      <p className="cert-study-price">{price}</p>
      <p className="muted small">{offer.rationale}</p>
      <div className="cert-study-lists">
        <div>
          <h4>What it covers</h4>
          <ul className="plain-list">
            {offer.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>What it does not</h4>
          <ul className="plain-list">
            {offer.excludes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
