import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadNews } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import { dateLocale } from "@/lib/i18n";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Résultats, annonces, interviews et vie de l'AIB : toute l'actualité du Choc des Titans.",
};

export const dynamic = "force-dynamic";

const categoryColor: Record<string, string> = {
  Résultats: "bg-red",
  Annonce: "bg-blue",
  AIB: "bg-ci-orange",
  Interview: "bg-ci-green",
  Partenariat: "bg-gold text-black",
};

export default async function ActualitesPage() {
  const { locale, t } = await getT();
  const dateFmt = new Intl.DateTimeFormat(dateLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const news = await loadNews();
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={t("news.kicker")}
          title={t("news.title")}
          description={t("news.desc")}
        />

        {featured && (
          <Reveal delay={0.1} className="mt-12">
            <Link
              href={`/actualites/${featured.slug}`}
              className="dark-section group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                <span
                  className={`inline-block rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${
                    categoryColor[featured.category] ?? "bg-blue"
                  }`}
                >
                  {featured.category}
                </span>
                <h2 className="mt-3 max-w-3xl text-2xl sm:text-4xl font-bold leading-tight text-white transition-colors group-hover:text-blue-light">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/65 line-clamp-2">
                  {featured.excerpt}
                </p>
                <time className="mt-3 block text-xs uppercase tracking-wider text-white/40">
                  {dateFmt.format(new Date(featured.date))}
                </time>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <Link
                href={`/actualites/${a.slug}`}
                className="group block h-full overflow-hidden rounded-xl glass-light transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={a.cover}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${
                      categoryColor[a.category] ?? "bg-blue"
                    }`}
                  >
                    {a.category}
                  </span>
                </div>
                <div className="p-5">
                  <time className="text-[11px] uppercase tracking-wider text-white/40">
                    {dateFmt.format(new Date(a.date))}
                  </time>
                  <h3 className="mt-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-blue-light line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                    {a.excerpt}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
