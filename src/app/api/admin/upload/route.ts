import { NextResponse } from "next/server";
import { saveUpload, uid } from "@/lib/store";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};
const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo

/** Upload d'un logo partenaire (FormData `file`) → URL servie par /api/uploads. */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format non supporté (PNG, JPG, WebP ou SVG)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 Mo)." }, { status: 400 });
  }

  const name = `${uid()}.${ext}`;
  const url = await saveUpload(name, Buffer.from(await file.arrayBuffer()), file.type);

  return NextResponse.json({ ok: true, url });
}
