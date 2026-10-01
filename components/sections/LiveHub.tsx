"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ExternalLink, Radio, Tv } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { DiscordIcon, TwitchIcon } from "@/components/ui/BrandIcons";
import { useLang } from "@/components/providers/LanguageProvider";
import type { SiteConfig, Socials } from "@/lib/types";

export default function LiveHub({ live, socials }: { live: SiteConfig["live"]; socials: Socials }) {
  const { d } = useLang();
  const { resolvedTheme } = useTheme();
  // Twitch embeds must declare the domain they're shown on, which we only know in the browser.
  const [host, setHost] = useState<string | null>(null);
  useEffect(() => setHost(window.location.hostname), []);

  const channel = live.twitchChannel?.trim();
  const serverId = live.discordServerId?.trim();
  const discordTheme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <section aria-labelledby="live-title" className="relative px-4 py-20 sm:px-6">
      <div aria-hidden className="glow-blob absolute end-0 top-1/4 -z-10 size-96 rounded-full bg-steel-600/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="live-title" eyebrow={d.live.eyebrow} title={d.live.title} description={d.live.description} />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="panel clip-chamfer overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-fg rtl:text-sm">
                <TwitchIcon className="size-4 text-[#9146ff]" />
                {d.live.twitch}
              </p>
              <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-300">
                <Radio className="size-3.5" aria-hidden /> {d.live.liveWhen}
              </span>
            </div>
            <div className="relative aspect-video bg-elevated-2">
              {channel ? (
                host && (
                  <iframe
                    title={`${channel} Twitch`}
                    src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${host}&muted=true&autoplay=false`}
                    allowFullScreen
                    className="absolute inset-0 size-full"
                    loading="lazy"
                  />
                )
              ) : (
                <Placeholder icon={<Tv className="size-10" aria-hidden />} text={d.live.twitchMissing} />
              )}
            </div>
            {socials.twitch && (
              <a href={socials.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 text-sm text-info hover:text-accent">
                {d.live.openTwitch} <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </Reveal>

          <Reveal delay={0.1} className="panel clip-chamfer flex flex-col overflow-hidden">
            <div className="flex items-center border-b border-line px-5 py-3">
              <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-fg rtl:text-sm">
                <DiscordIcon className="size-4 text-[#5865f2]" />
                {d.live.discord}
              </p>
            </div>
            <div className="relative min-h-[400px] flex-1 bg-elevated-2">
              {serverId ? (
                <iframe
                  key={discordTheme}
                  title="Discord"
                  src={`https://discord.com/widget?id=${encodeURIComponent(serverId)}&theme=${discordTheme}`}
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="absolute inset-0 size-full"
                  loading="lazy"
                />
              ) : (
                <Placeholder icon={<DiscordIcon className="size-10" />} text={d.live.discordMissing} />
              )}
            </div>
            {socials.discord && (
              <a href={socials.discord} target="_blank" rel="noopener noreferrer" className="btn btn-primary m-4">
                {d.live.joinDiscord}
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Placeholder({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-circuit absolute inset-0 grid place-items-center p-6 text-center">
      <div className="text-muted">
        <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full border border-line-strong text-steel-500">{icon}</div>
        <p className="max-w-xs text-sm">{text}</p>
      </div>
    </div>
  );
}
