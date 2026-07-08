"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Partner } from "@/data/types";
import PartnerModal, { PartnerBadge } from "./PartnerModal";

/**
 * Nuage de partenaires : disposition aléatoire (mélange à chaque visite),
 * taille des logos proportionnelle à la portée (`reach`) du partenariat.
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

  // reach 10-100 → taille de tuile 64-148 px
  const sizeOf = (p: Partner) => {
    const reach = Math.min(Math.max(p.reach ?? 40, 10), 100);
    return Math.round(56 + (reach / 100) * 92);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {shuffled.map((p, i) => {
          const size = sizeOf(p);
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 220,
                delay: (i % 12) * 0.045,
              }}
              whileHover={{ scale: 1.09, rotate: (i % 2 ? 1 : -1) * 1.5, zIndex: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(p)}
              title={p.name}
              aria-label={`${p.name} — détails du partenaire`}
              className="group relative cursor-pointer"
            >
              <PartnerBadge
                partner={p}
                size={size}
                className="rounded-2xl shadow-card transition-shadow duration-300 group-hover:shadow-glow-blue"
              />
              {p.tier === "titan" && (
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-black text-black shadow">
                  ★
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <PartnerModal partner={selected} onClose={() => setSelected(null)} />
    </>
  );
}
