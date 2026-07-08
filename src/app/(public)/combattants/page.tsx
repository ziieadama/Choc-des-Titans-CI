import type { Metadata } from "next";
import { loadFighters } from "@/lib/store";
import FightersGrid from "./FightersGrid";

export const metadata: Metadata = {
  title: "Les combattants",
  description:
    "Champions, challengers et révélations : le roster officiel du Choc des Titans.",
};

export const dynamic = "force-dynamic";

export default async function CombattantsPage() {
  const fighters = await loadFighters();
  return <FightersGrid fighters={fighters} />;
}
