"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useLang } from "@/components/providers/LanguageProvider";

export default function NotFoundContent() {
  const { d } = useLang();
  return (
    <section className="bg-circuit grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl font-black text-gradient-copper" dir="ltr">404</p>
        <h1 className="mt-4 font-display text-xl text-fg">{d.notFound.title}</h1>
        <ButtonLink href="/" className="mt-8">
          {d.notFound.back}
        </ButtonLink>
      </div>
    </section>
  );
}
