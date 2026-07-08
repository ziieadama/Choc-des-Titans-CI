import { NextResponse } from "next/server";
import { loadPartners, savePartners } from "@/lib/store";
import type { Partner } from "@/data/types";

export async function GET() {
  return NextResponse.json(await loadPartners());
}

export async function PUT(req: Request) {
  const data = (await req.json()) as Partner[];
  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await savePartners(data);
  return NextResponse.json({ ok: true });
}
