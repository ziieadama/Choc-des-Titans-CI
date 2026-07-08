import Image from "next/image";
import Link from "next/link";
import {
  Radio,
  Ticket,
  ChevronRight,
  CalendarDays,
  MapPin,
  Flame,
  Users,
  Trophy,
  HeartHandshake,
} from "lucide-react";
import { firstImages } from "@/data/gallery";
import {
  loadNews,
  loadPartners,
  loadSettings,
  loadEditions,
  loadFighters,
  loadContent,
  pickCurrentEdition,
  pickNextStage,
  pickLastCompletedStage,
} from "@/lib/store";
import { getLatestVideos } from "@/lib/youtube";
import { getT } from "@/lib/locale-server";
import { dateLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import Countdown from "@/components/Countdown";
import FaceOff from "@/components/FaceOff";
import FightCard from "@/components/FightCard";
import FighterCard from "@/components/FighterCard";
import PartnerMarquee from "@/components/PartnerMarquee";
import PartnerLogoCloud from "@/components/PartnerLogoCloud";
import CountUp from "@/components/CountUp";
import VideoGrid from "@/components/VideoGrid";
import { YoutubeIcon } from "@/components/SocialIcons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, t } = await getT();
  const [partners, news, settings, yt, editions, fighters, content] =
    await Promise.all([
      loadPartners(),
      loadNews(),
      loadSettings(),
      getLatestVideos(),
      loadEditions(),
      loadFighters(),
      loadContent(),
    ]);
  const fightersBySlug = Object.fromEntries(fighters.map((f) => [f.slug, f]));
  const currentEdition = pickCurrentEdition(editions);
  const visibleVideos = yt.videos.filter((v) => !settings.hiddenVideoIds.includes(v.id));

  const dateFmt = new Intl.DateTimeFormat(dateLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stage = pickNextStage(editions);
  const lastStage = pickLastCompletedStage(editions);
  const headlineFight =
    lastStage?.fights.find((f) => f.headline) ?? lastStage?.fights[0];
  const otherFights = lastStage?.fights.filter((f) => f.id !== headlineFight?.id) ?? [];
  const champions = fighters.filter((f) => f.champion).slice(0, 4);
  const ambiance = firstImages("misc/public", 6);
  const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      {/* ========== HERO (îlot sombre photo, sans chevauchement) ========== */}
      <section className="dark-section hero-vignette relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0b0b0b]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={content.hero.image}
            alt="Combat de boxe du Choc des Titans sous les projecteurs"
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover object-[center_30%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/60" />

        {/* Contenu principal : flexible, jamais sous le bandeau stats */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <Reveal>
            <p className="inline-flex w-fit items-center gap-2 rounded-full glass-light px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-blue-light">
              <Flame size={13} className="text-red" />
              {content.hero.badge[locale]}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="section-title mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl text-white">
              {t("home.title1")}
              <br />
              <span className="text-gradient-blue">{t("home.title2")}</span>
              <span className="text-red">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/75">
              {content.hero.subtitle[locale]}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/direct"
                className="btn-shine inline-flex items-center gap-2.5 rounded-md bg-red px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-dark hover:shadow-glow-red active:scale-95"
              >
                <Radio size={17} strokeWidth={2.5} />
                {t("nav.watchLive")}
              </Link>
              <Link
                href={`/evenements/${currentEdition.slug}`}
                className="inline-flex items-center gap-2.5 rounded-md glass-light px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-white/10 hover:border-white/25 active:scale-95"
              >
                <Ticket size={17} />
                {t("home.cta.edition")}
              </Link>
            </div>
          </Reveal>

          {stage && (
            <Reveal delay={0.45}>
              <div className="mt-12">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                  <CalendarDays size={14} className="text-blue-light" />
                  {t("home.nextStage")} — {stage.commune},{" "}
                  {dateFmt.format(new Date(stage.date))}
                </p>
                <Countdown target={stage.date} />
              </div>
            </Reveal>
          )}
        </div>

        {/* Bandeau stats : dans le flux, aucun chevauchement possible */}
        <div className="relative z-10 hidden border-t border-white/8 glass sm:block">
          <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/8 px-4 sm:px-6 lg:px-8">
            {content.stats.map((cs) => ({ n: cs.value, suffix: cs.suffix, label: cs.label[locale] })).map((s) => (
              <div key={s.label} className="flex flex-col items-center py-5">
                <CountUp
                  value={s.n}
                  suffix={s.suffix}
                  className="font-display text-2xl lg:text-3xl text-white"
                />
                <span className="mt-0.5 text-[10px] lg:text-xs uppercase tracking-widest text-white/45">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BANDEAU PARTENAIRES ========== */}
      <section className="border-y border-line bg-carbon py-5">
        <PartnerMarquee partners={partners} />
      </section>

      {/* ========== PROCHAIN RENDEZ-VOUS ========== */}
      {stage && (
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue/10 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker={t("home.next.kicker")}
              title={t("home.next.title")}
              description={t("home.next.desc")}
            />
            <Reveal delay={0.15} className="mt-10">
              <div className="dark-section group relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                  <Image
                    src={stage.cover}
                    alt={`${stage.name} — ${stage.venue}`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/40 to-transparent mix-blend-multiply" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <span className="inline-block rounded bg-red px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                      Étape 2 · CDT 7
                    </span>
                    <h3 className="font-display mt-3 text-4xl sm:text-5xl uppercase text-white">
                      {stage.commune}
                    </h3>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-blue-light" />
                        {dateFmt.format(new Date(stage.date))} · 19h00
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-blue-light" />
                        {stage.venue}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/direct"
                      className="btn-shine inline-flex items-center gap-2 rounded-md bg-red px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-dark hover:shadow-glow-red active:scale-95"
                    >
                      {t("home.next.buyPass")}
                    </Link>
                    <Link
                      href={`/evenements/${currentEdition.slug}`}
                      className="inline-flex items-center gap-2 rounded-md glass-light px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
                    >
                      {t("home.next.program")}
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ========== DERNIERS RÉSULTATS / FACE-À-FACE ========== */}
      {lastStage && headlineFight && (
        <section className="relative bg-carbon py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              kicker={`${lastStage.name} · ${dateFmt.format(new Date(lastStage.date))}`}
              title={t("home.results.title")}
              description={t("home.results.desc")}
            />
            <div className="mt-10">
              <FaceOff
                fight={headlineFight}
                label={t("home.results.mainFight")}
                purse={settings.purses[headlineFight.id]}
                fightersBySlug={fightersBySlug}
              />
            </div>

            <div className="mt-14">
              <Reveal>
                <h3 className="font-display text-xl uppercase tracking-wide text-white/85">
                  {t("home.results.allResults")}
                </h3>
              </Reveal>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {otherFights.map((f, i) => (
                  <Reveal key={f.id} delay={i * 0.08}>
                    <FightCard fight={f} purse={settings.purses[f.id]} locale={locale} fightersBySlug={fightersBySlug} />
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.2} className="mt-8">
                <Link
                  href={`/evenements/${currentEdition.slug}`}
                  className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-light transition-colors hover:text-white"
                >
                  {t("home.results.seeEdition")}
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ========== DERNIÈRES VIDÉOS (YouTube auto-sync) ========== */}
      {visibleVideos.length > 0 && (
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-red/6 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                kicker={t("videos.kicker")}
                title={t("videos.home.title")}
              />
              <Reveal delay={0.1}>
                <Link
                  href="/videos"
                  className="group inline-flex items-center gap-2 rounded-md glass-light px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                >
                  <span className="text-red"><YoutubeIcon size={15} /></span>
                  {t("videos.home.all")}
                  <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-10">
              <VideoGrid videos={visibleVideos.slice(0, 3)} compact />
            </div>
          </div>
        </section>
      )}

      {/* ========== LES TITANS ========== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-red/8 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              kicker={t("home.roster.kicker")}
              title={t("home.roster.title")}
              description={t("home.roster.desc")}
            />
            <Reveal delay={0.1}>
              <Link
                href="/combattants"
                className="group inline-flex items-center gap-2 rounded-md glass-light px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
              >
                {t("home.roster.all")}
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {champions.map((f, i) => (
              <Reveal key={f.slug} delay={i * 0.08}>
                <FighterCard fighter={f} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== L'EXPÉRIENCE ========== */}
      <section className="bg-carbon py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader kicker={t("home.exp.kicker")} title={t("home.exp.title")} />
              <Reveal delay={0.1}>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted">
                  {t("home.exp.desc")}
                </p>
              </Reveal>
              <div className="mt-8 space-y-5">
                {[
                  { icon: Users, title: t("home.exp.f1.title"), text: t("home.exp.f1.text") },
                  { icon: HeartHandshake, title: t("home.exp.f2.title"), text: t("home.exp.f2.text") },
                  { icon: Trophy, title: t("home.exp.f3.title"), text: t("home.exp.f3.text") },
                ].map((item, i) => (
                  <Reveal key={item.title} delay={0.15 + i * 0.08}>
                    <div className="flex gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue/15 text-blue-light">
                        <item.icon size={19} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Mosaïque ambiance */}
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {ambiance.map((src, i) => (
                  <div
                    key={src}
                    className={`relative overflow-hidden rounded-xl ${
                      i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="Ambiance du public au Choc des Titans"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== BLOC AIB ========== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-ci-orange/8 blur-[130px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass relative overflow-hidden rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-ci-orange via-white/60 to-ci-green" />
            <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
              <Reveal>
                <span className="dark-section mx-auto block w-fit rounded-2xl bg-[#0b0b0b] p-4 ring-1 ring-white/10">
                  <Image
                    src="/images/brand/logo-aib.png"
                    alt="Logo de l'Association Ivoirienne de Boxe"
                    width={160}
                    height={160}
                    className="h-32 w-32 sm:h-40 sm:w-40 object-contain drop-shadow-[0_0_30px_rgba(247,127,0,0.25)]"
                  />
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-ci-orange">
                  {t("home.aib.kicker")}
                </p>
                <h2 className="section-title mt-3 text-3xl sm:text-4xl text-white">
                  {t("home.aib.title")}
                </h2>
                <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
                  {t("home.aib.desc")}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/aib"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-95"
                  >
                    {t("home.aib.discover")}
                  </Link>
                  <Link
                    href="/aib/rejoindre"
                    className="inline-flex items-center justify-center gap-2 rounded-md glass-light px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    {t("home.aib.join")}
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ACTUALITÉS ========== */}
      <section className="bg-carbon py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader kicker={t("home.news.kicker")} title={t("home.news.title")} />
            <Reveal delay={0.1}>
              <Link
                href="/actualites"
                className="group inline-flex items-center gap-2 rounded-md glass-light px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
              >
                {t("home.news.all")}
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {sortedNews.slice(0, 3).map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.1}>
                <Link
                  href={`/actualites/${article.slug}`}
                  className="group block overflow-hidden rounded-xl glass-light transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.cover}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <time className="text-[11px] uppercase tracking-wider text-white/40">
                      {dateFmt.format(new Date(article.date))}
                    </time>
                    <h3 className="mt-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-blue-light line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NUAGE DE PARTENAIRES ========== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/6 blur-[140px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker={t("home.partners.kicker")}
            title={t("home.partners.title")}
            description={t("home.partners.desc")}
            align="center"
          />
          <div className="mt-14">
            <PartnerLogoCloud partners={partners} />
          </div>
          <Reveal delay={0.2} className="mt-12 text-center">
            <Link
              href="/partenaires"
              className="group inline-flex items-center gap-2 rounded-md glass-light px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
            >
              {t("home.partners.all")}
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="dark-section relative overflow-hidden">
        <div className="relative min-h-[420px]">
          <Image
            src={(editions[1] ?? editions[0]).cover}
            alt="La grande finale du Choc des Titans"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-dark/30 via-transparent to-red-dark/30" />
          <div className="relative z-10 mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
            <Reveal>
              <h2 className="section-title text-4xl sm:text-6xl text-white">
                {t("home.cta.title1")}
                <br />
                <span className="text-gradient-fire">{t("home.cta.title2")}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-sm sm:text-base text-white/70">
                {t("home.cta.desc")}
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <Link
                href="/direct"
                className="btn-shine mt-8 inline-flex items-center gap-2.5 rounded-md bg-red px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-dark hover:shadow-glow-red active:scale-95"
              >
                <Radio size={17} strokeWidth={2.5} />
                {t("home.cta.button")}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
