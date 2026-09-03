/**
 * A person's profile: what they wrote, and what they earned.
 *
 * WHY THE EARNED HALF IS ABOVE THE WRITTEN HALF
 *
 * Everybody entering this field is writing the same headline, because they
 * have all read the same advice about what a headline should say. The badges,
 * the packages finished and the seats actually sat in are the part nobody else
 * can write, and they come from the tables that graded the work. So they go
 * first, and the paragraph goes underneath.
 *
 * WHY THE VISIBILITY CONTROL IS NOT AT THE BOTTOM
 *
 * The moment somebody types a real name and a LinkedIn address into a
 * pseudonymous product is the moment they need to know who can see it. Putting
 * that setting under a Save button at the end of a long form is how people
 * find out afterwards.
 */

import { useEffect, useState } from 'react';

import {
  ABOUT_MAX,
  HEADLINE_MAX,
  PROFILE_VISIBILITIES,
  PROFILE_VISIBILITY_LABELS,
  githubUrl,
  linkedinUrl,
} from '@soc/shared';
import type { ProfileVisibility, PublicProfile } from '@soc/shared';

import { ApiCallError, profile as profileApi } from '../lib/api';

interface Props {
  /** Null for your own. A call sign to read somebody else's. */
  callSign?: string | null;
  onExit: () => void;
}

