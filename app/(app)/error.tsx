"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col justify-center gap-6 px-6 py-9">
      <div>
        <h1 className="display text-[44px] leading-none">
          Couldn&apos;t load this
        </h1>
        <p className="mt-2.5 text-muted">
          Check your connection, then try again.
        </p>
      </div>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  );
}
