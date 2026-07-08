import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { loadNews } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import { dateLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import SocialRow from "@/components/SocialRow";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await loadNews();
  const article = news.find((n) => n.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, t } = await getT();
  const dateFmt = new Intl.DateTimeFormat(dateLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const news = await loadNews();
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  const others = news.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero article */}
      <section className="dark-section hero-vignette relative flex min-h-[60dvh] items-end overflow-hidden bg-[#0b0b0b]">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 pb-12 pt-32">
          <Reveal>
            <Link
              href="/actualites"
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white"
            >
              <ChevronLeft size={14} />
              {t("news.allNews")}
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="inline-block rounded bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {article.category}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-bold leading-tight text-white">
              {article.title}
            </h1>
            <time className="mt-4 block text-sm text-white/50">
              {dateFmt.format(new Date(article.date))}
            </time>
          </Reveal>
        </div>
      </section>

      {/* Corps */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <Reveal>
          <p className="text-lg leading-relaxed text-white/85 font-medium">
            {article.excerpt}
          </p>
        </Reveal>
        <div className="mt-8 space-y-6">
          {article.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="text-base leading-relaxed text-white/70">{p}</p>
            </Reveal>
          ))}
        </div>

        {/* Suivre le CDT */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-xl glass-light p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold uppercase tracking-wider text-white/70">
              {locale === "en" ? "Follow the Clash of the Titans" : "Suivez le Choc des Titans"}
            </p>
            <SocialRow size="sm" />
          </div>
        </Reveal>
      </article>

      {/* À lire aussi */}
      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          <Reveal>
            <h2 className="font-display text-2xl uppercase tracking-wide text-white">
              {t("news.readAlso")}
            </h2>
            <div className="accent-bar mt-3" />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {others.map((a, i) => (
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
                    <h3 className="text-sm font-bold leading-snug text-white transition-colors group-hover:text-blue-light line-clamp-2">
                      {a.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-light">
                      {t("common.readMore")}
                      <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
