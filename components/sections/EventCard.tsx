"use client";

import { ArrowUpRight, CalendarDays, Clock, Gamepad2, MapPin, Swords, Trophy, type LucideIcon } from "lucide-react";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { ClubEvent, EventStatus } from "@/types";
import { asset, cn } from "@/lib/utils";

const statusTone: Record<EventStatus, BadgeTone> = { live: "danger", upcoming: "accent", completed: "info" };

export default function EventCard({ event: e }: { event: ClubEvent }) {
  const { d, t, date } = useLang();
  const isPast = e.status === "completed";
  const day = Number(e.date.split("-")[2]);

  return (
    <Card as="article" hover chamfer className={cn("flex h-full flex-col overflow-hidden", isPast && "opacity-80")}>
      <div className="relative h-36 overflow-hidden border-b border-line bg-elevated-2">
        {e.image ? (
          <img src={asset(e.image)} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="bg-circuit grid size-full place-items-center bg-gradient-to-br from-steel-500/30 to-transparent">
            <Gamepad2 className="size-12 text-steel-500/70" aria-hidden />
          </div>
        )}
        <Badge tone={statusTone[e.status]} pulse={e.status === "live"} className="absolute start-3 top-3">
          {d.events.status[e.status]}
        </Badge>
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

        {!isPast && e.registrationUrl && (
          <ButtonLink href={e.registrationUrl} variant="ghost" chamfer={false} fullWidth className="mt-6">
            {d.events.register} <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </ButtonLink>
        )}
      </div>
    </Card>
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
