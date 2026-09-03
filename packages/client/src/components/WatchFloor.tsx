/**
 * The watch floor, as the room itself rather than a picture of one.
 *
 * WHY THIS REPLACED A LIST OF SEAT CARDS
 *
 * The floor existed as a standalone mockup that no code loaded, and the thing
 * the app actually rendered was a grid of cards. Those are not the same
 * product. A card grid tells you which chairs are taken; a floor tells you what
 * a SOC is, which rows escalate to which, and where you are sitting in it, and
 * for somebody who has never seen one that is most of the teaching.
 *
 * THE ROWS ARE THE TIERS
 *
 * Front to back: triage, investigation, specialists, and the command pod. An
 * alert lands at the front and only what survives it travels backwards, so
 * somebody looking at this should be able to read the escalation model off the
 * floor without being told.
 *
 * WHAT IS LIVE AND WHAT IS DRAWN
 *
 * Every chair, name and occupant comes from the room. The scenario decides
 * which seats exist, so a floor for a scenario with eight roles has eight
 * desks and not thirteen, and the geometry stretches to whatever it is given.
 * Nothing here is hardcoded to a particular scenario.
 */

import { useMemo } from 'react';

import type { SocRoleId } from '@soc/shared';
import type { SeatView } from '../lib/api';

/** Tier per seat, and the one chair somebody new should be able to find. */
const TIER: Record<string, 1 | 2 | 3> = {
  'soc-operator': 1,
  'log-analyst': 2,
  'network-analyst': 2,
  'cloud-security': 2,
  'vulnerability-analyst': 2,
  forensics: 3,
  'malware-analyst': 3,
  'threat-intel': 3,
  'ai-security': 3,
  'detection-engineer': 3,
  'fusion-analyst': 3,
  'mitigation-specialist': 3,
  'ir-lead': 3,
};

/**
 * The three seats that face the lead rather than a queue.
 *
 * Kept out of the rows on purpose. Fusion turns several analysts' findings
 * into one assessment and mitigation turns that into an action with a price on
 * it, so both face the decision rather than a surface. Putting either in a row
 * would point them at a queue neither of them works.
 */
const POD: SocRoleId[] = ['mitigation-specialist', 'ir-lead', 'fusion-analyst'];

const ROW_GEO = [
  { y: 190, scale: 0.72, half: 250, label: 'TIER 3', what: 'Specialists' },
  { y: 292, scale: 0.88, half: 330, label: 'TIER 2', what: 'Investigation' },
  { y: 398, scale: 1.05, half: 420, label: 'TIER 1', what: 'Triage · entry level' },
];

/**
 * The band is shallower than the row it sits behind.
 *
 * A band tall enough to enclose a desk, its screen and its occupant reaches
 * far enough down to swallow the row in front of it, which reads as one zone
 * containing two tiers and is the opposite of what the band is for.
 */
const BAND_HEIGHT = 86;

const SHORT: Record<string, string> = {
  'soc-operator': 'SOC OPERATOR',
  'log-analyst': 'LOG ANALYST',
  'network-analyst': 'NETWORK',
  'cloud-security': 'CLOUD SEC',
  'vulnerability-analyst': 'VULN ANALYST',
  forensics: 'FORENSICS',
  'malware-analyst': 'MALWARE',
  'threat-intel': 'THREAT INTEL',
  'ai-security': 'AI SECURITY',
  'detection-engineer': 'DETECTION ENG',
  'fusion-analyst': 'FUSION',
  'mitigation-specialist': 'MITIGATION',
  'ir-lead': 'IR LEAD',
};

interface Placed {
  seat: SeatView;
  x: number;
  y: number;
  scale: number;
}

interface Props {
  seating: SeatView[];
  /** The role this browser is sitting in, or null while still choosing. */
  mine: SocRoleId | null;
  onPick: (role: SocRoleId) => void;
  /** Roles that have something new on their board, for the live shift. */
  active?: SocRoleId[];
}

export function WatchFloor({ seating, mine, onPick, active = [] }: Props) {
  const { rows, pod } = useMemo(() => layOut(seating), [seating]);
  const activeSet = new Set(active);

  return (
    <svg
      className="floor"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="The watch floor. Rows run front to back by tier."
    >
      {/* Tier bands, drawn under the desks. Without them the rows are three
          rows; with them they are the escalation model. */}
      {ROW_GEO.map((g, i) =>
        rows[i]?.length ? (
          <g key={g.label} aria-hidden="true">
            <rect
              x={600 - g.half - 46 * g.scale}
              y={g.y - 44 * g.scale}
              width={2 * (g.half + 46 * g.scale)}
              height={BAND_HEIGHT * g.scale}
              rx={24 * g.scale}
              className={g.label === 'TIER 1' ? 'floor__band floor__band--entry' : 'floor__band'}
            />
            {/* The label deliberately does not scale with the row's
                perspective: it is chrome, and scaling it renders the back row
                at a size that is present in the DOM and invisible on screen. */}
            <text
              className={g.label === 'TIER 1' ? 'floor__tier floor__tier--entry' : 'floor__tier'}
              x={600 - g.half - 46 * g.scale + 10}
              y={g.y - 44 * g.scale + 20}
            >
              {g.label}
            </text>
            <text
              className="floor__tierwhat"
              x={600 - g.half - 46 * g.scale + 10}
              y={g.y - 44 * g.scale + 37}
            >
              {g.what}
            </text>
          </g>
        ) : null,
      )}

      {/* Back to front, so nearer desks occlude further ones. */}
      {[...rows.flat(), ...pod]
        .sort((a, b) => a.y - b.y)
        .map((p) => (
          <Station
            key={p.seat.role}
            placed={p}
            mine={p.seat.role === mine}
            busy={activeSet.has(p.seat.role)}
            onPick={onPick}
          />
        ))}
    </svg>
  );
}

