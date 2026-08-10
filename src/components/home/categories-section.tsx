"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSafeEmblaCarousel } from "@/hooks";
import { cn } from "@/lib/utils";

const OPTIONS: {
  label: string;
  href: string;
  image: string;
  badge?: "NEW";
}[] = [
  {
    label: "Buy a home",
    href: "/buy",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    label: "Renting a home",
    href: "/rent",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
  {
    label: "Invest in Real Estate",
    href: "/projects",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80",
    badge: "NEW",
  },
  {
    label: "Sell/Rent your property",
    href: "/portal",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    label: "Plots/Land",
    href: "/plots",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  },
  {
    label: "Explore Insights",
    href: "/blog",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    badge: "NEW",
  },
  {
    label: "PG and co-living",
    href: "/pg",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
  },
  {
    label: "Commercial",
    href: "/commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
];

export function CategoriesSection() {
  const [emblaRef, emblaApi] = useSafeEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
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
    <section className="bg-white pb-10 pt-6 sm:pb-14 sm:pt-10 md:pt-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-left sm:mb-8 sm:text-center md:mb-10">
          <h2 className="text-lg font-bold text-charcoal sm:text-sm sm:font-semibold sm:tracking-[0.18em] sm:text-charcoal/70 sm:uppercase md:text-[15px] md:tracking-[0.2em]">
            Get started with
          </h2>
          <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-charcoal/70 sm:uppercase sm:tracking-[0.12em] sm:text-[13px]">
            Explore real estate options in top cities
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous options"
            className={cn(
              "absolute top-[38%] left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition",
              "hover:border-gold/40 hover:text-gold-rich disabled:pointer-events-none disabled:opacity-30",
              "-translate-x-1 sm:-translate-x-3",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next options"
            className={cn(
              "absolute top-[38%] right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition",
              "hover:border-gold/40 hover:text-gold-rich disabled:pointer-events-none disabled:opacity-30",
              "translate-x-1 sm:translate-x-3",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="overflow-hidden px-1" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5">
              {OPTIONS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group min-w-0 shrink-0 grow-0 basis-[42%] sm:basis-[30%] md:basis-[22%] lg:basis-[18%]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream shadow-sm ring-1 ring-border/60 transition group-hover:shadow-md group-hover:ring-gold/30">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 18vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {item.badge ? (
                      <span className="absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase bg-danger">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-charcoal group-hover:text-gold-rich">
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
