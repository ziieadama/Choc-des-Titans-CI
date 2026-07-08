import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CalendarDays } from "lucide-react";
import { loadEditions } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Événements & Éditions",
  description:
    "L'édition en cours, les prochaines dates et l'historique complet des éditions du Choc des Titans.",
};

const statusStyle: Record<string, string> = {
  "en cours": "bg-red text-white",
  "à venir": "bg-blue text-white",
  terminée: "bg-white/10 text-white/60",
};

export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const { t } = await getT();
  const editions = await loadEditions();
  const [current, ...past] = editions;

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={t("events.kicker")}
          title={t("events.title")}
          description={t("events.desc")}
        />

        {/* Édition en cours */}
        <Reveal delay={0.1} className="mt-12">
          <Link
            href={`/evenements/${current.slug}`}
            className="dark-section group relative block overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              <Image
                src={current.cover}
                alt={current.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <span className={`inline-block rounded px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${statusStyle[current.status]}`}>
                {t("events.current")}
              </span>
              <h2 className="font-display mt-3 text-4xl sm:text-6xl uppercase text-white">
                {current.title}
              </h2>
              <p className="mt-1 text-sm sm:text-base italic text-white/60">
                « {current.tagline} » · {current.year}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-md bg-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all group-hover:bg-red-dark group-hover:shadow-glow-red">
                {t("events.follow")}
                <ChevronRight size={16} />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Historique */}
        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-2xl uppercase tracking-wide text-white/85">
              {t("events.past")}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((ed, i) => (
              <Reveal key={ed.slug} delay={i * 0.07}>
                <Link
                  href={`/evenements/${ed.slug}`}
                  className="group block overflow-hidden rounded-xl glass-light transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={ed.cover}
                      alt={ed.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="dark-section font-display absolute right-3 top-3 rounded bg-black/60 px-2.5 py-1 text-sm text-white backdrop-blur-sm">
                      {ed.year}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl uppercase text-white transition-colors group-hover:text-blue-light">
                      {ed.title}
                    </h3>
                    <p className="mt-1 text-sm italic text-white/50">« {ed.tagline} »</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">
                      {ed.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/40">
                      <CalendarDays size={13} />
                      {ed.stages.length > 0
                        ? `${ed.stages.length} ${t("events.stages")}`
                        : t("events.archived")}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
