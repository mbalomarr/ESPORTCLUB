"use client";

import { Gamepad2, Sparkles, Swords, Target, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/components/providers/LanguageProvider";
import { StatsStrip } from "./HomeOverview";
import type { SiteConfig } from "@/lib/types";

// Icons the professor can reference by name in data/site.json → about.pillars[].icon
const icons: Record<string, LucideIcon> = {
  swords: Swords,
  users: Users,
  target: Target,
  trophy: Trophy,
  gamepad: Gamepad2,
  zap: Zap,
  sparkles: Sparkles,
};

export default function About({ about, headingLevel }: { about: SiteConfig["about"]; headingLevel?: HeadingLevel }) {
  const { d, t } = useLang();

  return (
    <section aria-labelledby="about-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-30" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="about-title" as={headingLevel} eyebrow={d.about.eyebrow} title={d.about.title} />

        <Reveal className="panel clip-chamfer mx-auto max-w-4xl p-8 text-center sm:p-10">
          <p className="text-lg leading-relaxed text-fg-soft sm:text-xl rtl:leading-loose">{t(about.vision)}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {about.pillars.map((p, i) => {
            const Icon = icons[p.icon] ?? Sparkles;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <article className="panel panel-hover h-full p-6">
                  <span className="mb-5 grid size-12 place-items-center rounded-lg border border-copper-500/40 bg-copper-500/10 text-accent">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-fg">{t(p.title)}</h3>
                  <p className="mt-2 text-muted">{t(p.text)}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <StatsStrip stats={about.stats} t={t} />
      </div>
    </section>
  );
}
