export type Lang = "en" | "ar";

export type Direction = "ltr" | "rtl";

/**
 * Any text field in /data is either plain text (identical in both languages, e.g. a game title)
 * or both translations: { "en": "...", "ar": "..." }. A missing "ar" falls back to "en".
 */
export type Localized = string | { en: string; ar?: string };

/** ISO calendar date, e.g. "2026-11-12". */
export type IsoDate = string;
