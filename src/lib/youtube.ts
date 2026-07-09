import "server-only";
import { readJson, writeJson, loadSettings } from "./store";

/**
 * Intégration YouTube Data API v3 — 100% côté serveur.
 * La clé API vit dans .env.local (YOUTUBE_API_KEY) et n'est JAMAIS
 * envoyée au navigateur. Les résultats sont mis en cache sur disque
 * (data-store/youtube-cache.json) pour préserver le quota.
 */

export interface YtVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  /** Classement automatique d'après le titre/la description. */
  category: "combat" | "actu";
}

interface YtCache {
  fetchedAt: number;
  channelKey: string;
  channelTitle?: string;
  videos: YtVideo[];
}

const CACHE_FILE = "youtube-cache.json";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const API = "https://www.googleapis.com/youtube/v3";

const FIGHT_RE =
  /\bvs\b|combat|fight|k\.?-?o\b|round|étape|etape|finale|main event|face[- ]à[- ]face|résumé|resume|highlight/i;

const classify = (title: string, description: string): YtVideo["category"] =>
  FIGHT_RE.test(`${title} ${description}`) ? "combat" : "actu";

const readCache = () => readJson<YtCache | null>(CACHE_FILE, null);
const writeCache = (cache: YtCache) => writeJson(CACHE_FILE, cache);

async function ytFetch(pathAndQuery: string, key: string) {
  const res = await fetch(`${API}/${pathAndQuery}&key=${key}`, {
    // Pas de cache Next : on gère notre propre cache disque
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`YouTube API ${res.status}`);
  }
  return res.json();
}

/** Résout l'ID de chaîne à partir d'un @handle, d'une URL ou d'un ID brut. */
async function resolveChannel(
  raw: string,
  key: string
): Promise<{ id: string; title?: string; uploads?: string } | null> {
  let value = raw.trim();
  // URL → extraire le segment utile
  const urlMatch = value.match(/youtube\.com\/(?:channel\/|c\/|@)?([^/?&\s]+)/i);
  if (urlMatch) value = urlMatch[1].startsWith("@") ? urlMatch[1] : `@${urlMatch[1]}`;
  if (/^UC[\w-]{22}$/.test(value)) {
    const data = await ytFetch(
      `channels?part=contentDetails,snippet&id=${encodeURIComponent(value)}`,
      key
    );
    const c = data.items?.[0];
    return c
      ? { id: c.id, title: c.snippet?.title, uploads: c.contentDetails?.relatedPlaylists?.uploads }
      : null;
  }
  const handle = value.startsWith("@") ? value : `@${value}`;
  const data = await ytFetch(
    `channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(handle)}`,
    key
  );
  const c = data.items?.[0];
  if (c) {
    return { id: c.id, title: c.snippet?.title, uploads: c.contentDetails?.relatedPlaylists?.uploads };
  }
  // Dernier recours : recherche de chaîne
  const search = await ytFetch(
    `search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(raw)}`,
    key
  );
  const found = search.items?.[0];
  if (!found) return null;
  const full = await ytFetch(
    `channels?part=contentDetails,snippet&id=${found.id.channelId}`,
    key
  );
  const fc = full.items?.[0];
  return fc
    ? { id: fc.id, title: fc.snippet?.title, uploads: fc.contentDetails?.relatedPlaylists?.uploads }
    : null;
}

/**
 * Dernières vidéos de la chaîne officielle (max 12), avec cache disque.
 * Retourne une liste vide en cas d'absence de clé, de chaîne introuvable
 * ou d'erreur API (le site reste fonctionnel).
 */
export async function getLatestVideos(): Promise<{
  videos: YtVideo[];
  channelTitle?: string;
}> {
  const key = process.env.YOUTUBE_API_KEY;
  const settings = await loadSettings();
  const channelKey = settings.youtubeChannel;

  const cache = await readCache();
  const fresh =
    cache &&
    cache.channelKey === channelKey &&
    Date.now() - cache.fetchedAt < CACHE_TTL;
  if (fresh) return { videos: cache.videos, channelTitle: cache.channelTitle };

  if (!key) {
    return { videos: cache?.videos ?? [] };
  }

  try {
    const channel = await resolveChannel(channelKey, key);
    if (!channel?.uploads) {
      // Chaîne introuvable : on sert l'éventuel cache périmé
      return { videos: cache?.videos ?? [] };
    }
    const data = await ytFetch(
      `playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${channel.uploads}`,
      key
    );
    type Item = {
      contentDetails?: { videoId?: string; videoPublishedAt?: string };
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: Record<string, { url?: string }>;
      };
    };
    const videos: YtVideo[] = ((data.items ?? []) as Item[])
      .map((it) => {
        const sn = it.snippet ?? {};
        const id = it.contentDetails?.videoId ?? "";
        const title = sn.title ?? "";
        const description = sn.description ?? "";
        return {
          id,
          title,
          description: description.slice(0, 300),
          publishedAt: it.contentDetails?.videoPublishedAt ?? sn.publishedAt ?? "",
          thumbnail:
            sn.thumbnails?.high?.url ??
            sn.thumbnails?.medium?.url ??
            sn.thumbnails?.default?.url ??
            "",
          category: classify(title, description),
        };
      })
      .filter((v) => v.id && v.title && v.title !== "Private video");

    await writeCache({
      fetchedAt: Date.now(),
      channelKey,
      channelTitle: channel.title,
      videos,
    });
    return { videos, channelTitle: channel.title };
  } catch {
    // Erreur API/réseau : cache périmé plutôt que rien
    return { videos: cache?.videos ?? [], channelTitle: cache?.channelTitle };
  }
}
