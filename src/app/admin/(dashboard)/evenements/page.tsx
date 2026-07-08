"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Swords,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import type { Edition, Stage, Fight, Fighter, WeightClass } from "@/data/types";
import {
  Field,
  ImagePicker,
  SaveBar,
  StringListField,
  inputCls,
} from "@/components/admin/ui";

const weightClasses: WeightClass[] = [
  "Poids Plume",
  "Welter",
  "Poids Moyen",
  "Mi-Lourd",
  "Poids Lourd",
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Éditeur complet des événements : éditions → étapes → combats.
 * Toute modification enregistrée est immédiatement visible sur le site.
 */
export default function AdminEvenementsPage() {
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Navigation : index d'édition puis index d'étape sélectionnés
  const [edIdx, setEdIdx] = useState<number | null>(null);
  const [stIdx, setStIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/editions").then((r) => r.json()).then(setEditions);
    fetch("/api/admin/fighters").then((r) => r.json()).then(setFighters);
  }, []);

  const save = async () => {
    if (!editions) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/editions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editions),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Enregistrement impossible.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  if (!editions) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  const update = (fn: (draft: Edition[]) => void) => {
    const draft = structuredClone(editions);
    fn(draft);
    setEditions(draft);
  };

  const edition = edIdx !== null ? editions[edIdx] : null;
  const stage = edition && stIdx !== null ? edition.stages[stIdx] : null;

  /* ================= LISTE DES ÉDITIONS ================= */
  if (edIdx === null) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl uppercase text-white">Événements</h1>
            <p className="mt-1 text-sm text-muted">
              Éditions, étapes, combats et résultats — publiés dès l&apos;enregistrement.
            </p>
          </div>
          <button
            onClick={() =>
              update((d) => {
                const n = Math.max(...d.map((e) => e.number)) + 1;
                d.unshift({
                  number: n,
                  slug: `cdt-${n}`,
                  year: new Date().getFullYear(),
                  title: `Choc des Titans ${n}`,
                  tagline: "",
                  status: "à venir",
                  description: "",
                  highlights: [],
                  stages: [],
                  cover: "/images/misc/public/public-01.jpg",
                });
              })
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark"
          >
            <Plus size={15} />
            Nouvelle édition
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {editions.map((ed, i) => (
            <div key={ed.slug} className="glass-light flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ed.cover} alt="" className="h-16 w-full shrink-0 rounded-lg object-cover sm:w-28" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg uppercase text-white">{ed.title}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      ed.status === "en cours"
                        ? "bg-red/15 text-red"
                        : ed.status === "à venir"
                          ? "bg-blue/15 text-blue-light"
                          : "bg-white/10 text-white/50"
                    }`}
                  >
                    {ed.status}
                  </span>
                </div>
                <p className="text-xs text-white/45">
                  {ed.year} · {ed.stages.length} étape{ed.stages.length > 1 ? "s" : ""} ·{" "}
                  {ed.stages.reduce((a, s) => a + s.fights.length, 0)} combats
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={`/evenements/${ed.slug}`}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white"
                  aria-label="Voir sur le site"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer ${ed.title} et toutes ses étapes ?`))
                      update((d) => void d.splice(i, 1));
                  }}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-red/10 hover:text-red"
                  aria-label="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setEdIdx(i)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/8 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
                >
                  Modifier
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <SaveBar onSave={save} saving={saving} saved={saved} />
      </div>
    );
  }

  /* ================= ÉDITEUR D'ÉTAPE ================= */
  if (edition && stage && stIdx !== null) {
    const setStage = (patch: Partial<Stage>) =>
      update((d) => Object.assign(d[edIdx!].stages[stIdx], patch));

    const fighterSelect = (
      label: string,
      value: string,
      onChange: (v: string) => void
    ) => (
      <Field label={label}>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="" className="bg-carbon">—</option>
          {fighters.map((f) => (
            <option key={f.slug} value={f.slug} className="bg-carbon">
              {f.name} ({f.weightClass} · {f.commune})
            </option>
          ))}
        </select>
      </Field>
    );

    return (
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setStIdx(null)}
          className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white"
        >
          <ChevronLeft size={14} />
          {edition.title}
        </button>
        <h1 className="font-display text-2xl uppercase text-white">{stage.name || "Nouvelle étape"}</h1>

        <section className="glass-light mt-6 space-y-4 rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de l'étape">
              <input value={stage.name} onChange={(e) => setStage({ name: e.target.value })} className={inputCls} placeholder="Étape 2 — Yopougon" />
            </Field>
            <Field label="Commune">
              <input value={stage.commune} onChange={(e) => setStage({ commune: e.target.value, slug: stage.slug || slugify(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Date et heure">
              <input
                type="datetime-local"
                value={stage.date?.slice(0, 16) ?? ""}
                onChange={(e) => setStage({ date: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Lieu">
              <input value={stage.venue} onChange={(e) => setStage({ venue: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Statut">
              <select
                value={stage.status}
                onChange={(e) => setStage({ status: e.target.value as Stage["status"] })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="à venir" className="bg-carbon">À venir</option>
                <option value="en direct" className="bg-carbon">En direct</option>
                <option value="terminé" className="bg-carbon">Terminé</option>
              </select>
            </Field>
            <Field label="Parrain (optionnel)">
              <input value={stage.parrain ?? ""} onChange={(e) => setStage({ parrain: e.target.value || undefined })} className={inputCls} />
            </Field>
          </div>
          <ImagePicker label="Photo de couverture" value={stage.cover} onChange={(cover) => setStage({ cover })} />
          <StringListField
            label="Personnalités présentes"
            value={stage.personalities ?? []}
            onChange={(personalities) => setStage({ personalities })}
          />
        </section>

        {/* Combats */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <Swords size={17} className="text-red" />
            Combats de l&apos;étape ({stage.fights.length})
          </h2>
          <button
            onClick={() =>
              update((d) => {
                d[edIdx!].stages[stIdx].fights.push({
                  id: `${edition.slug}-${stage.slug}-${Date.now().toString(36)}`,
                  weightClass: "Welter",
                  red: fighters[0]?.slug ?? "",
                  blue: fighters[1]?.slug ?? "",
                  story: "",
                  cover: stage.cover,
                });
              })
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark"
          >
            <Plus size={14} />
            Ajouter un combat
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {stage.fights.map((fight, fi) => {
            const setFight = (patch: Partial<Fight>) =>
              update((d) => Object.assign(d[edIdx!].stages[stIdx].fights[fi], patch));
            return (
              <div key={fight.id} className="glass-light rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-light">
                    Combat {fi + 1}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm("Supprimer ce combat ?"))
                        update((d) => void d[edIdx!].stages[stIdx].fights.splice(fi, 1));
                    }}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-red/10 hover:text-red"
                    aria-label="Supprimer le combat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Field label="Catégorie">
                    <select
                      value={fight.weightClass}
                      onChange={(e) => setFight({ weightClass: e.target.value as WeightClass })}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {weightClasses.map((w) => (
                        <option key={w} value={w} className="bg-carbon">{w}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="flex items-end gap-5 pb-1">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                      <input type="checkbox" checked={Boolean(fight.female)} onChange={(e) => setFight({ female: e.target.checked || undefined })} className="h-4 w-4 accent-[#266fb3]" />
                      Combat féminin
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                      <input type="checkbox" checked={Boolean(fight.headline)} onChange={(e) => setFight({ headline: e.target.checked || undefined })} className="h-4 w-4 accent-[#d9a441]" />
                      Combat principal
                    </label>
                  </div>
                  {fighterSelect("Coin rouge", fight.red, (red) => setFight({ red }))}
                  {fighterSelect("Coin bleu", fight.blue, (blue) => setFight({ blue }))}
                  {fighterSelect("Vainqueur", fight.winner ?? "", (w) => setFight({ winner: w || undefined }))}
                  <Field label="Méthode">
                    <select
                      value={fight.method ?? ""}
                      onChange={(e) => setFight({ method: (e.target.value || undefined) as Fight["method"] })}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="" className="bg-carbon">—</option>
                      {["Décision", "K.O", "TKO", "Abandon"].map((m) => (
                        <option key={m} value={m} className="bg-carbon">{m}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Récit du combat">
                    <textarea rows={2} value={fight.story} onChange={(e) => setFight({ story: e.target.value })} className={`${inputCls} resize-none`} />
                  </Field>
                </div>
                <div className="mt-4">
                  <ImagePicker label="Photo du combat" value={fight.cover ?? ""} onChange={(cover) => setFight({ cover })} />
                </div>
              </div>
            );
          })}
        </div>

        <SaveBar onSave={save} saving={saving} saved={saved} />
      </div>
    );
  }

  /* ================= ÉDITEUR D'ÉDITION ================= */
  if (edition) {
    const setEdition = (patch: Partial<Edition>) =>
      update((d) => Object.assign(d[edIdx], patch));

    return (
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setEdIdx(null)}
          className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white"
        >
          <ChevronLeft size={14} />
          Toutes les éditions
        </button>
        <h1 className="font-display text-2xl uppercase text-white">{edition.title}</h1>

        <section className="glass-light mt-6 space-y-4 rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titre">
              <input value={edition.title} onChange={(e) => setEdition({ title: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Accroche">
              <input value={edition.tagline} onChange={(e) => setEdition({ tagline: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Année">
              <input type="number" value={edition.year} onChange={(e) => setEdition({ year: Number(e.target.value) })} className={`tabular ${inputCls}`} />
            </Field>
            <Field label="Statut" hint="« En cours » pilote l'accueil (countdown, résultats).">
              <select
                value={edition.status}
                onChange={(e) => setEdition({ status: e.target.value as Edition["status"] })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="à venir" className="bg-carbon">À venir</option>
                <option value="en cours" className="bg-carbon">En cours</option>
                <option value="terminée" className="bg-carbon">Terminée</option>
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={3} value={edition.description} onChange={(e) => setEdition({ description: e.target.value })} className={`${inputCls} resize-none`} />
          </Field>
          <ImagePicker label="Photo de couverture" value={edition.cover} onChange={(cover) => setEdition({ cover })} />
          <StringListField
            label="Temps forts"
            value={edition.highlights}
            onChange={(highlights) => setEdition({ highlights })}
          />
        </section>

        {/* Étapes */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <CalendarDays size={17} className="text-blue-light" />
            Étapes ({edition.stages.length})
          </h2>
          <button
            onClick={() =>
              update((d) => {
                d[edIdx].stages.push({
                  slug: `etape-${d[edIdx].stages.length + 1}`,
                  name: `Étape ${d[edIdx].stages.length + 1}`,
                  commune: "",
                  date: new Date().toISOString().slice(0, 16),
                  venue: "",
                  status: "à venir",
                  fights: [],
                  cover: edition.cover,
                });
              })
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark"
          >
            <Plus size={14} />
            Ajouter une étape
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {edition.stages.map((s, si) => (
            <div key={s.slug + si} className="glass-light flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.cover} alt="" className="h-14 w-full shrink-0 rounded-lg object-cover sm:w-24" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{s.name || "(sans nom)"}</p>
                <p className="text-xs text-white/45">
                  {s.commune} · {s.date?.slice(0, 10)} · {s.fights.length} combat{s.fights.length > 1 ? "s" : ""} ·{" "}
                  <span className={s.status === "terminé" ? "text-white/45" : "text-blue-light"}>{s.status}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => {
                    if (confirm(`Supprimer l'étape ${s.name} ?`))
                      update((d) => void d[edIdx].stages.splice(si, 1));
                  }}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-red/10 hover:text-red"
                  aria-label="Supprimer l'étape"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setStIdx(si)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/8 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
                >
                  Ouvrir
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <SaveBar onSave={save} saving={saving} saved={saved} />
      </div>
    );
  }

  return null;
}
