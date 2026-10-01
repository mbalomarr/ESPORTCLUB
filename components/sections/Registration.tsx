"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Rocket, ShieldCheck } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/components/providers/LanguageProvider";
import { formOptions } from "@/lib/i18n/dictionary";
import type { Lang, Localized } from "@/lib/types";
import { cn, FormNotConnectedError, pick, submitToFormspree } from "@/lib/utils";

type Option = { value: string; en: string; ar: string };

export default function Registration({
  formId,
  googleFormEmbedUrl,
  games,
  headingLevel,
}: {
  formId?: string;
  googleFormEmbedUrl?: string;
  games: Localized[];
  headingLevel?: HeadingLevel;
}) {
  const { d } = useLang();
  return (
    <section aria-labelledby="join-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-50" />
      <div aria-hidden className="glow-blob absolute start-1/2 top-1/3 -z-10 size-[36rem] rounded-full bg-copper-500/10 blur-[140px] ltr:-translate-x-1/2 rtl:translate-x-1/2" />
      <div className="mx-auto max-w-4xl">
        <SectionHeading id="join-title" as={headingLevel} eyebrow={d.join.eyebrow} title={d.join.title} description={d.join.description} />
        <Reveal>
          {googleFormEmbedUrl ? (
            <div className="panel clip-chamfer overflow-hidden">
              <iframe src={googleFormEmbedUrl} title={d.join.formTitle} className="h-[1100px] w-full bg-white" loading="lazy">
                {d.join.loading}
              </iframe>
            </div>
          ) : (
            <RegistrationForm formId={formId} games={games} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

function RegistrationForm({ formId, games }: { formId?: string; games: Localized[] }) {
  const { d, lang } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const gameOptions: Option[] = games.map((g) => ({ value: pick(g, "en"), en: pick(g, "en"), ar: pick(g, "ar") }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("_gotcha")) return;
    // Join multi-select checkbox groups into readable strings.
    const payload: Record<string, string> = { language: lang };
    for (const key of new Set(fd.keys())) payload[key] = fd.getAll(key).map(String).join(", ");
    setState("sending");
    setError("");
    try {
      await submitToFormspree(formId, { _subject: `New member: ${payload.fullName}`, form: "registration", ...payload });
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof FormNotConnectedError ? d.common.notConnected : (err as Error).message || d.common.genericError);
      setState("error");
    }
  }

  return (
    <div className="panel clip-chamfer relative overflow-hidden p-5 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-400 to-transparent" />
      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <motion.div key="done" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
            <div className="glow-copper mx-auto mb-6 grid size-20 place-items-center rounded-full border-2 border-copper-400 bg-copper-500/10">
              <CheckCircle2 className="size-10 text-accent" aria-hidden />
            </div>
            <h2 className="font-display text-2xl font-black uppercase text-gradient-copper">{d.join.successTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">{d.join.successText}</p>
            <button type="button" onClick={() => setState("idle")} className="btn btn-ghost clip-chamfer mt-8">
              {d.join.another}
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <Fieldset legend={d.join.sections.info}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="fullName" label={d.join.fullName} required autoComplete="name" />
                <Field id="studentId" label={d.join.studentId} required inputMode="numeric" pattern="[0-9]{6,12}" title={d.join.digitsOnly} ltr />
                <Field id="email" label={d.join.email} type="email" required autoComplete="email" placeholder="you@pmu.edu.sa" ltr />
                <Field id="phone" label={d.join.phone} type="tel" autoComplete="tel" placeholder="05X XXX XXXX" optional ltr />
                <Field id="major" label={d.join.major} required />
                <div>
                  <label htmlFor="year" className="label">{d.join.year}</label>
                  <select id="year" name="year" required className="field" defaultValue="">
                    <option value="" disabled>{d.join.select}</option>
                    {formOptions.years.map((y) => (
                      <option key={y.value} value={y.value}>{y[lang]}</option>
                    ))}
                  </select>
                </div>
                <Field id="discord" label={d.join.discord} placeholder="falcon_pmu" optional ltr />
                <Field id="gamertag" label={d.join.gamertag} optional ltr />
              </div>
            </Fieldset>

            <Fieldset legend={d.join.sections.game}>
              <ChipGroup name="games" label={d.join.games} options={gameOptions} lang={lang} />
              <ChipGroup name="platforms" label={d.join.platforms} options={formOptions.platforms} lang={lang} />
              <div>
                <p className="label" id="level-label">{d.join.skill}</p>
                <div role="radiogroup" aria-labelledby="level-label" className="grid gap-3 sm:grid-cols-3">
                  {formOptions.levels.map((l, i) => (
                    <label key={l.value} className="cursor-pointer">
                      <input type="radio" name="skillLevel" value={l.value} required defaultChecked={i === 0} className="peer sr-only" />
                      <span className="block rounded-lg border border-line-strong bg-elevated/60 p-4 transition-all hover:border-steel-400 peer-checked:border-copper-400 peer-checked:bg-copper-500/10 peer-checked:glow-copper peer-focus-visible:outline-2 peer-focus-visible:outline-ember-500">
                        <span className="block font-display text-sm font-bold uppercase text-fg">{l[lang]}</span>
                        <span className="text-xs text-muted">{l.hint[lang]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </Fieldset>

            <Fieldset legend={d.join.sections.contribute}>
              <ChipGroup name="roles" label={d.join.roles} options={formOptions.roles} lang={lang} />
              <div>
                <label htmlFor="message" className="label">
                  {d.join.message} <span className="normal-case text-muted">{d.common.optional}</span>
                </label>
                <textarea id="message" name="message" rows={3} maxLength={800} className="field resize-none" placeholder={d.join.messagePlaceholder} />
              </div>
            </Fieldset>

            <label className="flex items-start gap-3 text-sm text-muted">
              <input type="checkbox" name="consent" value="yes" required className="mt-0.5 size-5 shrink-0 accent-copper-500" />
              <span>{d.join.consent}</span>
            </label>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="size-4 shrink-0 text-steel-500" aria-hidden /> {d.join.privacy}
              </p>
              <button type="submit" disabled={state === "sending"} className="btn btn-primary clip-chamfer w-full sm:w-auto">
                {state === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Rocket className="size-4 rtl:-scale-x-100" aria-hidden />}
                {state === "sending" ? d.join.submitting : d.join.submit}
              </button>
            </div>
            <p aria-live="polite" className="min-h-5 text-center text-sm text-red-600 dark:text-red-300">
              {state === "error" ? error : ""}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex w-full items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent rtl:text-base">
        {legend}
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-copper-500/50 to-transparent rtl:bg-gradient-to-l" />
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  optional,
  ltr,
  ...props
}: { id: string; label: string; optional?: boolean; ltr?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { d } = useLang();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {optional && <span className="normal-case text-muted">{d.common.optional}</span>}
      </label>
      {/* Emails, IDs and phone numbers are always typed left-to-right, aligned to the reading edge in Arabic. */}
      <input id={id} name={id} dir={ltr ? "ltr" : undefined} className={cn("field", ltr && "rtl:text-end")} {...props} />
    </div>
  );
}

function ChipGroup({ name, label, options, lang }: { name: string; label: string; options: Option[]; lang: Lang }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="checkbox" name={name} value={o.value} className="peer sr-only" />
            <span
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border border-line-strong bg-elevated/60 px-4 text-sm text-fg-soft transition-all",
                "hover:border-steel-400 peer-checked:border-copper-400 peer-checked:bg-copper-500/15 peer-checked:text-accent",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-500",
              )}
            >
              {o[lang] || o.en}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
