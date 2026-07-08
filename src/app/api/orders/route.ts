import { NextResponse } from "next/server";
import { loadOrders, saveOrders, loadSettings, uid, type Order } from "@/lib/store";
import { ppvOffers } from "@/data/site";

/** Création d'une commande PPV (paiement simulé pour la version test). */
export async function POST(req: Request) {
  let body: { offerId?: string; method?: string; phone?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const offer = ppvOffers.find((o) => o.id === body.offerId);
  if (!offer || !body.method) {
    return NextResponse.json({ error: "Offre ou moyen de paiement invalide." }, { status: 400 });
  }
  const phone = (body.phone ?? "").replace(/[^\d+ ]/g, "").slice(0, 20);
  if (body.method !== "card" && phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }

  const settings = await loadSettings();
  const amount = settings.prices[offer.id] ?? offer.price;

  const order: Order = {
    id: uid(),
    offerId: offer.id,
    offerName: offer.name,
    amount,
    method: String(body.method).slice(0, 30),
    phone: phone || undefined,
    email: body.email ? String(body.email).slice(0, 120) : undefined,
    status: "payée", // paiement simulé : validation immédiate
    createdAt: new Date().toISOString(),
  };

  const orders = await loadOrders();
  orders.unshift(order);
  await saveOrders(orders);

  return NextResponse.json({ ok: true, orderId: order.id, amount });
}
