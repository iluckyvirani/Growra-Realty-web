"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import type { Property } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { loadGoogleMaps } from "@/lib/google-maps";

type GoogleMapsNs = {
  maps: {
    Map: new (
      el: HTMLElement,
      opts: object,
    ) => {
      fitBounds: (b: unknown, padding?: number | object) => void;
      setCenter: (c: { lat: number; lng: number }) => void;
      setZoom: (z: number) => void;
    };
    Marker: new (opts: object) => {
      setMap: (m: unknown) => void;
      addListener: (event: string, fn: () => void) => void;
    };
    InfoWindow: new (opts?: object) => {
      setContent: (html: string) => void;
      open: (opts: { map: unknown; anchor: unknown }) => void;
      close: () => void;
    };
    LatLngBounds: new () => {
      extend: (c: { lat: number; lng: number }) => void;
      isEmpty: () => boolean;
    };
    event: { clearInstanceListeners: (obj: unknown) => void };
  };
};

interface PropertiesMapProps {
  properties: Property[];
  className?: string;
  height?: number;
}

function hasValidCoords(p: Property) {
  const { lat, lng } = p.coordinates ?? { lat: 0, lng: 0 };
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

export function PropertiesMap({ properties, className, height = 420 }: PropertiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<InstanceType<GoogleMapsNs["maps"]["Map"]> | null>(null);
  const markersRef = useRef<InstanceType<GoogleMapsNs["maps"]["Marker"]>[]>([]);
  const infoRef = useRef<InstanceType<GoogleMapsNs["maps"]["InfoWindow"]> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const pins = useMemo(
    () => properties.filter(hasValidCoords),
    [properties],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!mapRef.current) return;
      setStatus("loading");
      try {
        await loadGoogleMaps([]);
        if (cancelled || !mapRef.current) return;
        const google = (window as unknown as { google: GoogleMapsNs }).google;

        if (!mapObj.current) {
          mapObj.current = new google.maps.Map(mapRef.current, {
            center: pins[0]
              ? { lat: pins[0].coordinates.lat, lng: pins[0].coordinates.lng }
              : { lat: 20.5937, lng: 78.9629 },
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
          infoRef.current = new google.maps.InfoWindow();
        }

        // Clear old markers
        markersRef.current.forEach((m) => {
          google.maps.event.clearInstanceListeners(m);
          m.setMap(null);
        });
        markersRef.current = [];

        const map = mapObj.current;
        const info = infoRef.current;
        if (!map || !info) return;

        if (!pins.length) {
          map.setCenter({ lat: 20.5937, lng: 78.9629 });
          map.setZoom(5);
          setStatus("ready");
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        pins.forEach((p) => {
          const position = { lat: p.coordinates.lat, lng: p.coordinates.lng };
          bounds.extend(position);
          const marker = new google.maps.Marker({
            map,
            position,
            title: p.title,
          });
          marker.addListener("click", () => {
            const href = `/property/${p.slug}`;
            info.setContent(`
              <div style="max-width:220px;font-family:system-ui,sans-serif;padding:2px 0">
                <div style="font-weight:700;font-size:13px;color:#1B1B1B;margin-bottom:2px">${escapeHtml(p.title)}</div>
                <div style="font-size:12px;color:#666;margin-bottom:4px">${escapeHtml(p.locality)}, ${escapeHtml(p.city)}</div>
                <div style="font-weight:700;font-size:13px;color:#C89B3C;margin-bottom:8px">${escapeHtml(formatPrice(p.price))}</div>
                <a href="${href}" target="_blank" rel="noopener noreferrer"
                   style="display:inline-block;background:linear-gradient(135deg,#C89B3C,#A67C2D);color:#fff;font-size:12px;font-weight:600;padding:6px 10px;border-radius:6px;text-decoration:none">
                  View details
                </a>
              </div>
            `);
            info.open({ map, anchor: marker });
          });
          markersRef.current.push(marker);
        });

        if (pins.length === 1) {
          map.setCenter({
            lat: pins[0]!.coordinates.lat,
            lng: pins[0]!.coordinates.lng,
          });
          map.setZoom(14);
        } else {
          map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
        }

        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Could not load map");
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [pins]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-cream",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-white/80 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <MapPin className="h-4 w-4 text-gold-rich" />
          {pins.length} {pins.length === 1 ? "property" : "properties"} on map
        </div>
        {properties.length !== pins.length ? (
          <p className="text-xs text-muted">
            {properties.length - pins.length} without location hidden
          </p>
        ) : null}
      </div>

      <div className="relative w-full" style={{ height }}>
        <div ref={mapRef} className="absolute inset-0 h-full w-full" />
        {status === "loading" ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/80">
            <Loader2 className="h-6 w-6 animate-spin text-gold-rich" />
          </div>
        ) : null}
        {status === "error" ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream px-6 text-center">
            <p className="text-sm text-muted">{errorMsg || "Map unavailable"}</p>
          </div>
        ) : null}
        {status === "ready" && !pins.length ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/90 px-6 text-center">
            <p className="text-sm text-muted">No mapped locations for these results.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
