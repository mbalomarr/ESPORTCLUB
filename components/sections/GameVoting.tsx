"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Crown, Lightbulb, Loader2, Lock, Send, Vote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/components/providers/LanguageProvider";
import type { GamesPoll } from "@/lib/types";
import { cn, FormNotConnectedError, pick, submitToFormspree } from "@/lib/utils";

/*
 * Without a database, votes work like this:
 *  1. The student's vote is sent to a Formspree inbox (one email/row per vote).
 *  2. Their choice is remembered in their browser so they can't vote twice from it,
 *     and their vote is added to the bars instantly.
 *  3. Club admins periodically copy the official totals into data/games.json → "votes".
 */
export default function GameVoting({
  poll,
  voteFormId,
  suggestionFormId,
}: {
  poll: GamesPoll;
  voteFormId?: string;
  suggestionFormId?: string;
}) {
  const { d, t, date } = useLang();
  const storageKey = `pmu-vote:${poll.poll.id}`;
  const [myVote, setMyVote] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setMyVote(localStorage.getItem(storageKey));
    } catch {
      /* storage blocked: voting still works for this visit */
    }
  }, [storageKey]);

  const tallies = useMemo(
    () => poll.options.map((o) => ({ ...o, votes: o.votes + (myVote === o.id ? 1 : 0) })),
    [poll.options, myVote],
  );
  const totalVotes = tallies.reduce((s, o) => s + o.votes, 0);
  const leader = tallies.reduce((a, b) => (b.votes > a.votes ? b : a), tallies[0]);
  const isOpen = poll.poll.isOpen;
  const hasVoted = myVote !== null;

  async function castVote(id: string, name: string) {
    if (hasVoted || pending || !isOpen) return;
    setPending(id);
    setError(null);
    try {
      await submitToFormspree(voteFormId, { _subject: `Game vote: ${name}`, form: "game-vote", poll: poll.poll.id, game: name });
      try {
        localStorage.setItem(storageKey, id);
      } catch {}
      setMyVote(id);
    } catch (e) {
      setError(e instanceof FormNotConnectedError ? d.common.notConnected : (e as Error).message || d.common.genericError);
    } finally {
      setPending(null);
    }
  }

  return (
    <section id="vote" aria-labelledby="vote-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="glow-blob absolute start-0 top-1/3 -z-10 size-96 rounded-full bg-steel-600/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="vote-title" eyebrow={d.vote.eyebrow} title={d.vote.title} description={t(poll.poll.question)} />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="panel clip-chamfer p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex flex-wrap items-center gap-2 font-display text-xs uppercase tracking-widest text-info rtl:text-sm">
                <Vote className="size-4 text-accent-2" aria-hidden />
                {isOpen ? d.vote.open : d.vote.closed}
                {poll.poll.closesOn && isOpen && (
                  <span className="font-sans normal-case tracking-normal text-muted">· {d.vote.until(date(poll.poll.closesOn))}</span>
                )}
              </p>
              <p className="text-sm text-muted">{d.vote.votes(totalVotes)}</p>
            </div>

            <ul className="space-y-3">
              {tallies.map((o) => {
                const name = t(o.name);
                const pct = totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0;
                const mine = myVote === o.id;
                const isLeader = o.id === leader?.id && o.votes > 0;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => castVote(o.id, pick(o.name, "en"))}
                      disabled={hasVoted || !isOpen || pending !== null}
                      aria-pressed={mine}
                      aria-label={`${d.vote.optionLabel(name, pct, o.votes)}${mine ? `, ${d.vote.yourVote}` : hasVoted ? "" : `. ${d.vote.voteFor}`}`}
                      className={cn(
                        "group relative isolate w-full overflow-hidden rounded-lg border bg-elevated/40 p-4 text-start transition-all",
                        mine ? "border-copper-400 glow-copper" : "border-line",
                        !hasVoted && isOpen && "hover:-translate-y-0.5 hover:border-copper-400/70",
                        "disabled:cursor-default",
                      )}
                    >
                      {/* Bar grows from the inline start: left in English, right in Arabic. */}
                      <motion.span
                        aria-hidden
                        className={cn(
                          "absolute inset-y-0 start-0 -z-10",
                          mine
                            ? "bg-gradient-to-r from-copper-500/45 to-ember-500/25 rtl:bg-gradient-to-l"
                            : "bg-gradient-to-r from-steel-500/35 to-steel-500/10 rtl:bg-gradient-to-l",
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-3">
                          {pending === o.id ? (
                            <Loader2 className="size-5 animate-spin text-accent" aria-hidden />
                          ) : mine ? (
                            <CheckCircle2 className="size-5 text-accent" aria-hidden />
                          ) : (
                            <span className="size-5 rounded-full border-2 border-steel-400/60 transition-colors group-hover:border-copper-400" aria-hidden />
                          )}
                          <span>
                            <span className="flex items-center gap-2 font-semibold text-fg">
                              {name}
                              {isLeader && <Crown className="size-4 text-ember-500" aria-label={d.vote.leading} />}
                            </span>
                            {o.genre && <span className="text-xs text-muted">{t(o.genre)}</span>}
                          </span>
                        </span>
                        <span className="font-display text-lg font-black text-fg" dir="ltr">{pct}%</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div aria-live="polite" className="mt-5 min-h-6 text-sm">
              {error && <p className="text-red-600 dark:text-red-300">{error}</p>}
              {hasVoted && !error && (
                <p className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="size-4 shrink-0" aria-hidden /> {d.vote.locked}
                </p>
              )}
              {!isOpen && (
                <p className="flex items-center gap-2 text-muted">
                  <Lock className="size-4 shrink-0" aria-hidden /> {d.vote.closedMsg}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SuggestGame formId={suggestionFormId} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SuggestGame({ formId }: { formId?: string }) {
  const { d } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) return; // bot
    setState("sending");
    try {
      await submitToFormspree(formId, { _subject: `Game suggestion: ${data.game}`, form: "game-suggestion", ...data });
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof FormNotConnectedError ? d.common.notConnected : (err as Error).message || d.common.genericError);
      setState("error");
    }
  }

  return (
    <div className="panel clip-chamfer h-full p-5 sm:p-8">
      <span className="mb-4 grid size-12 place-items-center rounded-lg border border-steel-400/40 bg-steel-500/10 text-info">
        <Lightbulb className="size-6" aria-hidden />
      </span>
      <h3 className="font-display text-xl font-bold uppercase text-fg">{d.vote.suggestTitle}</h3>
      <p className="mt-2 text-sm text-muted">{d.vote.suggestText}</p>

      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg border border-copper-400/50 bg-copper-500/10 p-5 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto size-8 text-accent" aria-hidden />
            <p className="mt-2 font-semibold text-fg">{d.vote.received}</p>
            <button type="button" onClick={() => setState("idle")} className="mt-3 text-sm text-accent underline underline-offset-4">
              {d.vote.another}
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="mt-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div>
              <label htmlFor="sg-game" className="label">{d.vote.gameTitle}</label>
              <input id="sg-game" name="game" required maxLength={80} className="field" placeholder={d.vote.gamePlaceholder} />
            </div>
            <div>
              <label htmlFor="sg-why" className="label">
                {d.vote.why} <span className="normal-case text-muted">{d.common.optional}</span>
              </label>
              <textarea id="sg-why" name="reason" rows={3} maxLength={500} className="field resize-none" placeholder={d.vote.whyPlaceholder} />
            </div>
            <div>
              <label htmlFor="sg-email" className="label">
                {d.vote.email} <span className="normal-case text-muted">{d.common.optional}</span>
              </label>
              <input id="sg-email" name="email" type="email" dir="ltr" className="field rtl:text-end" placeholder="you@pmu.edu.sa" />
            </div>
            <button type="submit" disabled={state === "sending"} className="btn btn-primary clip-chamfer w-full">
              {state === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4 rtl:-scale-x-100" aria-hidden />}
              {d.vote.send}
            </button>
            <p aria-live="polite" className="min-h-5 text-sm text-red-600 dark:text-red-300">{state === "error" ? error : ""}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
