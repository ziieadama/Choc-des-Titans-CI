import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAccounts,
  type AdminRole,
} from "@/lib/adminAuth";
import { verifyStoredUser } from "@/lib/users";

/** Connexion à l'espace d'administration. */
export async function POST(req: Request) {
  let body: { user?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // 1) Comptes d'amorçage (.env) — 2) Utilisateurs créés dans le back office
  let role: AdminRole | null =
    getAccounts().find((a) => a.user === body.user && a.password === body.password)
      ?.role ?? null;
  if (!role && body.user && body.password) {
    role = (await verifyStoredUser(body.user, body.password))?.role ?? null;
  }
  if (!role) {
    // Petit délai pour freiner le brute force
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 3600,
  });
  return res;
}
