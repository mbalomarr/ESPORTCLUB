import type { Localized } from "./i18n";
import type { Socials } from "./site";

/** A club board member shown on the About page (data/roster.json). */
export interface RosterMember {
  name: Localized;
  role: Localized;
  major?: Localized;
  mainGame?: Localized;
  /** Site path ("/roster/name.jpg") or full URL. Empty shows initials. */
  photo?: string;
  /** Public profile links. Personal Discord accounts are intentionally not supported. */
  socials?: Omit<Socials, "discord">;
}

/** A tournament result shown on the Leaderboard (data/hall-of-fame.json). */
export interface HallOfFameEntry {
  tournament: Localized;
  game: Localized;
  date: string;
  winner: Localized;
  players?: string[];
  runnerUp?: Localized;
  prize?: Localized;
}
