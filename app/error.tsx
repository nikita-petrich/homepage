"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-start justify-center gap-4 px-6 sm:px-8">
      <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
        Da ist etwas schiefgelaufen.
      </h1>
      <p className="text-[15px] leading-[1.65] text-notion-gray">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="cursor-pointer rounded-md bg-[var(--accent-o)] px-4 py-2 text-[14px] font-medium text-white shadow-sm transition-colors hover:brightness-95"
      >
        Erneut versuchen
      </button>
    </main>
  );
}
