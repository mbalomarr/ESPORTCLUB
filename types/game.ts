import type { IsoDate, Localized } from "./i18n";

export interface GameOption {
  /** Stable identifier; also used to remember a visitor's vote. */
  id: string;
  name: Localized;
  genre?: Localized;
  /** Official tally, updated by club admins. */
  votes: number;
}

export interface Poll {
  /** Changing the id starts a fresh poll (every visitor can vote again). */
  id: string;
  question: Localized;
  isOpen: boolean;
  closesOn?: IsoDate;
}

export interface GamesPoll {
  poll: Poll;
  options: GameOption[];
}
