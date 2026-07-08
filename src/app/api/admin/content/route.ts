import { NextResponse } from "next/server";
import { loadContent, saveContent, type SiteContent } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await loadContent());
}

export async function PUT(req: Request) {
  const data = (await req.json()) as SiteContent;
  if (!data?.hero || !data?.aib) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  await saveContent(data);
  return NextResponse.json({ ok: true });
}
