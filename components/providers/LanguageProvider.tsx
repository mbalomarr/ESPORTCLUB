"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Lang, Localized } from "@/lib/types";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionary";
import { formatDate, pick } from "@/lib/utils";

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  d: Dictionary;
  setLang: (lang: Lang) => void;
  /** Resolve a Localized value from /data into the active language. */
  t: (value: Localized | undefined) => string;
  date: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    // Cookie lets the server render the right language/direction on the next request.
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    const html = document.documentElement;
    html.lang = next;
    html.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      d: dictionaries[lang],
      setLang,
      t: (v) => pick(v, lang),
      date: (iso, opts) => formatDate(iso, lang, opts),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
