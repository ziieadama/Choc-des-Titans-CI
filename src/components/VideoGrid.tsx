"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, Swords, Clapperboard } from "lucide-react";
import type { YtVideo } from "@/lib/youtube";
import { useLocale } from "./LocaleProvider";

/**
 * Grille de vidéos YouTube avec filtres (Combats / Coulisses) et lecteur
 * en modal (youtube-nocookie, aucune clé exposée côté client).
 */
export default function VideoGrid({
  videos,
  compact = false,
}: {
  videos: YtVideo[];
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const en = locale === "en";
  const [filter, setFilter] = useState<"all" | "combat" | "actu">("all");
  const [playing, setPlaying] = useState<YtVideo | null>(null);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  const shown = filter === "all" ? videos : videos.filter((v) => v.category === filter);
  const dateFmt = new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filters = [
    { id: "all" as const, label: en ? "All" : "Toutes", icon: null },
    { id: "combat" as const, label: en ? "Fights & recaps" : "Combats & résumés", icon: Swords },
    { id: "actu" as const, label: en ? "Behind the scenes" : "Coulisses & actus", icon: Clapperboard },
  ];

  return (
    <>
      {!compact && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filter === f.id
                  ? "bg-red text-white shadow-glow-red"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f.icon && <f.icon size={13} />}
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-4 sm:grid-cols-2 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-3"}`}>
        <AnimatePresence mode="popLayout">
          {shown.map((v, i) => (
            <motion.button
              key={v.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
              onClick={() => setPlaying(v)}
              className="group block cursor-pointer overflow-hidden rounded-xl glass-light text-left transition-all duration-300 hover:border-white/25 hover:-translate-y-1"
              aria-label={`${en ? "Play" : "Lire"} : ${v.title}`}
            >
              <div className="dark-section relative aspect-video overflow-hidden bg-[#111214]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {v.category === "combat" ? <Swords size={10} /> : <Clapperboard size={10} />}
                  {v.category === "combat"
                    ? en ? "Fight" : "Combat"
                    : en ? "Backstage" : "Coulisses"}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red/90 text-white shadow-glow-red transition-transform duration-300 group-hover:scale-110">
                    <Play size={22} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold leading-snug text-white transition-colors group-hover:text-blue-light line-clamp-2">
                  {v.title}
                </h3>
                {v.publishedAt && (
                  <time className="mt-1.5 block text-[11px] uppercase tracking-wider text-white/40">
                    {dateFmt.format(new Date(v.publishedAt))}
                  </time>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Lecteur modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setPlaying(null)}
          >
            <button
              onClick={() => setPlaying(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={en ? "Close" : "Fermer"}
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 22, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <div className="overflow-hidden rounded-2xl bg-black shadow-card">
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`}
                    title={playing.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
              <p className="mt-3 px-1 text-sm font-semibold text-white/85">{playing.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
