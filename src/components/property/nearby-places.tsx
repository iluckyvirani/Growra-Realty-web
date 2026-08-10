"use client";

import { useRef } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Hospital,
  MapPin,
  Train,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { NearbyPlace } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NearbyPlace["type"], LucideIcon> = {
  school: GraduationCap,
  hospital: Hospital,
  metro: Train,
  restaurant: UtensilsCrossed,
  mall: Building2,
  park: Trees,
};

interface NearbyPlacesProps {
  places: NearbyPlace[];
  className?: string;
}

export function NearbyPlaces({ places, className }: NearbyPlacesProps) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!places.length) return null;

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className={cn("rounded-[8px] border border-border bg-white p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-charcoal">
          <MapPin className="h-4 w-4 text-gold-rich" />
          Places nearby
        </h2>
        <span className="text-sm font-medium text-gold-rich">View All ({places.length})</span>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {places.map((place) => {
            const Icon = TYPE_ICON[place.type] ?? MapPin;
            return (
              <div
                key={`${place.name}-${place.type}`}
                className="flex min-w-[180px] max-w-[220px] shrink-0 items-start gap-2"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne/70 text-gold-rich">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">{place.name}</p>
                  <p className="text-xs text-muted">{place.distance}</p>
                </div>
              </div>
            );
          })}
        </div>
        {places.length > 3 ? (
          <>
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="absolute top-1/2 -left-2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-gold-rich shadow sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="absolute top-1/2 -right-2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-gold-rich shadow sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