export function Profile({ callSign = null, onExit }: Props) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const load = callSign ? profileApi.byCallSign(callSign) : profileApi.mine();
    void load
      .then((result) => {
        setProfile(result.profile);
        setError(null);
      })
      .catch((caught) =>
        setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load that profile.'),
      )
      .finally(() => setLoading(false));
  }, [callSign]);

  if (loading) return <div className="centered-note">Loading…</div>;

  if (!profile) {
    return (
      <section className="profile">
        <p className="seat-note seat-note--bad">{error ?? 'No profile there.'}</p>
        <button type="button" className="quiet" onClick={onExit}>
          Back
        </button>
      </section>
    );
  }

  const mine = !callSign;

  if (editing) {
    return (
      <ProfileForm
        initial={profile}
        onSaved={(saved) => {
          setProfile(saved);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <section className="profile">
      <header className="profile__head">
        <div className="profile__who">
          {profile.avatarId ? (
            <span className={`avatar avatar--${profile.avatarId}`} aria-hidden="true" />
          ) : null}
          <div>
            <h1>{profile.displayName || profile.callSign || 'Unnamed'}</h1>
            <p className="profile__meta">
              {profile.callSign ? <span className="profile__callsign">{profile.callSign}</span> : null}
              {profile.location ? <> · {profile.location}</> : null}
              {' · '}
              since {new Date(profile.joinedAt).toLocaleDateString()}
            </p>
            {profile.headline ? <p className="profile__headline">{profile.headline}</p> : null}
            {profile.openToWork ? <span className="profile__open">Open to work</span> : null}
          </div>
        </div>

        <div className="profile__controls">
          {mine ? (
            <button type="button" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          ) : null}
          <button type="button" className="quiet" onClick={onExit}>
            Back
          </button>
        </div>
      </header>

      {/*
        First, because it is the half nobody can type in. A headline is a
        claim; a run of shifts at a named seat is a record.
      */}
      <div className="profile__earned">
        <Stat value={profile.shiftsRun} label="shifts run" />
        <Stat value={profile.badgeIds.length} label="badges earned" />
        <Stat value={profile.packagesCompleted} label="packages worked" />
      </div>

      {profile.seatsPlayed.length > 0 ? (
        <p className="profile__seats">
          Sat at{' '}
          {profile.seatsPlayed.slice(0, 5).map((seat, index) => (
            <span key={seat}>
              {index > 0 ? ', ' : ''}
              <strong>{seat.replace(/-/g, ' ')}</strong>
            </span>
          ))}
          {profile.seatsPlayed.length > 5 ? ` and ${profile.seatsPlayed.length - 5} more` : ''}.
        </p>
      ) : null}

      {profile.about ? (
        <div className="profile__about">
          {profile.about.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {profile.githubHandle || profile.linkedinHandle ? (
        <div className="profile__links">
          {/*
            Rebuilt from the stored handle against a fixed host, so the address
            is not something anybody typed. rel and target are belt and braces
            on top of that.
          */}
          {profile.githubHandle ? (
            <a
              href={githubUrl(profile.githubHandle)}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              GitHub · {profile.githubHandle}
            </a>
          ) : null}
          {profile.linkedinHandle ? (
            <a
              href={linkedinUrl(profile.linkedinHandle)}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              LinkedIn · {profile.linkedinHandle}
            </a>
          ) : null}
        </div>
      ) : null}

      {mine ? (
        <p className="profile__visibility">
          Visible to: <strong>{PROFILE_VISIBILITY_LABELS[profile.visibility].label}</strong>.{' '}
          {PROFILE_VISIBILITY_LABELS[profile.visibility].detail}
        </p>
      ) : null}
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="profile__stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProfileForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: PublicProfile;
  onSaved: (saved: PublicProfile) => void;
  onCancel: () => void;
}) {
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [headline, setHeadline] = useState(initial.headline);
  const [about, setAbout] = useState(initial.about);
  const [location, setLocation] = useState(initial.location);
  // Seeded with the handle rather than the address: somebody re-editing sees
  // what is stored, and pasting a full URL over it still works.
  const [github, setGithub] = useState(initial.githubHandle ?? '');
  const [linkedin, setLinkedin] = useState(initial.linkedinHandle ?? '');
  const [openToWork, setOpenToWork] = useState(initial.openToWork);
  const [visibility, setVisibility] = useState<ProfileVisibility>(initial.visibility);
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setProblems({});
    try {
      const result = await profileApi.save({
        displayName,
        headline,
        about,
        location,
        github,
        linkedin,
        openToWork,
        visibility,
      });
      onSaved(result.profile);
    } catch (caught) {
      if (caught instanceof ApiCallError) {
        setProblems(caught.error.fields ?? {});
        setError(caught.error.message);
      } else {
        setError('Could not save that.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="profile profile--editing">
      <h1>Your profile</h1>
      <p className="seat-note">
        All of it is optional. The badges and the shifts you have run are on it either way, and
        those are the part you cannot type in.
      </p>

      {/*
        Before the fields, not after them. Somebody about to put a real name
        and a LinkedIn page into a product where they have been a call sign
        needs to know who sees it before they type it, not under a save button.
      */}
      <fieldset className="profile__field">
        <legend>Who can see this</legend>
        {PROFILE_VISIBILITIES.map((option) => (
          <label key={option} className="profile__radio">
            <input
              type="radio"
              name="visibility"
              checked={visibility === option}
              onChange={() => setVisibility(option)}
            />
            <span>
              <strong>{PROFILE_VISIBILITY_LABELS[option].label}</strong>
              <em>{PROFILE_VISIBILITY_LABELS[option].detail}</em>
            </span>
          </label>
        ))}
      </fieldset>

      <Field
        label="Name"
        hint="Optional. Your call sign is what the floor uses either way."
        problem={problems.displayName}
      >
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </Field>

      <Field
        label="One line"
        hint={`What you are working towards. ${HEADLINE_MAX - headline.length} left.`}
        problem={problems.headline}
      >
        <input
          value={headline}
          maxLength={HEADLINE_MAX}
          placeholder="Career changer, heading for a SOC analyst seat"
          onChange={(e) => setHeadline(e.target.value)}
        />
      </Field>

      <Field label="Where" hint="Optional, and as vague as you like." problem={problems.location}>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </Field>

      <Field
        label="About"
        hint={`What you did before, and what you are after. ${ABOUT_MAX - about.length} left.`}
        problem={problems.about}
      >
        <textarea rows={7} value={about} maxLength={ABOUT_MAX} onChange={(e) => setAbout(e.target.value)} />
      </Field>

      <Field
        label="GitHub"
        hint="Your username, or paste the address of your profile page."
        problem={problems.github}
      >
        <input value={github} placeholder="octocat" onChange={(e) => setGithub(e.target.value)} />
      </Field>

      <Field
        label="LinkedIn"
        hint="Paste the address of your profile page, the one with /in/ in it."
        problem={problems.linkedin}
      >
        <input
          value={linkedin}
          placeholder="https://www.linkedin.com/in/your-name"
          onChange={(e) => setLinkedin(e.target.value)}
        />
      </Field>

      <label className="profile__check">
        <input type="checkbox" checked={openToWork} onChange={(e) => setOpenToWork(e.target.checked)} />
        <span>Open to work. Shown as a badge on the profile.</span>
      </label>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="profile__controls">
        <button type="button" className="primary" disabled={busy} onClick={() => void save()}>
          Save
        </button>
        <button type="button" className="quiet" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  problem,
  children,
}: {
  label: string;
  hint: string;
  problem?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="profile__field">
      <span className="profile__label">{label}</span>
      {children}
      {problem ? (
        <span className="profile__problem">{problem}</span>
      ) : (
        <span className="profile__hint">{hint}</span>
      )}
    </label>
  );
}
