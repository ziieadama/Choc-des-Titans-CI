import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { galleryCollections } from "@/data/galleryStructure";
import { imagesOf } from "@/data/gallery";
import { loadGalleryExtra } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return galleryCollections.map((c) => ({ slug: c.key.split("/")[1] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = galleryCollections.find((c) => c.key.endsWith(slug));
  if (!col) return {};
  return { title: `Galerie — ${col.title}`, description: col.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getT();
  const col = galleryCollections.find((c) => c.key.endsWith(slug));
  if (!col) notFound();

  const extra = await loadGalleryExtra();
  const imgs = [...imagesOf(col.key), ...(extra[col.key] ?? [])];

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
          kicker={`${imgs.length} ${t("common.photos")}`}
          title={col.title}
          description={col.description}
        />
        <div className="mt-10">
          <GalleryGrid images={imgs} alt={col.title} />
        </div>
      </div>
    </div>
  );
}
