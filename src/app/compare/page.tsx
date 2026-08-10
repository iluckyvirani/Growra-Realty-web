"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GitCompare, Trash2, X } from "lucide-react";
import { getPropertyById } from "@/services/property-service";
import type { Property } from "@/types";
import { useCompareStore } from "@/store";
import { formatArea, formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const { items, remove, clear } = useCompareStore();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(items.map((id) => getPropertyById(id))).then((rows) => {
      if (!cancelled) {
        setProperties(
          rows.filter((p): p is Property => Boolean(p)).slice(0, 4),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const rows = useMemo(
    () => [
      {
        label: "Price",
        render: (i: number) => formatPrice(properties[i].price),
      },
      {
        label: "Type",
        render: (i: number) => (
          <span className="capitalize">{properties[i].propertyType}</span>
        ),
      },
      {
        label: "Listing",
        render: (i: number) => (
          <span className="capitalize">{properties[i].listingType}</span>
        ),
      },
      {
        label: "BHK",
        render: (i: number) =>
          properties[i].bhk ? `${properties[i].bhk} BHK` : "—",
      },
      {
        label: "Bathrooms",
        render: (i: number) => properties[i].bathrooms || "—",
      },
      {
        label: "Area",
        render: (i: number) => formatArea(properties[i].area),
      },
      {
        label: "Carpet area",
        render: (i: number) =>
          properties[i].carpetArea
            ? formatArea(properties[i].carpetArea!)
            : "—",
      },
      {
        label: "Location",
        render: (i: number) =>
          `${properties[i].locality}, ${properties[i].city}`,
      },
      {
        label: "Builder",
        render: (i: number) => properties[i].builderName,
      },
      {
        label: "Status",
        render: (i: number) => (
          <span className="capitalize">
            {properties[i].constructionStatus.replace(/-/g, " ")}
          </span>
        ),
      },
      {
        label: "Furnished",
        render: (i: number) => (
          <span className="capitalize">
            {properties[i].furnished.replace(/-/g, " ")}
          </span>
        ),
      },
      {
        label: "Parking",
        render: (i: number) => properties[i].parking ?? "—",
      },
      {
        label: "Facing",
        render: (i: number) => properties[i].facing ?? "—",
      },
      {
        label: "Possession",
        render: (i: number) => properties[i].possession,
      },
      {
        label: "RERA",
        render: (i: number) => properties[i].reraId ?? "—",
      },
      {
        label: "Verified",
        render: (i: number) => (properties[i].verified ? "Yes" : "No"),
      },
      {
        label: "Price / sq.ft",
        render: (i: number) =>
          properties[i].pricePerSqft
            ? formatPrice(properties[i].pricePerSqft!)
            : "—",
      },
    ],
    [properties],
  );

  return (
    <div>
      <PageHeader
        title="Compare Properties"
        description="Side-by-side comparison of up to 4 shortlisted homes."
        breadcrumbs={[{ label: "Compare" }]}
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
              icon={GitCompare}
              title="Nothing to compare yet"
              description="Add up to 4 properties from any listing page to compare features side by side."
              action={{ label: "Browse properties", href: "/buy" }}
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-cream/60 dark:bg-ink/30">
                    <th className="sticky left-0 z-10 w-40 bg-cream/95 px-4 py-4 text-left font-semibold text-muted dark:bg-ink/95">
                      Feature
                    </th>
                    {properties.map((p) => (
                      <th
                        key={p.id}
                        className="min-w-[200px] px-4 py-4 text-left align-top"
                      >
                        <div className="relative space-y-3">
                          <button
                            type="button"
                            aria-label={`Remove ${p.title}`}
                            onClick={() => remove(p.id)}
                            className="absolute -right-1 -top-1 rounded-full p-1 text-muted transition hover:bg-border hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                            <Image
                              src={p.images[0] || "/placeholder.jpg"}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="220px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/property/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-2 font-semibold text-foreground hover:text-gold"
                            >
                              {p.title}
                            </Link>
                            {p.luxury ? (
                              <Badge className="mt-2 bg-gold text-white">
                                Luxury
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-border last:border-0"
                    >
                      <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium text-muted">
                        {row.label}
                      </th>
                      {properties.map((_, i) => (
                        <td
                          key={`${row.label}-${i}`}
                          className="px-4 py-3 text-foreground"
                        >
                          {row.render(i)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
