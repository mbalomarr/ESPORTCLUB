"use client";

import { useLang } from "@/components/providers/LanguageProvider";

export default function SkipLink() {
  const { d } = useLang();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-copper-500 focus:px-4 focus:py-2 focus:text-navy-950"
    >
      {d.nav.skip}
    </a>
  );
}
