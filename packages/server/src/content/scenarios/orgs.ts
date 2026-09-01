/**
 * The organisations scenarios happen in.
 *
 * WHY MORE THAN ONE
 *
 * The first twenty-six scenarios all take place at Ridgeline Medical Group. At
 * that size it reads as continuity. At a hundred and fifty it becomes a
 * monoculture, and a student who has only ever worked a hospital learns the
 * hospital rather than the skill: they come to expect that the crown jewels are
 * patient records, that the regulator cares about confidentiality above
 * everything, and that a bad hour is measured in days of recovery.
 *
 * None of that is generally true, and the differences are not decoration. They
 * change which finding matters, how fast a decision has to be made, and what
 * "worst case" even means:
 *
 *   In a hospital, availability can be a clinical safety issue and the worst
 *   case is measured in harm to people who never chose to be there.
 *
 *   In a credit union, money moves in minutes and is unrecoverable once it
 *   settles, so the first hour is a race against a payment rail rather than an
 *   investigation. The same evidence demands a faster and cruder decision.
 *
 *   In a freight operator, the physical world keeps moving whatever the network
 *   is doing. Systems can be down while lorries are still loading, and the
 *   damage accrues in the gap between what the system believes and what is
 *   actually on the dock.
 *
 * A floor that has worked all three has met the same techniques against three
 * different definitions of disaster, which is what makes the technique itself
 * the thing they remember.
 *
 * WHY THIS IS A TABLE AND NOT PROSE IN EACH SCENARIO
 *
 * Host naming, crown jewels and regulator are referenced constantly and are
 * exactly the sort of detail that drifts when it is retyped. A scenario author
 * reaches for a hostname, invents `fcu-core-1` where every other file says
 * `fcu-core-01`, and the estate quietly stops being one place.
 */

export const ORG_IDS = ['ridgeline', 'fenmarch', 'ardal'] as const;
export type OrgId = (typeof ORG_IDS)[number];

export interface Organisation {
  id: OrgId;
  name: string;
  sector: string;
  /** Prefix every host in this estate carries, e.g. "rmg-web-02". */
  hostPrefix: string;
  /** What an attacker would actually be after. */
  crownJewels: string[];
  /** Who has to be told, and roughly how quickly. */
  notification: string;
  /**
   * What makes an hour here different from an hour anywhere else.
   *
   * Written to be read by a scenario author before they write, because the
   * clock is the thing most likely to be got wrong: a response that is correct
   * at the hospital is too slow at the credit union and too fast at the freight
   * operator.
   */
  tempo: string;
  /** The thing that goes wrong here that does not go wrong elsewhere. */
  characteristicRisk: string;
}

export const ORGANISATIONS: Record<OrgId, Organisation> = {
  ridgeline: {
    id: 'ridgeline',
    name: 'Ridgeline Medical Group',
    sector: 'Healthcare',
    hostPrefix: 'rmg',
    crownJewels: [
      'Electronic patient record',
      'Clinical research participant register',
      'Imaging archive',
      'Controlled drugs register',
    ],
    notification:
      'Data protection regulator within 72 hours where personal data is involved, and the clinical ' +
      'safety officer immediately where patient care could be affected.',
    tempo:
      'Deliberate. Clinical systems cannot be isolated without somebody establishing what happens ' +
      'to the patients depending on them, so containment is a conversation rather than a command. ' +
      'The floor usually has hours rather than minutes, and spending them is the correct use of ' +
      'them.',
    characteristicRisk:
      'Devices that cannot be patched because certification forbids it, on a flat network, ' +
      'attached to people.',
  },
  fenmarch: {
    id: 'fenmarch',
    name: 'Fenmarch Credit Union',
    sector: 'Financial services',
    hostPrefix: 'fcu',
    crownJewels: [
      'Core banking ledger',
      'Payment initiation and approval systems',
      'Member identity and KYC records',
      'Card processing',
    ],
    notification:
      'Financial regulator on a same-day basis for operational incidents, the payment scheme within ' +
      'hours where transactions are affected, and members individually where accounts are touched.',
    tempo:
      'Fast and unforgiving. Payments settle in minutes and are unrecoverable afterwards, so the ' +
      'first hour is a race against a payment rail rather than an investigation. A decision that ' +
      'would be prudently slow at the hospital is simply too late here, and the floor has to act ' +
      'on less evidence than it is comfortable with.',
    characteristicRisk:
      'A small institution with the same obligations as a large one, running core systems it ' +
      'buys rather than builds, where the fastest path to money is a person rather than a ' +
      'vulnerability.',
  },
  ardal: {
    id: 'ardal',
    name: 'Ardal Freight',
    sector: 'Logistics and warehousing',
    hostPrefix: 'adf',
    crownJewels: [
      'Warehouse management system',
      'Route and scheduling platform',
      'Customs and manifest filing',
      'Yard and gate access control',
    ],
    notification:
      'Customers contractually within hours where shipments are affected, customs authority where ' +
      'manifest integrity is in question, and the regulator only where personal data is involved.',
    tempo:
      'Continuous and physical. The lorries keep moving whatever the network is doing, so systems ' +
      'can be down while goods are still being loaded, and the damage accrues in the gap between ' +
      'what the system believes is on a pallet and what is actually on it. Nothing stops for an ' +
      'incident, which means containment has to be planned around a site that will not pause.',
    characteristicRisk:
      'Operational technology bought on a fifteen year replacement cycle, sitting on the same ' +
      'network as the office, in buildings where the doors are held open by a forklift.',
  },
};

/** Host naming, so a scenario cannot invent a second convention by accident. */
export function host(org: OrgId, role: string, index: number): string {
  return `${ORGANISATIONS[org].hostPrefix}-${role}-${String(index).padStart(2, '0')}`;
}
