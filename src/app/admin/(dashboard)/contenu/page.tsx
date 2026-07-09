"use client";

import { useEffect, useState } from "react";
import { Loader2, Home, Landmark, ExternalLink, Hash } from "lucide-react";
import type { SiteContent } from "@/lib/store";
import {
  Field,
  FrField,
  ImagePicker,
  SaveBar,
  SectionCard,
  SubSection,
  AutoTranslateBadge,
  inputCls,
} from "@/components/admin/ui";

/**
 * Édition du contenu de la page d'accueil et de la page AIB.
 * Saisie en français uniquement — l'anglais est traduit automatiquement
 * à l'enregistrement.
 */
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
    // Récupère les traductions générées côté serveur
    const data = await res.json();
    if (data.content) setContent(data.content);
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

  /** Éditeur d'un chiffre clé : chiffre + symbole + texte descriptif. */
  const statEditor = (
    stats: SiteContent["stats"],
    onChange: (s: SiteContent["stats"]) => void,
    exemples: string[]
  ) => (
    <div className="grid gap-4 lg:grid-cols-2">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl border border-white/8 bg-white/5 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-light">
            <Hash size={12} />
            Chiffre clé n°{i + 1}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Le chiffre affiché"
              hint={`Exemple : ${exemples[i]?.split("|")[0] ?? "7"}`}
            >
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
            <Field
              label="Symbole après le chiffre"
              hint="« + » pour afficher 40+, vide sinon"
            >
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
            <FrField
              label="Texte affiché sous le chiffre"
              example={exemples[i]?.split("|")[1] ?? "Éditions"}
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
            Textes et images de la page d&apos;accueil et de la page AIB.
            Saisissez en français : l&apos;anglais est traduit automatiquement.
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

      {/* ============ 1. PAGE D'ACCUEIL ============ */}
      <SectionCard
        number="1"
        title="Page d'accueil"
        description="La première page que voient les visiteurs : grande photo, phrase d'accroche et chiffres clés."
        icon={<Home size={16} className="text-blue-light" />}
      >
        <SubSection
          number="1.1"
          title="La grande photo d'en-tête"
          description="Photo plein écran affichée en haut de la page d'accueil, derrière le titre « Le Choc des Titans »."
        >
          <ImagePicker
            label="Photo d'en-tête"
            hint="Choisissez une photo spectaculaire au format paysage (combat, ambiance…)."
            value={content.hero.image}
            onChange={(image) =>
              setContent({ ...content, hero: { ...content.hero, image } })
            }
          />
        </SubSection>

        <SubSection
          number="1.2"
          title="Le petit badge au-dessus du titre"
          description="La petite étiquette bleue affichée tout en haut, qui annonce l'édition en cours."
        >
          <FrField
            label="Texte du badge"
            example="7ᵉ édition · Saison 2026 en cours"
            value={content.hero.badge}
            onChange={(badge) =>
              setContent({ ...content, hero: { ...content.hero, badge } })
            }
          />
        </SubSection>

        <SubSection
          number="1.3"
          title="La phrase de présentation"
          description="Le paragraphe affiché sous le titre, qui présente le Choc des Titans en quelques mots."
        >
          <FrField
            label="Phrase de présentation"
            rows={3}
            example="La grande arène ivoirienne de la boxe et du MMA…"
            value={content.hero.subtitle}
            onChange={(subtitle) =>
              setContent({ ...content, hero: { ...content.hero, subtitle } })
            }
          />
        </SubSection>

        <SubSection
          number="1.4"
          title="Les 4 chiffres clés"
          description="Le bandeau de statistiques affiché en bas de la photo d'en-tête (nombre d'éditions, de communes, de combats, de partenaires…)."
        >
          {statEditor(content.stats, (stats) => setContent({ ...content, stats }), [
            "7|Éditions",
            "6|Communes traversées",
            "40|Combats de gala",
            "42|Partenaires engagés",
          ])}
        </SubSection>
      </SectionCard>

      {/* ============ 2. PAGE AIB ============ */}
      <SectionCard
        number="2"
        title="Page AIB — Association Ivoirienne de Boxe"
        description="La page institutionnelle de l'AIB : le mot du président, les chiffres de l'association et ses trois piliers."
        icon={<Landmark size={16} className="text-ci-orange" />}
      >
        <SubSection
          number="2.1"
          title="Le président"
          description="Le grand portrait officiel et la citation affichés au centre de la page AIB."
        >
          <Field label="Nom complet du président">
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
              placeholder="Jhimmy Traoré"
            />
          </Field>
          <ImagePicker
            label="Photo officielle du président"
            hint="Portrait vertical bien cadré (le placeholder actuel est à remplacer par la photo bras croisés)."
            value={content.aib.president.photo}
            onChange={(photo) =>
              setContent({
                ...content,
                aib: { ...content.aib, president: { ...content.aib.president, photo } },
              })
            }
          />
          <FrField
            label="Sa fonction officielle"
            example="Président de l'Association Ivoirienne de Boxe · Promoteur du Choc des Titans"
            value={content.aib.president.role}
            onChange={(role) =>
              setContent({
                ...content,
                aib: { ...content.aib, president: { ...content.aib.president, role } },
              })
            }
          />
          <FrField
            label="Sa citation (le mot du président)"
            rows={4}
            example="La boxe m'a tout appris : la discipline, le respect…"
            value={content.aib.president.quote}
            onChange={(quote) =>
              setContent({
                ...content,
                aib: { ...content.aib, president: { ...content.aib.president, quote } },
              })
            }
          />
        </SubSection>

        <SubSection
          number="2.2"
          title="Les 4 chiffres clés de l'AIB"
          description="Le bandeau de statistiques de la page AIB (clubs affiliés, licenciés, régions couvertes…)."
        >
          {statEditor(
            content.aib.stats,
            (stats) => setContent({ ...content, aib: { ...content.aib, stats } }),
            ["42|Clubs affiliés", "950|Licenciés", "16|Régions couvertes", "7|Éditions du CDT"]
          )}
        </SubSection>

        <SubSection
          number="2.3"
          title="Les 3 piliers : Mission, Vision, Engagements"
          description="Les trois cartes affichées sous le titre « Mission, vision, engagements » de la page AIB."
        >
          <div className="space-y-4">
            {content.aib.mvv.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/5 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-light">
                  Carte n°{i + 1}
                </p>
                <FrField
                  label="Titre de la carte"
                  example={["Notre mission", "Notre vision", "Nos engagements"][i] ?? "Notre mission"}
                  value={item.title}
                  onChange={(title) => {
                    const mvv = [...content.aib.mvv];
                    mvv[i] = { ...item, title };
                    setContent({ ...content, aib: { ...content.aib, mvv } });
                  }}
                />
                <div className="mt-3">
                  <FrField
                    label="Texte de la carte"
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
        </SubSection>
      </SectionCard>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-ci-green/8 px-4 py-3">
        <AutoTranslateBadge />
        <p className="text-xs text-muted">
          À l&apos;enregistrement, tous les textes modifiés sont traduits en anglais
          pour la version EN du site. Les textes inchangés gardent leur traduction.
        </p>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
