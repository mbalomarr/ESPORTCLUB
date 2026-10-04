"use client";

import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/components/providers/LanguageProvider";
import type { Stat } from "@/types";

/** Club numbers from data/site.json → about.stats (shown on Home and About). */
export default function StatsStrip({ stats }: { stats: Stat[] }) {
  const { t } = useLang();
  return (
    <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={i} delay={i * 0.08} className="flex flex-col-reverse bg-elevated px-4 py-8 text-center">
          <dt className="mt-2 text-xs uppercase tracking-[0.2em] text-muted rtl:text-sm">{t(s.label)}</dt>
          <dd className="font-display text-3xl font-black text-gradient-copper sm:text-4xl" dir="ltr">
            {s.value}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
