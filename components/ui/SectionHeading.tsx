import Reveal from "./Reveal";

export type HeadingLevel = "h1" | "h2";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  /** The first section on each page renders as h1. */
  as?: HeadingLevel;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.3em] text-accent-2">
        <span aria-hidden className="h-px w-6 bg-copper-500" />
        {eyebrow}
        <span aria-hidden className="h-px w-6 bg-copper-500" />
      </p>
      <Tag id={id} className="font-display text-3xl font-black uppercase text-gradient-steel sm:text-4xl">
        {title}
      </Tag>
      {description && <p className="mt-4 text-muted">{description}</p>}
    </Reveal>
  );
}
