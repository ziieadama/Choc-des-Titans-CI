import { NextResponse } from "next/server";
import { loadNews, saveNews } from "@/lib/store";
import type { NewsArticle } from "@/data/types";

export async function GET() {
  return NextResponse.json(await loadNews());
}

/** Remplace la collection complète (CRUD géré côté interface). */
export async function PUT(req: Request) {
  const data = (await req.json()) as NewsArticle[];
  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveNews(data);
  return NextResponse.json({ ok: true });
}
