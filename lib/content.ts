// Single entry point for all Git-backed content in /data.
// JSON is bundled at build time, so every commit to /data triggers a Vercel
// rebuild and the live site updates within about a minute.
import siteJson from "@/data/site.json";
import eventsJson from "@/data/events.json";
import rosterJson from "@/data/roster.json";
import hallOfFameJson from "@/data/hall-of-fame.json";
import gamesJson from "@/data/games.json";
import type {
  ClubEvent,
  GamesPoll,
  HallOfFameEntry,
  RosterMember,
  SiteConfig,
} from "./types";

export const site = siteJson as unknown as SiteConfig;

const statusOrder = { live: 0, upcoming: 1, completed: 2 } as const;

export const events = [...(eventsJson as unknown as ClubEvent[])].sort((a, b) => {
  const s = statusOrder[a.status] - statusOrder[b.status];
  if (s !== 0) return s;
  // Upcoming: soonest first. Completed: most recent first.
  return a.status === "completed"
    ? b.date.localeCompare(a.date)
    : a.date.localeCompare(b.date);
});

export const roster = rosterJson as unknown as RosterMember[];

export const hallOfFame = [...(hallOfFameJson as unknown as HallOfFameEntry[])].sort(
  (a, b) => b.date.localeCompare(a.date),
);

export const games = gamesJson as unknown as GamesPoll;
