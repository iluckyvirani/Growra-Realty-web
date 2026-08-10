"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxury flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium tracking-widest text-gold uppercase">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">We hit an unexpected bump</h1>
      <p className="mt-3 max-w-md text-muted">
        Please try again. If the issue persists, return home or contact our concierge team.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
