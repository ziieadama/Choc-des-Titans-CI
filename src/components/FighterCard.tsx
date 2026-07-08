import Image from "next/image";
import Link from "next/link";
import { MapPin, Crown } from "lucide-react";
import type { Fighter } from "@/data/types";
import type { Locale } from "@/lib/i18n";

/** Carte combattant style roster UFC : photo plein cadre, dégradé, record. */
export default function FighterCard({
  fighter,
  locale = "fr",
}: {
  fighter: Fighter;
  locale?: Locale;
}) {
  const { wins, losses, draws } = fighter.record;
  const [w, l, d] = locale === "en" ? ["W", "L", "D"] : ["V", "D", "N"];
  return (
    <Link
      href={`/combattants/${fighter.slug}`}
      className="dark-section group relative block aspect-[3/4] overflow-hidden rounded-xl bg-[#16181b]"
    >
      <Image
        src={fighter.photo}
        alt={fighter.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {fighter.champion && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-gold/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
          <Crown size={11} />
          Champion
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-light">
          {fighter.weightClass}
        </p>
        <h3 className="font-display mt-1 text-xl uppercase leading-tight text-white">
          {fighter.name}
        </h3>
        {fighter.nickname && (
          <p className="text-xs italic text-white/60">« {fighter.nickname} »</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
            <MapPin size={11} />
            {fighter.commune}
          </span>
          <span className="tabular rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white">
            {wins}{w} - {losses}{l}
            {draws > 0 && ` - ${draws}${d}`}
          </span>
        </div>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-red to-blue transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
