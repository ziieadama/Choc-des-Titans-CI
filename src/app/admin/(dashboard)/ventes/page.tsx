"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, RefreshCw } from "lucide-react";
import { formatFcfa } from "@/data/site";

interface Order {
  id: string;
  offerName: string;
  amount: number;
  method: string;
  phone?: string;
  status: "payée" | "en attente" | "remboursée";
  createdAt: string;
}

const statusCls: Record<Order["status"], string> = {
  payée: "bg-ci-green/15 text-ci-green",
  "en attente": "bg-gold/15 text-gold",
  remboursée: "bg-red/15 text-red",
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function VentesPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/orders");
    setOrders(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: Order["status"]) => {
    setBusy(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setBusy(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement cette commande ?")) return;
    setBusy(id);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      alert(d?.error ?? "Suppression impossible.");
    }
    await load();
    setBusy(null);
  };

  const total = orders
    ?.filter((o) => o.status === "payée")
    .reduce((acc, o) => acc + o.amount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Ventes PPV</h1>
          <p className="mt-1 text-sm text-muted">
            Commandes de pass effectuées sur la plateforme (paiements simulés).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total !== undefined && (
            <span className="tabular rounded-lg bg-ci-green/12 px-4 py-2 text-sm font-bold text-ci-green">
              {formatFcfa(total)} encaissés
            </span>
          )}
          <button
            onClick={load}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
          >
            <RefreshCw size={13} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="glass-light mt-8 overflow-x-auto rounded-xl">
        {orders === null ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-light" />
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-white/50">
              Aucune vente enregistrée. Effectuez un achat test depuis la page
              «&nbsp;Le direct&nbsp;» du site public : il apparaîtra ici instantanément.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 text-[11px] uppercase tracking-wider text-white/40">
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Pass</th>
                <th className="px-5 py-4 font-semibold">Montant</th>
                <th className="px-5 py-4 font-semibold">Paiement</th>
                <th className="px-5 py-4 font-semibold">Téléphone</th>
                <th className="px-5 py-4 font-semibold">Statut</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-white/60">
                    {dateFmt.format(new Date(o.createdAt))}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-white">{o.offerName}</td>
                  <td className="tabular px-5 py-3.5 font-bold text-white">
                    {formatFcfa(o.amount)}
                  </td>
                  <td className="px-5 py-3.5 capitalize text-white/60">{o.method}</td>
                  <td className="tabular px-5 py-3.5 text-white/60">{o.phone ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.status}
                      disabled={busy === o.id}
                      onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                      className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none ${statusCls[o.status]}`}
                    >
                      <option value="payée">Payée</option>
                      <option value="en attente">En attente</option>
                      <option value="remboursée">Remboursée</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => remove(o.id)}
                      disabled={busy === o.id}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-red/10 hover:text-red"
                      aria-label="Supprimer la commande"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
