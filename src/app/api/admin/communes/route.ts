import { NextResponse } from "next/server";
import { loadCommunes, saveCommunes } from "@/lib/store";
import type { CommuneInfo } from "@/data/types";

export async function GET() {
  return NextResponse.json(await loadCommunes());
}

export async function PUT(req: Request) {
  const data = (await req.json()) as CommuneInfo[];
  if (!Array.isArray(data) || data.some((c) => !c.slug || !c.name)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveCommunes(data);
  return NextResponse.json({ ok: true });
}
