import type { Metadata } from "next";
import { YoutubeIcon } from "@/components/SocialIcons";
import { getLatestVideos } from "@/lib/youtube";
import { loadSettings } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import { siteConfig } from "@/data/site";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import VideoGrid from "@/components/VideoGrid";
import SocialRow from "@/components/SocialRow";

export const metadata: Metadata = {
  title: "Vidéos officielles",
  description:
    "Résumés de combats, face-à-face et coulisses : les vidéos officielles du Choc des Titans, synchronisées avec la chaîne YouTube.",
};

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const { t } = await getT();
  const [{ videos: allVideos, channelTitle }, settings] = await Promise.all([
    getLatestVideos(),
    loadSettings(),
  ]);
  const videos = allVideos.filter((v) => !settings.hiddenVideoIds.includes(v.id));

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            kicker={t("videos.kicker")}
            title={t("videos.title")}
            description={t("videos.desc")}
          />
          <Reveal delay={0.1}>
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#ff0000] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
            >
              <YoutubeIcon size={16} />
              {t("videos.channel")}
              {channelTitle ? ` — ${channelTitle}` : ""}
            </a>
          </Reveal>
        </div>

        <div className="mt-10">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <Reveal>
              <div className="glass-light flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red/10 text-red">
                  <YoutubeIcon size={28} />
                </span>
                <p className="max-w-md text-sm leading-relaxed text-muted">
                  {t("videos.empty")}
                </p>
                <SocialRow size="sm" />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
