"use client";

import { createContext, useContext, useMemo } from "react";

import type { Locale } from "./config";
import type { Ui } from "./ui";

type I18nValue = { locale: Locale; ui: Ui };

const I18nContext = createContext<I18nValue | null>(null);

/* Hands the active locale and the localised interface strings to the client
   components. Mounted once in the locale layout, which knows the locale from
   its route params — so no client component ever has to guess it. */
export function I18nProvider({
  locale,
  ui,
  children,
}: I18nValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, ui }), [locale, ui]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return value;
}

export function useUi(): Ui {
  return useI18n().ui;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
