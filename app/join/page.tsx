import type { Metadata } from "next";
import { games, site } from "@/lib/content";
import Registration from "@/components/sections/Registration";

export const metadata: Metadata = { title: "Join the Club" };

export default function JoinPage() {
  return (
    <Registration
      formId={site.forms.registrationFormspreeId}
      googleFormEmbedUrl={site.forms.googleFormEmbedUrl}
      games={games.options.map((g) => g.name)}
      headingLevel="h1"
    />
  );
}
