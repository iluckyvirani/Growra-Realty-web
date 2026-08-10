"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useMounted } from "@/hooks";
import { useLocationStore } from "@/store";
import { ExploreLocationDropdown } from "@/components/layout/explore-location-dropdown";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LocationPickerProps {
  /** Light text treatment for transparent navbar over dark hero */
  overHero?: boolean;
  className?: string;
}

export function LocationPicker({ overHero = false, className }: LocationPickerProps) {
  const mounted = useMounted();
  const { cityName } = useLocationStore();
  const [open, setOpen] = useState(false);

  const displayName = mounted ? cityName : "All India";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto max-w-[9.5rem] gap-1.5 rounded-xl px-2.5 py-2 sm:max-w-[11rem]",
            overHero
              ? "text-white hover:bg-white/15 hover:text-white"
              : "text-foreground hover:bg-champagne/50",
            className,
          )}
          aria-label={`Current city: ${displayName}. Explore location`}
          aria-expanded={open}
        >
          <MapPin
            className={cn("h-4 w-4 shrink-0", overHero ? "text-gold-light" : "text-gold")}
          />
          <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">
            {displayName}
          </span>
          <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 opacity-70", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={10}
        collisionPadding={12}
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        <ExploreLocationDropdown onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
