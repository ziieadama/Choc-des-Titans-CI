"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Radio, BadgeCheck } from "lucide-react";
import { ppvOffers, formatFcfa } from "@/data/site";
import type { Edition, Fighter } from "@/data/types";

interface Settings {
  liveMode: boolean;
  liveTitle: string;
  prices: Record<string, number>;
  purses: Record<string, number>;
  youtubeChannel: string;
}



export default function AdminParametresPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [allFights, setAllFights] = useState<{ id: string; label: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings);
    Promise.all([
      fetch("/api/admin/editions").then((r) => r.json()),
      fetch("/api/admin/fighters").then((r) => r.json()),
    ]).then(([editions, fighters]: [Edition[], Fighter[]]) => {
      const byslug = Object.fromEntries(fighters.map((f) => [f.slug, f.name]));
      const current = editions.find((e) => e.status === "en cours") ?? editions[0];
      setAllFights(
        (current?.stages ?? []).flatMap((st) =>
          st.fights.map((f) => ({
            id: f.id,
            label: `${f.weightClass}${f.female ? " (F)" : ""} — ${byslug[f.red] ?? f.red} vs ${byslug[f.blue] ?? f.blue}`,
          }))
        )
      );
    });
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-blue";

  if (!settings) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl uppercase text-white">Paramètres & Live</h1>
      <p className="mt-1 text-sm text-muted">
        Pilotez le mode direct et la tarification des pass en temps réel.
      </p>

      {/* Mode Live */}
      <div
        className={`mt-8 rounded-2xl border p-7 transition-all ${
          settings.liveMode
            ? "border-red/50 bg-red/[0.06] shadow-glow-red"
            : "border-white/10 bg-white/[0.03]"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                settings.liveMode ? "bg-red/20 text-red" : "bg-white/8 text-white/50"
              }`}
            >
              <Radio size={22} className={settings.liveMode ? "live-dot rounded-full" : ""} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Mode direct</h2>
              <p className="text-sm text-muted">
                {settings.liveMode
                  ? "Le site affiche « EN DIRECT » sur la page Le direct."
                  : "Le site affiche le compte à rebours du prochain événement."}
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={settings.liveMode}
            onClick={() => setSettings({ ...settings, liveMode: !settings.liveMode })}
            className={`relative h-8 w-14 cursor-pointer rounded-full transition-colors ${
              settings.liveMode ? "bg-red" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
                settings.liveMode ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">
            Titre du direct
          </label>
          <input
            value={settings.liveTitle}
            onChange={(e) => setSettings({ ...settings, liveTitle: e.target.value })}
            className={`mt-2 ${inputCls}`}
            placeholder="CDT 7 — Étape 2 · Yopougon"
          />
        </div>
      </div>

      {/* Chaîne YouTube */}
      <div className="glass-light mt-6 rounded-2xl p-7">
        <h2 className="text-base font-bold text-white">Chaîne YouTube officielle</h2>
        <p className="mt-1 text-sm text-muted">
          Les vidéos publiées sur cette chaîne apparaissent automatiquement sur le
          site (page Vidéos + accueil), classées combats/coulisses d&apos;après leur
          titre et leur description. Synchronisation toutes les 15 minutes.
        </p>
        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">
            @handle, URL ou ID de chaîne
          </label>
          <input
            value={settings.youtubeChannel ?? ""}
            onChange={(e) => setSettings({ ...settings, youtubeChannel: e.target.value })}
            className={`mt-2 ${inputCls}`}
            placeholder="@chocdestitans"
          />
        </div>
      </div>

      {/* Tarifs */}
      <div className="glass-light mt-6 rounded-2xl p-7">
        <h2 className="text-base font-bold text-white">Tarification des pass (FCFA)</h2>
        <p className="mt-1 text-sm text-muted">
          Les nouveaux tarifs s&apos;appliquent immédiatement à la page « Le direct ».
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {ppvOffers.map((o) => (
            <div key={o.id}>
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                {o.name}
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={settings.prices[o.id] ?? o.price}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    prices: { ...settings.prices, [o.id]: Number(e.target.value) },
                  })
                }
                className={`mt-2 tabular ${inputCls}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Récompenses des combats */}
      <div className="glass-light mt-6 rounded-2xl p-7">
        <h2 className="text-base font-bold text-white">Récompenses des combats (FCFA)</h2>
        <p className="mt-1 text-sm text-muted">
          Prime du vainqueur par combat — affichée sur les cartes de résultats du
          site. De 100 000 à 2 000 000 FCFA selon le poids et l&apos;importance de
          l&apos;affiche.
        </p>
        <div className="mt-5 space-y-4">
          {allFights.map((f) => (
            <div key={f.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-white/75">{f.label}</span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={settings.purses?.[f.id] ?? 0}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      purses: { ...settings.purses, [f.id]: Number(e.target.value) },
                    })
                  }
                  className={`w-44 tabular ${inputCls}`}
                />
                <span className="tabular w-32 text-right text-xs font-bold text-gold">
                  {formatFcfa(settings.purses?.[f.id] ?? 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Enregistrer
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ci-green">
            <BadgeCheck size={16} />
            Paramètres appliqués
          </span>
        )}
      </div>

      {/* Accès */}
      <div className="glass-light mt-10 rounded-2xl p-7">
        <h2 className="text-base font-bold text-white">Sécurité de l&apos;accès</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Les identifiants du back office se configurent via les variables
          d&apos;environnement <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-blue-light">ADMIN_USER</code>,{" "}
          <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-blue-light">ADMIN_PASSWORD</code> et{" "}
          <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-blue-light">ADMIN_SECRET</code>{" "}
          (fichier <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-blue-light">.env.local</code>).
          Les sessions sont signées HMAC-SHA256 et expirent après 12 heures.
        </p>
      </div>
    </div>
  );
}
