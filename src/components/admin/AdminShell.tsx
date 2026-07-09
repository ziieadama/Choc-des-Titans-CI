"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Newspaper,
  Dumbbell,
  Handshake,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  LayoutTemplate,
  CalendarDays,
  Images,
  Clapperboard,
  UserCog,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/contenu", label: "Contenu du site", icon: LayoutTemplate },
  { href: "/admin/evenements", label: "Événements", icon: CalendarDays },
  { href: "/admin/combattants", label: "Combattants", icon: Dumbbell },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/videos", label: "Vidéos", icon: Clapperboard },
  { href: "/admin/galerie", label: "Galerie & communes", icon: Images },
  { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/admin/ventes", label: "Ventes PPV", icon: Ticket },
  { href: "/admin/adhesions", label: "Adhésions AIB", icon: Users },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UserCog },
  { href: "/admin/parametres", label: "Paramètres & Live", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRole(d?.role ?? null))
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {links.map((l) => {
        const active =
          l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-blue/15 text-blue-light"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <l.icon size={17} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 px-6 py-5">
      <Image
        src="/images/brand/logo-cdt-sm.png"
        alt="Choc des Titans"
        width={38}
        height={38}
        className="brand-logo h-9 w-9 object-contain"
      />
      <div>
        <p className="font-display text-sm uppercase leading-tight text-white">
          Back Office
        </p>
        <p className="text-[10px] uppercase tracking-widest text-blue-light">
          Choc des Titans
        </p>
        {role && (
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
              role === "superadmin"
                ? "bg-gold/15 text-gold"
                : "bg-blue/15 text-blue-light"
            }`}
          >
            {role === "superadmin" ? "★ Superadmin" : "Admin"}
          </span>
        )}
      </div>
    </div>
  );

  const footer = (
    <div className="border-t border-white/8 px-3 py-4 space-y-1">
      <div className="flex items-center justify-between rounded-lg px-3.5 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Thème clair / sombre
        </span>
        <ThemeToggle />
      </div>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={16} />
        Voir le site
      </Link>
      <button
        onClick={logout}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-red/90 transition-colors hover:bg-red/10"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-carbon lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>

      {/* Topbar mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-carbon px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/images/brand/logo-cdt-sm.png"
            alt=""
            width={28}
            height={28}
            className="brand-logo h-7 w-7 object-contain"
          />
          <span className="font-display text-sm uppercase text-white">Back Office</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white hover:bg-white/10"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-carbon pt-16"
            onClick={(e) => e.stopPropagation()}
          >
            {nav}
            {footer}
          </aside>
        </div>
      )}

      {/* Contenu */}
      <main className="flex-1 px-4 pb-16 pt-20 sm:px-8 lg:ml-64 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
