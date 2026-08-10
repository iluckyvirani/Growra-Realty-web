"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import type { Property, SearchFilters as SearchFiltersType } from "@/types";
import { filterPropertyList } from "@/lib/listing";
import { cn } from "@/lib/utils";
import { useLocationStore, useSearchStore } from "@/store";
import type { BreadcrumbItem } from "@/components/common/page-header";
import { SearchFilters } from "@/components/search/search-filters";
import { SortBar } from "@/components/search/sort-bar";
import { PropertyGrid } from "@/components/search/property-grid";

const QUICK_FILTERS = [
  { id: "new-launch", label: "NEW LAUNCH" },
  { id: "verified", label: "Verified" },
  { id: "under-construction", label: "Under construction" },
  { id: "ready", label: "Ready To Move" },
  { id: "bhk-2", label: "2 BHK" },
  { id: "bhk-3", label: "3 BHK" },
  { id: "bhk-4", label: "4 BHK" },
] as const;

interface ListingViewProps {
  initialProperties: Property[];
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  initialFilters?: Partial<SearchFiltersType>;
}

export function ListingView({
  initialProperties,
  breadcrumbs,
  initialFilters,
}: ListingViewProps) {
  const { filters, setFilters, resetFilters, setViewMode } = useSearchStore();
  const cityName = useLocationStore((s) => s.cityName);

  useEffect(() => {
    resetFilters();
    setViewMode("list");
    if (initialFilters) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => filterPropertyList(initialProperties, filters),
    [initialProperties, filters],
  );

  const locationLabel =
    filters.city ||
    (cityName && cityName !== "All India" ? cityName : "All India");
  const saleLabel =
    filters.listingType === "rent"
      ? "for Rent"
      : filters.listingType === "pg"
        ? "PG / Co-living"
        : "for Sale";

  const isQuickActive = (id: string) => {
    if (id === "verified") return Boolean(filters.verified);
    if (id === "new-launch")
      return filters.constructionStatus?.includes("new-launch") ?? false;
    if (id === "under-construction")
      return filters.constructionStatus?.includes("under-construction") ?? false;
    if (id === "ready") return filters.constructionStatus?.includes("ready") ?? false;
    if (id === "bhk-2") return filters.bhk?.includes(2) ?? false;
    if (id === "bhk-3") return filters.bhk?.includes(3) ?? false;
    if (id === "bhk-4") return filters.bhk?.includes(4) ?? false;
    return false;
  };

  const toggleQuick = (id: (typeof QUICK_FILTERS)[number]["id"]) => {
    if (id === "verified") {
      setFilters({ verified: !filters.verified });
      return;
    }
    if (id.startsWith("bhk-")) {
      const n = Number(id.replace("bhk-", ""));
      const current = filters.bhk ?? [];
      const next = current.includes(n) ? current.filter((b) => b !== n) : [...current, n];
      setFilters({ bhk: next.length ? next : undefined });
      return;
    }
    const statusMap = {
      "new-launch": "new-launch",
      "under-construction": "under-construction",
      ready: "ready",
    } as const;
    const status = statusMap[id as keyof typeof statusMap];
    if (!status) return;
    const current = filters.constructionStatus ?? [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ constructionStatus: next.length ? next : undefined });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <section className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs?.length ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold-rich">
              Home
            </Link>
            {breadcrumbs.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-gold-rich">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-charcoal">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {/* Results title */}
        <h1 className="text-lg font-bold text-charcoal sm:text-xl">
          {filtered.length.toLocaleString("en-IN")} results{" "}
          <span className="font-normal text-muted">|</span>{" "}
          Property in {locationLabel} {saleLabel}
        </h1>

        {/* Insights strip */}
        <Link
          href={`/city/${locationLabel.toLowerCase().replace(/\s+/g, "-").replace("/", "")}`}
          className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-champagne/40 px-3 py-2 text-sm text-charcoal transition hover:border-gold/30"
        >
          <MapPin className="h-4 w-4 text-gold-rich" />
          <span>
            Get to know more about {locationLabel}{" "}
            <span className="font-semibold text-gold-rich">View Insights →</span>
          </span>
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <SearchFilters className="sticky top-24" />
          </div>

          <div className="space-y-4">
            <div className="lg:hidden">
              <SearchFilters />
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_FILTERS.map((f) => {
                const on = isQuickActive(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleQuick(f.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition",
                      on
                        ? "border-gold bg-champagne text-charcoal"
                        : "border-border bg-white text-charcoal/80 hover:border-gold/40",
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
              <div className="ml-auto">
                <SortBar count={filtered.length} compact />
              </div>
            </div>

            <PropertyGrid properties={filtered} />
          </div>
        </div>
      </section>
    </div>
  );
}
