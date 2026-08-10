import {
  ArrowUpDown,
  Baby,
  BatteryCharging,
  Bell,
  Building2,
  Camera,
  Car,
  Circle,
  Dumbbell,
  Home,
  Shield,
  Sparkles,
  TreePine,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { resolveAmenities } from "@/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Waves,
  Dumbbell,
  Car,
  Shield,
  TreePine,
  Building2,
  Baby,
  Zap,
  ArrowUpDown,
  Camera,
  Sparkles,
  Circle,
  Bell,
  Home,
  BatteryCharging,
};

interface AmenitiesListProps {
  amenities: string[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function AmenitiesList({
  amenities,
  className,
  columns = 3,
}: AmenitiesListProps) {
  const items = resolveAmenities(amenities);

  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid gap-3", colClass, className)}>
      {items.map((a) => {
        const Icon = ICON_MAP[a.icon] ?? Sparkles;
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-cream/40 px-4 py-3 dark:bg-ink/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne/70 text-gold-rich">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="text-xs capitalize text-muted">{a.category}</p>
            </div>
          </div>
        );
      })}
      {!items.length ? (
        <p className="col-span-full text-sm text-muted">Amenities details coming soon.</p>
      ) : null}
    </div>
  );
}
