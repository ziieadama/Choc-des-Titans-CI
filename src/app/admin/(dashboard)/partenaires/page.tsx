"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Save, Upload, ImageOff } from "lucide-react";
import type { Partner } from "@/data/types";
import { partnerCategories } from "@/data/partners";

const emptyPartner = (): Partner => ({
  id: "",
  name: "",
  category: "Institutionnel",
  tier: "officiel",
  message: "",
  about: "",
  initials: "",
  color: "#266fb3",
  reach: 50,
});

export default function AdminPartenairesPage() {
  const [items, setItems] = useState<Partner[] | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      alert(data.error ?? "L'upload a échoué.");
      return;
    }
    setEditing((e) => (e ? { ...e, logo: data.url } : e));
  };

  useEffect(() => {
    fetch("/api/admin/partners")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const persist = async (next: Partner[]) => {
    setSaving(true);
    await fetch("/api/admin/partners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setItems(next);
    setSaving(false);
  };

  const save = async () => {
    if (!editing || !items) return;
    if (!editing.name.trim() || !editing.message.trim()) {
      alert("Nom et mot de la marque sont obligatoires.");
      return;
    }
    const partner = {
      ...editing,
      id: editing.id || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      initials:
        editing.initials ||
        editing.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 3)
          .toUpperCase(),
    };
    const next = isNew
      ? [...items, partner]
      : items.map((p) => (p.id === partner.id ? partner : p));
    await persist(next);
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!items || !confirm("Retirer ce partenaire ?")) return;
    await persist(items.filter((p) => p.id !== id));
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Partenaires</h1>
          <p className="mt-1 text-sm text-muted">
            {items ? `${items.length} partenaires` : "…"} — les modifications sont
            visibles immédiatement sur le site.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyPartner());
            setIsNew(true);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue"
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items === null ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-light" />
          </div>
        ) : (
          items.map((p) => (
            <div key={p.id} className="glass-light flex items-center gap-4 rounded-xl p-4">
              {p.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"
                />
              ) : (
                <span
                  className="font-display inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}88)` }}
                >
                  {p.initials}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{p.name}</p>
                <p className="text-xs text-white/45">
                  {p.category} · {p.tier} · portée {p.reach ?? 50}%
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => {
                    setEditing({ ...p });
                    setIsNew(false);
                  }}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-blue/15 hover:text-blue-light"
                  aria-label={`Modifier ${p.name}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-red/10 hover:text-red"
                  aria-label={`Supprimer ${p.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-xl rounded-2xl p-7"
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
              {isNew ? "Nouveau partenaire" : editing.name}
            </h2>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Nom *
                  </label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Catégorie
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value as Partner["category"] })
                    }
                    className={`mt-1.5 cursor-pointer ${inputCls}`}
                  >
                    {partnerCategories.map((c) => (
                      <option key={c} value={c} className="bg-carbon">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Niveau
                  </label>
                  <select
                    value={editing.tier}
                    onChange={(e) =>
                      setEditing({ ...editing, tier: e.target.value as Partner["tier"] })
                    }
                    className={`mt-1.5 cursor-pointer ${inputCls}`}
                  >
                    <option value="titan" className="bg-carbon">Partenaire Titan</option>
                    <option value="or" className="bg-carbon">Partenaire Or</option>
                    <option value="officiel" className="bg-carbon">Partenaire Officiel</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Couleur du monogramme
                  </label>
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-white/5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Logo du partenaire
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    {editing.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={editing.logo}
                        alt="Logo"
                        className="h-14 w-14 rounded-lg bg-white object-contain p-1.5"
                      />
                    ) : (
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-white/30">
                        <ImageOff size={20} />
                      </span>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-white/8 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploading ? "Envoi…" : "Téléverser un logo"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadLogo(f);
                        }}
                      />
                    </label>
                    {editing.logo && (
                      <button
                        onClick={() => setEditing({ ...editing, logo: undefined })}
                        className="cursor-pointer text-xs font-bold uppercase tracking-wider text-red/80 hover:text-red"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-white/35">
                    PNG, JPG, WebP ou SVG · 2 Mo max. Sans logo, un monogramme élégant est affiché.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/60">
                    Portée du partenariat
                    <span className="tabular text-blue-light">{editing.reach ?? 50}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={editing.reach ?? 50}
                    onChange={(e) => setEditing({ ...editing, reach: Number(e.target.value) })}
                    className="mt-2 w-full cursor-pointer accent-[#266fb3]"
                  />
                  <p className="mt-1 text-[11px] text-white/35">
                    Détermine la taille du logo dans le nuage de partenaires de la page d'accueil.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Représentant
                  </label>
                  <input
                    value={editing.representative ?? ""}
                    onChange={(e) => setEditing({ ...editing, representative: e.target.value })}
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Fonction
                  </label>
                  <input
                    value={editing.role ?? ""}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Mot de la marque *
                </label>
                <textarea
                  rows={3}
                  value={editing.message}
                  onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                  className={`mt-1.5 resize-none ${inputCls}`}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Lien avec le Choc des Titans
                </label>
                <textarea
                  rows={2}
                  value={editing.about}
                  onChange={(e) => setEditing({ ...editing, about: e.target.value })}
                  className={`mt-1.5 resize-none ${inputCls}`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="cursor-pointer rounded-md bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
              >
                Annuler
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
