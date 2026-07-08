import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { galleryEditions, getGalleryEdition, communePhotoCount } from "@/data/galleryStructure";
import { getT } from "@/lib/locale-server";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";

export function generateStaticParams() {
  return galleryEditions.map((e) => ({ edition: e.editionSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ edition: string }>;
}): Promise<Metadata> {
  const { edition } = await params;
  const ed = getGalleryEdition(edition);
  if (!ed) return {};
  return { title: `Galerie — ${ed.title}`, description: ed.description };
}

export default async function GalerieEditionPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition } = await params;
  const { t } = await getT();
  const ed = getGalleryEdition(edition);
  if (!ed) notFound();

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href="/galerie"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white"
          >
            <ChevronLeft size={14} />
            {t("gallery.all")}
          </Link>
        </Reveal>

        <SectionHeader
          kicker={`${t("gallery.album")} ${ed.year}`}
          title={ed.title}
          description={ed.description}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ed.communes.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.07}>
              <Link
                href={`/galerie/${ed.editionSlug}/${c.slug}`}
                className="dark-section group relative block aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={c.cover}
                  alt={`Photos de ${c.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-light">
                    <MapPin size={12} />
                    {t("gallery.commune")}
                  </p>
                  <h2 className="font-display mt-1.5 text-2xl uppercase text-white">
                    {c.name}
                  </h2>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/55">
                      <Camera size={12} />
                      {communePhotoCount(c)} {t("common.photos")} · {c.sections.length} {t("gallery.series")}{c.sections.length > 1 ? "s" : ""}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-white/40 transition-all group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-red to-blue transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
