import { NextResponse } from "next/server";
import { loadGalleryExtra, saveGalleryExtra, type GalleryExtra } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await loadGalleryExtra());
}

export async function PUT(req: Request) {
  const data = (await req.json()) as GalleryExtra;
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveGalleryExtra(data);
  return NextResponse.json({ ok: true });
}
