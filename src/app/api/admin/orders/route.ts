import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/requireRole";
import { loadOrders, saveOrders } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await loadOrders());
}

/** Mise à jour du statut d'une commande. */
export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !["payée", "en attente", "remboursée"].includes(status)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }
  const orders = await loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  order.status = status;
  await saveOrders(orders);
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
  const orders = await loadOrders();
  await saveOrders(orders.filter((o) => o.id !== id));
  return NextResponse.json({ ok: true });
}
