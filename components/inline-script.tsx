"use client";

/* An inline <script> that the browser runs synchronously while it parses the
   HTML — the shape the bundled guide prescribes for anything that has to take
   effect before the first paint
   (node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md,
   "Extracting a reusable component").

   Such a script only ever runs when it arrives in the server HTML. Wherever
   React puts the element there through the DOM instead — hydration, a soft
   navigation, or a route rendered on demand, whose document reaches the
   browser as flight payload rather than as HTML — it is inert, and React says
   so in development ("Encountered a script tag while rendering React
   component"). The `type` switch states that: `text/plain` is not an
   executable script type, which is the condition React checks before warning.
   suppressHydrationWarning covers the type differing between the two renders —
   the DOM keeps the executable one the server sent.

   It has to be a client component. `typeof window` is evaluated where the
   component runs, and a server component runs only on the server: its element
   would be serialised into the flight payload with `text/javascript` baked in,
   and the client would replay that verbatim — the same warning, one indirection
   further away. As a client component the function is re-executed in the
   browser, so the client render really does produce `text/plain`. */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
