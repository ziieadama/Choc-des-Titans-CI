import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/requireRole";
import { loadMemberships, saveMemberships } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await loadMemberships());
}

/** Approbation / refus d'une demande d'adhésion. */
export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !["en attente", "approuvée", "refusée"].includes(status)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }
  const all = await loadMemberships();
  const item = all.find((m) => m.id === id);
  if (!item) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  item.status = status;
  await saveMemberships(all);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireSuperadmin())) {
    return NextResponse.json(
      { error: "Action réservée au superadmin." },
      { status: 403 }
    );
  }
  const { id } = await req.json();
  const all = await loadMemberships();
  await saveMemberships(all.filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
