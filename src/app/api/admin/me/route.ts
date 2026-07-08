import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/** Rôle de la session courante (le middleware garantit déjà la validité). */
export async function GET() {
  const store = await cookies();
  const { valid, role } = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  return NextResponse.json({ role });
}
