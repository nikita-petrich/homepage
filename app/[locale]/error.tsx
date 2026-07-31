"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

import { useUi } from "@/lib/i18n/provider";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const ui = useUi();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-start justify-center gap-4 px-6 sm:px-8">
      <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
        {ui.error.title}
      </h1>
      <p className="text-[15px] leading-[1.65] text-notion-gray">
        {ui.error.text}
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
      >
        {ui.error.retry}
      </button>
    </main>
  );
}
