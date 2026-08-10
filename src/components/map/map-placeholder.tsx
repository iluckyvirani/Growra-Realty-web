"use client";

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { getGoogleMapsApiKey } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

interface MapPlaceholderProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
  zoom?: number;
  /** Map frame height. Default is compact (medium). */
  size?: "sm" | "md" | "lg";
}

const MAP_HEIGHT: Record<NonNullable<MapPlaceholderProps["size"]>, number> = {
  sm: 160,
  md: 240,
  lg: 320,
};

function mapsSearchUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function mapsDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function mapsEmbedUrl(lat: number, lng: number, zoom: number) {
  const key = getGoogleMapsApiKey();
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${lat},${lng}&zoom=${zoom}`;
  }
  const delta = 0.012;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function MapPlaceholder({
  lat,
  lng,
  label,
  className,
  zoom = 15,
  size = "md",
}: MapPlaceholderProps) {
  const openUrl = mapsSearchUrl(lat, lng);
  const directionsUrl = mapsDirectionsUrl(lat, lng);
  const embedUrl = mapsEmbedUrl(lat, lng, zoom);
  const height = MAP_HEIGHT[size];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-cream dark:bg-ink",
        className,
      )}
    >
      <div
        className="relative w-full overflow-hidden bg-champagne/30"
        style={{ height, maxHeight: height }}
      >
        <iframe
          title={label ? `Map — ${label}` : "Property location map"}
          src={embedUrl}
          height={height}
          className="block h-full w-full border-0"
          style={{ height, maxHeight: height }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-white/80 px-3 py-2 dark:bg-charcoal/60">
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-rich" />
          <span className="truncate text-sm font-semibold text-foreground">
            {label || "Live location"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal transition hover:bg-cream dark:bg-ink dark:text-cream"
          >
            <Navigation className="h-3.5 w-3.5 text-gold-rich" />
            Directions
          </a>
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md gold-gradient px-2.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-gold/25 transition hover:opacity-95"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Maps
          </a>
        </div>
      </div>
    </div>
  );
}
