"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Partner } from "@/data/types";
import PartnerModal from "./PartnerModal";

/**
 * Nuage de partenaires : les logos apparaissent BRUTS, sans cadre ni fond,
 * posés naturellement sur la page. Disposition aléatoire à chaque visite,
 * taille proportionnelle à la portée (`reach`), flottement doux et zoom au
 * survol. Monogramme discret pour les partenaires sans logo.
 */
export default function PartnerLogoCloud({ partners }: { partners: Partner[] }) {
  const [selected, setSelected] = useState<Partner | null>(null);

  // Mélange aléatoire côté client, stable pour la durée de la visite
  const shuffled = useMemo(() => {
    const arr = [...partners];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [partners]);

  // reach 10-100 → hauteur de logo 34-92 px
  const sizeOf = (p: Partner) => {
    const reach = Math.min(Math.max(p.reach ?? 40, 10), 100);
    return Math.round(30 + (reach / 100) * 62);
  };

  // Agrandissement au survol proportionnel à la portée du partenariat :
  // reach 10 → ×1.10 · reach 50 → ×1.24 · reach 100 → ×1.42
  const hoverScaleOf = (p: Partner) => {
    const reach = Math.min(Math.max(p.reach ?? 40, 10), 100);
    return 1.06 + (reach / 100) * 0.36;
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-9 sm:gap-x-14">
        {shuffled.map((p, i) => {
          const h = sizeOf(p);
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 24, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 200,
                delay: (i % 10) * 0.05,
              }}
              whileHover={{
                scale: hoverScaleOf(p),
                rotate: (i % 2 ? 1 : -1) * 1.5,
                zIndex: 5,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(p)}
              title={p.name}
              aria-label={`${p.name} — détails du partenaire`}
              className="group relative cursor-pointer"
            >
              <span
                className="animate-logo-float block"
                style={{
                  animationDelay: `${(i % 7) * 0.6}s`,
                  animationDuration: `${4.5 + (i % 5) * 0.7}s`,
                }}
              >
                {p.logo ? (
                  // Logo brut, sans cadre : il vit directement sur la page
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logo}
                    alt={p.name}
                    loading="lazy"
                    className="logo-raw object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_6px_20px_rgba(38,111,179,0.35)]"
                    style={{ height: h, width: "auto", maxWidth: h * 2.6 }}
                  />
                ) : (
                  // Sans logo : monogramme typographique épuré, sans bloc
                  <span
                    className="font-display inline-flex items-baseline gap-1 leading-none tracking-wide transition-all duration-300 group-hover:drop-shadow-[0_6px_20px_rgba(38,111,179,0.35)]"
                    style={{ fontSize: h * 0.62, color: p.color }}
                  >
                    {p.initials}
                  </span>
                )}
              </span>
              {p.tier === "titan" && (
                <span
                  className="absolute -right-3 -top-2 text-gold"
                  style={{ fontSize: Math.max(h * 0.22, 12) }}
                  aria-hidden
                >
                  ★
                </span>
              )}
              {/* Nom au survol, discret */}
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {p.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <PartnerModal partner={selected} onClose={() => setSelected(null)} />
    </>
  );
}
