/** Shared Google Maps key helpers for portal + admin mock. */

export const GROWRA_GMAPS_STORAGE_KEY = "growra_gmaps_key";

/** Fallback for local demo when env / localStorage empty */
export const GROWRA_GMAPS_DEMO_KEY = "AIzaSyBEIm9GE0iJQETlvOnEZ2lluTsXcvqJaaU";

export function getGoogleMapsApiKey(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(GROWRA_GMAPS_STORAGE_KEY)?.trim();
    if (stored) return stored;
  }
  const fromEnv =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) ||
    (typeof process !== "undefined" && process.env.VITE_GOOGLE_MAPS_API_KEY?.trim()) ||
    "";
  return fromEnv || GROWRA_GMAPS_DEMO_KEY;
}

export function ensureGoogleMapsKeyStored() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(GROWRA_GMAPS_STORAGE_KEY)) {
    localStorage.setItem(GROWRA_GMAPS_STORAGE_KEY, getGoogleMapsApiKey());
  }
}

let mapsLoader: Promise<void> | null = null;

export function loadGoogleMaps(libraries: string[] = ["places"]): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  ensureGoogleMapsKeyStored();
  const key = getGoogleMapsApiKey();

  const g = (window as unknown as { google?: { maps?: unknown } }).google;
  if (g?.maps) return Promise.resolve();

  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-growra-gmaps]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps script failed")));
      return;
    }
    const script = document.createElement("script");
    script.dataset.growraGmaps = "1";
    script.async = true;
    script.defer = true;
    const libs = libraries.length ? `&libraries=${libraries.join(",")}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}${libs}`;
    script.onload = () => resolve();
    script.onerror = () => {
      mapsLoader = null;
      reject(new Error("Failed to load Google Maps. Check API key / billing / referrer restrictions."));
    };
    document.head.appendChild(script);
  });

  return mapsLoader;
}
