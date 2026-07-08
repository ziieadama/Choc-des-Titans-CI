import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Star,
  Users,
  ChevronRight,
  ImageIcon,
  Radio,
} from "lucide-react";
import { editions as editionsSeed } from "@/data/editions";
import { firstImages } from "@/data/gallery";
import { loadSettings, loadEditions, loadFighters } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import { dateLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import FightCard from "@/components/FightCard";
import FaceOff from "@/components/FaceOff";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return editionsSeed.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edition = (await loadEditions()).find((e) => e.slug === slug);
  if (!edition) return {};
  return {
    title: `${edition.title} (${edition.year})`,
    description: edition.description,
  };
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, t } = await getT();
  const [settings, editions, fighters] = await Promise.all([
    loadSettings(),
    loadEditions(),
    loadFighters(),
  ]);
  const fightersBySlug = Object.fromEntries(fighters.map((f) => [f.slug, f]));
  const dateFmt = new Intl.DateTimeFormat(dateLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const edition = editions.find((e) => e.slug === slug);
  if (!edition) notFound();

  const doneStages = edition.stages.filter((s) => s.status === "terminé");
  const upcomingStages = edition.stages.filter((s) => s.status === "à venir");
  const nextUp = upcomingStages[0];
  const headline = doneStages
    .flatMap((s) => s.fights)
    .find((f) => f.headline);

  return (
    <div className="pb-20">
      {/* Hero édition */}
      <section className="dark-section hero-vignette relative flex min-h-[70dvh] items-end overflow-hidden bg-[#0b0b0b]">
        <Image
          src={edition.cover}
          alt={edition.title}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <Reveal>
            <span
              className={`inline-block rounded px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
                edition.status === "en cours"
                  ? "bg-red text-white"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {t("common.edition")} {edition.status} · {edition.year}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="section-title mt-4 text-5xl sm:text-7xl text-white">
              {edition.title}
            </h1>
            <p className="mt-3 text-lg italic text-white/60">« {edition.tagline} »</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-white/75">
              {edition.description}
            </p>
          </Reveal>
          {edition.status === "en cours" && (
            <Reveal delay={0.3}>
              <Link
                href="/direct"
                className="mt-7 inline-flex items-center gap-2.5 rounded-md bg-red px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-dark hover:shadow-glow-red active:scale-95"
              >
                <Radio size={16} strokeWidth={2.5} />
                {t("events.followLive")}
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Temps forts */}
        <section className="py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {edition.highlights.map((h, i) => (
              <Reveal key={h} delay={i * 0.07}>
                <div className="glass-light flex h-full gap-3 rounded-xl p-5">
                  <Star size={17} className="mt-0.5 shrink-0 text-gold" />
                  <p className="text-sm leading-relaxed text-white/80">{h}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Prochaine étape + countdown */}
        {nextUp && (
          <section className="pb-14">
            <Reveal>
              <div className="glass relative overflow-hidden rounded-2xl">
                <div className="absolute inset-y-0 right-0 w-1/2 opacity-25">
                  <Image
                    src={nextUp.cover}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover [mask-image:linear-gradient(to_left,black,transparent)]"
                  />
                </div>
                <div className="relative z-10 flex flex-col gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-light">
                      {t("events.nextMeeting")}
                    </p>
                    <h2 className="font-display mt-2 text-3xl sm:text-4xl uppercase text-white">
                      {nextUp.name}
                    </h2>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-blue-light" />
                        {dateFmt.format(new Date(nextUp.date))}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-blue-light" />
                        {nextUp.venue}
                      </span>
                    </p>
                  </div>
                  <Countdown target={nextUp.date} />
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Étapes terminées : résultats */}
        {doneStages.map((stage) => (
          <section key={stage.slug} className="pb-16">
            <SectionHeader
              kicker={`${dateFmt.format(new Date(stage.date))} · ${stage.venue}`}
              title={stage.name}
              description={
                stage.parrain ? `Sous le parrainage de ${stage.parrain}.` : undefined
              }
            />

            {stage.personalities && stage.personalities.length > 0 && (
              <Reveal delay={0.1} className="mt-6">
                <div className="glass-light rounded-xl p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
                    <Users size={14} className="text-blue-light" />
                    {t("events.personalities")}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.personalities.map((p) => (
                      <li
                        key={p}
                        className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs text-white/75"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {headline && stage.fights.includes(headline) && (
              <div className="mt-8">
                <FaceOff fight={headline} label={t("home.results.mainFight")} purse={settings.purses[headline.id]} fightersBySlug={fightersBySlug} />
              </div>
            )}

            {stage.fights.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {stage.fights
                  .filter((f) => f !== headline)
                  .map((f, i) => (
                    <Reveal key={f.id} delay={i * 0.06}>
                      <FightCard fight={f} purse={settings.purses[f.id]} locale={locale} fightersBySlug={fightersBySlug} />
                    </Reveal>
                  ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">
                {t("events.resultsSoon")}
              </p>
            )}

            {edition.galleryEditionKey && (
              <Reveal delay={0.15} className="mt-8">
                <Link
                  href={`/galerie/${edition.slug}`}
                  className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-light transition-colors hover:text-white"
                >
                  <ImageIcon size={16} />
                  {t("events.photosOf")}
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            )}
          </section>
        ))}

        {/* Étapes à venir : calendrier */}
        {upcomingStages.length > 0 && (
          <section className="pb-16">
            <SectionHeader kicker={t("events.calendar")} title={t("events.upcoming")} />
            <div className="mt-8 space-y-3">
              {upcomingStages.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.07}>
                  <div className="glass-light group flex flex-col gap-4 rounded-xl p-5 transition-all hover:border-white/20 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                      <Image
                        src={s.cover}
                        alt={s.commune}
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl uppercase text-white">{s.name}</h3>
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/55">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-blue-light" />
                          {dateFmt.format(new Date(s.date))} · 19h00
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-blue-light" />
                          {s.venue}
                        </span>
                      </p>
                    </div>
                    <Link
                      href="/direct"
                      className="inline-flex shrink-0 items-center gap-2 rounded-md bg-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-95"
                    >
                      {t("events.passLive")}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Étapes d'une édition passée (ex CDT6) */}
        {edition.status === "terminée" && edition.stages.length > 0 && (
          <section className="pb-16">
            <SectionHeader kicker="Le parcours" title="Les étapes de l'édition" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {edition.stages.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.06}>
                  <Link
                    href={
                      edition.galleryEditionKey
                        ? `/galerie/${edition.slug}/${s.slug}`
                        : `/galerie/${edition.slug}`
                    }
                    className="group relative block aspect-[16/10] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={s.cover}
                      alt={s.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="font-display text-lg uppercase text-white">
                        {s.commune}
                      </h3>
                      <p className="text-xs text-white/55">
                        {dateFmt.format(new Date(s.date))}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Bandeau photos édition */}
        {edition.galleryEditionKey && (
          <section>
            <Reveal>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {firstImages(
                  edition.galleryEditionKey === "cdt7"
                    ? "cdt7/bingerville/panorama"
                    : "cdt6/finale",
                  6
                ).map((src) => (
                  <Link
                    key={src}
                    href={`/galerie/${edition.slug}`}
                    className="group relative block aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={src}
                      alt="Photo de l'édition"
                      fill
                      sizes="(max-width: 640px) 33vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-blue/0 transition-colors group-hover:bg-blue/20" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}
