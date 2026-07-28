"use client";

import { useEffect, useRef } from "react";

import { track } from "./track";

/* Debounced search tracking for the gallery/skills search fields.
 *
 * Deliberately never logs the raw query text: free-text input is an
 * uncontrollable data source (people paste names or e-mail addresses) and
 * rare query strings act as quasi-identifiers. Query length and result count
 * preserve almost all of the analytical value without that risk. */
export function useSearchTracking(
  gallery: string,
  query: string,
  resultCount: number,
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      track("gallery_search", {
        gallery,
        query_length: query.trim().length,
        result_count: resultCount,
      });
    }, 800);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [gallery, query, resultCount]);
}
