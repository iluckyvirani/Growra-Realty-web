"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSafeEmblaCarousel } from "@/hooks";
import { getAllCities } from "@/services/property-service";
import { cn } from "@/lib/utils";
import type { City } from "@/types";

const CITY_COLUMNS: [string, string][] = [
  ["delhi-ncr", "mumbai"],
  ["bengaluru", "hyderabad"],
  ["pune", "kolkata"],
  ["chennai", "ahmedabad"],
];

function formatPropertyCount(count: number) {
  const rounded = count >= 1000 ? Math.floor(count / 1000) * 1000 : count;
  return `${rounded.toLocaleString("en-IN")}+ Properties`;
}

function CompactCityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className="group flex items-center gap-4 rounded-xl py-2 pr-2 transition hover:bg-champagne/40"
    >
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-border/60 sm:h-20 sm:w-20">
        <Image
          src={city.image}
          alt={city.name}
          fill
          sizes="80px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold text-charcoal group-hover:text-gold-rich sm:text-lg">
          {city.name}
        </p>
        <p className="mt-0.5 text-sm text-muted">{formatPropertyCount(city.propertyCount)}</p>
      </div>
    </Link>
  );
}

export function PopularCities() {
  const [emblaRef, emblaApi] = useSafeEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canNext, setCanNext] = useState(false);

  const columns = useMemo(() => {
    const all = getAllCities();
    const bySlug = new Map(all.map((city) => [city.slug, city]));

    return CITY_COLUMNS.map(([topSlug, bottomSlug]) => {
      const top = bySlug.get(topSlug);
      const bottom = bySlug.get(bottomSlug);
      return [top, bottom].filter((city): city is City => Boolean(city));
    }).filter((pair) => pair.length > 0);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="top-cities" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
          Top cities
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          Explore Real Estate in Popular Indian Cities
        </h2>

        <div className="relative mt-8 sm:mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 sm:gap-8 lg:gap-10">
              {columns.map((pair) => (
                <div
                  key={pair.map((c) => c.slug).join("-")}
                  className="flex min-w-0 shrink-0 grow-0 basis-[78%] flex-col gap-4 sm:basis-[48%] md:basis-[38%] lg:basis-[28%] xl:basis-[22%]"
                >
                  {pair.map((city) => (
                    <CompactCityCard key={city.id} city={city} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="More cities"
            className={cn(
              "absolute top-1/2 -right-1 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition sm:right-0",
              "hover:border-gold/40 hover:text-gold-rich disabled:pointer-events-none disabled:opacity-30",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
