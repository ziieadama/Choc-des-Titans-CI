import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/store";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

/** Sert les fichiers uploadés depuis data-store/uploads (logos partenaires). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  // Nom strictement contrôlé : pas de traversée de répertoire possible
  if (!/^[a-z0-9]+\.(png|jpg|webp|svg)$/.test(name)) {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }
  const filePath = path.join(DATA_DIR, "uploads", name);
  try {
    const data = await fs.readFile(filePath);
    const ext = name.split(".").pop() as string;
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
