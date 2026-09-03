/**
 * The landing screen a newcomer sees first: a branching map of ways in.
 *
 * "Cybersecurity" is a dozen different jobs, and a career changer does not yet
 * know which. So the screen asks the question out loud and lays the way in as a
 * tree that grows down the page:
 *
 *   - the assessment is the root: everyone starts by finding where they fit;
 *   - it forks into Risk (a branch of its own, no terminal) and Linux (the
 *     trunk every hands-on path shares);
 *   - from Linux the trunk continues into SOC Foundations, which fans out into
 *     the individual roles;
 *   - then the live war rooms, the portfolio the work builds, and interview
 *     practice.
 *
 * The buttons are styled as consoles you step into, not links, because that is
 * what choosing a path here is meant to feel like.
 */

import { useState } from 'react';

import type { LobbyDoorId } from '@soc/shared';

function SocRoomIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="8" width="38" height="24" rx="3" className="ri-screen" />
      <rect x="8" y="11" width="32" height="18" rx="1.5" className="ri-inner" />
      <path d="M10 22 h5 l2 -6 l3 11 l3 -8 l2 3 h10" className="ri-wave" fill="none" />
      <rect x="19" y="33" width="10" height="4" className="ri-stand" />
      <rect x="13" y="38" width="22" height="2.5" rx="1.25" className="ri-base" />
    </svg>
  );
}

function RedBlueRoomIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5 L40 11 V25 C40 34 33 40 24 43 C15 40 8 34 8 25 V11 Z" className="ri-shield" />
      <clipPath id="rb-clip">
        <path d="M24 5 L40 11 V25 C40 34 33 40 24 43 C15 40 8 34 8 25 V11 Z" />
      </clipPath>
      <g clipPath="url(#rb-clip)">
        <rect x="0" y="0" width="24" height="48" className="ri-red" />
        <rect x="24" y="0" width="24" height="48" className="ri-blue" />
      </g>
      <line x1="24" y1="5" x2="24" y2="43" className="ri-divide" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="6" width="30" height="36" rx="3" className="ri-screen" />
      <line x1="14" y1="15" x2="34" y2="15" className="ri-line" />
      <line x1="14" y1="21" x2="30" y2="21" className="ri-line" />
      <line x1="14" y1="27" x2="32" y2="27" className="ri-line" />
      <circle cx="31" cy="34" r="7" className="ri-seal" />
      <path d="M28 34 l2 2 l4 -4" className="ri-check" fill="none" />
    </svg>
  );
}

function InterviewIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="19" y="8" width="10" height="20" rx="5" className="ri-mic" />
      <path d="M14 24 a10 10 0 0 0 20 0" className="ri-arc" fill="none" />
      <line x1="24" y1="34" x2="24" y2="40" className="ri-stem" />
      <line x1="17" y1="40" x2="31" y2="40" className="ri-foot" />
      <circle cx="24" cy="15" r="1.6" className="ri-wave2" />
      <circle cx="24" cy="20" r="1.6" className="ri-wave2" />
    </svg>
  );
}

function RiskRoomIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      {/* a balance scale: risk is weighed, not typed */}
      <line x1="24" y1="12" x2="24" y2="40" className="ri-post" />
      <line x1="10" y1="14" x2="38" y2="14" className="ri-beam" />
      <circle cx="24" cy="11" r="2.6" className="ri-pivot" />
      <line x1="18" y1="40" x2="30" y2="40" className="ri-basefoot" />
      <line x1="10" y1="14" x2="6" y2="23" className="ri-cord" />
      <line x1="10" y1="14" x2="14" y2="23" className="ri-cord" />
      <path d="M4 23 a6 4 0 0 0 12 0" className="ri-pan" fill="none" />
      <line x1="38" y1="14" x2="34" y2="23" className="ri-cord" />
      <line x1="38" y1="14" x2="42" y2="23" className="ri-cord" />
      <path d="M32 23 a6 4 0 0 0 12 0" className="ri-pan" fill="none" />
    </svg>
  );
}

function AiRoomIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      {/* a neural chip: a model under test */}
      <rect x="14" y="14" width="20" height="20" rx="3" className="ri-chip" />
      <path d="M20 20 L28 20 M20 20 L24 28 L28 20" className="ri-link" fill="none" />
      <circle cx="20" cy="20" r="1.7" className="ri-node" />
      <circle cx="28" cy="20" r="1.7" className="ri-node" />
      <circle cx="24" cy="28" r="1.7" className="ri-node" />
      <line x1="19" y1="14" x2="19" y2="9" className="ri-pin" />
      <line x1="24" y1="14" x2="24" y2="9" className="ri-pin" />
      <line x1="29" y1="14" x2="29" y2="9" className="ri-pin" />
      <line x1="19" y1="34" x2="19" y2="39" className="ri-pin" />
      <line x1="24" y1="34" x2="24" y2="39" className="ri-pin" />
      <line x1="29" y1="34" x2="29" y2="39" className="ri-pin" />
      <line x1="14" y1="21" x2="9" y2="21" className="ri-pin" />
      <line x1="14" y1="27" x2="9" y2="27" className="ri-pin" />
      <line x1="34" y1="21" x2="39" y2="21" className="ri-pin" />
      <line x1="34" y1="27" x2="39" y2="27" className="ri-pin" />
    </svg>
  );
}

function LobbyIcon() {
  return (
    <svg className="room-icon room-icon--big" viewBox="0 0 48 48" aria-hidden="true">
      {/* a doorway with people in front of it */}
      <path d="M14 40 V14 a10 10 0 0 1 20 0 V40" className="ri-arch" fill="none" />
      <line x1="8" y1="40" x2="40" y2="40" className="ri-base" />
      <circle cx="19" cy="27" r="3" className="ri-node" />
      <path d="M14 37 a5 5 0 0 1 10 0" className="ri-arc" fill="none" />
      <circle cx="30" cy="27" r="3" className="ri-node" />
      <path d="M25 37 a5 5 0 0 1 10 0" className="ri-arc" fill="none" />
    </svg>
  );
}

function BadgeShelfIcon() {
  return (
    <svg className="room-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="18" r="11" className="ri-seal" />
      <path d="M19 18 l4 4 l8 -8" className="ri-check" fill="none" />
      <path d="M17 28 L14 44 L24 39 L34 44 L31 28" className="ri-ribbon" fill="none" />
    </svg>
  );
}

interface HomeProps {
  username: string;
  onSignOut: () => void;
  onTakeAssessment: () => void;
  onRisk: () => void;
  onLinux: () => void;
  onNetworking: () => void;
  onSoc: () => void;
  onBrowseTracks: () => void;
  /**
   * Every war room tile goes through here.
   *
   * The door somebody pressed rides along, so the lobby can show that intent to
   * the other people standing in it. A room needs several people at once, and
   * before the lobby existed each of them arrived alone at an empty schedule
   * ten minutes apart and concluded the whole thing was dead.
   */
  onLobby: (door: LobbyDoorId | null) => void;
  /**
   * Straight onto the SOC watch floor, skipping the lobby.
   *
   * The lobby is how strangers find each other, and it earns its place the
   * first few times. Somebody who already has a group, or who is going back to
   * a room they left, should not have to walk through a waiting area to reach a
   * floor they can already see.
   */
  onWatchFloor: () => void;
  onBadges: () => void;
  onPortfolio: () => void;
  onInterviewSim: () => void;
  onInterviewPeer: () => void;
  /** Whether the viewer has the paid tier. The UI is identical either way; free
   *  simply cannot enter the locked tiles. */
  paid: boolean;
}

