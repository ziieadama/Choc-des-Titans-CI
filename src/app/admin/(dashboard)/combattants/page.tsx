"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, X, Save, Crown, Plus, Trash2, ExternalLink } from "lucide-react";
import type { Fighter, WeightClass } from "@/data/types";
import { Field, ImagePicker, StringListField, inputCls } from "@/components/admin/ui";

const weightClasses: WeightClass[] = [
  "Poids Plume",
  "Welter",
  "Poids Moyen",
  "Mi-Lourd",
  "Poids Lourd",
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyFighter = (): Fighter => ({
  slug: "",
  name: "",
  commune: "",
  weightClass: "Welter",
  gender: "H",
  record: { wins: 0, losses: 0, draws: 0, ko: 0 },
  titles: [],
  bio: "",
  photo: "/images/misc/public/public-01.jpg",
  stats: { puissance: 70, vitesse: 70, technique: 70, endurance: 70 },
});

/** Gestion complète du roster : fiches, records, stats, ajout/suppression. */
export default function AdminCombattantsPage() {
  const [items, setItems] = useState<Fighter[] | null>(null);
  const [editing, setEditing] = useState<Fighter | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/fighters").then((r) => r.json()).then(setItems);
  }, []);

  const persist = async (next: Fighter[]) => {
    setSaving(true);
    const res = await fetch("/api/admin/fighters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Enregistrement impossible.");
      return false;
    }
    setItems(next);
    return true;
  };

  const save = async () => {
    if (!editing || !items) return;
    if (!editing.name.trim() || !editing.commune.trim()) {
      alert("Nom et commune sont obligatoires.");
      return;
    }
    const fighter = { ...editing, slug: editing.slug || slugify(editing.name) };
    const next = isNew
      ? [...items, fighter]
      : items.map((f) => (f.slug === fighter.slug ? fighter : f));
    if (await persist(next)) setEditing(null);
  };

  const remove = async (slug: string) => {
    if (!items) return;
    if (!confirm("Supprimer ce combattant ? Les combats qui le référencent ne l'afficheront plus."))
      return;
    await persist(items.filter((f) => f.slug !== slug));
  };

  const num = (label: string, key: keyof Fighter["record"]) =>
    editing && (
      <Field label={label}>
        <input
          type="number"
          min={0}
          value={editing.record[key]}
          onChange={(e) =>
            setEditing({ ...editing, record: { ...editing.record, [key]: Number(e.target.value) } })
          }
          className={`tabular ${inputCls}`}
        />
      </Field>
    );

  const statSlider = (label: string, key: keyof Fighter["stats"]) =>
    editing && (
      <div>
        <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/60">
          {label}
          <span className="tabular text-blue-light">{editing.stats[key]}</span>
        </label>
        <input
          type="range"
          min={40}
          max={99}
          value={editing.stats[key]}
          onChange={(e) =>
            setEditing({ ...editing, stats: { ...editing.stats, [key]: Number(e.target.value) } })
          }
          className="mt-2 w-full cursor-pointer accent-[#266fb3]"
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Combattants</h1>
          <p className="mt-1 text-sm text-muted">
            Le roster complet — fiches publiées dès l&apos;enregistrement.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyFighter());
            setIsNew(true);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark"
        >
          <Plus size={15} />
          Nouveau combattant
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items === null ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-light" />
          </div>
        ) : (
          items.map((f) => (
            <div key={f.slug} className="glass-light flex items-center gap-4 rounded-xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.photo} alt={f.name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/10" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold text-white">
                  {f.name}
                  {f.champion && <Crown size={13} className="shrink-0 text-gold" />}
                </p>
                <p className="text-xs text-white/45">{f.weightClass} · {f.commune}</p>
                <p className="tabular mt-0.5 text-xs font-semibold text-blue-light">
                  {f.record.wins}V - {f.record.losses}D - {f.record.draws}N · {f.record.ko} K.O
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <a
                  href={`/combattants/${f.slug}`}
                  target="_blank"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white"
                  aria-label="Voir le profil public"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => {
                    setEditing(structuredClone(f));
                    setIsNew(false);
                  }}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-blue/15 hover:text-blue-light"
                  aria-label={`Modifier ${f.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(f.slug)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-red/10 hover:text-red"
                  aria-label={`Supprimer ${f.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Éditeur */}
      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-2xl rounded-2xl p-7"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-xl uppercase text-white">
              {isNew ? "Nouveau combattant" : editing.name}
            </h2>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet *">
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Surnom">
                  <input value={editing.nickname ?? ""} onChange={(e) => setEditing({ ...editing, nickname: e.target.value || undefined })} className={inputCls} placeholder="Le Titan" />
                </Field>
                <Field label="Commune *">
                  <input value={editing.commune} onChange={(e) => setEditing({ ...editing, commune: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Catégorie">
                  <select value={editing.weightClass} onChange={(e) => setEditing({ ...editing, weightClass: e.target.value as WeightClass })} className={`${inputCls} cursor-pointer`}>
                    {weightClasses.map((w) => (
                      <option key={w} value={w} className="bg-carbon">{w}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Genre">
                  <select value={editing.gender} onChange={(e) => setEditing({ ...editing, gender: e.target.value as "H" | "F" })} className={`${inputCls} cursor-pointer`}>
                    <option value="H" className="bg-carbon">Masculin</option>
                    <option value="F" className="bg-carbon">Féminin</option>
                  </select>
                </Field>
                <div className="flex items-end pb-1">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
                    <input type="checkbox" checked={Boolean(editing.champion)} onChange={(e) => setEditing({ ...editing, champion: e.target.checked || undefined })} className="h-4 w-4 accent-[#d9a441]" />
                    Champion en titre
                  </label>
                </div>
              </div>

              <ImagePicker label="Photo du combattant" value={editing.photo} onChange={(photo) => setEditing({ ...editing, photo })} />

              <div className="grid grid-cols-4 gap-3">
                {num("Victoires", "wins")}
                {num("Défaites", "losses")}
                {num("Nuls", "draws")}
                {num("K.O", "ko")}
              </div>

              <Field label="Biographie">
                <textarea rows={4} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className={`${inputCls} resize-none`} />
              </Field>

              <StringListField
                label="Palmarès"
                value={editing.titles}
                onChange={(titles) => setEditing({ ...editing, titles })}
              />

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Attributs de combat
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {statSlider("Puissance", "puissance")}
                  {statSlider("Vitesse", "vitesse")}
                  {statSlider("Technique", "technique")}
                  {statSlider("Endurance", "endurance")}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="cursor-pointer rounded-md bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15">
                Annuler
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Enregistrer & publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
