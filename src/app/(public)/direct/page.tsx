import type { Metadata } from "next";
import { loadSettings, loadEditions, pickNextStage } from "@/lib/store";
import LiveExperience from "./LiveExperience";

export const metadata: Metadata = {
  title: "Le Direct — Pay-Per-View",
  description:
    "Regardez les combats du Choc des Titans en direct : Pass Soirée, Pass Édition ou Pass VIP Digital. Paiement Orange Money, MTN MoMo, Moov Money, Wave et carte bancaire.",
};

export const dynamic = "force-dynamic";

export default async function DirectPage() {
  const [settings, editions] = await Promise.all([loadSettings(), loadEditions()]);
  const stage = pickNextStage(editions);

  return (
    <LiveExperience
      liveMode={settings.liveMode}
      liveTitle={settings.liveTitle}
      prices={settings.prices}
      nextStage={
        stage
          ? { name: stage.name, date: stage.date, venue: stage.venue, cover: stage.cover }
          : null
      }
    />
  );
}
