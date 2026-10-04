import type { IsoDate, Localized } from "./i18n";

export const EVENT_STATUSES = ["upcoming", "live", "completed"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface ClubEvent {
  /** Unique, URL-safe identifier (lowercase letters, digits, dashes). */
  id: string;
  title: Localized;
  game: Localized;
  date: IsoDate;
  /** 24-hour time, e.g. "18:00". */
  time?: string;
  location?: Localized;
  format?: Localized;
  prize?: Localized;
  status: EventStatus;
  description?: Localized;
  /** Site path ("/join") or full URL. */
  registrationUrl?: string;
  /** Site path ("/games/x.jpg") or full URL. */
  image?: string;
}
