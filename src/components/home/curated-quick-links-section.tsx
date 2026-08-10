"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSafeEmblaCarousel } from "@/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type QuickLink = { label: string; href: string };

type CityColumn = {
  city: string;
  links: QuickLink[];
};

const VISIBLE_LINKS = 5;

function buildBuyLinks(city: string): QuickLink[] {
  const q = encodeURIComponent(city);
  return [
    { label: `Flats in ${city}`, href: `/buy?city=${q}&type=apartment` },
    { label: `House for sale in ${city}`, href: `/buy?city=${q}&type=villa` },
    { label: `Plots in ${city}`, href: `/buy?city=${q}&type=plot` },
    { label: `Builder floor in ${city}`, href: `/buy?city=${q}&type=apartment` },
    { label: `Farm house in ${city}`, href: `/buy?city=${q}&type=farmhouse` },
    { label: `Villas in ${city}`, href: `/buy?city=${q}&type=villa` },
    { label: `Commercial property in ${city}`, href: `/buy?city=${q}&type=commercial` },
  ];
}

function buildRentLinks(city: string): QuickLink[] {
  const q = encodeURIComponent(city);
  return [
    { label: `Flats for rent in ${city}`, href: `/rent?city=${q}&type=apartment` },
    { label: `House for rent in ${city}`, href: `/rent?city=${q}&type=villa` },
    { label: `Builder floor for rent in ${city}`, href: `/rent?city=${q}&type=apartment` },
    { label: `Villas for rent in ${city}`, href: `/rent?city=${q}&type=villa` },
    { label: `PG in ${city}`, href: `/pg?city=${q}` },
    { label: `Office space in ${city}`, href: `/rent?city=${q}&type=office` },
    { label: `Commercial space in ${city}`, href: `/rent?city=${q}&type=commercial` },
  ];
}

const BUY_CITIES = [
  "Delhi",
  "Gurgaon",
  "Noida",
  "Agra",
  "Mumbai",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

const RENT_CITIES = BUY_CITIES;

function getColumns(cities: string[], mode: "buy" | "rent"): CityColumn[] {
  return cities.map((city) => ({
    city,
    links: mode === "buy" ? buildBuyLinks(city) : buildRentLinks(city),
  }));
}

function CityLinksColumn({ column }: { column: CityColumn }) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = column.links.length - VISIBLE_LINKS;
  const visibleLinks = expanded ? column.links : column.links.slice(0, VISIBLE_LINKS);

  return (
    <div className="min-w-0">
      <h3 className="text-base font-bold text-charcoal sm:text-lg">
        Properties in {column.city}
      </h3>
      <ul className="mt-4 space-y-3">
        {visibleLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-charcoal/80 transition hover:text-gold-rich hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {!expanded && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 text-sm font-medium text-gold-rich hover:underline"
        >
          View {hiddenCount} More
        </button>
      ) : null}
    </div>
  );
}

function QuickLinksCarousel({ columns }: { columns: CityColumn[] }) {
  const [emblaRef, emblaApi] = useSafeEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canNext, setCanNext] = useState(false);

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
    <div className="relative mt-6 sm:mt-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8 sm:gap-10 lg:gap-12">
          {columns.map((column) => (
            <div
              key={column.city}
              className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[46%] lg:basis-[30%] xl:basis-[22%]"
            >
              <CityLinksColumn column={column} />
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
  );
}

export function CuratedQuickLinksSection() {
  const buyColumns = getColumns(BUY_CITIES, "buy");
  const rentColumns = getColumns(RENT_CITIES, "rent");

  return (
    <section className="border-t border-border bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          Curated Quick Links
        </h2>

        <Tabs defaultValue="buy" className="mt-6">
          <TabsList className="h-auto w-full justify-start gap-8 rounded-none border-b border-border bg-transparent p-0 shadow-none">
            <TabsTrigger
              value="buy"
              className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base font-semibold text-muted shadow-none data-[state=active]:border-gold-rich data-[state=active]:bg-transparent data-[state=active]:text-charcoal data-[state=active]:shadow-none"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="rent"
              className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base font-semibold text-muted shadow-none data-[state=active]:border-gold-rich data-[state=active]:bg-transparent data-[state=active]:text-charcoal data-[state=active]:shadow-none"
            >
              Rent / Lease
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="mt-0 pt-6 sm:pt-8">
            <QuickLinksCarousel columns={buyColumns} />
          </TabsContent>

          <TabsContent value="rent" className="mt-0 pt-6 sm:pt-8">
            <QuickLinksCarousel columns={rentColumns} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
