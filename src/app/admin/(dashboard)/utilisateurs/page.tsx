"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, KeyRound, ShieldCheck, Crown, X } from "lucide-react";
import { Field, inputCls } from "@/components/admin/ui";

interface AdminUserPublic {
  id: string;
  name: string;
  user: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

const genPassword = () =>
  "CDT-" +
  Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"[b % 54])
    .join("") +
  "!";

/** Gestion des comptes du back office (réservé au superadmin). */
export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<AdminUserPublic[] | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", user: "", password: genPassword(), role: "admin" as "admin" | "superadmin" });
  const [lastCreated, setLastCreated] = useState<{ user: string; password: string } | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/users");
    if (res.status === 403) {
      setForbidden(true);
      setUsers([]);
      return;
    }
    setUsers(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      alert(data.error ?? "Création impossible.");
      return;
    }
    setLastCreated({ user: form.user, password: form.password });
    setCreating(false);
    setForm({ name: "", user: "", password: genPassword(), role: "admin" });
    await load();
  };

  const resetPassword = async (u: AdminUserPublic) => {
    const password = genPassword();
    if (!confirm(`Réinitialiser le mot de passe de ${u.name} ?`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, password }),
    });
    setBusy(false);
    if (res.ok) setLastCreated({ user: u.user, password });
  };

  const setRole = async (u: AdminUserPublic, role: "admin" | "superadmin") => {
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, role }),
    });
    setBusy(false);
    await load();
  };

  const remove = async (u: AdminUserPublic) => {
    if (!confirm(`Supprimer le compte de ${u.name} ?`)) return;
    setBusy(true);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id }),
    });
    setBusy(false);
    await load();
  };

  if (users === null) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl uppercase text-white">Utilisateurs</h1>
        <div className="glass-light mt-8 flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
          <ShieldCheck size={32} className="text-gold" />
          <p className="max-w-md text-sm leading-relaxed text-muted">
            La gestion des comptes est réservée au <strong className="text-gold">superadmin</strong>.
            Connectez-vous avec le compte superadmin pour ajouter ou modifier des utilisateurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Utilisateurs</h1>
          <p className="mt-1 text-sm text-muted">
            Comptes d&apos;accès au back office. Les mots de passe sont hachés (SHA-256 + sel).
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark"
        >
          <Plus size={15} />
          Ajouter un compte
        </button>
      </div>

      {lastCreated && (
        <div className="glass mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ci-green/40 p-4">
          <p className="text-sm text-white/85">
            Identifiants à transmettre : <strong className="text-white">{lastCreated.user}</strong> /{" "}
            <code className="rounded bg-white/10 px-2 py-0.5 text-ci-green">{lastCreated.password}</code>
            <span className="ml-2 text-xs text-white/45">(affiché une seule fois)</span>
          </p>
          <button
            onClick={() => setLastCreated(null)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/50 hover:bg-white/10"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Comptes d'amorçage */}
      <div className="glass-light mt-6 rounded-xl p-4 text-xs text-white/45">
        Les comptes d&apos;amorçage <code className="text-blue-light">admin</code> et{" "}
        <code className="text-gold">superadmin</code> (définis dans les variables
        d&apos;environnement) restent toujours actifs en plus des comptes ci-dessous.
      </div>

      <div className="mt-4 space-y-3">
        {users.length === 0 && (
          <p className="glass-light rounded-xl px-6 py-10 text-center text-sm text-white/50">
            Aucun compte supplémentaire. Ajoutez des membres de l&apos;équipe avec le bouton ci-dessus.
          </p>
        )}
        {users.map((u) => (
          <div key={u.id} className="glass-light flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
            <span
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                u.role === "superadmin" ? "bg-gold/15 text-gold" : "bg-blue/15 text-blue-light"
              }`}
            >
              {u.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                {u.name}
                {u.role === "superadmin" && <Crown size={13} className="text-gold" />}
              </p>
              <p className="text-xs text-white/45">
                @{u.user} · créé le {new Date(u.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <select
                value={u.role}
                disabled={busy}
                onChange={(e) => setRole(u, e.target.value as "admin" | "superadmin")}
                className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider outline-none ${
                  u.role === "superadmin" ? "bg-gold/15 text-gold" : "bg-blue/15 text-blue-light"
                }`}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <button
                onClick={() => resetPassword(u)}
                disabled={busy}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/8 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/15"
              >
                <KeyRound size={12} />
                Réinit. mot de passe
              </button>
              <button
                onClick={() => remove(u)}
                disabled={busy}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white/40 hover:bg-red/10 hover:text-red"
                aria-label="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal création */}
      {creating && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setCreating(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass relative mt-10 w-full max-w-md rounded-2xl p-7"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="font-display text-xl uppercase text-white">Nouveau compte</h2>
            <div className="mt-5 space-y-4">
              <Field label="Nom complet *">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Ex : Aminata Koné" />
              </Field>
              <Field label="Identifiant de connexion *" hint="Minuscules, chiffres, . _ - (min. 3 caractères)">
                <input value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value.toLowerCase() })} className={inputCls} placeholder="aminata.kone" />
              </Field>
              <Field label="Mot de passe *" hint="Généré automatiquement — copiez-le avant de valider.">
                <div className="flex gap-2">
                  <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`tabular ${inputCls}`} />
                  <button
                    onClick={() => setForm({ ...form, password: genPassword() })}
                    className="shrink-0 cursor-pointer rounded-md bg-white/8 px-3 text-[11px] font-bold uppercase text-white hover:bg-white/15"
                  >
                    Générer
                  </button>
                </div>
              </Field>
              <Field label="Rôle">
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "superadmin" })} className={`${inputCls} cursor-pointer`}>
                  <option value="admin" className="bg-carbon">Admin — gestion courante</option>
                  <option value="superadmin" className="bg-carbon">Superadmin — contrôle total</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setCreating(false)} className="cursor-pointer rounded-md bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15">
                Annuler
              </button>
              <button
                onClick={create}
                disabled={busy}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark disabled:opacity-60"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
