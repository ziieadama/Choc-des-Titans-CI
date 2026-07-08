import { NextResponse } from "next/server";
import { loadEditions, saveEditions } from "@/lib/store";
import type { Edition } from "@/data/types";

export async function GET() {
  return NextResponse.json(await loadEditions());
}

/** Remplace la collection complète (éditions → étapes → combats). */
export async function PUT(req: Request) {
  const data = (await req.json()) as Edition[];
  if (!Array.isArray(data) || data.some((e) => !e.slug || !e.title)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveEditions(data);
  return NextResponse.json({ ok: true });
}
