"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Eye, EyeOff, ExternalLink } from "lucide-react";
import type { YtVideo } from "@/lib/youtube";
import { Field, SaveBar, inputCls } from "@/components/admin/ui";

interface Settings {
  liveMode: boolean;
  liveTitle: string;
  prices: Record<string, number>;
  purses: Record<string, number>;
  youtubeChannel: string;
  hiddenVideoIds: string[];
}

/**
 * Vidéos YouTube synchronisées : chaîne, resynchronisation manuelle,
 * masquage de vidéos sur le site.
 */
export default function AdminVideosPage() {
  const [videos, setVideos] = useState<YtVideo[] | null>(null);
  const [channelTitle, setChannelTitle] = useState<string | undefined>();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [v, s] = await Promise.all([
      fetch("/api/admin/videos").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ]);
    setVideos(v.videos);
    setChannelTitle(v.channelTitle);
    setSettings(s);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetch("/api/admin/videos-refresh", { method: "POST" });
    await load();
    setRefreshing(false);
  };

  const toggleHidden = (id: string) => {
    if (!settings) return;
    const hidden = settings.hiddenVideoIds.includes(id)
      ? settings.hiddenVideoIds.filter((v) => v !== id)
      : [...settings.hiddenVideoIds, id];
    setSettings({ ...settings, hiddenVideoIds: hidden });
  };

  if (!videos || !settings) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-blue-light" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase text-white">Vidéos</h1>
          <p className="mt-1 text-sm text-muted">
            Synchronisées avec YouTube{channelTitle ? ` — chaîne « ${channelTitle} »` : ""} ·
            resync automatique toutes les 15 min.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/videos"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md bg-white/8 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
          >
            <ExternalLink size={13} />
            Page publique
          </a>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-dark disabled:opacity-60"
          >
            {refreshing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Synchroniser maintenant
          </button>
        </div>
      </div>

      <div className="glass-light mt-6 rounded-2xl p-6">
        <Field
          label="Chaîne YouTube officielle"
          hint="@handle, URL ou ID de chaîne (UC…). Les nouvelles vidéos publiées apparaissent automatiquement sur le site."
        >
          <input
            value={settings.youtubeChannel}
            onChange={(e) => setSettings({ ...settings, youtubeChannel: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.length === 0 && (
          <p className="col-span-full rounded-xl glass-light px-6 py-12 text-center text-sm text-white/50">
            Aucune vidéo synchronisée pour le moment.
          </p>
        )}
        {videos.map((v) => {
          const hidden = settings.hiddenVideoIds.includes(v.id);
          return (
            <div key={v.id} className={`glass-light overflow-hidden rounded-xl transition-opacity ${hidden ? "opacity-50" : ""}`}>
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.thumbnail} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {v.category === "combat" ? "Combat" : "Coulisses"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold leading-snug text-white line-clamp-2">{v.title}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <a
                    href={`https://youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-wider text-blue-light hover:text-white"
                  >
                    Voir sur YouTube
                  </a>
                  <button
                    onClick={() => toggleHidden(v.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      hidden
                        ? "bg-white/8 text-white/50 hover:bg-white/15"
                        : "bg-ci-green/12 text-ci-green hover:bg-ci-green/20"
                    }`}
                  >
                    {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    {hidden ? "Masquée" : "Visible"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
