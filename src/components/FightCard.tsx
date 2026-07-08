import Image from "next/image";
import Link from "next/link";
import { Trophy, Zap, Coins } from "lucide-react";
import type { Fight, Fighter } from "@/data/types";
import { fighters as fightersSeed } from "@/data/fighters";
import { formatFcfa } from "@/data/site";
import { makeT, type Locale } from "@/lib/i18n";

/**
 * Carte résultat photo-forward : les deux boxeurs en grand, duel rouge/bleu,
 * vainqueur mis en lumière (ruban or, adversaire estompé) et prime affichée.
 */
export default function FightCard({
  fight,
  purse,
  locale = "fr",
  fightersBySlug,
}: {
  fight: Fight;
  purse?: number;
  locale?: Locale;
  /** Roster à jour (store) ; retombe sur les données seed à défaut. */
  fightersBySlug?: Record<string, Fighter>;
}) {
  const t = makeT(locale);
  const lookup = (slug: string) =>
    fightersBySlug?.[slug] ?? fightersSeed.find((f) => f.slug === slug);
  const red = lookup(fight.red);
  const blue = lookup(fight.blue);
  if (!red || !blue) return null;

  const side = (fighter: NonNullable<typeof red>, corner: "red" | "blue") => {
    const isWinner = fight.winner === fighter.slug;
    const hasWinner = Boolean(fight.winner);
    return (
      <Link
        href={`/combattants/${fighter.slug}`}
        className="group/side relative block flex-1 overflow-hidden"
        aria-label={fighter.name}
      >
        <div className="relative aspect-[3/4] sm:aspect-[4/5]">
          <Image
            src={fighter.photo}
            alt={fighter.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-all duration-500 group-hover/side:scale-105 ${
              hasWinner && !isWinner ? "grayscale-[45%] brightness-[0.75]" : ""
            }`}
          />
          {/* Teinte coin */}
          <div
            className={`absolute inset-0 mix-blend-multiply ${
              corner === "red"
                ? "bg-gradient-to-tr from-red-dark/60 via-transparent to-transparent"
                : "bg-gradient-to-tl from-blue-dark/60 via-transparent to-transparent"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

          {/* Liseré vainqueur */}
          {isWinner && (
            <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-gold/80" />
          )}

          {/* Ruban vainqueur */}
          {isWinner && (
            <span className="absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gold px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-black shadow-lg">
              <Trophy size={10} />
              {t("common.winner")}
            </span>
          )}

          {/* Identité */}
          <div
            className={`absolute inset-x-0 bottom-0 p-3 sm:p-4 ${
              corner === "blue" ? "text-right" : ""
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                corner === "red" ? "text-red" : "text-blue-light"
              }`}
            >
              {corner === "red" ? t("common.redCorner") : t("common.blueCorner")}
            </p>
            <h4 className="font-display mt-0.5 text-base sm:text-xl uppercase leading-tight text-white transition-colors group-hover/side:text-blue-light">
              {fighter.name}
            </h4>
            <p className="text-[11px] text-white/55">
              {fighter.commune} · {fighter.record.wins}
              {locale === "en" ? "W" : "V"}-{fighter.record.losses}
              {locale === "en" ? "L" : "D"}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <article className="group overflow-hidden rounded-2xl glass-light transition-all duration-300 hover:border-white/25 hover:shadow-card">
      {/* Bandeau catégorie */}
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-light">
          {fight.weightClass}
          {fight.female && ` · ${t("common.female")}`}
        </span>
        {fight.method && (
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              fight.method === "K.O" ? "bg-red/15 text-red" : "bg-white/10 text-white/70"
            }`}
          >
            {fight.method === "K.O" && <Zap size={10} />}
            {fight.method}
          </span>
        )}
      </div>

      {/* Duel photo */}
      <div className="dark-section relative flex">
        {side(red, "red")}

        {/* Séparateur VS */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        <span className="font-display pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          <span className="text-red">V</span>
          <span className="text-blue-light">S</span>
        </span>

        {side(blue, "blue")}
      </div>

      {/* Pied : prime + récit */}
      <div className="px-4 py-3.5 sm:px-5">
        {purse !== undefined && purse > 0 && (
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold">
            <Coins size={12} />
            {t("common.purse")} : {formatFcfa(purse)}
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted line-clamp-2">{fight.story}</p>
      </div>
    </article>
  );
}
