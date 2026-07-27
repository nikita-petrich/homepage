"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* Shared dialog scaffolding for the project and reference popups.
 *
 * Uses the native <dialog> element via showModal(), which provides the
 * complete modal keyboard contract for free: focus is trapped inside the
 * dialog, the first focusable element (the close button) receives initial
 * focus, ESC closes, and focus returns to the triggering element on close.
 * Clicking the backdrop (the dialog element itself, stretched over the
 * viewport) also closes. */
export function ModalShell({
  label,
  onClose,
  maxWidthClass = "max-w-[720px]",
  children,
}: {
  label: string;
  onClose: () => void;
  maxWidthClass?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] backdrop:bg-transparent open:flex sm:p-6"
      style={{ animation: "np-overlay-in 0.2s ease-out" }}
    >
      <div
        className={cn(
          "relative my-4 h-fit w-full overflow-hidden rounded-xl bg-white shadow-[rgba(15,15,15,0.2)_0px_16px_48px] sm:my-8",
          maxWidthClass,
        )}
        style={{ animation: "np-modal-in 0.28s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 z-10 cursor-pointer rounded-md bg-white/85 p-1.5 text-notion-gray backdrop-blur transition-colors hover:bg-white hover:text-notion-text"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
