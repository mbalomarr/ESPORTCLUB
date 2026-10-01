import type { Metadata } from "next";
import { games, site } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import Registration from "@/components/sections/Registration";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.join };
}

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
