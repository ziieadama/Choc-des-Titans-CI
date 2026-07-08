import { NextResponse } from "next/server";
import { getLatestVideos } from "@/lib/youtube";

/** Liste complète (non filtrée) des vidéos synchronisées, pour l'admin. */
export async function GET() {
  return NextResponse.json(await getLatestVideos());
}
