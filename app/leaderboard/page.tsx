import type { Metadata } from "next";
import { hallOfFame } from "@/lib/content";
import HallOfFame from "@/components/sections/HallOfFame";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return <HallOfFame entries={hallOfFame} headingLevel="h1" />;
}
