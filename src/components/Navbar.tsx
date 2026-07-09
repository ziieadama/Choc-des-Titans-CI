"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Radio } from "lucide-react";
import type { DictKey } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import SocialRow from "./SocialRow";

const links: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/evenements", key: "nav.events" },
  { href: "/combattants", key: "nav.fighters" },
  { href: "/galerie", key: "nav.gallery" },
  { href: "/videos", key: "nav.videos" },
  { href: "/actualites", key: "nav.news" },
  { href: "/aib", key: "nav.aib" },
  { href: "/partenaires", key: "nav.partners" },
];

/**
 * Header premium : trois zones (marque · navigation centrée · actions),
 * une seule ligne dès 1024 px, filet tricolore, barre de progression de
 * lecture, entrée animée et soulignements élégants.
 */
export default function Navbar() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Progression de lecture de la page
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 glass transition-shadow duration-300 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      {/* Filet tricolore CDT au sommet */}
      <div className="h-[3px] w-full bg-gradient-to-r from-red via-blue to-blue-dark" />

      <nav
        className={`mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-4 xl:gap-3 xl:px-6 transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[76px]"
        }`}
      >
        {/* ——— Zone 1 : la marque ——— */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={t("nav.home")}
        >
          <motion.span whileHover={{ rotate: -4, scale: 1.06 }} transition={{ type: "spring", damping: 12 }}>
            <Image
              src="/images/brand/logo-cdt.png"
              alt="Logo Choc des Titans"
              width={60}
              height={54}
              className={`brand-logo w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-10 sm:h-11" : "h-11 sm:h-[52px]"
              }`}
              priority
            />
          </motion.span>
          <span className="font-display text-lg uppercase leading-none tracking-wide text-white sm:text-xl lg:hidden xl:inline">
            Choc des <span className="text-gradient-blue">Titans</span>
          </span>
        </Link>

        {/* ——— Zone 2 : navigation centrée (une seule ligne dès 1024 px) ——— */}
        <motion.div
          className="hidden flex-1 items-center justify-center lg:flex"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.25 } } }}
        >
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <motion.span
                key={l.href}
                variants={{
                  hidden: { opacity: 0, y: -12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
              >
                <Link
                  href={l.href}
                  className={`group/link relative block whitespace-nowrap px-1.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 xl:px-3.5 xl:text-[12.5px] xl:tracking-[0.08em] ${
                    active ? "text-blue" : "text-white/65 hover:text-white"
                  }`}
                >
                  {t(l.key)}
                  {/* Soulignement animé au survol */}
                  {!active && (
                    <span className="pointer-events-none absolute inset-x-1.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-red to-blue transition-transform duration-300 group-hover/link:scale-x-100 xl:inset-x-3.5" />
                  )}
                  {/* Indicateur de page active, partagé entre les liens */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", damping: 26, stiffness: 300 }}
                      className="pointer-events-none absolute inset-x-1 inset-y-1 -z-10 rounded-md bg-blue/10"
                    >
                      <span className="absolute inset-x-2 -bottom-1 h-[2.5px] rounded-full bg-gradient-to-r from-red to-blue" />
                    </motion.span>
                  )}
                </Link>
              </motion.span>
            );
          })}
        </motion.div>

        {/* ——— Zone 3 : langue · thème · direct ——— */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-0">
          <div className="hidden items-center gap-1.5 md:flex">
            <LanguageToggle />
            <ThemeToggle />
            <span className="mx-1 hidden h-6 w-px bg-white/15 xl:block" aria-hidden />
          </div>
          <Link
            href="/direct"
            className="btn-shine hidden items-center gap-1.5 rounded-md bg-red px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-red-dark hover:shadow-glow-red active:scale-95 sm:inline-flex xl:gap-2 xl:px-4 xl:text-[12.5px] xl:tracking-wider"
          >
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
            <Radio size={14} strokeWidth={2.5} />
            {t("nav.live")}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Barre de progression de lecture */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-[2px] w-full origin-left bg-gradient-to-r from-red via-blue to-blue-light"
        aria-hidden
      />

      {/* ——— Menu mobile / tablette ——— */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass overflow-hidden border-t border-white/5 lg:hidden"
          >
            <div className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      className={`flex items-center justify-between rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                        active
                          ? "bg-blue/15 text-blue"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {t(l.key)}
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-blue" />}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="mt-2 flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <div className="mt-2 flex justify-center rounded-md bg-white/5 px-4 py-3">
                <SocialRow size="sm" />
              </div>
              <Link
                href="/direct"
                className="btn-shine mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-red px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
              >
                <Radio size={16} strokeWidth={2.5} />
                {t("nav.watchLive")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
