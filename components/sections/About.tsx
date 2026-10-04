"use client";

import { Gamepad2, Sparkles, Swords, Target, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import IconTile from "@/components/ui/IconTile";
import { Card } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { PillarIcon, SiteConfig } from "@/types";
import StatsStrip from "./StatsStrip";

// Exhaustive over PillarIcon, so adding an icon name to the type forces a mapping here.
const icons: Record<PillarIcon, LucideIcon> = {
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

        <Reveal>
          <Card chamfer className="mx-auto max-w-4xl p-8 text-center sm:p-10">
            <p className="text-lg leading-relaxed text-fg-soft sm:text-xl rtl:leading-loose">{t(about.vision)}</p>
          </Card>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {about.pillars.map((p, i) => {
            const Icon = icons[p.icon] ?? Sparkles;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <Card as="article" hover className="h-full p-6">
                  <IconTile className="mb-5">
                    <Icon className="size-6" aria-hidden />
                  </IconTile>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-fg">{t(p.title)}</h3>
                  <p className="mt-2 text-muted">{t(p.text)}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <StatsStrip stats={about.stats} />
      </div>
    </section>
  );
}
