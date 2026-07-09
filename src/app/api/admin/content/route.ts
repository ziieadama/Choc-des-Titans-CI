import { NextResponse } from "next/server";
import { loadContent, saveContent, type SiteContent } from "@/lib/store";
import { autoTranslateLocalized } from "@/lib/translate";

export async function GET() {
  return NextResponse.json(await loadContent());
}

/**
 * Enregistre le contenu du site. L'admin saisit uniquement le français :
 * les versions anglaises sont traduites automatiquement (seuls les textes
 * modifiés sont retraduits).
 */
export async function PUT(req: Request) {
  const data = (await req.json()) as SiteContent;
  if (!data?.hero || !data?.aib) {
    return NextResponse.json({ error: "Format invalide." }, { status: 400 });
  }
  const previous = await loadContent();
  const translated = await autoTranslateLocalized(data, previous);
  await saveContent(translated);
  return NextResponse.json({ ok: true, content: translated });
}
