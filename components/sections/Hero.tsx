"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cardClass } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import type { ClubEvent, SiteConfig } from "@/types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const lineStyles = ["text-gradient-steel", "text-gradient-copper", "text-gradient-steel"];

export default function Hero({ site, nextEvent }: { site: SiteConfig; nextEvent?: ClubEvent }) {
  const { d, t, date } = useLang();

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-20 opacity-70" />
      <div aria-hidden className="bg-grid-fade absolute inset-0 -z-20" />
      <div aria-hidden className="glow-blob absolute start-1/2 top-1/3 -z-10 size-[42rem] -translate-y-1/2 rounded-full bg-steel-600/25 blur-[120px] ltr:-translate-x-1/2 rtl:translate-x-1/2" />
      <div aria-hidden className="glow-blob absolute bottom-0 end-0 -z-10 size-[28rem] rounded-full bg-copper-500/15 blur-[120px]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 text-center lg:order-1 lg:text-start">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-copper-500/40 bg-elevated/70 px-4 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.25em] text-accent"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember-500 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-ember-500" />
            </span>
            {t(site.university)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display text-5xl font-black uppercase leading-[0.95] sm:text-6xl xl:text-7xl rtl:leading-[1.3]"
          >
            {d.hero.titleLines.map((line, i) => (
              <span key={i} className={`block ${lineStyles[i] ?? ""}`}>
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted lg:mx-0"
          >
            {t(site.tagline)} {d.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <ButtonLink href="/join" fullWidth className="sm:w-auto">
              {d.hero.ctaJoin} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/events" variant="ghost" fullWidth className="sm:w-auto">
              {d.hero.ctaEvents}
            </ButtonLink>
          </motion.div>

          {nextEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Link href="/events" className={cardClass({ hover: true, className: "mt-10 inline-flex items-center gap-4 px-4 py-3 text-start" })}>
                <span className="grid size-10 place-items-center rounded-md bg-copper-500/15 text-accent">
                  <CalendarDays className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-[0.65rem] uppercase tracking-[0.2em] text-accent-2">
                    {nextEvent.status === "live" ? d.hero.liveNow : d.hero.nextUp}
                  </span>
                  <span className="block font-semibold text-fg">{t(nextEvent.title)}</span>
                  <span className="block text-sm text-muted">
                    {date(nextEvent.date)}
                    {nextEvent.time ? <> · <span dir="ltr">{nextEvent.time}</span></> : null}
                  </span>
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Animated emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative order-1 mx-auto grid aspect-square w-64 place-items-center sm:w-80 lg:order-2 lg:w-[26rem]"
        >
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-copper-500/40"
          />
          <motion.div
            aria-hidden
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full border border-steel-400/30"
          >
            {[
              "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
              "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
              "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
            ].map((pos) => (
              <span key={pos} className={`absolute ${pos} size-2 rounded-full bg-ember-500 shadow-[0_0_12px_2px_rgb(242_118_43/0.8)]`} />
            ))}
          </motion.div>
          <div aria-hidden className="glow-blob absolute inset-12 animate-pulse-slow rounded-full bg-steel-500/30 blur-3xl" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative">
            <Logo
              src={site.logo}
              alt={d.common.logoAlt}
              size={320}
              priority
              className="size-48! ring-2 ring-navy-700 shadow-[0_0_80px_-10px_rgb(86_131_176/0.8)] sm:size-60! lg:size-80!"
            />
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#overview"
        aria-label={d.hero.scroll}
        className="absolute bottom-6 start-1/2 hidden text-muted hover:text-accent sm:block ltr:-translate-x-1/2 rtl:translate-x-1/2"
      >
        <ChevronDown className="size-7 animate-bounce motion-reduce:animate-none" aria-hidden />
      </a>
    </section>
  );
}
