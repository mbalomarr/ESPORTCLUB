"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Crown, Loader2, Lock, Vote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { useLang } from "@/components/providers/LanguageProvider";
import { submitToFormspree } from "@/lib/formspree";
import { useFormSubmission } from "@/lib/hooks/use-form-submission";
import { pick } from "@/lib/i18n/localize";
import type { GamesPoll } from "@/types";
import { cn } from "@/lib/utils";
import SuggestGameForm from "./SuggestGameForm";

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
  const { error, run } = useFormSubmission({ notConnected: d.common.notConnected, generic: d.common.genericError });

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
  const totalVotes = tallies.reduce((sum, o) => sum + o.votes, 0);
  const leaderId = tallies.reduce<(typeof tallies)[number] | undefined>((a, b) => (!a || b.votes > a.votes ? b : a), undefined)?.id;
  const isOpen = poll.poll.isOpen;
  const hasVoted = myVote !== null;

  async function castVote(id: string, name: string) {
    if (hasVoted || pending || !isOpen) return;
    setPending(id);
    const ok = await run(() => submitToFormspree(voteFormId, { _subject: `Game vote: ${name}`, form: "game-vote", poll: poll.poll.id, game: name }));
    if (ok) {
      try {
        localStorage.setItem(storageKey, id);
      } catch {}
      setMyVote(id);
    }
    setPending(null);
  }

  return (
    <section id="vote" aria-labelledby="vote-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="glow-blob absolute start-0 top-1/3 -z-10 size-96 rounded-full bg-steel-600/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="vote-title" eyebrow={d.vote.eyebrow} title={d.vote.title} description={t(poll.poll.question)} />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Card chamfer className="p-5 sm:p-8">
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
                  const isLeader = o.id === leaderId && o.votes > 0;
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => castVote(o.id, pick(o.name, "en"))}
                        disabled={hasVoted || !isOpen || pending !== null}
                        aria-pressed={mine}
                        aria-label={`${d.vote.optionLabel(name, pct, o.votes)}${mine ? `, ${d.vote.yourVote}` : hasVoted ? "" : `. ${d.vote.voteFor}`}`}
                        className={cn(
                          "group relative isolate w-full overflow-hidden rounded-lg border bg-elevated/40 p-4 text-start transition-all disabled:cursor-default",
                          mine ? "glow-copper border-copper-400" : "border-line",
                          !hasVoted && isOpen && "hover:-translate-y-0.5 hover:border-copper-400/70",
                        )}
                      >
                        {/* Bar grows from the inline start: left in English, right in Arabic. */}
                        <motion.span
                          aria-hidden
                          className={cn(
                            "absolute inset-y-0 start-0 -z-10 rtl:bg-gradient-to-l",
                            mine ? "bg-gradient-to-r from-copper-500/45 to-ember-500/25" : "bg-gradient-to-r from-steel-500/35 to-steel-500/10",
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
                          <span className="font-display text-lg font-black text-fg" dir="ltr">
                            {pct}%
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div aria-live="polite" className="mt-5 min-h-6 text-sm">
                {error && <p className="text-red-600 dark:text-red-300">{error}</p>}
                {hasVoted && (
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
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <SuggestGameForm formId={suggestionFormId} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
