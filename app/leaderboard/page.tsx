import type { Metadata } from "next";
import { hallOfFame } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import HallOfFame from "@/components/sections/HallOfFame";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.leaderboard };
}

export default function LeaderboardPage() {
  return <HallOfFame entries={hallOfFame} headingLevel="h1" />;
}
