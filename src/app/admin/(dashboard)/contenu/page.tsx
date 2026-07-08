"use client";

import { useEffect, useState } from "react";
import { Loader2, Home, Landmark, ExternalLink } from "lucide-react";
import type { SiteContent } from "@/lib/store";
import {
  Field,
  BilingualField,
  ImagePicker,
  SaveBar,
  inputCls,
} from "@/components/admin/ui";

/** Édition du contenu de la page d'accueil et de la section AIB. */
export default function AdminContenuPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Enregistrement impossible.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  if (!content) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  const statEditor = (
    stats: SiteContent["stats"],
    onChange: (s: SiteContent["stats"]) => void
  ) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl border border-white/8 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Valeur ${i + 1}`}>
              <input
                type="number"
                value={s.value}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...s, value: Number(e.target.value) };
                  onChange(next);
                }}
                className={`tabular ${inputCls}`}
              />
            </Field>
            <Field label="Suffixe">
              <input
                value={s.suffix}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...s, suffix: e.target.value.slice(0, 3) };
                  onChange(next);
                }}
                className={inputCls}
                placeholder="+"
              />
            </Field>
          </div>
          <div className="mt-3">
            <BilingualField
              label="Libellé"
              value={s.label}
              onChange={(label) => {
                const next = [...stats];
                next[i] = { ...s, label };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Contenu du site</h1>
          <p className="mt-1 text-sm text-muted">
            Page d&apos;accueil et section AIB — publié dès l&apos;enregistrement.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-md bg-white/8 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
        >
          <ExternalLink size={13} />
          Voir le site
        </a>
      </div>

      {/* ===== Accueil ===== */}
      <section className="glass-light mt-8 rounded-2xl p-6 sm:p-7">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Home size={17} className="text-blue-light" />
          Page d&apos;accueil — Héro
        </h2>
        <div className="mt-5 space-y-5">
          <ImagePicker
            label="Image principale du héro"
            value={content.hero.image}
            onChange={(image) =>
              setContent({ ...content, hero: { ...content.hero, image } })
            }
          />
          <BilingualField
            label="Badge (au-dessus du titre)"
            value={content.hero.badge}
            onChange={(badge) =>
              setContent({ ...content, hero: { ...content.hero, badge } })
            }
          />
          <BilingualField
            label="Texte d'introduction"
            rows={3}
            value={content.hero.subtitle}
            onChange={(subtitle) =>
              setContent({ ...content, hero: { ...content.hero, subtitle } })
            }
          />
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-white/70">
          Bandeau de statistiques
        </h3>
        <div className="mt-4">
          {statEditor(content.stats, (stats) => setContent({ ...content, stats }))}
        </div>
      </section>

      {/* ===== AIB ===== */}
      <section className="glass-light mt-6 rounded-2xl p-6 sm:p-7">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Landmark size={17} className="text-ci-orange" />
          Section AIB — Le président
        </h2>
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom du président">
              <input
                value={content.aib.president.name}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aib: {
                      ...content.aib,
                      president: { ...content.aib.president, name: e.target.value },
                    },
                  })
                }
                className={inputCls}
              />
            </Field>
          </div>
          <ImagePicker
            label="Photo officielle du président"
            hint="Portrait vertical recommandé (3:4). Remplacez le placeholder par la photo bras croisés."
            value={content.aib.president.photo}
            onChange={(photo) =>
              setContent({
                ...content,
                aib: {
                  ...content.aib,
                  president: { ...content.aib.president, photo },
                },
              })
            }
          />
          <BilingualField
            label="Fonction"
            value={content.aib.president.role}
            onChange={(role) =>
              setContent({
                ...content,
                aib: { ...content.aib, president: { ...content.aib.president, role } },
              })
            }
          />
          <BilingualField
            label="Citation (mot du président)"
            rows={4}
            value={content.aib.president.quote}
            onChange={(quote) =>
              setContent({
                ...content,
                aib: { ...content.aib, president: { ...content.aib.president, quote } },
              })
            }
          />
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-white/70">
          Chiffres clés de l&apos;AIB
        </h3>
        <div className="mt-4">
          {statEditor(content.aib.stats, (stats) =>
            setContent({ ...content, aib: { ...content.aib, stats } })
          )}
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-white/70">
          Mission · Vision · Engagements
        </h3>
        <div className="mt-4 space-y-4">
          {content.aib.mvv.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/8 p-4">
              <BilingualField
                label={`Titre ${i + 1}`}
                value={item.title}
                onChange={(title) => {
                  const mvv = [...content.aib.mvv];
                  mvv[i] = { ...item, title };
                  setContent({ ...content, aib: { ...content.aib, mvv } });
                }}
              />
              <div className="mt-3">
                <BilingualField
                  label="Texte"
                  rows={3}
                  value={item.text}
                  onChange={(text) => {
                    const mvv = [...content.aib.mvv];
                    mvv[i] = { ...item, text };
                    setContent({ ...content, aib: { ...content.aib, mvv } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
