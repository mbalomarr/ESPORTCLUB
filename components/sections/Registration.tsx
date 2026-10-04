"use client";

import { Loader2, Rocket, ShieldCheck } from "lucide-react";
import SectionHeading, { type HeadingLevel } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Toast from "@/components/ui/Toast";
import { ChipGroup, FormError, FormSection, Honeypot, RadioCards, SelectField, TextAreaField, TextField, type Choice } from "@/components/ui/Form";
import { useLang } from "@/components/providers/LanguageProvider";
import { formOptions, type ChoiceOption } from "@/lib/i18n/form-options";
import { pick } from "@/lib/i18n/localize";
import { formDataToRecord, submitToFormspree } from "@/lib/formspree";
import { useFormSubmission } from "@/lib/hooks/use-form-submission";
import type { Lang, Localized } from "@/types";

interface RegistrationProps {
  formId?: string;
  /** When set, a Google Form is embedded instead of the built-in form. */
  googleFormEmbedUrl?: string;
  /** Poll games, offered as "Games you play" choices. */
  games: Localized[];
  headingLevel?: HeadingLevel;
}

export default function Registration({ formId, googleFormEmbedUrl, games, headingLevel }: RegistrationProps) {
  const { d } = useLang();
  return (
    <section aria-labelledby="join-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden
        className="glow-blob absolute start-1/2 top-1/3 -z-10 size-[36rem] rounded-full bg-copper-500/10 blur-[140px] ltr:-translate-x-1/2 rtl:translate-x-1/2"
      />
      <div className="mx-auto max-w-4xl">
        <SectionHeading id="join-title" as={headingLevel} eyebrow={d.join.eyebrow} title={d.join.title} description={d.join.description} />
        <Reveal>
          {googleFormEmbedUrl ? (
            <Card chamfer className="overflow-hidden">
              <iframe src={googleFormEmbedUrl} title={d.join.formTitle} className="h-[1100px] w-full bg-white" loading="lazy">
                {d.join.loading}
              </iframe>
            </Card>
          ) : (
            <RegistrationForm formId={formId} games={games} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/** Localize option labels while keeping English values for the inbox. */
const toChoices = (options: ChoiceOption[], lang: Lang): Choice[] => options.map((o) => ({ value: o.value, label: o[lang] || o.en }));

function RegistrationForm({ formId, games }: { formId?: string; games: Localized[] }) {
  const { d, lang } = useLang();
  const { status, error, run, reset, isSending } = useFormSubmission({ notConnected: d.common.notConnected, generic: d.common.genericError });
  const gameChoices: Choice[] = games.map((g) => ({ value: pick(g, "en"), label: pick(g, lang) }));
  const levelChoices: Choice[] = formOptions.levels.map((l) => ({ value: l.value, label: l[lang], hint: l.hint[lang] }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = formDataToRecord(new FormData(form));
    if (data._gotcha) return;
    const ok = await run(() =>
      submitToFormspree(formId, { _subject: `New member: ${data.fullName}`, form: "registration", language: lang, ...data }),
    );
    // The form stays on screen for the next registration; clear it and confirm with a toast.
    if (ok) form.reset();
  }

  return (
    <Card chamfer className="relative overflow-hidden p-5 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-400 to-transparent" />
      <form onSubmit={onSubmit} className="space-y-8">
        <Honeypot />

        <FormSection legend={d.join.sections.info}>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="fullName" label={d.join.fullName} required autoComplete="name" />
            <TextField id="studentId" label={d.join.studentId} required inputMode="numeric" pattern="[0-9]{6,12}" title={d.join.digitsOnly} ltr />
            <TextField id="email" label={d.join.email} type="email" required autoComplete="email" placeholder="you@pmu.edu.sa" ltr />
            <TextField id="phone" label={d.join.phone} hint={d.common.optional} type="tel" autoComplete="tel" placeholder="05X XXX XXXX" ltr />
            <TextField id="major" label={d.join.major} required />
            <SelectField id="year" label={d.join.year} placeholder={d.join.select} options={toChoices(formOptions.years, lang)} required />
          </div>
        </FormSection>

        <FormSection legend={d.join.sections.game}>
          <ChipGroup name="games" label={d.join.games} options={gameChoices} />
          <ChipGroup name="platforms" label={d.join.platforms} options={toChoices(formOptions.platforms, lang)} />
          <RadioCards name="skillLevel" label={d.join.skill} options={levelChoices} />
        </FormSection>

        <FormSection legend={d.join.sections.contribute}>
          <ChipGroup name="roles" label={d.join.roles} options={toChoices(formOptions.roles, lang)} />
          <TextAreaField id="message" label={d.join.message} hint={d.common.optional} maxLength={800} placeholder={d.join.messagePlaceholder} />
        </FormSection>

        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" value="yes" required className="mt-0.5 size-5 shrink-0 accent-copper-500" />
          <span>{d.join.consent}</span>
        </label>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="size-4 shrink-0 text-steel-500" aria-hidden /> {d.join.privacy}
          </p>
          <Button type="submit" disabled={isSending} fullWidth className="sm:w-auto">
            {isSending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Rocket className="size-4 rtl:-scale-x-100" aria-hidden />}
            {isSending ? d.join.submitting : d.join.submit}
          </Button>
        </div>
        <FormError message={error} className="text-center" />
      </form>
      <Toast open={status === "sent"} message={d.join.success} closeLabel={d.common.close} onClose={reset} />
    </Card>
  );
}
