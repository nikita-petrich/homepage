"use client";

import { useCallback, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUi } from "@/lib/i18n/provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/* Shared dialog scaffolding for the project, reference and certificate popups,
   built on the shadcn Dialog (Radix) primitive: focus trap, initial focus, ESC,
   backdrop click, body scroll-lock and focus return for free. The dialog is
   always mounted "open"; closing it calls `onClose`, which the intercepting
   route turns into a router.back(). */
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
  const ui = useUi();
  /* The caller passes a Tailwind width class; read the px out of it and apply
     it as an inline style. A width class assembled at runtime would never be
     emitted by the static Tailwind compiler, so the class alone cannot size the
     dialog (that was the full-width regression). min() keeps a phone gutter. */
  const px = Number(maxWidthClass.match(/\[(\d+)px\]/)?.[1] ?? 720);

  /* Close exactly once per dialog. ESC, a backdrop click and the X button all
     land here, and the dialog stays mounted until the navigation that onClose
     starts has committed — so two of them in quick succession would fire two
     router.back() calls and jump two entries deep into the history. */
  const closed = useRef(false);
  const close = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        style={{ maxWidth: `min(${px}px, calc(100% - 2rem))` }}
        className={cn(
          "w-full gap-0 overflow-y-auto rounded-xl p-0 shadow-xl",
          "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)]",
        )}
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <button
          type="button"
          onClick={close}
          aria-label={ui.common.close}
          className="absolute top-3 right-3 z-10 cursor-pointer rounded-md bg-background/85 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-foreground"
        >
          <X size={18} />
        </button>
        {children}
      </DialogContent>
    </Dialog>
  );
}
