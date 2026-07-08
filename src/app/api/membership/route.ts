import { NextResponse } from "next/server";
import {
  loadMemberships,
  saveMemberships,
  uid,
  type MembershipRequest,
} from "@/lib/store";

/** Dépôt d'une demande d'adhésion / de soutien à l'AIB. */
export async function POST(req: Request) {
  let body: Partial<MembershipRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const types = ["club", "soutien", "benevole", "athlete"] as const;
  const type = types.find((t) => t === body.type);
  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 20);
  const commune = String(body.commune ?? "").trim().slice(0, 60);

  if (!type || name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 8 || !commune) {
    return NextResponse.json(
      { error: "Merci de remplir correctement tous les champs obligatoires." },
      { status: 400 }
    );
  }

  const request: MembershipRequest = {
    id: uid(),
    type,
    name,
    email,
    phone,
    commune,
    club: body.club ? String(body.club).slice(0, 80) : undefined,
    message: body.message ? String(body.message).slice(0, 600) : undefined,
    status: "en attente",
    createdAt: new Date().toISOString(),
  };

  const all = await loadMemberships();
  all.unshift(request);
  await saveMemberships(all);

  return NextResponse.json({ ok: true, id: request.id });
}
