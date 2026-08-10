"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadGoogleMaps } from "@/lib/google-maps";

export type MapLocationValue = {
  lat: number;
  lng: number;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

interface LocationMapPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (loc: MapLocationValue) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 27.1767, lng: 78.0081 }; // Agra

type GoogleMapsNs = {
  maps: {
    Map: new (el: HTMLElement, opts: object) => {
      setCenter: (c: { lat: number; lng: number }) => void;
      setZoom: (z: number) => void;
      addListener: (event: string, fn: (e: { latLng?: { lat: () => number; lng: () => number } }) => void) => void;
    };
    Marker: new (opts: object) => {
      setPosition: (c: { lat: number; lng: number }) => void;
      getPosition: () => { lat: () => number; lng: () => number } | null;
      addListener: (event: string, fn: () => void) => void;
    };
    Geocoder: new () => {
      geocode: (
        req: { location?: { lat: number; lng: number }; address?: string },
        cb: (results: GeocodeResult[] | null, status: string) => void,
      ) => void;
    };
    places?: {
      Autocomplete: new (
        input: HTMLInputElement,
        opts?: object,
      ) => {
        addListener: (event: string, fn: () => void) => void;
        getPlace: () => {
          geometry?: { location?: { lat: () => number; lng: () => number } };
          formatted_address?: string;
          address_components?: AddressComponent[];
        };
      };
    };
    event: { clearInstanceListeners: (obj: unknown) => void };
  };
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeocodeResult = {
  formatted_address?: string;
  address_components?: AddressComponent[];
};

function parseComponents(components: AddressComponent[] | undefined) {
  const get = (type: string) => components?.find((c) => c.types.includes(type))?.long_name;
  return {
    locality:
      get("sublocality_level_1") ||
      get("sublocality") ||
      get("neighborhood") ||
      get("locality") ||
      "",
    city: get("locality") || get("administrative_area_level_2") || "",
    state: get("administrative_area_level_1") || "",
    pincode: get("postal_code") || "",
  };
}

export function LocationMapPicker({ value, onChange, className }: LocationMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mapObj = useRef<InstanceType<GoogleMapsNs["maps"]["Map"]> | null>(null);
  const markerObj = useRef<InstanceType<GoogleMapsNs["maps"]["Marker"]> | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [coordsLabel, setCoordsLabel] = useState(
    value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : "Click map to set location",
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError("");
      try {
        await loadGoogleMaps(["places"]);
        if (cancelled || !mapRef.current) return;
        const google = (window as unknown as { google: GoogleMapsNs }).google;
        const center = value ?? DEFAULT_CENTER;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: value ? 15 : 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        mapObj.current = map;

        const marker = new google.maps.Marker({
          map,
          position: center,
          draggable: true,
          title: "Property location",
        });
        markerObj.current = marker;

        const applyLatLng = (lat: number, lng: number, skipGeocode = false) => {
          marker.setPosition({ lat, lng });
          map.setCenter({ lat, lng });
          setCoordsLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          if (skipGeocode) {
            onChange({ lat, lng });
            return;
          }
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const parsed = parseComponents(results[0].address_components);
              onChange({
                lat,
                lng,
                address: results[0].formatted_address,
                ...parsed,
              });
            } else {
              onChange({ lat, lng });
            }
          });
        };

        map.addListener("click", (e) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (lat == null || lng == null) return;
          applyLatLng(lat, lng);
        });

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (!pos) return;
          applyLatLng(pos.lat(), pos.lng());
        });

        if (searchRef.current && google.maps.places) {
          const ac = new google.maps.places.Autocomplete(searchRef.current, {
            fields: ["geometry", "formatted_address", "address_components"],
            componentRestrictions: { country: "in" },
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            const loc = place.geometry?.location;
            if (!loc) {
              toast.error("No location found for that place");
              return;
            }
            const lat = loc.lat();
            const lng = loc.lng();
            const parsed = parseComponents(place.address_components);
            marker.setPosition({ lat, lng });
            map.setCenter({ lat, lng });
            map.setZoom(16);
            setCoordsLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            onChange({
              lat,
              lng,
              address: place.formatted_address,
              ...parsed,
            });
          });
        }

        if (value) {
          setCoordsLabel(`${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`);
        }

        setReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load Google Maps");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once on mount
  }, []);

  const searchManual = () => {
    const q = query.trim();
    if (!q) return;
    const google = (window as unknown as { google?: GoogleMapsNs }).google;
    if (!google?.maps || !markerObj.current || !mapObj.current) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: `${q}, India` }, (results, status) => {
      if (status !== "OK" || !results?.[0]) {
        toast.error("Location not found — try map click or Places suggestions");
        return;
      }
      // Thin typing: re-use Places Autocomplete when possible; for manual search parse address only
      const formatted = results[0].formatted_address || q;
      const parsed = parseComponents(results[0].address_components);
      // Geocoder results include geometry in real API — cast via unknown
      const raw = results[0] as unknown as {
        geometry?: { location?: { lat: () => number; lng: () => number } };
      };
      const loc = raw.geometry?.location;
      if (!loc) {
        toast.error("No coordinates for that search");
        return;
      }
      const lat = loc.lat();
      const lng = loc.lng();
      markerObj.current?.setPosition({ lat, lng });
      mapObj.current?.setCenter({ lat, lng });
      mapObj.current?.setZoom(16);
      setCoordsLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      onChange({ lat, lng, address: formatted, ...parsed });
    });
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-end justify-between gap-2">
        <div>
          <Label>Live location on map</Label>
          <p className="text-xs text-muted">Search a place or click / drag the pin on the map.</p>
        </div>
        <p className="flex items-center gap-1 text-[11px] font-medium text-gold-rich">
          <MapPin className="h-3.5 w-3.5" />
          {coordsLabel}
        </p>
      </div>

      <div className="mb-2 flex gap-2">
        <Input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search area, landmark, or address…"
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={searchManual} aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-cream">
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream/80">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 text-center text-sm text-danger">
            {error}
          </div>
        ) : null}
        <div ref={mapRef} className="h-[280px] w-full md:h-[340px]" />
      </div>
      {ready ? (
        <p className="mt-1.5 text-[11px] text-muted">
          Tip: enable Maps JavaScript API + Places API for this key in Google Cloud.
        </p>
      ) : null}
    </div>
  );
}
