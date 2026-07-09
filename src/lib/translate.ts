import "server-only";

/**
 * Traduction automatique français → anglais.
 * L'admin saisit uniquement en français ; l'anglais est généré à
 * l'enregistrement (endpoint public Google Translate, sans clé).
 * En cas d'échec réseau, le texte français est conservé tel quel
 * pour ne jamais bloquer une publication.
 */
export async function translateFrToEn(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=" +
      encodeURIComponent(trimmed);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!res.ok) return text;
    const data = (await res.json()) as [[string, string][]];
    const out = (data[0] ?? [])
      .map((seg) => seg?.[0] ?? "")
      .join("")
      .trim();
    return out || text;
  } catch {
    return text;
  }
}

interface Localized {
  fr: string;
  en: string;
}

const isLocalized = (v: unknown): v is Localized =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Localized).fr === "string" &&
  typeof (v as Localized).en === "string";

/**
 * Parcourt un objet et régénère chaque champ `en` à partir du `fr`
 * lorsqu'il a changé par rapport à la version précédente (les textes
 * inchangés conservent leur traduction existante — zéro appel inutile).
 */
export async function autoTranslateLocalized<T>(next: T, prev?: T): Promise<T> {
  const walk = async (n: unknown, p: unknown): Promise<unknown> => {
    if (isLocalized(n)) {
      const before = isLocalized(p) ? p : undefined;
      if (before && before.fr === n.fr && before.en) {
        return { fr: n.fr, en: before.en };
      }
      return { fr: n.fr, en: await translateFrToEn(n.fr) };
    }
    if (Array.isArray(n)) {
      const prevArr = Array.isArray(p) ? p : [];
      const out = [];
      for (let i = 0; i < n.length; i++) out.push(await walk(n[i], prevArr[i]));
      return out;
    }
    if (typeof n === "object" && n !== null) {
      const src = n as Record<string, unknown>;
      const prevObj = (typeof p === "object" && p !== null ? p : {}) as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(src)) {
        out[key] = await walk(src[key], prevObj[key]);
      }
      return out;
    }
    return n;
  };
  return (await walk(next, prev)) as T;
}