/** The career paths that open up once the foundations are in place. */
const SOC_ROLES: Array<{ name: string; color: string; blurb: string }> = [
  { name: 'Log Analyst', color: 'green', blurb: 'Builds the timeline everyone argues from.' },
  { name: 'Network Analyst', color: 'blue', blurb: 'Tells a beacon from a backup job.' },
  { name: 'Threat Hunter', color: 'amber', blurb: 'Hunts what never raised an alert.' },
  { name: 'Threat Intelligence Analyst', color: 'cyan', blurb: 'Works out who is behind it, and what is next.' },
  { name: 'Forensics Analyst', color: 'violet', blurb: 'Preserves evidence to a courtroom standard.' },
  { name: 'Incident Response Analyst', color: 'red', blurb: 'Decides what the team does next.' },
  { name: 'Detection Engineer', color: 'green', blurb: 'Turns an incident into a rule.' },
  { name: 'Malware Analyst', color: 'violet', blurb: 'Works out what a file actually does.' },
  { name: 'Vulnerability Analyst', color: 'amber', blurb: 'Decides what gets patched first.' },
  { name: 'Cloud Security Analyst', color: 'cyan', blurb: 'Every attack is an API call and an identity.' },
  { name: 'AI Security Analyst', color: 'blue', blurb: 'Tests the models before they ship.' },
  { name: 'Red Team Operator', color: 'red', blurb: 'Breaks in, on purpose and with permission.' },
  { name: 'Blue Team Analyst', color: 'blue', blurb: 'Defends the floor in real time.' },
  { name: 'Purple Team Analyst', color: 'violet', blurb: 'Runs both sides to close the gaps.' },
  { name: 'Mitigation Analyst', color: 'amber', blurb: 'Weighs what a fix will break.' },
  { name: 'Mitigation Engineer', color: 'green', blurb: 'Builds the control that holds the line.' },
  { name: 'Security Engineer', color: 'cyan', blurb: 'Builds security into the systems themselves.' },
];

