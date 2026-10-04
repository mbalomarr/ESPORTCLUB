"use client";

import { Crown, Medal, Trophy } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { HallOfFameEntry } from "@/types";

export default function HallOfFame({ entries, headingLevel }: { entries: HallOfFameEntry[]; headingLevel?: HeadingLevel }) {
  const { d, t, date } = useLang();
  const [latest, ...rest] = entries;

  return (
    <section aria-labelledby="hof-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="glow-blob absolute inset-x-0 top-1/4 -z-10 mx-auto h-96 max-w-3xl rounded-full bg-copper-500/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="hof-title" as={headingLevel} eyebrow={d.hof.eyebrow} title={d.hof.title} description={d.hof.description} />

        {!latest ? (
          <Card className="mx-auto max-w-md p-8 text-center text-muted">{d.hof.empty}</Card>
        ) : (
          <>
            {/* Spotlight: most recent champion */}
            <Reveal>
              <Card chamfer className="glow-copper relative mx-auto mb-10 max-w-4xl overflow-hidden p-6 sm:p-10">
              <div aria-hidden className="bg-circuit absolute inset-0 opacity-60" />
              <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start">
                <div className="grid size-24 shrink-0 place-items-center rounded-full border-2 border-ember-500/70 bg-gradient-to-br from-copper-400/30 to-transparent shadow-[0_0_40px_-6px_rgb(242_118_43/0.7)]">
                  <Trophy className="size-11 text-accent" aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xs uppercase tracking-[0.25em] text-accent-2 rtl:text-sm">
                    {d.hof.reigning} · {t(latest.game)}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-black uppercase text-gradient-copper sm:text-4xl">{t(latest.winner)}</h2>
                  <p className="mt-1 text-fg-soft">
                    {t(latest.tournament)} · {date(latest.date)}
                  </p>
                  {latest.players && latest.players.length > 1 && (
                    <p className="mt-3 text-sm text-muted">
                      {d.hof.roster}: <span dir="ltr">{latest.players.join(" · ")}</span>
                    </p>
                  )}
                </div>
                {latest.prize && (
                  <div className="rounded-lg border border-copper-400/40 bg-bg/70 px-4 py-3 text-center">
                    <p className="text-[0.65rem] uppercase tracking-widest text-muted rtl:text-xs">{d.hof.prize}</p>
                    <p className="font-display font-bold text-accent">{t(latest.prize)}</p>
                  </div>
                )}
              </div>
              </Card>
            </Reveal>

            {rest.length > 0 && (
              <Reveal>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-start text-sm">
                      <caption className="sr-only">{d.hof.caption}</caption>
                      <thead className="border-b border-line font-display text-[0.7rem] uppercase tracking-widest text-info rtl:text-sm">
                        <tr>
                          <th scope="col" className="px-5 py-4 text-start">{d.hof.cols.tournament}</th>
                          <th scope="col" className="px-5 py-4 text-start">{d.hof.cols.game}</th>
                          <th scope="col" className="px-5 py-4 text-start">{d.hof.cols.champion}</th>
                          <th scope="col" className="px-5 py-4 text-start">{d.hof.cols.runnerUp}</th>
                          <th scope="col" className="px-5 py-4 text-end">{d.hof.cols.date}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((h) => (
                          <tr key={`${h.date}-${t(h.tournament)}`} className="border-b border-line transition-colors last:border-0 hover:bg-elevated-2/60">
                            <td className="px-5 py-4 font-semibold text-fg">{t(h.tournament)}</td>
                            <td className="px-5 py-4 text-muted">{t(h.game)}</td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 font-semibold text-accent">
                                <Crown className="size-4 text-ember-500" aria-hidden /> {t(h.winner)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-muted">
                              {h.runnerUp && (
                                <span className="inline-flex items-center gap-2">
                                  <Medal className="size-4" aria-hidden /> {t(h.runnerUp)}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-end text-muted">{date(h.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