/**
 * Place the seats this scenario actually runs.
 *
 * Row width follows how many seats the row holds rather than a fixed slot
 * count, so a five-wide row of specialists is drawn five wide. A row that lies
 * about its own size to keep a grid tidy is the kind of quiet wrongness this
 * floor should not teach.
 */
function layOut(seating: SeatView[]): { rows: Placed[][]; pod: Placed[] } {
  const inPod = seating.filter((s) => POD.includes(s.role));
  const desks = seating.filter((s) => !POD.includes(s.role));

  const byTier: SeatView[][] = [[], [], []];
  for (const seat of desks) byTier[(TIER[seat.role] ?? 2) - 1]!.push(seat);

  // Drawn back to front: tier 3 furthest, tier 1 nearest.
  const ordered = [byTier[2]!, byTier[1]!, byTier[0]!];

  /*
   * A sparse row clusters rather than spans.
   *
   * Spreading whatever the row holds across its full width put two desks at
   * opposite ends of the floor with a void between them, which reads as a room
   * that has lost people rather than a scenario that seats two. The row is as
   * wide as its seats need and no wider, up to the width available.
   */
  const rows = ordered.map((row, i) => {
    const g = ROW_GEO[i]!;
    const gap = Math.min((2 * g.half) / Math.max(1, row.length - 1), 210 * g.scale);
    const width = gap * (row.length - 1);
    return row.map((seat, j) => ({
      seat,
      x: 600 - width / 2 + j * gap,
      y: g.y,
      scale: g.scale,
    }));
  });

  /*
   * The lead is centre, always, and the other two flank it.
   *
   * Spreading the pod evenly across whoever happens to be in it put the lead
   * on the right-hand flank on any scenario that seats no fusion analyst,
   * which is most of them. The lead's position is not a layout outcome: it is
   * the chair the other two face, and a pod where the lead is off to one side
   * reads as three peers rather than as a decision and its two inputs.
   */
  const flanks = POD.filter((role) => role !== 'ir-lead' && inPod.some((s) => s.role === role));
  const pod: Placed[] = [];
  for (const [i, role] of flanks.entries()) {
    // One flank sits left; two sit either side.
    const x = flanks.length === 1 ? 364 : i === 0 ? 364 : 836;
    pod.push({ seat: inPod.find((s) => s.role === role)!, x, y: 490, scale: 1.1 });
  }
  const lead = inPod.find((s) => s.role === 'ir-lead');
  if (lead) {
    // Slightly forward of the flanks, so the pod reads as facing inward rather
    // than as a fourth row.
    pod.push({ seat: lead, x: 600, y: 512, scale: 1.24 });
  }

  return { rows, pod };
}

function Station({
  placed,
  mine,
  busy,
  onPick,
}: {
  placed: Placed;
  mine: boolean;
  busy: boolean;
  onPick: (role: SocRoleId) => void;
}) {
  const { seat, x, y, scale: k } = placed;
  const w = 150 * k;
  const h = 34 * k;
  const occupied = Boolean(seat.occupant);
  const label = SHORT[seat.role] ?? seat.role;

  const classes = [
    'station',
    occupied ? 'station--taken' : 'station--open',
    mine ? 'station--mine' : '',
    busy ? 'station--busy' : '',
    seat.selectable ? 'station--selectable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <g
      className={classes}
      transform={`translate(${x} ${y})`}
      role={seat.selectable ? 'button' : 'group'}
      tabIndex={seat.selectable ? 0 : -1}
      aria-label={
        occupied
          ? `${label}, taken by ${seat.occupant!.callSign}`
          : `${label}, open. ${seat.blockedBecause ?? 'Select to sit here.'}`
      }
      onClick={() => seat.selectable && onPick(seat.role)}
      onKeyDown={(e) => {
        if (seat.selectable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPick(seat.role);
        }
      }}
    >
      {/* desk */}
      <rect className="station__desk" x={-w / 2} y={-h / 2} width={w} height={h} rx={5 * k} />
      {/* monitor: the seat's own screen, which is the point of the chair */}
      <rect
        className="station__screen"
        x={-w / 2 + 8 * k}
        y={-h / 2 - 22 * k}
        width={w - 16 * k}
        height={20 * k}
        rx={2 * k}
      />
      {/* chair and occupant */}
      {occupied ? (
        <>
          <circle className="station__head" cx={0} cy={h / 2 + 15 * k} r={9 * k} />
          <path
            className="station__body"
            d={`M${-13 * k} ${h / 2 + 30 * k} a${13 * k} ${13 * k} 0 0 1 ${26 * k} 0 Z`}
          />
        </>
      ) : (
        <circle className="station__empty" cx={0} cy={h / 2 + 18 * k} r={10 * k} />
      )}
      <text className="station__label" y={-h / 2 - 28 * k}>
        {label}
      </text>
      <text className="station__who" y={h / 2 + 48 * k}>
        {occupied ? `@${seat.occupant!.callSign}` : 'open'}
      </text>
    </g>
  );
}
