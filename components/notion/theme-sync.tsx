"use client";

import { useEffect } from "react";

import { syncThemeClass } from "@/lib/theme";

/* Backstop for the inline theme script in the layout: see syncThemeClass().
   Renders nothing; it only makes sure the class on <html> matches the stored
   preference on routes where the inline script did not run. */
export function ThemeSync() {
  useEffect(() => {
    syncThemeClass();
  }, []);
  return null;
}
