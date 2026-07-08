"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Radio,
  Check,
  X,
  Lock,
  ShieldCheck,
  Loader2,
  PlayCircle,
  Smartphone,
  CreditCard,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Volume2,
  Maximize,
  Settings,
} from "lucide-react";
import { ppvOffers, paymentMethods, formatFcfa, type PpvOffer } from "@/data/site";
import Countdown from "@/components/Countdown";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { useLocale } from "@/components/LocaleProvider";

/** Traductions EN des offres (les données restent FR par défaut). */
const offersEn: Record<string, { name: string; description: string; features: string[] }> = {
  "pass-soiree": {
    name: "Night Pass",
    description: "The current stage, live and in HD.",
    features: ["Full live fight night", "HD 1080p quality", "48h replay", "Mobile, tablet and TV access"],
  },
  "pass-edition": {
    name: "Edition Pass",
    description: "Every CDT 7 stage, final included.",
    features: ["Every stage live", "Grand Final included", "Unlimited edition replays", "Exclusive locker-room content", "HD 1080p quality"],
  },
  "pass-vip": {
    name: "Digital VIP Pass",
    description: "The ultimate ringside experience.",
    features: ["Everything in the Edition Pass", "Exclusive ringside camera", "Live face-offs and weigh-ins", "Post-fight interviews", "Official digital supporter badge"],
  },
};

interface LiveExperienceProps {
  liveMode: boolean;
  liveTitle: string;
  prices: Record<string, number>;
  nextStage: { name: string; date: string; venue: string; cover: string } | null;
}

type CheckoutStep = "offer" | "payment" | "processing" | "success";

const ACCESS_KEY = "cdt-ppv-access";

