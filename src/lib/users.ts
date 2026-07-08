import "server-only";
import { createHash, randomBytes } from "crypto";
import { loadUsers, type AdminUser } from "./store";
import type { AdminRole } from "./adminAuth";

/** Hachage de mot de passe : sha256(salt + mot de passe). */
export const hashPassword = (password: string, salt: string) =>
  createHash("sha256").update(`${salt}${password}`).digest("hex");

export const newSalt = () => randomBytes(16).toString("hex");

/** Vérifie un couple identifiant/mot de passe dans le store utilisateurs. */
export async function verifyStoredUser(
  user: string,
  password: string
): Promise<{ role: AdminRole; account: AdminUser } | null> {
  const users = await loadUsers();
  const found = users.find((u) => u.user === user);
  if (!found) return null;
  if (hashPassword(password, found.salt) !== found.passwordHash) return null;
  return { role: found.role, account: found };
}
