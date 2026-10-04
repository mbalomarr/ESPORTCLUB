"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lightbulb, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";
import { FormError, Honeypot, TextAreaField, TextField } from "@/components/ui/Form";
import { useLang } from "@/components/providers/LanguageProvider";
import { formDataToRecord, submitToFormspree } from "@/lib/formspree";
import { useFormSubmission } from "@/lib/hooks/use-form-submission";

export default function SuggestGameForm({ formId }: { formId?: string }) {
  const { d } = useLang();
  const { status, error, run, reset, isSending } = useFormSubmission({ notConnected: d.common.notConnected, generic: d.common.genericError });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = formDataToRecord(new FormData(form));
    if (data._gotcha) return;
    const ok = await run(() => submitToFormspree(formId, { _subject: `Game suggestion: ${data.game}`, form: "game-suggestion", ...data }));
    if (ok) form.reset();
  }

  return (
    <Card chamfer className="h-full p-5 sm:p-8">
      <IconTile tone="steel" className="mb-4">
        <Lightbulb className="size-6" aria-hidden />
      </IconTile>
      <h3 className="font-display text-xl font-bold uppercase text-fg">{d.vote.suggestTitle}</h3>
      <p className="mt-2 text-sm text-muted">{d.vote.suggestText}</p>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg border border-copper-400/50 bg-copper-500/10 p-5 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto size-8 text-accent" aria-hidden />
            <p className="mt-2 font-semibold text-fg">{d.vote.received}</p>
            <button type="button" onClick={reset} className="mt-3 text-sm text-accent underline underline-offset-4">
              {d.vote.another}
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="mt-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Honeypot />
            <TextField id="game" label={d.vote.gameTitle} required maxLength={80} placeholder={d.vote.gamePlaceholder} />
            <TextAreaField id="reason" label={d.vote.why} hint={d.common.optional} maxLength={500} placeholder={d.vote.whyPlaceholder} />
            <TextField id="email" label={d.vote.email} hint={d.common.optional} type="email" placeholder="you@pmu.edu.sa" ltr />
            <Button type="submit" disabled={isSending} fullWidth>
              {isSending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4 rtl:-scale-x-100" aria-hidden />}
              {d.vote.send}
            </Button>
            <FormError message={error} />
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}
