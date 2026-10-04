"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { ClubEvent } from "@/types";
import { cn } from "@/lib/utils";
import EventCard from "./EventCard";

const filterKeys = ["all", "upcoming", "completed"] as const;
type Filter = (typeof filterKeys)[number];

const matches = (e: ClubEvent, filter: Filter) =>
  filter === "all" || (filter === "upcoming" ? e.status !== "completed" : e.status === "completed");

export default function EventsBoard({ events, headingLevel }: { events: ClubEvent[]; headingLevel?: HeadingLevel }) {
  const { d } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = useMemo(() => events.filter((e) => matches(e, filter)), [events, filter]);

  return (
    <section aria-labelledby="events-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="events-title" as={headingLevel} eyebrow={d.events.eyebrow} title={d.events.title} description={d.events.description} />

        <div role="tablist" aria-label={d.events.filterLabel} className="mb-10 flex justify-center gap-2">
          {filterKeys.map((key) => (
            <button
              key={key}
              type="button"
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
          <Card className="mx-auto max-w-md p-8 text-center text-muted">{d.events.empty}</Card>
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
