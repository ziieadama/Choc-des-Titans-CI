import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";
import { galleryEditions, galleryCollections, communePhotoCount } from "@/data/galleryStructure";
import { imagesOf } from "@/data/gallery";
import { getT } from "@/lib/locale-server";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Galerie photos",
  description:
    "Toutes les photos officielles du Choc des Titans : éditions, communes, combats et coulisses.",
};

export default async function GaleriePage() {
  const { t } = await getT();
  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={t("gallery.kicker")}
          title={t("gallery.title")}
          description={t("gallery.desc")}
        />

        {/* Éditions */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {galleryEditions.map((ed, i) => {
            const total = ed.communes.reduce((acc, c) => acc + communePhotoCount(c), 0);
            return (
              <Reveal key={ed.editionSlug} delay={i * 0.1}>
                <Link
                  href={`/galerie/${ed.editionSlug}`}
                  className="dark-section group relative block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={ed.cover}
                      alt={ed.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="inline-flex items-center gap-1.5 rounded bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Camera size={11} />
                      {total} {t("common.photos")}
                    </span>
                    <h2 className="font-display mt-3 text-3xl sm:text-4xl uppercase text-white">
                      {ed.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">{ed.year} · {ed.communes.length} commune{ed.communes.length > 1 ? "s" : ""}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-light transition-colors group-hover:text-white">
                      {t("gallery.explore")}
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Collections transverses */}
        <div className="mt-14">
          <Reveal>
            <h2 className="font-display text-2xl uppercase tracking-wide text-white/85">
              {t("gallery.aroundRing")}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {galleryCollections.map((c, i) => (
              <Reveal key={c.key} delay={i * 0.08}>
                <Link
                  href={`/galerie/collection/${c.key.split("/")[1]}`}
                  className="group glass-light flex items-center gap-5 overflow-hidden rounded-xl p-4 transition-all hover:border-white/20 hover:-translate-y-0.5"
                >
                  <span className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={c.cover}
                      alt={c.title}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-white transition-colors group-hover:text-blue-light">
                      {c.title}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      {c.description}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/40">
                      <Camera size={12} />
                      {imagesOf(c.key).length} {t("common.photos")}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
