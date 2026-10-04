"use client";

import { useCallback, useState } from "react";
import { FormNotConnectedError } from "@/lib/formspree";

export type SubmissionStatus = "idle" | "sending" | "sent" | "error";

/**
 * Shared state machine for the site's Formspree-backed forms.
 * `run` executes a submission and maps failures to a user-facing message.
 */
export function useFormSubmission(messages: { notConnected: string; generic: string }) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [error, setError] = useState("");

  const run = useCallback(
    async (submit: () => Promise<void>) => {
      setStatus("sending");
      setError("");
      try {
        await submit();
        setStatus("sent");
        return true;
      } catch (err) {
        setError(err instanceof FormNotConnectedError ? messages.notConnected : (err as Error).message || messages.generic);
        setStatus("error");
        return false;
      }
    },
    [messages.notConnected, messages.generic],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
  }, []);

  return { status, error: status === "error" ? error : "", run, reset, isSending: status === "sending" };
}
