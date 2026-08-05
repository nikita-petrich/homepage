"use client";

import { createContext, useContext } from "react";
import Link from "next/link";

/* True for everything rendered by an intercepting route in the @modal slot,
   i.e. a dialog laid over the page the visitor came from. The standalone pages
   render the very same components on a hard load, where the dialog *is* the
   page — hence a context rather than a check on the URL. */
const InterceptedModalContext = createContext(false);

export function InterceptedModal({ children }: { children: React.ReactNode }) {
  return (
    <InterceptedModalContext.Provider value>
      {children}
    </InterceptedModalContext.Provider>
  );
}

function useIsInterceptedModal() {
  return useContext(InterceptedModalContext);
}

/* A link from inside a dialog to another dialog route (project → testimonial →
   project → …).
 *
 * In an intercepted dialog it *replaces* the history entry instead of pushing a
 * new one. Pushing kept one entry per hop, and since closing is a
 * router.back(), every close only peeled off one hop and revealed the previous
 * dialog: six hops meant seven closes before the visitor was back on the page —
 * the popups appeared to close endlessly. Replacing keeps exactly one modal
 * entry above the underlying page, so one close (X, ESC, backdrop or the
 * browser's Back button) always returns to it.
 *
 * On a standalone page the dialog is the page itself, so its links push as
 * usual — closing the dialog that opens on top of it has to come back here. */
export function ModalLink({
  replace,
  scroll = false,
  ...props
}: React.ComponentProps<typeof Link>) {
  const intercepted = useIsInterceptedModal();
  return <Link {...props} scroll={scroll} replace={replace ?? intercepted} />;
}
