import type { Metadata } from "next";
import { roster, site } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import About from "@/components/sections/About";
import Roster from "@/components/sections/Roster";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.about };
}

export default function AboutPage() {
  return (
    <>
      <About about={site.about} headingLevel="h1" />
      <Roster members={roster} />
    </>
  );
}
