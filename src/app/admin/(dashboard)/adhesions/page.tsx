"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, Trash2, Mail, Phone } from "lucide-react";

interface Membership {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  commune: string;
  club?: string;
  message?: string;
  status: "en attente" | "approuvée" | "refusée";
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  club: "Affiliation club",
  athlete: "Athlète",
  benevole: "Bénévole",
  soutien: "Soutien / Mécène",
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function AdhesionsPage() {
  const [items, setItems] = useState<Membership[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/memberships");
    setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: Membership["status"]) => {
    setBusy(id);
    await fetch("/api/admin/memberships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setBusy(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    setBusy(id);
    const res = await fetch("/api/admin/memberships", {
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

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl uppercase text-white">Adhésions AIB</h1>
      <p className="mt-1 text-sm text-muted">
        Demandes reçues via l&apos;espace « Rejoindre l&apos;AIB » du site public.
      </p>

      <div className="mt-8 space-y-4">
        {items === null ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-light" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-light rounded-xl px-6 py-16 text-center">
            <p className="text-sm text-white/50">
              Aucune demande pour l&apos;instant. Remplissez le formulaire
              «&nbsp;Rejoindre l&apos;AIB&nbsp;» sur le site public pour tester le flux.
            </p>
          </div>
        ) : (
          items.map((m) => (
            <div key={m.id} className="glass-light rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-base font-bold text-white">{m.name}</h2>
                    <span className="rounded-full bg-blue/12 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-light">
                      {typeLabels[m.type] ?? m.type}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        m.status === "approuvée"
                          ? "bg-ci-green/15 text-ci-green"
                          : m.status === "refusée"
                            ? "bg-red/15 text-red"
                            : "bg-gold/15 text-gold"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={12} className="text-blue-light" />
                      {m.email}
                    </span>
                    <span className="tabular inline-flex items-center gap-1.5">
                      <Phone size={12} className="text-blue-light" />
                      {m.phone}
                    </span>
                    <span>Commune : {m.commune}</span>
                    {m.club && <span>Club : {m.club}</span>}
                    <span>Reçue le {dateFmt.format(new Date(m.createdAt))}</span>
                  </p>
                  {m.message && (
                    <p className="mt-3 max-w-2xl rounded-lg bg-white/[0.04] px-4 py-3 text-sm italic leading-relaxed text-white/70">
                      « {m.message} »
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {m.status !== "approuvée" && (
                    <button
                      onClick={() => setStatus(m.id, "approuvée")}
                      disabled={busy === m.id}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-ci-green/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ci-green transition-colors hover:bg-ci-green/25"
                    >
                      <Check size={14} />
                      Approuver
                    </button>
                  )}
                  {m.status !== "refusée" && (
                    <button
                      onClick={() => setStatus(m.id, "refusée")}
                      disabled={busy === m.id}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-red/12 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red transition-colors hover:bg-red/20"
                    >
                      <X size={14} />
                      Refuser
                    </button>
                  )}
                  <button
                    onClick={() => remove(m.id)}
                    disabled={busy === m.id}
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-red/10 hover:text-red"
                    aria-label="Supprimer la demande"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
