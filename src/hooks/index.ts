"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaViewportRefType, UseEmblaCarouselType } from "embla-carousel-react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;
type EmblaPlugins = Parameters<typeof useEmblaCarousel>[1];

/**
 * Embla wrapper that only attaches the viewport after mount.
 * Prevents `container.children` crashes during SSR / hydration recovery.
 */
export function useSafeEmblaCarousel(
  options?: EmblaOptions,
  plugins?: EmblaPlugins,
): UseEmblaCarouselType {
  const mounted = useMounted();
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const safeRef = useCallback<EmblaViewportRefType>(
    (node) => {
      if (!mounted) {
        emblaRef(null);
        return;
      }
      emblaRef(node);
    },
    [mounted, emblaRef],
  );

  return [safeRef, mounted ? emblaApi : undefined];
}
