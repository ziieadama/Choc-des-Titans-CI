import type { Metadata } from "next";
import MembershipForm from "./MembershipForm";

export const metadata: Metadata = {
  title: "Rejoindre l'AIB",
  description:
    "Affiliez votre club, devenez athlète licencié, bénévole ou soutien de l'Association Ivoirienne de Boxe.",
};

export default function RejoindrePage() {
  return <MembershipForm />;
}
