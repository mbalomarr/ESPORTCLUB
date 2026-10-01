"use client";

import { Gamepad2, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import SocialLinks from "@/components/ui/SocialLinks";
import { useLang } from "@/components/providers/LanguageProvider";
import type { RosterMember } from "@/lib/types";
import { asset, initials, pick } from "@/lib/utils";

export default function Roster({ members }: { members: RosterMember[] }) {
  const { d, t } = useLang();

  return (
    <section aria-labelledby="roster-title" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="roster-title" eyebrow={d.roster.eyebrow} title={d.roster.title} description={d.roster.description} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => {
            const name = t(m.name);
            return (
              <Reveal key={i} delay={(i % 4) * 0.08}>
                <article className="panel panel-hover clip-chamfer group flex h-full flex-col items-center p-6 text-center">
                  <div className="relative mb-5">
                    <div aria-hidden className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-copper-400 via-steel-500 to-navy-700 opacity-70 blur-[2px] transition-opacity group-hover:opacity-100" />
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset(m.photo)} alt={d.roster.photoOf(name)} loading="lazy" className="relative size-28 rounded-full border-4 border-elevated object-cover" />
                    ) : (
                      <div className="relative grid size-28 place-items-center rounded-full border-4 border-elevated bg-gradient-to-br from-steel-600 to-navy-800 font-display text-3xl font-black text-silver-50">
                        {/* Latin initials read well in both languages */}
                        <span aria-hidden>{initials(pick(m.name, "en"))}</span>
                      </div>
                    )}
                  </div>

                  <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent-2 rtl:text-sm">{t(m.role)}</p>
                  <h3 className="mt-1 text-lg font-bold text-fg">{name}</h3>
                  {m.gamertag && <p className="font-display text-sm text-info" dir="ltr">&ldquo;{m.gamertag}&rdquo;</p>}

                  <dl className="mt-4 w-full space-y-1.5 border-t border-line pt-4 text-sm text-muted">
                    {m.major && (
                      <div className="flex items-center justify-center gap-2">
                        <dt><GraduationCap className="size-4 text-steel-500" aria-label={d.roster.major} /></dt>
                        <dd>{t(m.major)}</dd>
                      </div>
                    )}
                    {m.mainGame && (
                      <div className="flex items-center justify-center gap-2">
                        <dt><Gamepad2 className="size-4 text-steel-500" aria-label={d.roster.mainGame} /></dt>
                        <dd>{t(m.mainGame)}</dd>
                      </div>
                    )}
                  </dl>

                  <SocialLinks socials={m.socials} size="sm" className="mt-4" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
