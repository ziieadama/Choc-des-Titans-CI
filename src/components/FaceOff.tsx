"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import type { Fight, Fighter } from "@/data/types";
import { fighters as fightersSeed } from "@/data/fighters";
import { formatFcfa } from "@/data/site";
import { useLocale } from "./LocaleProvider";

/**
 * Face-à-face principal style UFC : deux moitiés rouge/bleu qui glissent
 * l'une vers l'autre, VS central, records, prime du vainqueur.
 */
export default function FaceOff({
  fight,
  label,
  purse,
  fightersBySlug,
}: {
  fight: Fight;
  label?: string;
  purse?: number;
  fightersBySlug?: Record<string, Fighter>;
}) {
  const { t, locale } = useLocale();
  const lookup = (slug: string) =>
    fightersBySlug?.[slug] ?? fightersSeed.find((f) => f.slug === slug);
  const red = lookup(fight.red);
  const blue = lookup(fight.blue);
  if (!red || !blue) return null;

  const half = (fighter: NonNullable<typeof red>, side: "red" | "blue") => (
    <motion.div
      initial={{ opacity: 0, x: side === "red" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 overflow-hidden"
    >
      <Link href={`/combattants/${fighter.slug}`} className="group block">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
          <Image
            src={fighter.photo}
            alt={fighter.name}
            fill
            sizes="(max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 mix-blend-multiply opacity-60 ${
              side === "red"
                ? "bg-gradient-to-tr from-red-dark/80 via-transparent to-transparent"
                : "bg-gradient-to-tl from-blue-dark/80 via-transparent to-transparent"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div
            className={`absolute bottom-0 p-4 sm:p-6 ${
              side === "blue" ? "right-0 text-right" : "left-0"
            }`}
          >
            <p
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] ${
                side === "red" ? "text-red" : "text-blue-light"
              }`}
            >
              {side === "red" ? t("common.redCorner") : t("common.blueCorner")}
            </p>
            <h3 className="font-display mt-1 text-2xl sm:text-4xl uppercase leading-none text-white">
              {fighter.name.split(" ")[0]}
              <br />
              <span className="text-white/80">{fighter.name.split(" ").slice(1).join(" ")}</span>
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/60">
              {fighter.commune} · {fighter.record.wins}
              {locale === "en" ? "W" : "V"}-{fighter.record.losses}
              {locale === "en" ? "L" : "D"}
              {fighter.record.draws > 0 &&
                `-${fighter.record.draws}${locale === "en" ? "D" : "N"}`}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="dark-section relative">
      {label && (
        <div className="absolute left-1/2 top-4 z-20 flex max-w-[92%] -translate-x-1/2 flex-col items-center gap-2">
          <span className="truncate rounded-full bg-red px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-glow-red whitespace-nowrap">
            {label}
          </span>
          {purse !== undefined && purse > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
              <Coins size={11} />
              {t("common.purse")} : {formatFcfa(purse)}
            </span>
          )}
        </div>
      )}
      <div className="flex overflow-hidden rounded-2xl border border-white/5">
        {half(red, "red")}

        {/* VS central */}
        <div className="relative z-10 flex w-0 items-center justify-center">
          <motion.span
            initial={{ scale: 0, rotate: -12 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 12, stiffness: 160, delay: 0.35 }}
            className="font-display absolute select-none text-4xl sm:text-6xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
          >
            <span className="text-red">V</span>
            <span className="text-blue-light">S</span>
          </motion.span>
        </div>

        {half(blue, "blue")}
      </div>
    </div>
  );
}
