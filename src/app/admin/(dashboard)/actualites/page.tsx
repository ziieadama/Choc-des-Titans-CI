"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil, Trash2, X, Save, ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/data/types";
import { ImagePicker } from "@/components/admin/ui";

const categories = ["Résultats", "Annonce", "AIB", "Interview", "Partenariat"] as const;

const emptyArticle = (): NewsArticle => ({
  slug: "",
  title: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Annonce",
  cover: "/images/misc/public/public-01.jpg",
  body: [""],
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export default function AdminActualitesPage() {
  const [items, setItems] = useState<NewsArticle[] | null>(null);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/news");
    setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const persist = async (next: NewsArticle[]) => {
    setSaving(true);
    await fetch("/api/admin/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setItems(next);
    setSaving(false);
  };

  const save = async () => {
    if (!editing || !items) return;
    const article = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      body: editing.body.filter((p) => p.trim().length > 0),
    };
    if (!article.title.trim() || !article.excerpt.trim()) {
      alert("Titre et chapô sont obligatoires.");
      return;
    }
    const next = isNew
      ? [article, ...items]
      : items.map((a) => (a.slug === article.slug ? article : a));
    await persist(next);
    setEditing(null);
  };

  const remove = async (slug: string) => {
    if (!items || !confirm("Supprimer cet article ?")) return;
    await persist(items.filter((a) => a.slug !== slug));
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-blue";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Actualités</h1>
          <p className="mt-1 text-sm text-muted">
            Les modifications sont publiées immédiatement sur le site.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyArticle());
            setIsNew(true);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue"
        >
          <Plus size={15} />
          Nouvel article
        </button>
      </div>

      {/* Liste */}
      <div className="mt-8 space-y-3">
        {items === null ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-light" />
          </div>
        ) : (
          items.map((a) => (
            <div
              key={a.slug}
              className="glass-light flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center"
            >
              <span className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                <Image src={a.cover} alt="" fill sizes="128px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-light">
                    {a.category}
                  </span>
                  <span className="text-[11px] text-white/40">{a.date}</span>
                </div>
                <h2 className="mt-1.5 truncate text-sm font-bold text-white">{a.title}</h2>
                <p className="mt-0.5 truncate text-xs text-white/45">{a.excerpt}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={`/actualites/${a.slug}`}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Voir sur le site"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => {
                    setEditing({ ...a, body: [...a.body] });
                    setIsNew(false);
                  }}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-blue/15 hover:text-blue-light"
                  aria-label="Modifier"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(a.slug)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 transition-colors hover:bg-red/10 hover:text-red"
                  aria-label="Supprimer"
                >
                  <Trash2 size={15} />
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
              {isNew ? "Nouvel article" : "Modifier l'article"}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Titre *
                </label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={`mt-1.5 ${inputCls}`}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Catégorie
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value as NewsArticle["category"] })
                    }
                    className={`mt-1.5 cursor-pointer ${inputCls}`}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-carbon">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
              </div>
              <ImagePicker
                label="Image de couverture"
                value={editing.cover}
                onChange={(cover) => setEditing({ ...editing, cover })}
              />
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Chapô *
                </label>
                <textarea
                  rows={2}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className={`mt-1.5 resize-none ${inputCls}`}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Corps de l&apos;article (un paragraphe par bloc)
                </label>
                <textarea
                  rows={8}
                  value={editing.body.join("\n\n")}
                  onChange={(e) =>
                    setEditing({ ...editing, body: e.target.value.split(/\n{2,}/) })
                  }
                  className={`mt-1.5 ${inputCls}`}
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
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
