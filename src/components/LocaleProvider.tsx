"use client";

import { createContext, useContext, useMemo } from "react";
import { makeT, type DictKey, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<{
  locale: Locale;
  t: (key: DictKey) => string;
}>({ locale: "fr", t: makeT("fr") });

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: makeT(locale) }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
