import type { Metadata } from "next";
import { loadPartners } from "@/lib/store";
import { getT } from "@/lib/locale-server";
import { partnerCategories } from "@/data/partners";
import SectionHeader from "@/components/SectionHeader";
import PartnerWall from "@/components/PartnerWall";
import Reveal from "@/components/Reveal";
import { Handshake } from "lucide-react";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Nos partenaires",
  description:
    "Institutions, marques et collectivités : découvrez la trentaine de partenaires qui portent le Choc des Titans et l'AIB.",
};

export const dynamic = "force-dynamic";

export default async function PartenairesPage() {
  const { t } = await getT();
  const partners = await loadPartners();

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={t("partners.kicker")}
          title={t("partners.title")}
          description={t("partners.desc")}
        />

        <div className="mt-12">
          <PartnerWall partners={partners} categories={partnerCategories} />
        </div>

        {/* Devenir partenaire */}
        <Reveal delay={0.15}>
          <div className="glass mt-16 flex flex-col items-center gap-6 rounded-2xl p-10 text-center sm:flex-row sm:text-left">
            <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue/15 text-blue-light">
              <Handshake size={30} />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-2xl uppercase text-white">
                {t("partners.become.title")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {t("partners.become.desc")}
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Devenir partenaire du Choc des Titans`}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-blue px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-95"
            >
              {t("partners.become.cta")}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
