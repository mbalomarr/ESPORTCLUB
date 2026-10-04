// Single entry point for all Git-backed content in /data.
// JSON is bundled at build time: every commit to /data triggers the GitHub Pages workflow,
// which validates the files (scripts/validate-data.mjs) and republishes the site.
import siteJson from "@/data/site.json";
import eventsJson from "@/data/events.json";
import rosterJson from "@/data/roster.json";
import hallOfFameJson from "@/data/hall-of-fame.json";
import gamesJson from "@/data/games.json";
import type { ClubEvent, EventStatus, GamesPoll, HallOfFameEntry, RosterMember, SiteConfig } from "@/types";

// JSON imports are typed structurally (e.g. status: string); the validator guarantees the
// narrower shapes below, so the casts are safe.
export const site = siteJson as unknown as SiteConfig;

const statusOrder: Record<EventStatus, number> = { live: 0, upcoming: 1, completed: 2 };

/** Live first, then upcoming (soonest first), then completed (most recent first). */
export const events: ClubEvent[] = [...(eventsJson as unknown as ClubEvent[])].sort((a, b) => {
  const byStatus = statusOrder[a.status] - statusOrder[b.status];
  if (byStatus !== 0) return byStatus;
  return a.status === "completed" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
});

export const nextEvent: ClubEvent | undefined = events.find((e) => e.status !== "completed");

export const roster = rosterJson as unknown as RosterMember[];

/** Most recent first; the first entry is the "Reigning Champion" spotlight. */
export const hallOfFame: HallOfFameEntry[] = [...(hallOfFameJson as unknown as HallOfFameEntry[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const games = gamesJson as unknown as GamesPoll;
