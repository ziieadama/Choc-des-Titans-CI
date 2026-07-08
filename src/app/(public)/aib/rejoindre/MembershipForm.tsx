"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  HandHeart,
  HeartHandshake,
  Dumbbell,
  Loader2,
  BadgeCheck,
  Send,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useLocale } from "@/components/LocaleProvider";

const typesByLocale = {
  fr: [
    { id: "club", icon: Building2, title: "Affilier mon club", text: "Votre club de boxe souhaite rejoindre le réseau officiel de l'AIB et participer aux compétitions homologuées." },
    { id: "athlete", icon: Dumbbell, title: "Devenir athlète licencié", text: "Vous pratiquez la boxe et souhaitez obtenir votre licence pour combattre sur le circuit officiel." },
    { id: "benevole", icon: HeartHandshake, title: "Devenir bénévole", text: "Rejoignez les équipes d'organisation des galas, des campagnes santé et des programmes jeunesse." },
    { id: "soutien", icon: HandHeart, title: "Soutenir l'AIB", text: "Mécène, entreprise ou particulier : contribuez au développement du noble art ivoirien." },
  ],
  en: [
    { id: "club", icon: Building2, title: "Affiliate my club", text: "Your boxing club wants to join the AIB's official network and take part in sanctioned competitions." },
    { id: "athlete", icon: Dumbbell, title: "Become a licensed athlete", text: "You box and want your licence to fight on the official circuit." },
    { id: "benevole", icon: HeartHandshake, title: "Volunteer", text: "Join the teams behind the fight nights, health campaigns and youth programmes." },
    { id: "soutien", icon: HandHeart, title: "Support the AIB", text: "Sponsor, company or individual: help grow the Ivorian noble art." },
  ],
} as const;

type FormState = "idle" | "sending" | "done";

export default function MembershipForm() {
  const { locale } = useLocale();
  const en = locale === "en";
  const types = typesByLocale[locale] ?? typesByLocale.fr;
  const [type, setType] = useState<(typeof typesByLocale.fr)[number]["id"]>("club");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    commune: "",
    club: "",
    message: "",
  });

  const set = (k: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "L'envoi a échoué.");
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "L'envoi a échoué. Réessayez.");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-blue";

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          kicker={en ? "The great family of the noble art" : "La grande famille du noble art"}
          title={en ? "Join the AIB" : "Rejoindre l'AIB"}
          description={
            en
              ? "Affiliated club, athlete, volunteer or supporter: choose your path and submit your application. The AIB team gets back to you within 72 hours."
              : "Club affilié, athlète, bénévole ou soutien : choisissez votre voie et déposez votre demande. L'équipe de l'AIB vous recontacte sous 72h."
          }
        />

        {/* Choix du type */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <button
                onClick={() => setType(t.id)}
                className={`h-full w-full cursor-pointer rounded-xl border p-5 text-left transition-all duration-200 ${
                  type === t.id
                    ? "border-blue bg-blue/10 shadow-glow-blue"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
                aria-pressed={type === t.id}
              >
                <t.icon
                  size={22}
                  className={type === t.id ? "text-blue-light" : "text-white/50"}
                />
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.text}</p>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Formulaire */}
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mt-10 flex flex-col items-center rounded-2xl p-12 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-ci-green/15 text-ci-green"
              >
                <BadgeCheck size={40} />
              </motion.span>
              <h2 className="font-display mt-6 text-2xl uppercase text-white">
                {en ? "Application sent!" : "Demande envoyée !"}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                {en
                  ? "Thank you for your commitment. The AIB team is reviewing your application and will contact you within 72 hours."
                  : "Merci pour votre engagement. L'équipe de l'AIB étudie votre demande et vous recontactera sous 72 heures aux coordonnées indiquées."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={submit}
              className="glass mt-10 rounded-2xl p-7 sm:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    {type === "club" ? (en ? "Manager's name *" : "Nom du responsable *") : en ? "Full name *" : "Nom complet *"}
                  </label>
                  <input
                    id="name"
                    required
                    autoComplete="name"
                    value={fields.name}
                    onChange={set("name")}
                    className={`mt-2 ${inputCls}`}
                    placeholder="Ex : Kouassi Jean-Marc"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={fields.email}
                    onChange={set("email")}
                    className={`mt-2 ${inputCls}`}
                    placeholder="vous@exemple.ci"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    {en ? "Phone *" : "Téléphone *"}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={fields.phone}
                    onChange={set("phone")}
                    className={`mt-2 ${inputCls}`}
                    placeholder="+225 07 XX XX XX XX"
                  />
                </div>
                <div>
                  <label htmlFor="commune" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    {en ? "Commune / City *" : "Commune / Ville *"}
                  </label>
                  <input
                    id="commune"
                    required
                    value={fields.commune}
                    onChange={set("commune")}
                    className={`mt-2 ${inputCls}`}
                    placeholder="Ex : Yopougon"
                  />
                </div>
                {(type === "club" || type === "athlete") && (
                  <div className="sm:col-span-2">
                    <label htmlFor="club" className="text-xs font-bold uppercase tracking-wider text-white/60">
                      {type === "club" ? (en ? "Club name *" : "Nom du club *") : en ? "Current club (if affiliated)" : "Club actuel (si affilié)"}
                    </label>
                    <input
                      id="club"
                      required={type === "club"}
                      value={fields.club}
                      onChange={set("club")}
                      className={`mt-2 ${inputCls}`}
                      placeholder="Ex : Gladiator Boxing Club Académie"
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-white/60">
                    {en ? "Your message" : "Votre message"}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={fields.message}
                    onChange={set("message")}
                    className={`mt-2 resize-none ${inputCls}`}
                    placeholder="Parlez-nous de votre projet, de votre club, de votre parcours…"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-5 rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {en ? "Sending…" : "Envoi en cours…"}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {en ? "Send my application" : "Envoyer ma demande"}
                  </>
                )}
              </button>
              <p className="mt-4 text-[11px] leading-relaxed text-white/35">
                {en
                  ? "* Required fields. Your data is used solely by the AIB to process your application, in line with Ivorian data-protection law."
                  : "* Champs obligatoires. Vos données sont utilisées uniquement pour le traitement de votre demande par l'AIB, conformément à la loi ivoirienne sur la protection des données personnelles."}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
