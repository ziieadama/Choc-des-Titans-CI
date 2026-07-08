import Link from "next/link";
import type { Partner } from "@/data/types";
import { PartnerBadge } from "./PartnerModal";

/** Bandeau défilant des partenaires (logos/monogrammes), pause au survol. */
export default function PartnerMarquee({ partners }: { partners: Partner[] }) {
  const doubled = [...partners, ...partners];
  return (
    <Link
      href="/partenaires"
      className="group block overflow-hidden py-2"
      aria-label="Partenaires"
    >
      <div className="animate-marquee flex w-max items-center gap-10">
        {doubled.map((p, i) => (
          <span
            key={p.id + i}
            className="flex items-center gap-3 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          >
            <PartnerBadge partner={p} size={38} className="rounded-md" />
            <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-white/70">
              {p.name}
            </span>
          </span>
        ))}
      </div>
    </Link>
  );
}
