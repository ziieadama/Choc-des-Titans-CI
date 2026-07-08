import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Crown, ChevronLeft, Swords } from "lucide-react";
import { fighters as fightersSeed } from "@/data/fighters";
import { loadSettings, loadEditions, loadFighters, pickCurrentEdition } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import Reveal from "@/components/Reveal";
import StatBars from "@/components/StatBars";
import FightCard from "@/components/FightCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return fightersSeed.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fighter = (await loadFighters()).find((f) => f.slug === slug);
  if (!fighter) return {};
  return {
    title: `${fighter.name}${fighter.nickname ? ` « ${fighter.nickname} »` : ""}`,
    description: fighter.bio,
  };
}

export default async function FighterPage({
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
  const fighter = fighters.find((f) => f.slug === slug);
  if (!fighter) notFound();

  const { wins, losses, draws, ko } = fighter.record;
  const fights = pickCurrentEdition(editions).stages
    .flatMap((s) => s.fights)
    .filter((f) => f.red === slug || f.blue === slug);
  const rivals = fighters
    .filter((f) => f.weightClass === fighter.weightClass && f.slug !== slug)
    .slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero profil */}
      <section className="dark-section relative overflow-hidden bg-[#0b0b0b]">
        <div className="relative min-h-[75dvh]">
          <Image
            src={fighter.photo}
            alt={fighter.name}
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[75dvh] max-w-7xl flex-col justify-end px-4 sm:px-6 lg:px-8 pb-12 pt-28">
            <Reveal>
              <Link
                href="/combattants"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white"
              >
                <ChevronLeft size={14} />
                {t("fighter.back")}
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-light">
                {fighter.weightClass} · {fighter.gender === "F" ? t("common.female") : t("common.male")}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="section-title mt-3 text-5xl sm:text-7xl text-white">
                {fighter.name}
              </h1>
              {fighter.nickname && (
                <p className="mt-2 text-xl italic text-white/60">« {fighter.nickname} »</p>
              )}
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full glass-light px-4 py-2 text-sm text-white/80">
                  <MapPin size={14} className="text-blue-light" />
                  {fighter.commune}
                </span>
                {fighter.champion && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-4 py-2 text-sm font-bold text-black">
                    <Crown size={14} />
                    Champion
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Record */}
        <section className="-mt-2 py-10">
          <Reveal>
            <div className="glass grid grid-cols-4 divide-x divide-white/8 rounded-2xl">
              {[
                { n: wins, label: t("fighter.wins"), cls: "text-ci-green" },
                { n: losses, label: t("fighter.losses"), cls: "text-red" },
                { n: draws, label: t("fighter.draws"), cls: "text-white/60" },
                { n: ko, label: "K.O", cls: "text-gold" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center py-6">
                  <span className={`font-display tabular text-3xl sm:text-4xl ${s.cls}`}>
                    {s.n}
                  </span>
                  <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/45">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            {/* Bio */}
            <section>
              <Reveal>
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                  {t("fighter.portrait")}
                </h2>
                <div className="accent-bar mt-3" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/75">
                  {fighter.bio}
                </p>
              </Reveal>
            </section>

            {/* Palmarès */}
            <section className="mt-10">
              <Reveal>
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                  {t("fighter.titles")}
                </h2>
                <div className="accent-bar mt-3" />
              </Reveal>
              <ul className="mt-5 space-y-3">
                {fighter.titles.map((t, i) => (
                  <Reveal key={t} delay={i * 0.07}>
                    <li className="glass-light flex items-center gap-3 rounded-lg p-4">
                      <Crown size={16} className="shrink-0 text-gold" />
                      <span className="text-sm text-white/85">{t}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>

            {/* Combats récents */}
            {fights.length > 0 && (
              <section className="mt-10">
                <Reveal>
                  <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                    {t("fighter.recentFights")}
                  </h2>
                  <div className="accent-bar mt-3" />
                </Reveal>
                <div className="mt-5 space-y-4">
                  {fights.map((f, i) => (
                    <Reveal key={f.id} delay={i * 0.07}>
                      <FightCard fight={f} purse={settings.purses[f.id]} locale={locale} fightersBySlug={fightersBySlug} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Colonne stats */}
          <aside>
            <Reveal delay={0.15}>
              <div className="glass rounded-2xl p-6 lg:sticky lg:top-24">
                <h3 className="font-display flex items-center gap-2 text-lg uppercase tracking-wide text-white">
                  <Swords size={17} className="text-blue-light" />
                  {t("fighter.attributes")}
                </h3>
                <div className="mt-6">
                  <StatBars stats={fighter.stats} />
                </div>

                {rivals.length > 0 && (
                  <div className="mt-8 border-t border-white/8 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                      {t("fighter.sameCategory")}
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {rivals.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/combattants/${r.slug}`}
                            className="group flex items-center gap-3"
                          >
                            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                              <Image
                                src={r.photo}
                                alt={r.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-white transition-colors group-hover:text-blue-light">
                                {r.name}
                              </span>
                              <span className="text-xs text-white/45">
                                {r.record.wins}{locale === "en" ? "W" : "V"}-{r.record.losses}{locale === "en" ? "L" : "D"} · {r.commune}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
