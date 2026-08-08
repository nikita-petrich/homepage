"use client";

import { LayoutGrid, Table2 } from "lucide-react";

import type { Ui } from "@/lib/i18n/ui";

export type GalleryView = "gallery" | "table";

/* The two views, in a module of their own so that both the placeholder button
 * (./database-toolbar.tsx) and the dropdown it upgrades to (./view-menu.tsx)
 * can name the current one without either pulling in the other. */
export const VIEW_OPTIONS: {
  key: GalleryView;
  label: (ui: Ui) => string;
  icon: React.ReactNode;
}[] = [
  {
    key: "gallery",
    label: (ui) => ui.gallery.view,
    icon: <LayoutGrid size={14} strokeWidth={1.9} />,
  },
  {
    key: "table",
    label: (ui) => ui.gallery.table,
    icon: <Table2 size={14} strokeWidth={1.9} />,
  },
];
