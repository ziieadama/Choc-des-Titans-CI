import manifest from "./gallery-manifest.json";

const galleryManifest = manifest as Record<string, string[]>;

/** Images d'un dossier de la galerie (clé du manifeste). */
export const imagesOf = (key: string): string[] => galleryManifest[key] ?? [];

/** n premières images d'un dossier. */
export const firstImages = (key: string, n: number): string[] =>
  imagesOf(key).slice(0, n);

/** Sous-dossiers galerie d'une édition (ex: "cdt6" -> abobo, adjame, ...). */
export const editionGalleryKeys = (editionKey: string): string[] =>
  Object.keys(galleryManifest).filter(
    (k) => k.startsWith(editionKey + "/") || k === editionKey
  );

export default galleryManifest;
