"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Info, Trophy, UserPlus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/components/providers/LanguageProvider";
import type { SiteConfig } from "@/lib/types";

const cards = [
  { href: "/events", key: "events", Icon: CalendarDays },
  { href: "/leaderboard", key: "leaderboard", Icon: Trophy },
  { href: "/about", key: "about", Icon: Info },
  { href: "/join", key: "join", Icon: UserPlus },
] as const;

export default function HomeOverview({ stats }: { stats: SiteConfig["about"]["stats"] }) {
  const { d, t } = useLang();

  return (
    <section id="overview" aria-labelledby="overview-title" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="overview-title" eyebrow={d.overview.eyebrow} title={d.overview.title} description={d.overview.description} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ href, key, Icon }, i) => (
            <Reveal key={href} delay={i * 0.08}>
              <Link href={href} className="panel panel-hover clip-chamfer group flex h-full flex-col p-6">
                <span className="mb-5 grid size-12 place-items-center rounded-lg border border-copper-500/40 bg-copper-500/10 text-accent">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="font-display text-lg font-bold uppercase tracking-wide text-fg">{d.overview.cards[key].title}</span>
                <span className="mt-2 flex-1 text-muted">{d.overview.cards[key].text}</span>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {d.overview.open}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <StatsStrip stats={stats} t={t} />
      </div>
    </section>
  );
}

export function StatsStrip({ stats, t }: { stats: SiteConfig["about"]["stats"]; t: (v: SiteConfig["about"]["stats"][number]["label"]) => string }) {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={i} delay={i * 0.08} className="flex flex-col-reverse bg-elevated px-4 py-8 text-center">
          <dt className="mt-2 text-xs uppercase tracking-[0.2em] text-muted rtl:text-sm">{t(s.label)}</dt>
          <dd className="font-display text-3xl font-black text-gradient-copper sm:text-4xl" dir="ltr">{s.value}</dd>
        </Reveal>
      ))}
    </dl>
  );
}
