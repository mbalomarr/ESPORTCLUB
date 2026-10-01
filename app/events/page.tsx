import type { Metadata } from "next";
import { events, games, site } from "@/lib/content";
import EventsBoard from "@/components/sections/EventsBoard";
import GameVoting from "@/components/sections/GameVoting";

export const metadata: Metadata = { title: "Events & Voting" };

export default function EventsPage() {
  return (
    <>
      <EventsBoard events={events} headingLevel="h1" />
      <GameVoting
        poll={games}
        voteFormId={site.forms.voteFormspreeId}
        suggestionFormId={site.forms.suggestionFormspreeId}
      />
    </>
  );
}
