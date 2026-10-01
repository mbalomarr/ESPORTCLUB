import type { Lang, Localized } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function pick(value: Localized | undefined, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return (lang === "ar" ? value.ar : value.en) || value.en || "";
}

// Gregorian calendar with Latin digits, matching the dates and numbers in /data.
const locales: Record<Lang, string> = { en: "en-GB", ar: "ar-SA-u-ca-gregory-nu-latn" };

export function formatDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions) {
  // Parse as a local date so "2026-11-12" never shifts a day across timezones.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString(locales[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export class FormNotConnectedError extends Error {}

export async function submitToFormspree(formId: string | undefined, payload: Record<string, unknown>) {
  if (!formId) throw new FormNotConnectedError();
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
    throw new Error(data?.errors?.map((e) => e.message).join(", ") || "");
  }
}
