import type { Metadata } from "next";
import { roster, site } from "@/lib/content";
import About from "@/components/sections/About";
import Roster from "@/components/sections/Roster";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <About about={site.about} headingLevel="h1" />
      <Roster members={roster} />
    </>
  );
}
