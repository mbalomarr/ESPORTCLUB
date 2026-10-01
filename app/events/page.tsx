import type { Metadata } from "next";
import { events, games, site } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import EventsBoard from "@/components/sections/EventsBoard";
import GameVoting from "@/components/sections/GameVoting";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.events };
}

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
