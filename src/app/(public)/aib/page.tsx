import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  HeartHandshake,
  Medal,
  Users,
  School,
  Stethoscope,
  Newspaper,
  ChevronRight,
  Quote,
} from "lucide-react";
import { loadNews, loadContent } from "@/lib/store";
import { firstImages } from "@/data/gallery";
import { getT } from "@/lib/locale-server";
import { dateLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CountUp from "@/components/CountUp";
import SocialRow from "@/components/SocialRow";

export const metadata: Metadata = {
  title: "AIB — Association Ivoirienne de Boxe",
  description:
    "Découvrez l'AIB : sa vision, ses engagements, son organisation et ses actions pour le développement de la boxe en Côte d'Ivoire.",
};

export const dynamic = "force-dynamic";

export default async function AibPage() {
  const { locale, t } = await getT();
  const en = locale === "en";
  const [news, content] = await Promise.all([loadNews(), loadContent()]);
  const aibNews = news.filter((n) => n.category === "AIB" || n.category === "Annonce");
  const actionImages = firstImages("misc/depistage", 3);
  const dateFmt = new Intl.DateTimeFormat(dateLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mvv = content.aib.mvv.map((m) => ({
    icon: [Target, Eye, HeartHandshake][content.aib.mvv.indexOf(m) % 3],
    title: m.title[locale],
    text: m.text[locale],
  }));

  const actions = [
    {
      icon: School,
      title: en ? "Training & scouting" : "Formation & détection",
      text: en
        ? "The “Young Talents” programme in 10 communes: scouting 12-18 year-olds, certified coaching and equipment kits for clubs."
        : "Programme « Jeunes Talents » dans 10 communes : détection des 12-18 ans, encadrement par des entraîneurs certifiés et kits d'équipement pour les clubs.",
    },
    {
      icon: Stethoscope,
      title: en ? "Health & screening" : "Santé & dépistage",
      text: en
        ? "Free screening campaigns (blood pressure, blood sugar, HIV, hepatitis) at every stage of the Clash of the Titans: over 1,200 people screened."
        : "Campagnes de dépistage gratuit (tension, glycémie, VIH, hépatites) en marge de chaque étape du Choc des Titans : plus de 1 200 personnes dépistées.",
    },
    {
      icon: Users,
      title: en ? "Inclusion through sport" : "Insertion par le sport",
      text: en
        ? "Partnerships with town halls and neighbourhood associations to give out-of-school youth structure, values and prospects."
        : "Partenariats avec les mairies et les associations de quartier pour offrir aux jeunes déscolarisés un cadre, des valeurs et des perspectives.",
    },
    {
      icon: Medal,
      title: en ? "Official competitions" : "Compétitions officielles",
      text: en
        ? "Organisation and sanctioning of galas, communal championships and the national Clash of the Titans circuit, with the Ministry of Sports."
        : "Organisation et homologation des galas, championnats communaux et du circuit national Choc des Titans, en lien avec le Ministère des Sports.",
    },
  ];

  return (
    <div className="pb-20">
      {/* Hero AIB */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-ci-orange/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-ci-green/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-ci-orange">
                  {t("aib.kicker")}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="section-title mt-4 text-4xl sm:text-6xl text-white">
                  {t("aib.title1")}
                  <br />
                  <span className="text-gradient-blue">{t("aib.title2")}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/75">
                  {en ? (
                    <>
                      Chaired by <strong className="text-white">Jhimmy Traoré</strong>, the
                      AIB unites the country&apos;s boxing clubs, oversees official
                      competitions and grows the noble art nationwide. It co-organises
                      the Clash of the Titans under the aegis of the Ministry of Sports.
                    </>
                  ) : (
                    <>
                      Présidée par <strong className="text-white">Jhimmy Traoré</strong>,
                      l&apos;AIB fédère les clubs de boxe de Côte d&apos;Ivoire, encadre
                      les compétitions officielles et développe la pratique du noble art
                      sur tout le territoire. Elle est la co-organisatrice du Choc des
                      Titans, sous l&apos;égide du Ministère des Sports.
                    </>
                  )}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/aib/rejoindre"
                    className="inline-flex items-center gap-2 rounded-md bg-blue px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-95"
                  >
                    {t("home.aib.join")}
                  </Link>
                  <Link
                    href="/actualites"
                    className="inline-flex items-center gap-2 rounded-md glass-light px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    <Newspaper size={16} />
                    {t("aib.pressNews")}
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <span className="dark-section mx-auto block w-fit rounded-3xl bg-[#0b0b0b] p-6 ring-1 ring-white/10">
                <Image
                  src="/images/brand/logo-aib.png"
                  alt="Logo de l'Association Ivoirienne de Boxe"
                  width={280}
                  height={280}
                  priority
                  className="mx-auto h-48 w-48 sm:h-64 sm:w-64 object-contain drop-shadow-[0_0_50px_rgba(247,127,0,0.3)]"
                />
              </span>
            </Reveal>
          </div>

          {/* Chiffres clés */}
          <Reveal delay={0.35}>
            <div className="glass mt-14 grid grid-cols-2 divide-white/8 rounded-2xl sm:grid-cols-4 sm:divide-x">
              {content.aib.stats.map((cs) => ({ n: cs.value, suffix: cs.suffix, label: cs.label[locale] })).map((s) => (
                <div key={s.label} className="flex flex-col items-center py-7">
                  <CountUp
                    value={s.n}
                    suffix={s.suffix}
                    className="font-display text-3xl sm:text-4xl text-white"
                  />
                  <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/45">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Engagements */}
      <section className="bg-carbon py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker={t("aib.mvv.kicker")}
            title={t("aib.mvv.title")}
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {mvv.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div className="glass-light h-full rounded-2xl p-7 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue/15 text-blue-light">
                    <c.icon size={22} />
                  </span>
                  <h3 className="font-display mt-5 text-xl uppercase text-white">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LE PRÉSIDENT — portrait solennel grand format ===== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue/8 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-[440px_1fr]">
            {/* Portrait grand format, cadrage rigoureux */}
            <Reveal>
              <figure className="relative">
                <div className="dark-section relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111214] shadow-card">
                  <Image
                    src={content.aib.president.photo}
                    alt={content.aib.president.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Filet tricolore */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ci-orange via-white to-ci-green" />
                </div>
                <figcaption className="glass -mt-14 relative z-10 mx-4 rounded-xl p-5 text-center">
                  <p className="font-display text-2xl uppercase text-white">
                    {content.aib.president.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-blue-light uppercase tracking-wider">
                    {content.aib.president.role[locale]}
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            {/* Le mot du président */}
            <Reveal delay={0.15}>
              <div className="flex h-full flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-light">
                  {t("aib.president.kicker")}
                </p>
                <div className="accent-bar mt-4" />
                <Quote size={34} className="mt-8 text-blue" />
                <blockquote className="mt-4 max-w-2xl text-lg sm:text-2xl italic leading-relaxed text-white/85">
                  {en
                    ? `“${content.aib.president.quote.en}”`
                    : `« ${content.aib.president.quote.fr} »`}
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <span className="h-px w-14 bg-gradient-to-r from-red to-blue" />
                  <p className="text-sm font-bold uppercase tracking-wider text-white">
                    {content.aib.president.name}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="bg-carbon py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker={t("aib.actions.kicker")}
            title={t("aib.actions.title")}
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              {actions.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.08}>
                  <div className="flex gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ci-green/12 text-ci-green">
                      <a.icon size={21} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                        {a.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="grid gap-3">
                {actionImages.map((src, i) => (
                  <div
                    key={src}
                    className={`relative overflow-hidden rounded-xl ${
                      i === 0 ? "aspect-[16/9]" : "aspect-[16/7]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="Action de dépistage santé de l'AIB"
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

      {/* Presse & actus AIB */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader kicker={t("aib.press.kicker")} title={t("aib.press.title")} />
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-4">
                <SocialRow size="sm" />
                <Link
                  href="/actualites"
                  className="group inline-flex items-center gap-2 rounded-md glass-light px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                >
                  {t("common.seeAll")}
                  <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {aibNews.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link
                  href={`/actualites/${a.slug}`}
                  className="group block overflow-hidden rounded-xl glass-light transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={a.cover}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <time className="text-[11px] uppercase tracking-wider text-white/40">
                      {dateFmt.format(new Date(a.date))}
                    </time>
                    <h3 className="mt-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-blue-light line-clamp-2">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA rejoindre */}
      <section className="pb-4">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <h2 className="section-title text-3xl sm:text-5xl text-white">
              {t("aib.join.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted">
              {t("aib.join.desc")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/aib/rejoindre"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-95"
            >
              {t("aib.join.cta")}
              <ChevronRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
