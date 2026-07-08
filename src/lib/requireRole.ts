import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken, type AdminRole } from "./adminAuth";

/** Rôle de la session admin courante (routes node). */
export async function currentRole(): Promise<AdminRole | null> {
  const store = await cookies();
  const { valid, role } = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  return valid && role ? role : null;
}

/** Garde superadmin pour les opérations sensibles (suppressions…). */
export async function requireSuperadmin(): Promise<boolean> {
  return (await currentRole()) === "superadmin";
}
