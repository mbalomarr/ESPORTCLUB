export type Lang = "en" | "ar";

/**
 * Any text field in /data can be either a plain string (same in both languages,
 * e.g. a gamertag) or an object with both translations: { "en": "...", "ar": "..." }.
 * If "ar" is missing, the English text is shown as a fallback.
 */
export type Localized = string | { en: string; ar?: string };

export type EventStatus = "upcoming" | "live" | "completed";

export interface ClubEvent {
  id: string;
  title: Localized;
  game: Localized;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (24h)
  location?: Localized;
  format?: Localized;
  prize?: Localized;
  status: EventStatus;
  description?: Localized;
  registrationUrl?: string;
  image?: string;
}

export interface Socials {
  x?: string;
  instagram?: string;
  twitch?: string;
  discord?: string;
}

export interface RosterMember {
  name: Localized;
  role: Localized;
  gamertag?: string;
  major?: Localized;
  mainGame?: Localized;
  photo?: string;
  socials?: Socials;
}

export interface HallOfFameEntry {
  tournament: Localized;
  game: Localized;
  date: string;
  winner: Localized;
  players?: string[];
  runnerUp?: Localized;
  prize?: Localized;
}

export interface GameOption {
  id: string;
  name: Localized;
  genre?: Localized;
  votes: number;
}

export interface GamesPoll {
  poll: { id: string; question: Localized; isOpen: boolean; closesOn?: string };
  options: GameOption[];
}

export interface SiteConfig {
  clubName: Localized;
  university: Localized;
  tagline: Localized;
  logo: string;
  contactEmail?: string;
  about: {
    vision: Localized;
    pillars: { title: Localized; icon: string; text: Localized }[];
    stats: { label: Localized; value: string }[];
  };
  socials: Socials;
  forms: {
    registrationFormspreeId?: string;
    googleFormEmbedUrl?: string;
    voteFormspreeId?: string;
    suggestionFormspreeId?: string;
  };
  live: { twitchChannel?: string; discordServerId?: string };
}