export default function LiveExperience({
  liveMode,
  liveTitle,
  prices,
  nextStage,
}: LiveExperienceProps) {
  const { t, locale } = useLocale();
  const en = locale === "en";
  const offerName = (o: PpvOffer) => (en ? offersEn[o.id]?.name ?? o.name : o.name);
  const offerDesc = (o: PpvOffer) => (en ? offersEn[o.id]?.description ?? o.description : o.description);
  const offerFeatures = (o: PpvOffer) => (en ? offersEn[o.id]?.features ?? o.features : o.features);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("offer");
  const [offer, setOffer] = useState<PpvOffer | null>(null);
  const [method, setMethod] = useState<string>("orange");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasAccess(Boolean(localStorage.getItem(ACCESS_KEY)));
  }, []);

  const priceOf = (o: PpvOffer) => prices[o.id] ?? o.price;

  const openCheckout = (o: PpvOffer) => {
    setOffer(o);
    setStep("offer");
    setError(null);
    setCheckoutOpen(true);
  };

  const pay = async () => {
    if (!offer) return;
    setError(null);
    if (method !== "card" && phone.replace(/\D/g, "").length < 8) {
      setError(t("live.phoneError"));
      return;
    }
    setStep("processing");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: offer.id, method, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Le paiement a échoué.");
      // Simulation du délai de validation mobile money
      await new Promise((r) => setTimeout(r, 1800));
      localStorage.setItem(
        ACCESS_KEY,
        JSON.stringify({ offerId: offer.id, orderId: data.orderId, at: Date.now() })
      );
      setStep("success");
      setHasAccess(true);
    } catch (e) {
      setStep("payment");
      setError(e instanceof Error ? e.message : t("live.payError"));
    }
  };

  return (
    <div className="pb-20">
      {/* ===== Écran principal : player ou paywall ===== */}
      <section className="relative overflow-hidden pt-16 sm:pt-[72px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="dark-section relative overflow-hidden rounded-2xl border border-white/8 bg-black shadow-card">
            <div className="relative aspect-video">
              {nextStage && (
                <Image
                  src={nextStage.cover}
                  alt={liveTitle}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className={`object-cover transition-all duration-700 ${
                    hasAccess ? "opacity-90" : "opacity-40 blur-[2px] scale-105"
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Badge état */}
              <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                {liveMode ? (
                  <span className="inline-flex items-center gap-2 rounded bg-red px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                    <span className="live-dot inline-block h-2 w-2 rounded-full bg-white" />
                    {t("common.live")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded glass-light px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80">
                    <CalendarDays size={13} />
                    {t("live.upcoming")}
                  </span>
                )}
                <span className="hidden sm:inline-block rounded glass-light px-3 py-1.5 text-xs font-semibold text-white/70">
                  {liveTitle}
                </span>
              </div>

              {/* Contenu central */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                {hasAccess ? (
                  liveMode ? (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      className="cursor-pointer text-white drop-shadow-[0_0_30px_rgba(225,31,33,0.6)]"
                      aria-label="Lancer le direct"
                    >
                      <PlayCircle size={92} strokeWidth={1.2} />
                    </motion.button>
                  ) : (
                    <div>
                      <p className="inline-flex items-center gap-2 rounded-full bg-ci-green/15 px-4 py-2 text-sm font-bold text-ci-green">
                        <BadgeCheck size={17} />
                        {t("live.passActive")}
                      </p>
                      <h2 className="font-display mt-5 text-3xl sm:text-5xl uppercase text-white">
                        {t("live.startsSoon")}
                      </h2>
                      {nextStage && (
                        <>
                          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/65">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} className="text-blue-light" />
                              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(nextStage.date))}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} className="text-blue-light" />
                              {nextStage.venue}
                            </span>
                          </p>
                          <div className="mt-7 flex justify-center">
                            <Countdown target={nextStage.date} compact />
                          </div>
                        </>
                      )}
                    </div>
                  )
                ) : (
                  <div>
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full glass-light">
                      <Lock size={26} className="text-white/80" />
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-5xl uppercase text-white">
                      {t("live.reserved")}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-white/65">
                      {t("live.reservedDesc")}
                    </p>
                    <button
                      onClick={() => openCheckout(ppvOffers[1])}
                      className="mt-7 inline-flex cursor-pointer items-center gap-2.5 rounded-md bg-red px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-dark hover:shadow-glow-red active:scale-95"
                    >
                      <Radio size={17} strokeWidth={2.5} />
                      {t("live.unlock")}
                    </button>
                  </div>
                )}
              </div>

              {/* Fausse barre player quand accès actif */}
              {hasAccess && (
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-4 bg-gradient-to-t from-black/90 to-transparent px-5 pb-4 pt-10">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                    <span className={`block h-full rounded-full bg-red ${liveMode ? "w-[92%]" : "w-0"}`} />
                  </span>
                  <span className="flex items-center gap-3 text-white/70">
                    <Volume2 size={17} />
                    <Settings size={17} />
                    <Maximize size={17} />
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
            <ShieldCheck size={14} className="text-ci-green" />
            {t("live.secure")}
          </p>
        </div>
      </section>

      {/* ===== Offres ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <SectionHeader
          kicker={t("live.offers.kicker")}
          title={t("live.offers.title")}
          description={t("live.offers.desc")}
          align="center"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {ppvOffers.map((o, i) => (
            <Reveal key={o.id} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                  o.highlight
                    ? "border border-blue/60 bg-gradient-to-b from-blue/15 to-transparent shadow-glow-blue"
                    : "glass-light hover:border-white/20"
                }`}
              >
                {o.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {t("live.mostChosen")}
                  </span>
                )}
                <h3 className="font-display text-xl uppercase text-white">{offerName(o)}</h3>
                <p className="mt-1 text-sm text-muted">{offerDesc(o)}</p>
                <p className="mt-5">
                  <span className="font-display tabular text-4xl text-white">
                    {formatFcfa(priceOf(o))}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {offerFeatures(o).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-ci-green" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openCheckout(o)}
                  className={`mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all active:scale-95 ${
                    o.highlight
                      ? "bg-red hover:bg-red-dark hover:shadow-glow-red"
                      : "bg-white/8 hover:bg-white/15"
                  }`}
                >
                  {t("live.buyPass")}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Moyens de paiement */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/40">
              {t("live.payVia")}
            </span>
            {paymentMethods.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-2 rounded-full glass-light px-4 py-2 text-xs font-semibold text-white/75"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: m.color }}
                />
                {m.name}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== Modal checkout ===== */}
      <AnimatePresence>
        {checkoutOpen && offer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-6"
            onClick={() => step !== "processing" && setCheckoutOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Achat de pass"
              className="glass relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-7 max-h-[90dvh] overflow-y-auto"
            >
              {step !== "processing" && (
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              )}

              {step === "offer" && (
                <div>
                  <h3 className="font-display text-2xl uppercase text-white">
                    {offerName(offer)}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{offerDesc(offer)}</p>
                  <p className="font-display tabular mt-4 text-3xl text-white">
                    {formatFcfa(priceOf(offer))}
                  </p>
                  <div className="mt-6 space-y-2">
                    {ppvOffers.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setOffer(o)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                          offer.id === o.id
                            ? "border-blue bg-blue/10"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <span className="text-sm font-semibold text-white">{offerName(o)}</span>
                        <span className="tabular text-sm font-bold text-blue-light">
                          {formatFcfa(priceOf(o))}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep("payment")}
                    className="mt-6 w-full cursor-pointer rounded-md bg-red px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-dark active:scale-[0.98]"
                  >
                    {t("live.continue")}
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div>
                  <h3 className="font-display text-2xl uppercase text-white">{t("live.payment")}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {offerName(offer)} · <span className="tabular font-bold text-white">{formatFcfa(priceOf(offer))}</span>
                  </p>

                  <fieldset className="mt-5">
                    <legend className="text-xs font-bold uppercase tracking-wider text-white/60">
                      {t("live.payMethod")}
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {paymentMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-left text-xs font-semibold transition-all ${
                            method === m.id
                              ? "border-blue bg-blue/10 text-white"
                              : "border-white/10 text-white/65 hover:border-white/25"
                          }`}
                        >
                          <span
                            className="inline-block h-3 w-3 shrink-0 rounded-full"
                            style={{ background: m.color }}
                          />
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {method !== "card" ? (
                    <div className="mt-5">
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-white/60">
                        {t("live.phoneNumber")} {paymentMethods.find((m) => m.id === method)?.name} *
                      </label>
                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 focus-within:border-blue">
                        <Smartphone size={16} className="text-white/40" />
                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+225 07 XX XX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-white/40">
                        {t("live.phoneHint")}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="flex items-center gap-2 text-sm text-white/70">
                        <CreditCard size={16} className="text-blue-light" />
                        {t("live.cardDemo")}
                      </p>
                    </div>
                  )}

                  {error && (
                    <p role="alert" className="mt-4 rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={pay}
                    className="mt-6 w-full cursor-pointer rounded-md bg-red px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-red-dark active:scale-[0.98]"
                  >
                    {t("live.pay")} {formatFcfa(priceOf(offer))}
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                    <ShieldCheck size={13} className="text-ci-green" />
                    {t("live.encrypted")}
                  </p>
                </div>
              )}

              {step === "processing" && (
                <div className="flex flex-col items-center py-10 text-center">
                  <Loader2 size={44} className="animate-spin text-blue-light" />
                  <h3 className="font-display mt-6 text-xl uppercase text-white">
                    {t("live.processing")}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    {method === "card"
                      ? t("live.processingCard")
                      : t("live.processingMobile")}
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-col items-center py-8 text-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-ci-green/15 text-ci-green"
                  >
                    <BadgeCheck size={40} />
                  </motion.span>
                  <h3 className="font-display mt-6 text-2xl uppercase text-white">
                    {t("live.success")}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    {t("live.successDesc")}
                  </p>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    className="mt-7 w-full cursor-pointer rounded-md bg-blue px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark active:scale-[0.98]"
                  >
                    {t("live.goLive")}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
