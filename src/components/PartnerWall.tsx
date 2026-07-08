"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Partner } from "@/data/types";
import type { DictKey } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";
import PartnerModal, { PartnerBadge } from "./PartnerModal";

const tierKey: Record<Partner["tier"], DictKey> = {
  titan: "partners.titanPartner",
  or: "partners.goldPartner",
  officiel: "partners.officialPartner",
};

/** Mur de partenaires filtrable : tuiles logo/monogramme + modal détail. */
export default function PartnerWall({
  partners,
  categories,
}: {
  partners: Partner[];
  categories: readonly string[];
}) {
  const { t } = useLocale();
  const [selected, setSelected] = useState<Partner | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const shown =
    filter === "all" ? partners : partners.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filtres */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["all", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              filter === c
                ? "bg-blue text-white shadow-glow-blue"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c === "all" ? t("partners.all") : t(`partners.cat.${c}` as DictKey)}
          </button>
        ))}
      </div>

      {/* Grille */}
      <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.button
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelected(p)}
              className="group glass-light cursor-pointer rounded-xl p-5 text-left transition-all duration-300 hover:border-white/25 hover:bg-white/5 hover:-translate-y-1"
              aria-label={p.name}
            >
              <PartnerBadge
                partner={p}
                size={52}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="mt-3 block text-sm font-bold leading-snug text-white">
                {p.name}
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-wider text-white/40">
                {t(`partners.cat.${p.category}` as DictKey)}
              </span>
              {p.tier === "titan" && (
                <span className="mt-2 inline-block rounded bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold">
                  {t("partners.titanPartner")}
                </span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <PartnerModal partner={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
