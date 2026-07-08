import { NextResponse } from "next/server";
import { loadUsers, saveUsers, uid, type AdminUser } from "@/lib/store";
import { hashPassword, newSalt } from "@/lib/users";
import { requireSuperadmin } from "@/lib/requireRole";

/** Gestion des comptes du back office — réservée au superadmin. */

const guard = async () =>
  (await requireSuperadmin())
    ? null
    : NextResponse.json({ error: "Action réservée au superadmin." }, { status: 403 });

const publicUser = (u: AdminUser) => ({
  id: u.id,
  name: u.name,
  user: u.user,
  role: u.role,
  createdAt: u.createdAt,
});

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json((await loadUsers()).map(publicUser));
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json();
  const name = String(body.name ?? "").trim().slice(0, 60);
  const user = String(body.user ?? "").trim().toLowerCase().slice(0, 40);
  const password = String(body.password ?? "");
  const role = body.role === "superadmin" ? "superadmin" : "admin";
  if (name.length < 2 || !/^[a-z0-9._-]{3,}$/.test(user) || password.length < 8) {
    return NextResponse.json(
      { error: "Nom, identifiant (min. 3 caractères a-z0-9._-) et mot de passe (min. 8 caractères) requis." },
      { status: 400 }
    );
  }
  const users = await loadUsers();
  if (users.some((u) => u.user === user)) {
    return NextResponse.json({ error: "Cet identifiant existe déjà." }, { status: 409 });
  }
  const salt = newSalt();
  const account: AdminUser = {
    id: uid(),
    name,
    user,
    salt,
    passwordHash: hashPassword(password, salt),
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(account);
  await saveUsers(users);
  return NextResponse.json({ ok: true, user: publicUser(account) });
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json();
  const users = await loadUsers();
  const found = users.find((u) => u.id === body.id);
  if (!found) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  if (body.role === "admin" || body.role === "superadmin") found.role = body.role;
  if (typeof body.password === "string" && body.password.length >= 8) {
    found.salt = newSalt();
    found.passwordHash = hashPassword(body.password, found.salt);
  }
  if (typeof body.name === "string" && body.name.trim().length >= 2) {
    found.name = body.name.trim().slice(0, 60);
  }
  await saveUsers(users);
  return NextResponse.json({ ok: true, user: publicUser(found) });
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await req.json();
  const users = await loadUsers();
  await saveUsers(users.filter((u) => u.id !== id));
  return NextResponse.json({ ok: true });
}
