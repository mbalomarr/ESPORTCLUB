import type { Direction, IsoDate, Lang, Localized } from "@/types";

/** localStorage key holding the visitor's language choice. */
export const LANG_STORAGE_KEY = "pmu-lang";

export const directionOf = (lang: Lang): Direction => (lang === "ar" ? "rtl" : "ltr");

/** Resolve a Localized value from /data, falling back to English when Arabic is missing. */
export function pick(value: Localized | undefined, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return (lang === "ar" ? value.ar : value.en) || value.en || "";
}

// Gregorian calendar with Latin digits, matching the dates and numbers in /data.
const locales: Record<Lang, string> = { en: "en-GB", ar: "ar-SA-u-ca-gregory-nu-latn" };

export function formatDate(iso: IsoDate, lang: Lang, opts?: Intl.DateTimeFormatOptions) {
  // Parse as a local date so "2026-11-12" never shifts a day across timezones.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString(locales[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}
