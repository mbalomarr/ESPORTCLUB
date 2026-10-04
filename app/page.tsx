import { nextEvent, site } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import HomeOverview from "@/components/sections/HomeOverview";
import LiveHub from "@/components/sections/LiveHub";

export default function HomePage() {
  return (
    <>
      <Hero site={site} nextEvent={nextEvent} />
      <HomeOverview stats={site.about.stats} />
      <LiveHub live={site.live} socials={site.socials} />
    </>
  );
}
