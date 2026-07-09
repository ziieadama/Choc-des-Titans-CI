import { NextResponse } from "next/server";
import { deleteStored } from "@/lib/store";
import { getLatestVideos } from "@/lib/youtube";

/** Force une resynchronisation immédiate avec YouTube (vide le cache). */
export async function POST() {
  await deleteStored("youtube-cache.json");
  const result = await getLatestVideos();
  return NextResponse.json({ ok: true, count: result.videos.length });
}
