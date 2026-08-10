import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-luxury flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="gold-text text-7xl font-extrabold md:text-9xl">404</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The property or page you are looking for may have moved — or never existed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/buy">Browse properties</Link>
        </Button>
      </div>
    </div>
  );
}
