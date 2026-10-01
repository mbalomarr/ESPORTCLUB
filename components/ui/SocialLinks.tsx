import type { Socials } from "@/lib/types";
import { DiscordIcon, InstagramIcon, TwitchIcon, XIcon } from "./BrandIcons";
import { cn } from "@/lib/utils";

const items = [
  { key: "discord", label: "Discord", Icon: DiscordIcon },
  { key: "twitch", label: "Twitch", Icon: TwitchIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "x", label: "X (Twitter)", Icon: XIcon },
] as const;

export default function SocialLinks({ socials, className, size = "md" }: { socials?: Socials; className?: string; size?: "sm" | "md" }) {
  const present = items.filter((i) => socials?.[i.key]);
  if (!present.length) return null;
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {present.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={socials![key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "grid place-items-center rounded-md border border-line-strong text-muted transition-colors hover:border-copper-400 hover:text-accent",
              size === "sm" ? "size-9" : "size-11",
            )}
          >
            <Icon className={size === "sm" ? "size-4" : "size-5"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
