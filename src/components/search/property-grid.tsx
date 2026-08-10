"use client";

import type { Property } from "@/types";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store";
import { PropertyCard } from "@/components/cards/property-card";
import { PropertiesMap } from "@/components/map/properties-map";
import { EmptyState } from "@/components/common/empty-state";

interface PropertyGridProps {
  properties: Property[];
  className?: string;
}

export function PropertyGrid({ properties, className }: PropertyGridProps) {
  const viewMode = useSearchStore((s) => s.viewMode);

  if (!properties.length) {
    return (
      <EmptyState
        title="No properties found"
        description="Try adjusting your filters or search in a different city."
        className={className}
      />
    );
  }

  if (viewMode === "map") {
    return (
      <div className={cn("space-y-4", className)}>
        <PropertiesMap properties={properties} height={440} className="w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 6).map((p) => (
            <PropertyCard key={p.id} property={p} variant="grid" />
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} variant="grid" />
      ))}
    </div>
  );
}
