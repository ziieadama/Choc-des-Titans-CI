"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Navbar() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 glass ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <nav className="mx-auto flex h-[72px] sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group" aria-label={t("nav.home")}>
          <Image
            src="/images/brand/logo-cdt.png"
            alt="Logo Choc des Titans"
            width={64}
            height={58}
            className="brand-logo h-12 w-auto sm:h-14 object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="font-display text-lg sm:text-xl uppercase leading-none tracking-wide text-white">
            Choc des <span className="text-gradient-blue">Titans</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-0.5">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-2 text-[13px] font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {t(l.key)}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-blue"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Link
            href="/direct"
            className="btn-shine hidden sm:inline-flex items-center gap-2 rounded-md bg-red px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-dark hover:shadow-glow-red active:scale-95 dark-section"
          >
            <Radio size={15} strokeWidth={2.5} />
            {t("nav.live")}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile / tablette */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="xl:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-1 max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
              {links.map((l, i) => {
                const active =
                  l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      className={`block rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                        active
                          ? "bg-blue/15 text-blue-light"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {t(l.key)}
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
                className="btn-shine mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-red px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white dark-section"
              >
                <Radio size={16} strokeWidth={2.5} />
                {t("nav.watchLive")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
