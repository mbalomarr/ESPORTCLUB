/** Thrown when a form has no Formspree ID configured in data/site.json. */
export class FormNotConnectedError extends Error {}

/** Post a submission straight from the browser to Formspree (no backend needed). */
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

/** FormData → flat record; multi-value fields (checkbox groups) are joined with commas. */
export function formDataToRecord(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of new Set(fd.keys())) out[key] = fd.getAll(key).map(String).join(", ");
  return out;
}
