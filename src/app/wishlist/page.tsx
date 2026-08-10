"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { getPropertyById } from "@/services/property-service";
import type { Property } from "@/types";
import { useWishlistStore } from "@/store";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { PropertyCard } from "@/components/cards/property-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, clear, remove } = useWishlistStore();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(items.map((id) => getPropertyById(id))).then((rows) => {
      if (!cancelled) {
        setProperties(rows.filter((p): p is Property => Boolean(p)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <div>
      <PageHeader
        title="Wishlist"
        description="Your saved homes — revisit favourites and shortlist with ease."
        breadcrumbs={[{ label: "Wishlist" }]}
      >
        {properties.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-2xl"
            onClick={() => clear()}
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        ) : null}
      </PageHeader>

      <section className="section-padding">
        <div className="container-luxury">
          {properties.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Save properties you love while browsing — they'll appear here."
              action={{ label: "Browse properties", href: "/buy" }}
            />
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {properties.length}
                </span>{" "}
                {properties.length === 1 ? "property" : "properties"} saved
              </p>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <div key={p.id} className="relative">
                    <PropertyCard property={p} variant="grid" />
                    <button
                      type="button"
                      aria-label={`Remove ${p.title} from wishlist`}
                      onClick={() => remove(p.id)}
                      className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-muted shadow-sm transition hover:text-gold dark:bg-ink/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted">
                Looking for more?{" "}
                <Link href="/buy" className="font-medium text-gold hover:underline">
                  Explore buy listings
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
