import { NextResponse } from "next/server";
import { loadSettings, saveSettings, defaultSettings, type Settings } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await loadSettings());
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<Settings>;
  const current = await loadSettings();
  const next: Settings = {
    liveMode: Boolean(body.liveMode ?? current.liveMode),
    liveTitle: String(body.liveTitle ?? current.liveTitle).slice(0, 120),
    prices: { ...defaultSettings.prices, ...current.prices, ...(body.prices ?? {}) },
    purses: { ...defaultSettings.purses, ...current.purses, ...(body.purses ?? {}) },
    youtubeChannel: String(body.youtubeChannel ?? current.youtubeChannel).slice(0, 120),
    hiddenVideoIds: Array.isArray(body.hiddenVideoIds)
      ? body.hiddenVideoIds.map(String).slice(0, 200)
      : current.hiddenVideoIds,
  };
  await saveSettings(next);
  return NextResponse.json({ ok: true, settings: next });
}
