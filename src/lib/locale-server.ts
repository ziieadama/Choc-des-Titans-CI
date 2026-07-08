import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, makeT, type Locale } from "./i18n";

/** Locale courante côté serveur (cookie `cdt_lang`, défaut : fr). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  return v === "en" ? "en" : "fr";
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: makeT(locale) };
}