export function Home({
  username,
  onSignOut,
  onTakeAssessment,
  onRisk,
  onLinux,
  onNetworking,
  onSoc,
  onBrowseTracks,
  onLobby,
  onWatchFloor,
  onBadges,
  onPortfolio,
  onInterviewSim,
  onInterviewPeer,
  paid,
}: HomeProps) {
  const [lockedNote, setLockedNote] = useState<string | null>(null);
  /** Wrap a navigation so a free viewer gets a note instead of entering. */
  const gate = (feature: string, action: () => void) => () => {
    if (paid) {
      action();
      return;
    }
    setLockedNote(`${feature} is part of the paid career pack. Ask for access to unlock it.`);
  };
  const lockChip = !paid ? <span className="lockchip">Paid</span> : null;
  return (
    <div className="home">
      <header className="home-top">
        <span className="brand">
          <span className="dot" />
          Ridgeline SOC Trainer
        </span>
        <span className="spacer" />
        <span className="who">{username}</span>
        <button className="btn" onClick={onSignOut}>
          Sign out
        </button>
      </header>

      <div className="home-inner">
        {lockedNote && (
          <div className="locked-note" role="status">
            <span>{lockedNote}</span>
            <button type="button" onClick={() => setLockedNote(null)} aria-label="Dismiss">
              &times;
            </button>
          </div>
        )}
        <div className="home-hero">
          <div className="home-eyebrow">Start here</div>
          <h1>
            So you want to get into <span className="accentword">cybersecurity</span>.
          </h1>
          <p className="home-sub">
            There are a dozen very different jobs hiding under that one word. The first question is
            not <em>how</em>. It is <em>which part</em>. Follow the trail.
          </p>
        </div>

        <div className="home-map">
          <span className="spine" aria-hidden="true">
            <span className="spine-pulse" />
          </span>

          {/* Root: the assessment */}
          <section className="stage">
            <div className="stage-node">01</div>
            <div className="stage-tiles">
              <button
                className={`techbtn accent solo${paid ? '' : ' locked'}`}
                onClick={gate('The assessment', onTakeAssessment)}
              >
                {lockChip}
                <span className="tb-tag">One word, a dozen very different jobs</span>
                <span className="tb-name">Take the assessment</span>
                <span className="tb-desc">
                  Cybersecurity is vast, and its jobs would suit completely different people. This
                  reads your interests, your strengths, and the way you actually think, then hands
                  you the paths that fit, and the ones that would wear you down. Stop guessing where
                  to start.
                </span>
                <span className="tb-enter">Career Fit Analyzer &rsaquo;&rsaquo;</span>
              </button>
            </div>
          </section>

          {/*
            Fork, drawn as one: a real branch (Risk, no terminal at all) on one
            side and the trunk (Linux and Networking, which share a foundation)
            on the other. Grouping the trunk pair visually and setting Risk
            apart with a divider is what makes it read as a fork rather than
            three equally-weighted tiles in a row.
          */}
          <section className="stage">
            <div className="stage-node">02</div>
            <div className="stage-label">Learn the basics and practice</div>
            <div className="stage-fork">
              <div className="fork-branch">
                <button className="techbtn amber" onClick={onRisk}>
                  <span className="tb-tag">No prerequisites needed</span>
                  <span className="tb-name">Go into Risk</span>
                  <span className="tb-desc">
                    Governance, risk, and compliance: decisions and evidence, no command line. A
                    path you can take without the terminal at all.
                  </span>
                  <span className="tb-enter">Explore Risk &amp; GRC &rsaquo;&rsaquo;</span>
                </button>
              </div>

              <div className="fork-divider" aria-hidden="true">
                <span>or</span>
              </div>

              <div className="fork-trunk">
                <button className="techbtn green" onClick={onLinux}>
                  <span className="tb-tag">The main trunk</span>
                  <span className="tb-name">Linux Foundations</span>
                  <span className="tb-desc">
                    Linux, logs, and networking in a simulated terminal. The ground floor every
                    hands-on path shares, and the way on to the SOC.
                  </span>
                  <span className="tb-enter">Open module &rsaquo;&rsaquo;</span>
                </button>

                <button className="techbtn violet" onClick={onNetworking}>
                  <span className="tb-tag">The main trunk</span>
                  <span className="tb-name">Networking Basics</span>
                  <span className="tb-desc">
                    What a host is talking to, and whether it should be. The other half of the
                    ground floor, and where the exfiltration connection from Linux Fundamentals
                    finally gets found.
                  </span>
                  <span className="tb-enter">Open module &rsaquo;&rsaquo;</span>
                </button>
              </div>
            </div>
          </section>

          {/* From Linux and Networking: SOC Foundations, fanning into roles */}
          <section className="stage">
            <div className="stage-node">03</div>
            <div className="stage-label">Learn the skills, and practice them on the roles</div>
            <div className="role-grid">
              {SOC_ROLES.map((role) => (
                <button className={`roletile ${role.color}`} key={role.name} onClick={onBrowseTracks}>
                  <span className="rl-name">{role.name}</span>
                  <span className="rl-blurb">{role.blurb}</span>
                  <span className="rl-soon">soon</span>
                </button>
              ))}
            </div>
          </section>

          {/* Live war rooms */}
          <section className="stage live">
            <div className="stage-node">05</div>
            <div className="stage-label live">
              <span className="live-badge">
                <span className="live-dot" />
                LIVE
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: 8,
                  textTransform: 'none',
                  letterSpacing: 0,
                  fontWeight: 400,
                  fontSize: 13,
                  opacity: 0.82,
                  maxWidth: 560,
                  lineHeight: 1.55,
                }}
              >
                Get hands-on experience in a live environment, alongside real people. This is as
                close to the real thing as you will get before the job.
              </span>
            </div>

            {/*
              One door in front of four.

              Every room here needs several people at the same time, and each of
              them used to arrive alone at an empty schedule ten minutes apart
              and conclude the whole thing was dead. The lobby is where they
              find each other first.
            */}
            <button className="lobbygate" onClick={() => onLobby(null)}>
              <LobbyIcon />
              <span className="lg-body">
                <span className="lg-tag">Everybody, from every room</span>
                <span className="lg-name">Take the lobby to the war rooms</span>
                <span className="lg-desc">
                  Walk in as your call sign, see who else is here and what they are heading for,
                  talk in the chat rooms, and find people for a session. Every war room below is a
                  door off it.
                </span>
                <span className="lg-enter">Enter the lobby &rsaquo;&rsaquo;</span>
              </span>
            </button>

            <div className="stage-tiles">
              <div className="roomcol">
                <button className="prereq-gate" onClick={onSoc}>
                  <span className="pg-tag">Prerequisite for this room</span>
                  <span className="pg-name">SOC Foundations</span>
                  <span className="pg-open">Open module &rsaquo;&rsaquo;</span>
                </button>
                <button className="roomtile soc" onClick={() => onLobby('soc')}>
                  <SocRoomIcon />
                  <span className="rt-body">
                    <span className="rt-name">SOC War Room</span>
                    <span className="rt-desc">Defend a live incident with a team on the floor.</span>
                    <span className="rt-status">
                      <span className="live-dot" />
                      rooms open
                    </span>
                  </span>
                </button>
                {/*
                  A separate control rather than a second click target inside
                  the tile: a button inside a button is invalid markup and does
                  not survive a keyboard.
                */}
                <button className="roomtile__direct" onClick={onWatchFloor}>
                  Skip the lobby, go straight to the watch floor &rsaquo;
                </button>
              </div>

              <button className="roomtile rb" onClick={() => onLobby('redblue')}>
                <RedBlueRoomIcon />
                <span className="rt-body">
                  <span className="rt-name">Red / Blue War Room</span>
                  <span className="rt-desc">Attack or defend, turn for turn, against a real opponent.</span>
                  <span className="rt-status">
                    <span className="live-dot" />
                    rooms open
                  </span>
                </span>
              </button>

              <button className="roomtile risk" onClick={() => onLobby('grc')}>
                <RiskRoomIcon />
                <span className="rt-body">
                  <span className="rt-name">Risk War Room</span>
                  <span className="rt-desc">Argue a risk call against the clock: accept, mitigate, or escalate.</span>
                  <span className="rt-status muted">not open yet &middot; wait in the lobby</span>
                </span>
              </button>

              <button className="roomtile ai" onClick={() => onLobby('ai')}>
                <AiRoomIcon />
                <span className="rt-body">
                  <span className="rt-name">AI Security War Room</span>
                  <span className="rt-desc">Break a deployed model&rsquo;s guardrails, or harden them, turn for turn.</span>
                  <span className="rt-status muted">not open yet &middot; wait in the lobby</span>
                </span>
              </button>
            </div>
          </section>

          {/* Land the job: the portfolio the work builds, and interview practice */}
          <section className="stage">
            <div className="stage-node">06</div>
            <div className="stage-label">Land the job</div>
            <div className="stage-tiles">
              {/* Free, and deliberately so: the badges are the record of work
                  already done, and putting a price on somebody's own history
                  would be indefensible. */}
              <button className="roomtile badges" onClick={onBadges}>
                <BadgeShelfIcon />
                <span className="rt-body">
                  <span className="rt-name">Your badges</span>
                  <span className="rt-desc">
                    One for every module you finish, and one for every career track you complete.
                    Each carries a line written for somebody who did not do the work, which is the
                    line you can hand an interviewer.
                  </span>
                  <span className="rt-status muted">collected as you go</span>
                </span>
              </button>

              <button
                className={`roomtile portfolio${paid ? '' : ' locked'}`}
                onClick={gate('Your portfolio', onPortfolio)}
              >
                {lockChip}
                <PortfolioIcon />
                <span className="rt-body">
                  <span className="rt-name">Your portfolio</span>
                  <span className="rt-desc">
                    Everything you have done, timestamped and kept at your best: which incidents you
                    cracked, and how fast you found what mattered. A record you can hand an interviewer.
                  </span>
                  <span className="rt-status muted">builds itself as you work</span>
                </span>
              </button>

              <button
                className={`roomtile interview${paid ? '' : ' locked'}`}
                onClick={gate('The simulation interview', onInterviewSim)}
              >
                {lockChip}
                <InterviewIcon />
                <span className="rt-body">
                  <span className="rt-name">Simulation interview</span>
                  <span className="rt-desc">
                    A scripted interviewer asks what this job really asks. Voice only, no camera, as
                    many times as you like.
                  </span>
                  <span className="rt-status muted">solo &middot; anytime</span>
                </span>
              </button>

              <button
                className={`roomtile interview${paid ? '' : ' locked'}`}
                onClick={gate('The peer interview', onInterviewPeer)}
              >
                {lockChip}
                <InterviewIcon />
                <span className="rt-body">
                  <span className="rt-name">Peer interview</span>
                  <span className="rt-desc">
                    Pair up: one of you gets the interviewer script, the other answers. Voice only, no
                    face, so it is comfortable. Then swap.
                  </span>
                  <span className="rt-status muted">two players</span>
                </span>
              </button>
            </div>
          </section>
        </div>

        <button className="home-browse" onClick={onBrowseTracks}>
          or browse all sixteen tracks
        </button>
      </div>
    </div>
  );
}
