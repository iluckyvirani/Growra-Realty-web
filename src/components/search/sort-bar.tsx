"use client";

import { Grid3X3, LayoutList, Map } from "lucide-react";
import type { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS: { value: NonNullable<SearchFilters["sortBy"]>; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "area-desc", label: "Area: Largest" },
];

interface SortBarProps {
  count: number;
  className?: string;
  compact?: boolean;
}

export function SortBar({ count, className, compact }: SortBarProps) {
  const { filters, setFilters, viewMode, setViewMode } = useSearchStore();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Select
          value={filters.sortBy ?? "relevance"}
          onValueChange={(v) => setFilters({ sortBy: v as SearchFilters["sortBy"] })}
        >
          <SelectTrigger className="h-9 w-[140px] border-border bg-white text-xs" aria-label="Sort by">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="hidden rounded-lg border border-border bg-white p-0.5 sm:flex">
          {(
            [
              { mode: "list" as const, icon: LayoutList, label: "List view" },
              { mode: "grid" as const, icon: Grid3X3, label: "Grid view" },
              { mode: "map" as const, icon: Map, label: "Map view" },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              type="button"
              size="icon"
              variant="ghost"
              aria-label={label}
              aria-pressed={viewMode === mode}
              className={cn(
                "h-8 w-8 rounded-md",
                viewMode === mode && "bg-champagne/70 text-gold-rich",
              )}
              onClick={() => setViewMode(mode)}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted">
        <span className="font-semibold text-foreground">
          {count.toLocaleString("en-IN")}
        </span>{" "}
        {count === 1 ? "property" : "properties"} found
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.sortBy ?? "relevance"}
          onValueChange={(v) =>
            setFilters({ sortBy: v as SearchFilters["sortBy"] })
          }
        >
          <SelectTrigger className="h-10 w-[180px]" aria-label="Sort by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-2xl border border-border p-0.5">
          {(
            [
              { mode: "list" as const, icon: LayoutList, label: "List view" },
              { mode: "grid" as const, icon: Grid3X3, label: "Grid view" },
              { mode: "map" as const, icon: Map, label: "Map view" },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              type="button"
              size="icon"
              variant="ghost"
              aria-label={label}
              aria-pressed={viewMode === mode}
              className={cn(
                "h-9 w-9 rounded-xl",
                viewMode === mode && "bg-champagne/70 text-gold-rich",
              )}
              onClick={() => setViewMode(mode)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
