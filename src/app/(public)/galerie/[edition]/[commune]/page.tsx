import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Quote, MapPin, Landmark, Trophy } from "lucide-react";
import {
  galleryEditions,
  getGalleryEdition,
  getGalleryCommune,
} from "@/data/galleryStructure";
import { imagesOf } from "@/data/gallery";
import { loadCommunes, loadGalleryExtra } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";
import CountUp from "@/components/CountUp";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return galleryEditions.flatMap((e) =>
    e.communes.map((c) => ({ edition: e.editionSlug, commune: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ edition: string; commune: string }>;
}): Promise<Metadata> {
  const { edition, commune } = await params;
  const ed = getGalleryEdition(edition);
  const com = getGalleryCommune(edition, commune);
  if (!ed || !com) return {};
  return {
    title: `Photos — ${com.name} · ${ed.title}`,
    description: `Toutes les photos de l'étape de ${com.name} du ${ed.title}.`,
  };
}

export default async function GalerieCommunePage({
  params,
}: {
  params: Promise<{ edition: string; commune: string }>;
}) {
  const { edition, commune } = await params;
  const { t } = await getT();
  const ed = getGalleryEdition(edition);
  const galleryCommune = getGalleryCommune(edition, commune);
  if (!ed || !galleryCommune) notFound();

  const [communes, extra] = await Promise.all([loadCommunes(), loadGalleryExtra()]);
  const info = communes.find((c) => c.slug === commune);
  const mot = info?.motInstitutionnel;

  return (
    <div className="pb-20">
      {/* Hero commune */}
      <section className="dark-section hero-vignette relative flex min-h-[55dvh] items-end overflow-hidden bg-[#0b0b0b]">
        <Image
          src={galleryCommune.cover}
          alt={`Étape de ${galleryCommune.name}`}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-28">
          <Reveal>
            <Link
              href={`/galerie/${ed.editionSlug}`}
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white"
            >
              <ChevronLeft size={14} />
              {ed.title}
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-light">
              <MapPin size={13} />
              {info?.region ?? "Côte d'Ivoire"}
            </p>
            <h1 className="section-title mt-3 text-5xl sm:text-6xl text-white">
              {galleryCommune.name}
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Présentation de la commune */}
        {info && (
          <section className="py-12">
            <div className={`grid gap-6 ${mot ? "lg:grid-cols-[1fr_440px]" : ""}`}>
              <Reveal>
                <div className="glass-light h-full rounded-2xl p-7">
                  <h2 className="font-display flex items-center gap-2 text-xl uppercase tracking-wide text-white">
                    <Landmark size={18} className="text-blue-light" />
                    {t("gallery.theCommune")}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
                    {info.description}
                  </p>
                  <h3 className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-light">
                    <Trophy size={14} />
                    {t("gallery.cdtLink")}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/75">
                    {info.lienCdt}
                  </p>
                  {info.stats && (
                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/8 pt-6">
                      {[
                        { n: info.stats.clubs, label: t("gallery.clubs") },
                        { n: info.stats.boxeurs, label: t("gallery.boxers") },
                        { n: info.stats.editionsAccueillies, label: t("gallery.editions") },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <CountUp
                            value={s.n}
                            className="font-display block text-2xl text-white"
                          />
                          <span className="mt-1 block text-[10px] uppercase tracking-wider text-white/45">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Mot institutionnel — portrait officiel grand format */}
              {mot && (
                <Reveal delay={0.12}>
                  <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl">
                    <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-ci-orange via-white/80 to-ci-green" />

                    {mot.photo && (
                      <div className="dark-section relative aspect-[4/3] overflow-hidden bg-[#111214]">
                        <Image
                          src={mot.photo}
                          alt={mot.auteur}
                          fill
                          sizes="(max-width: 1024px) 100vw, 440px"
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <p className="font-display text-xl uppercase text-white">
                            {mot.auteur}
                          </p>
                          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/65">
                            {mot.fonction}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <Quote size={24} className="text-blue" />
                      <p className="mt-3 flex-1 text-sm sm:text-[15px] italic leading-relaxed text-white/85">
                        « {mot.texte} »
                      </p>
                      {!mot.photo && (
                        <div className="mt-5 border-t border-white/8 pt-4">
                          <p className="text-sm font-bold text-white">{mot.auteur}</p>
                          <p className="text-xs text-white/50">{mot.fonction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Sections de photos */}
        {galleryCommune.sections.map((section) => {
          const imgs = [...imagesOf(section.key), ...(extra[section.key] ?? [])];
          if (imgs.length === 0) return null;
          return (
            <section key={section.key} className="pb-14">
              <Reveal>
                <h2 className="font-display text-2xl uppercase tracking-wide text-white">
                  {section.title}
                </h2>
                <div className="accent-bar mt-3 mb-7" />
              </Reveal>
              <GalleryGrid images={imgs} alt={section.title} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
