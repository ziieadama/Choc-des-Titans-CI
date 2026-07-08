import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/store";
import { getLatestVideos } from "@/lib/youtube";

/** Force une resynchronisation immédiate avec YouTube (vide le cache). */
export async function POST() {
  try {
    await fs.unlink(path.join(DATA_DIR, "youtube-cache.json"));
  } catch {}
  const result = await getLatestVideos();
  return NextResponse.json({ ok: true, count: result.videos.length });
}
