"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Info, Trophy, UserPlus, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import IconTile from "@/components/ui/IconTile";
import { cardClass } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Stat } from "@/types";
import StatsStrip from "./StatsStrip";

const cards: { href: string; key: keyof Dictionary["overview"]["cards"]; Icon: LucideIcon }[] = [
  { href: "/events", key: "events", Icon: CalendarDays },
  { href: "/leaderboard", key: "leaderboard", Icon: Trophy },
  { href: "/about", key: "about", Icon: Info },
  { href: "/join", key: "join", Icon: UserPlus },
];

export default function HomeOverview({ stats }: { stats: Stat[] }) {
  const { d } = useLang();

  return (
    <section id="overview" aria-labelledby="overview-title" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="overview-title" eyebrow={d.overview.eyebrow} title={d.overview.title} description={d.overview.description} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ href, key, Icon }, i) => (
            <Reveal key={href} delay={i * 0.08}>
              <Link href={href} className={cardClass({ hover: true, chamfer: true, className: "group flex h-full flex-col p-6" })}>
                <IconTile className="mb-5">
                  <Icon className="size-6" aria-hidden />
                </IconTile>
                <span className="font-display text-lg font-bold uppercase tracking-wide text-fg">{d.overview.cards[key].title}</span>
                <span className="mt-2 flex-1 text-muted">{d.overview.cards[key].text}</span>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {d.overview.open}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <StatsStrip stats={stats} />
      </div>
    </section>
  );
}
