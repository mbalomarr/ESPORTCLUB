"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock, Gamepad2, MapPin, Swords, Trophy, type LucideIcon } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import { useLang } from "@/components/providers/LanguageProvider";
import type { ClubEvent, EventStatus } from "@/lib/types";
import { asset, cn } from "@/lib/utils";

const filterKeys = ["all", "upcoming", "completed"] as const;
type Filter = (typeof filterKeys)[number];

const badgeStyle: Record<EventStatus, string> = {
  live: "bg-red-500/15 text-red-700 border-red-500/50 dark:text-red-300",
  upcoming: "bg-copper-500/15 text-accent border-copper-400/50",
  completed: "bg-steel-500/10 text-info border-steel-400/40",
};

export default function EventsBoard({ events, headingLevel }: { events: ClubEvent[]; headingLevel?: HeadingLevel }) {
  const { d } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = useMemo(
    () =>
      events.filter((e) =>
        filter === "all" ? true : filter === "upcoming" ? e.status !== "completed" : e.status === "completed",
      ),
    [events, filter],
  );

  return (
    <section aria-labelledby="events-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="events-title" as={headingLevel} eyebrow={d.events.eyebrow} title={d.events.title} description={d.events.description} />

        <div role="tablist" aria-label={d.events.filterLabel} className="mb-10 flex justify-center gap-2">
          {filterKeys.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "relative isolate min-h-11 rounded-md px-5 font-display text-xs font-bold uppercase tracking-widest transition-colors rtl:text-sm",
                filter === key ? "text-navy-950" : "text-muted hover:text-fg",
              )}
            >
              {filter === key && (
                <motion.span
                  layoutId="event-filter"
                  className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-copper-400 to-ember-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {d.events.filters[key]}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="panel mx-auto max-w-md p-8 text-center text-muted">{d.events.empty}</p>
        ) : (
          <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((e) => (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard event={e} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function EventCard({ event: e }: { event: ClubEvent }) {
  const { d, t, date } = useLang();
  const isPast = e.status === "completed";
  const day = Number(e.date.split("-")[2]);
  const url = e.registrationUrl;

  return (
    <article className={cn("panel panel-hover clip-chamfer flex h-full flex-col overflow-hidden", isPast && "opacity-80")}>
      <div className="relative h-36 overflow-hidden border-b border-line bg-elevated-2">
        {e.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(e.image)} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="bg-circuit grid size-full place-items-center bg-gradient-to-br from-steel-500/30 to-transparent">
            <Gamepad2 className="size-12 text-steel-500/70" aria-hidden />
          </div>
        )}
        <span className={cn("absolute start-3 top-3 rounded border px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-widest backdrop-blur rtl:text-xs", badgeStyle[e.status] ?? badgeStyle.upcoming)}>
          {e.status === "live" && <span className="me-1.5 inline-block size-1.5 animate-pulse rounded-full bg-red-500 align-middle" />}
          {d.events.status[e.status] ?? e.status}
        </span>
        <div className="absolute end-3 top-3 rounded-md border border-line-strong bg-bg/85 px-3 py-1.5 text-center backdrop-blur" aria-hidden>
          <span className="block font-display text-xl font-black leading-none text-fg">{day}</span>
          <span className="block text-[0.65rem] uppercase tracking-widest text-accent rtl:text-xs">
            {date(e.date, { month: "short", day: undefined, year: undefined })}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-accent-2 rtl:text-xs">{t(e.game)}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-fg">{t(e.title)}</h3>
        {e.description && <p className="mt-2 text-sm text-muted">{t(e.description)}</p>}

        <ul className="mt-4 space-y-2 text-sm text-fg-soft">
          <Meta icon={CalendarDays} text={date(e.date, { weekday: "short" })} />
          {e.time && <Meta icon={Clock} text={e.time} ltr />}
          {e.location && <Meta icon={MapPin} text={t(e.location)} />}
          {e.format && <Meta icon={Swords} text={t(e.format)} />}
          {e.prize && <Meta icon={Trophy} text={t(e.prize)} highlight />}
        </ul>

        {!isPast && url && (
          url.startsWith("/") ? (
            <Link href={url} className="btn btn-ghost mt-6 w-full">
              {d.events.register} <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 w-full">
              {d.events.register} <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </a>
          )
        )}
      </div>
    </article>
  );
}

function Meta({ icon: Icon, text, highlight, ltr }: { icon: LucideIcon; text: string; highlight?: boolean; ltr?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <Icon className={cn("mt-0.5 size-4 shrink-0", highlight ? "text-ember-500" : "text-steel-500")} aria-hidden />
      <span dir={ltr ? "ltr" : undefined} className={highlight ? "font-semibold text-accent" : undefined}>
        {text}
      </span>
    </li>
  );
}
