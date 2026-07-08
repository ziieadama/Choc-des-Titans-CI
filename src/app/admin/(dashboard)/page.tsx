import Link from "next/link";
import {
  Ticket,
  Users,
  Newspaper,
  Radio,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  loadOrders,
  loadMemberships,
  loadNews,
  loadSettings,
} from "@/lib/store";
import { formatFcfa } from "@/data/site";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminDashboard() {
  const [orders, memberships, news, settings] = await Promise.all([
    loadOrders(),
    loadMemberships(),
    loadNews(),
    loadSettings(),
  ]);

  const paid = orders.filter((o) => o.status === "payée");
  const revenue = paid.reduce((acc, o) => acc + o.amount, 0);
  const pendingMemberships = memberships.filter((m) => m.status === "en attente");

  // Revenus des 7 derniers jours pour le mini-graphe
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const total = paid
      .filter((o) => o.createdAt.slice(0, 10) === key)
      .reduce((acc, o) => acc + o.amount, 0);
    return {
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      total,
    };
  });
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  const stats = [
    {
      icon: TrendingUp,
      label: "Revenus PPV (payés)",
      value: formatFcfa(revenue),
      sub: `${paid.length} commande${paid.length > 1 ? "s" : ""}`,
      href: "/admin/ventes",
      accent: "text-ci-green bg-ci-green/12",
    },
    {
      icon: Ticket,
      label: "Ventes totales",
      value: String(orders.length),
      sub: "toutes commandes",
      href: "/admin/ventes",
      accent: "text-blue-light bg-blue/12",
    },
    {
      icon: Users,
      label: "Adhésions en attente",
      value: String(pendingMemberships.length),
      sub: `${memberships.length} demande${memberships.length > 1 ? "s" : ""} au total`,
      href: "/admin/adhesions",
      accent: "text-ci-orange bg-ci-orange/12",
    },
    {
      icon: Newspaper,
      label: "Articles publiés",
      value: String(news.length),
      sub: "sur la plateforme",
      href: "/admin/actualites",
      accent: "text-gold bg-gold/12",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-sm text-muted">
            Pilotage de la plateforme Choc des Titans.
          </p>
        </div>
        <Link
          href="/admin/parametres"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
            settings.liveMode
              ? "bg-red/15 text-red"
              : "bg-white/8 text-white/60 hover:bg-white/12"
          }`}
        >
          <Radio size={14} className={settings.liveMode ? "live-dot rounded-full" : ""} />
          {settings.liveMode ? "LIVE en cours" : "Live désactivé"}
        </Link>
      </div>

      {/* Cartes stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group glass-light rounded-xl p-5 transition-all hover:border-white/20 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.accent}`}>
                <s.icon size={18} />
              </span>
              <ArrowUpRight
                size={15}
                className="text-white/25 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="font-display tabular mt-4 text-2xl text-white">{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/50">
              {s.label}
            </p>
            <p className="mt-1 text-[11px] text-white/35">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {/* Graphe revenus 7 jours */}
        <div className="glass-light rounded-xl p-6 lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Revenus PPV — 7 derniers jours
          </h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {days.map((d, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] tabular text-white/40">
                  {d.total > 0 ? `${Math.round(d.total / 1000)}k` : ""}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-dark to-blue-light transition-all"
                  style={{
                    height: `${Math.max((d.total / maxDay) * 78, d.total > 0 ? 8 : 2)}%`,
                    opacity: d.total > 0 ? 1 : 0.25,
                  }}
                />
                <span className="text-[10px] uppercase text-white/40">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières ventes */}
        <div className="glass-light rounded-xl p-6 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Dernières ventes
          </h2>
          {orders.length === 0 ? (
            <p className="mt-6 text-sm text-white/40">
              Aucune vente pour le moment. Les achats de pass effectués sur la page
              « Le direct » apparaîtront ici.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/6">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-white">{o.offerName}</p>
                    <p className="text-[11px] text-white/40">
                      {dateFmt.format(new Date(o.createdAt))} · {o.method}
                    </p>
                  </div>
                  <span className="tabular text-sm font-bold text-ci-green">
                    {formatFcfa(o.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dernières adhésions */}
      <div className="glass-light mt-4 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Dernières demandes d&apos;adhésion AIB
          </h2>
          <Link
            href="/admin/adhesions"
            className="text-xs font-bold uppercase tracking-wider text-blue-light hover:text-white"
          >
            Tout voir
          </Link>
        </div>
        {memberships.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">
            Aucune demande pour le moment. Les demandes envoyées via « Rejoindre
            l&apos;AIB » apparaîtront ici.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-white/40">
                  <th className="pb-3 font-semibold">Nom</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Commune</th>
                  <th className="pb-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {memberships.slice(0, 5).map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 font-semibold text-white">{m.name}</td>
                    <td className="py-3 capitalize text-white/60">{m.type}</td>
                    <td className="py-3 text-white/60">{m.commune}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          m.status === "approuvée"
                            ? "bg-ci-green/15 text-ci-green"
                            : m.status === "refusée"
                              ? "bg-red/15 text-red"
                              : "bg-gold/15 text-gold"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
