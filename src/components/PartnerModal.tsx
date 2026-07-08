"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Quote, CalendarCheck, UserRound } from "lucide-react";
import type { Partner } from "@/data/types";
import { useLocale } from "./LocaleProvider";
import type { DictKey } from "@/lib/i18n";

/** Vignette logo / monogramme d'un partenaire. */
export function PartnerBadge({
  partner,
  size = 48,
  className = "",
}: {
  partner: Partner;
  size?: number;
  className?: string;
}) {
  if (partner.logo) {
    return (
      <span
        className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-full w-full object-contain p-1.5"
          loading="lazy"
        />
      </span>
    );
  }
  return (
    <span
      className={`font-display inline-flex items-center justify-center rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: "#ffffff",
        background: `linear-gradient(135deg, ${partner.color}, ${partner.color}88)`,
      }}
    >
      {partner.initials}
    </span>
  );
}

const tierKey: Record<Partner["tier"], DictKey> = {
  titan: "partners.titanPartner",
  or: "partners.goldPartner",
  officiel: "partners.officialPartner",
};

/** Modal détail partenaire (représentant, mot de la marque, lien CDT). */
export default function PartnerModal({
  partner,
  onClose,
}: {
  partner: Partner | null;
  onClose: () => void;
}) {
  const { t } = useLocale();
  return (
    <AnimatePresence>
      {partner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={partner.name}
            className="glass relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[85dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <PartnerBadge partner={partner} size={64} className="shrink-0 rounded-xl" />
              <div>
                <h3 className="font-display text-xl uppercase text-white">{partner.name}</h3>
                <p className="text-xs uppercase tracking-wider text-blue-light">
                  {t(`partners.cat.${partner.category}` as DictKey)} · {t(tierKey[partner.tier])}
                </p>
              </div>
            </div>

            <blockquote className="relative mt-6 rounded-xl bg-white/5 p-5">
              <Quote size={18} className="absolute -top-2 left-4 text-blue" />
              <p className="text-sm italic leading-relaxed text-white/85">
                « {partner.message} »
              </p>
            </blockquote>

            {(partner.representative || partner.role) && (
              <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
                <UserRound size={15} className="text-blue-light shrink-0" />
                <span>
                  {partner.representative && (
                    <strong className="text-white">{partner.representative}</strong>
                  )}
                  {partner.representative && partner.role && " — "}
                  {partner.role}
                </span>
              </p>
            )}

            <p className="mt-4 text-sm leading-relaxed text-muted">{partner.about}</p>

            {partner.since && (
              <p className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-white/50">
                <CalendarCheck size={14} className="text-blue-light" />
                {t("partners.since")} {partner.since}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
