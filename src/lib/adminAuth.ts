/**
 * Authentification admin par cookie signé HMAC-SHA256 (Web Crypto,
 * compatible edge middleware et routes node), avec rôles.
 *
 * Comptes configurés via .env.local :
 *   ADMIN_USER / ADMIN_PASSWORD           → rôle "admin" (gestion courante)
 *   SUPERADMIN_USER / SUPERADMIN_PASSWORD → rôle "superadmin" (contrôle total)
 *   ADMIN_SECRET                          → clé de signature des sessions
 */

export const ADMIN_COOKIE = "cdt_admin_session";
const SESSION_HOURS = 12;

export type AdminRole = "admin" | "superadmin";

const encoder = new TextEncoder();

const getSecret = () =>
  process.env.ADMIN_SECRET ?? "cdt-dev-secret-change-me-in-production";

export const getAccounts = (): { user: string; password: string; role: AdminRole }[] => [
  {
    user: process.env.ADMIN_USER ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "titans2026",
    role: "admin",
  },
  {
    user: process.env.SUPERADMIN_USER ?? "superadmin",
    password: process.env.SUPERADMIN_PASSWORD ?? "change-me-superadmin",
    role: "superadmin",
  },
];

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Crée la valeur du cookie de session : role.expiry.signature */
export async function createSessionToken(role: AdminRole): Promise<string> {
  const expiry = Date.now() + SESSION_HOURS * 3600_000;
  const payload = `${role}.${expiry}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Vérifie signature + expiration ; retourne le rôle si valide. */
export async function verifySessionToken(
  token: string | undefined
): Promise<{ valid: boolean; role?: AdminRole }> {
  if (!token) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };
  const [role, expiryStr, sig] = parts;
  if (role !== "admin" && role !== "superadmin") return { valid: false };
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return { valid: false };
  const expected = await hmac(`${role}.${expiryStr}`);
  if (sig.length !== expected.length) return { valid: false };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? { valid: true, role } : { valid: false };
}
