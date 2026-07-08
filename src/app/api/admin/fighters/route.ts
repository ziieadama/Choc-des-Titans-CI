import { NextResponse } from "next/server";
import { loadFighters, saveFighters } from "@/lib/store";
import type { Fighter } from "@/data/types";

export async function GET() {
  return NextResponse.json(await loadFighters());
}

export async function PUT(req: Request) {
  const data = (await req.json()) as Fighter[];
  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveFighters(data);
  return NextResponse.json({ ok: true });
}
