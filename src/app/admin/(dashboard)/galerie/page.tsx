"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Upload, Trash2, ExternalLink, Landmark, Images } from "lucide-react";
import manifest from "@/data/gallery-manifest.json";
import type { CommuneInfo } from "@/data/types";
import { Field, ImagePicker, SaveBar, inputCls } from "@/components/admin/ui";

const galleryManifest = manifest as Record<string, string[]>;
const sectionKeys = Object.keys(galleryManifest).filter((k) => k !== "brand");

/**
 * Galerie & communes : textes institutionnels (mot du maire, stats, photos)
 * et ajout de photos supplémentaires dans chaque section de la galerie.
 */
export default function AdminGaleriePage() {
  const [communes, setCommunes] = useState<CommuneInfo[] | null>(null);
  const [extra, setExtra] = useState<Record<string, string[]> | null>(null);
  const [selected, setSelected] = useState(0);
  const [section, setSection] = useState(sectionKeys[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/communes").then((r) => r.json()).then(setCommunes);
    fetch("/api/admin/gallery-extra").then((r) => r.json()).then(setExtra);
  }, []);

  const save = async () => {
    if (!communes || !extra) return;
    setSaving(true);
    setSaved(false);
    const [r1, r2] = await Promise.all([
      fetch("/api/admin/communes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(communes),
      }),
      fetch("/api/admin/gallery-extra", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extra),
      }),
    ]);
    setSaving(false);
    if (!r1.ok || !r2.ok) {
      alert("Enregistrement impossible.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const uploadToSection = async (files: FileList) => {
    if (!extra) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files).slice(0, 10)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) urls.push(data.url);
    }
    setExtra({ ...extra, [section]: [...(extra[section] ?? []), ...urls] });
    setUploading(false);
  };

  const commune = communes?.[selected];
  const sectionExtras = useMemo(() => extra?.[section] ?? [], [extra, section]);

  if (!communes || !extra) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  const setCommune = (patch: Partial<CommuneInfo>) => {
    const next = [...communes];
    next[selected] = { ...next[selected], ...patch };
    setCommunes(next);
  };

  const mot = commune?.motInstitutionnel;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl uppercase text-white">Galerie & communes</h1>
      <p className="mt-1 text-sm text-muted">
        Textes institutionnels des communes et photos supplémentaires de la galerie.
      </p>

      {/* ===== Communes ===== */}
      <section className="glass-light mt-8 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <Landmark size={17} className="text-blue-light" />
            Communes du circuit
          </h2>
          <select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            className={`${inputCls} max-w-56 cursor-pointer`}
          >
            {communes.map((c, i) => (
              <option key={c.slug} value={i} className="bg-carbon">{c.name}</option>
            ))}
          </select>
        </div>

        {commune && (
          <div className="mt-5 space-y-4">
            <Field label="Présentation de la commune">
              <textarea rows={3} value={commune.description} onChange={(e) => setCommune({ description: e.target.value })} className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Son lien avec le Choc des Titans">
              <textarea rows={3} value={commune.lienCdt} onChange={(e) => setCommune({ lienCdt: e.target.value })} className={`${inputCls} resize-none`} />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              {(["clubs", "boxeurs", "editionsAccueillies"] as const).map((k) => (
                <Field key={k} label={{ clubs: "Clubs", boxeurs: "Boxeurs", editionsAccueillies: "Éditions" }[k]}>
                  <input
                    type="number"
                    value={commune.stats?.[k] ?? 0}
                    onChange={(e) =>
                      setCommune({
                        stats: {
                          clubs: commune.stats?.clubs ?? 0,
                          boxeurs: commune.stats?.boxeurs ?? 0,
                          editionsAccueillies: commune.stats?.editionsAccueillies ?? 0,
                          [k]: Number(e.target.value),
                        },
                      })
                    }
                    className={`tabular ${inputCls}`}
                  />
                </Field>
              ))}
            </div>

            <div className="rounded-xl border border-white/8 p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Mot institutionnel / du maire
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Auteur">
                  <input
                    value={mot?.auteur ?? ""}
                    onChange={(e) =>
                      setCommune({
                        motInstitutionnel: { auteur: e.target.value, fonction: mot?.fonction ?? "", texte: mot?.texte ?? "", photo: mot?.photo },
                      })
                    }
                    className={inputCls}
                    placeholder="Hon. Doumbia Issouf"
                  />
                </Field>
                <Field label="Fonction">
                  <input
                    value={mot?.fonction ?? ""}
                    onChange={(e) =>
                      setCommune({
                        motInstitutionnel: { auteur: mot?.auteur ?? "", fonction: e.target.value, texte: mot?.texte ?? "", photo: mot?.photo },
                      })
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Texte">
                  <textarea
                    rows={3}
                    value={mot?.texte ?? ""}
                    onChange={(e) =>
                      setCommune({
                        motInstitutionnel: { auteur: mot?.auteur ?? "", fonction: mot?.fonction ?? "", texte: e.target.value, photo: mot?.photo },
                      })
                    }
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <ImagePicker
                  label="Photo officielle (portrait du maire / parrain)"
                  hint="Portrait rectangulaire bien cadré. Laisser vide pour un affichage sans photo."
                  value={mot?.photo ?? ""}
                  onChange={(photo) =>
                    setCommune({
                      motInstitutionnel: { auteur: mot?.auteur ?? "", fonction: mot?.fonction ?? "", texte: mot?.texte ?? "", photo: photo || undefined },
                    })
                  }
                />
              </div>
            </div>
            <a
              href={`/galerie`}
              target="_blank"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-light hover:text-white"
            >
              <ExternalLink size={13} />
              Voir la galerie sur le site
            </a>
          </div>
        )}
      </section>

      {/* ===== Photos supplémentaires ===== */}
      <section className="glass-light mt-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <Images size={17} className="text-blue-light" />
            Ajouter des photos à la galerie
          </h2>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className={`${inputCls} max-w-72 cursor-pointer`}
          >
            {sectionKeys.map((k) => (
              <option key={k} value={k} className="bg-carbon">
                {k} ({galleryManifest[k].length + (extra[k]?.length ?? 0)})
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-[11px] text-white/35">
          Les photos ajoutées apparaissent à la suite des photos officielles de la
          section sélectionnée (10 max par envoi, 2 Mo chacune).
        </p>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 px-6 py-8 text-white/50 transition-colors hover:border-blue hover:text-white">
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {uploading ? "Envoi en cours…" : "Cliquer pour téléverser des photos"}
          </span>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.length && uploadToSection(e.target.files)}
          />
        </label>

        {sectionExtras.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {sectionExtras.map((url) => (
              <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() =>
                    setExtra({ ...extra, [section]: sectionExtras.filter((u) => u !== url) })
                  }
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Retirer la photo"
                >
                  <Trash2 size={18} className="text-red" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
