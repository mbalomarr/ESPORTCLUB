"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

const options: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ar", label: "ع" },
];

/** Segmented EN / ع switch. The whole control toggles, so one tap always switches. */
export default function LanguageToggle() {
  const { lang, setLang, d } = useLang();
  const next: Lang = lang === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={d.nav.switchLang}
      title={d.nav.switchLang}
      lang={next}
      className="relative flex h-10 items-center rounded-full border border-line-strong bg-elevated/60 p-1 transition-colors hover:border-copper-400"
    >
      {options.map((o) => (
        <span
          key={o.value}
          aria-hidden
          className={cn(
            "relative z-10 grid h-8 min-w-9 place-items-center rounded-full px-2 text-xs font-bold transition-colors",
            o.value === "en" ? "font-display tracking-wider" : "font-[family-name:var(--font-cairo)] text-sm",
            lang === o.value ? "text-navy-950" : "text-muted",
          )}
        >
          {lang === o.value && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-copper-400 to-ember-500"
              transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
            />
          )}
          {o.label}
        </span>
      ))}
    </button>
  );
}
