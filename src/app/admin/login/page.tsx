"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, User, KeyRound, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Connexion impossible.");
      router.push(params.get("from") ?? "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass w-full max-w-md rounded-2xl p-8 sm:p-10"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex rounded-full bg-white p-1.5">
          <Image
            src="/images/brand/logo-cdt-sm.png"
            alt="Choc des Titans"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </span>
        <div>
          <h1 className="font-display text-xl uppercase text-white">
            Back Office
          </h1>
          <p className="text-xs uppercase tracking-widest text-blue-light">
            Choc des Titans · Administration
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="user" className="text-xs font-bold uppercase tracking-wider text-white/60">
            Identifiant
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 focus-within:border-blue">
            <User size={16} className="text-white/40" />
            <input
              id="user"
              required
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              placeholder="admin"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-white/60">
            Mot de passe
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 focus-within:border-blue">
            <KeyRound size={16} className="text-white/40" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              placeholder="••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-blue-light hover:text-white"
            >
              {showPass ? "Masquer" : "Voir"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-dark hover:shadow-glow-blue active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Connexion…
            </>
          ) : (
            <>
              <Lock size={15} />
              Se connecter
            </>
          )}
        </button>
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-white/35">
        <ShieldCheck size={13} className="text-ci-green" />
        Accès réservé — session sécurisée 12h
      </p>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="dark-section relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0b0b] px-4">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue/12 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-red/10 blur-[130px]" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
