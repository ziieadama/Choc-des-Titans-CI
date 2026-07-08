"use client";

import { useMemo, useState } from "react";
import { Loader2, Save, BadgeCheck, Upload, Images, X } from "lucide-react";
import manifest from "@/data/gallery-manifest.json";

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-blue";

/** Champ avec libellé uniforme. */
export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-bold uppercase tracking-wider text-white/60">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-white/35">{hint}</p>}
    </div>
  );
}

/** Paire FR/EN côte à côte. */
export function BilingualField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: { fr: string; en: string };
  onChange: (v: { fr: string; en: string }) => void;
  rows?: number;
}) {
  const Comp = rows ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["fr", "en"] as const).map((l) => (
        <Field key={l} label={`${label} (${l.toUpperCase()})`}>
          <Comp
            rows={rows}
            value={value[l]}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, [l]: e.target.value })
            }
            className={`${inputCls} ${rows ? "resize-none" : ""}`}
          />
        </Field>
      ))}
    </div>
  );
}

/** Barre de sauvegarde collante (mobile friendly). */
export function SaveBar({
  onSave,
  saving,
  saved,
  label = "Enregistrer & publier",
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-30 mt-8 flex items-center gap-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-card transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-[0.98] disabled:opacity-60"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {label}
      </button>
      {saved && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ci-green/15 px-4 py-2 text-sm font-semibold text-ci-green">
          <BadgeCheck size={16} />
          Publié sur le site
        </span>
      )}
    </div>
  );
}

const galleryManifest = manifest as Record<string, string[]>;
const folders = Object.keys(galleryManifest).filter((k) => k !== "brand");

/**
 * Sélecteur d'image : chemin manuel, upload, ou navigation dans les
 * 400+ photos officielles de la galerie.
 */
export function ImagePicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const [browsing, setBrowsing] = useState(false);
  const [folder, setFolder] = useState(folders[0]);
  const [uploading, setUploading] = useState(false);

  const images = useMemo(() => galleryManifest[folder] ?? [], [folder]);

  const upload = async (file: File) => {
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
    onChange(data.url);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-24 shrink-0 rounded-lg border border-white/10 object-cover"
          />
        ) : (
          <span className="inline-flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
            <Images size={20} />
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          placeholder="/images/…"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setBrowsing(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/8 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/15"
          >
            <Images size={13} />
            Galerie
          </button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/8 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/15">
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            Upload
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
        </div>
      </div>

      {browsing && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setBrowsing(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass flex h-[80dvh] w-full max-w-3xl flex-col rounded-2xl p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className={`${inputCls} max-w-xs cursor-pointer`}
              >
                {folders.map((f) => (
                  <option key={f} value={f} className="bg-carbon">
                    {f} ({galleryManifest[f].length})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setBrowsing(false)}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 grid flex-1 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => {
                    onChange(src);
                    setBrowsing(false);
                  }}
                  className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg ring-2 transition-all hover:ring-blue ${
                    value === src ? "ring-blue" : "ring-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Field>
  );
}

/** Éditeur de liste de chaînes (une par ligne). */
export function StringListField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Field label={label} hint={hint ?? "Une entrée par ligne."}>
      <textarea
        rows={Math.max(3, text.split("\n").length + 1)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() =>
          onChange(text.split("\n").map((l) => l.trim()).filter(Boolean))
        }
        className={`${inputCls} resize-none`}
      />
    </Field>
  );
}
