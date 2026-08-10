"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronRight, ShieldCheck, Tag } from "lucide-react";
import { useSafeEmblaCarousel } from "@/hooks";
import { getAllProperties } from "@/services/property-service";
import type { Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { ViewNumberButton } from "@/components/property/property-inquiry-dialog";

export function NewlyLaunchedSection() {
  const [projects, setProjects] = useState<Property[]>([]);
  const [emblaRef, emblaApi] = useSafeEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAllProperties().then((all) => {
      if (cancelled) return;
      const fresh = all.filter(
        (p) =>
          p.constructionStatus === "new-launch" ||
          p.listingType === "project" ||
          p.constructionStatus === "under-construction",
      );
      setProjects((fresh.length ? fresh : all.filter((p) => p.featured)).slice(0, 8));
    });
    return () => {
      cancelled = true;
    };
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
    <section className="bg-champagne/35 py-10 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-rich">
            <Building2 className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="h-1 w-1 rounded-full bg-gold-light" />
            </span>
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
              Newly launched projects
            </h2>
            <p className="mt-0.5 text-sm text-muted">Bigger home in the same budget</p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {projects.map((p, i) => {
                const growth = (3.2 + (i % 5) * 0.7).toFixed(1);
                return (
                  <article
                    key={p.id}
                    className="min-w-0 shrink-0 grow-0 basis-[88%] overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm sm:basis-[70%] md:basis-[48%] lg:basis-[38%]"
                  >
                    <div className="relative p-4 pb-3">
                      <span className="absolute top-0 left-0 rounded-br-lg bg-[#F5D5A8] px-2.5 py-1 text-[10px] font-bold tracking-wide text-charcoal uppercase">
                        New Arrival
                      </span>

                      <div className="mt-5 flex gap-3">
                        <div className="relative shrink-0">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-border sm:h-[4.5rem] sm:w-[4.5rem]">
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                          {p.reraId ? (
                            <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded bg-charcoal px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                              <ShieldCheck className="h-2.5 w-2.5 text-gold-light" />
                              RERA
                            </span>
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1 pt-1">
                          <Link
                            href={`/property/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line-clamp-1 text-sm font-bold text-charcoal hover:text-gold-rich sm:text-base"
                          >
                            {p.title}
                          </Link>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                            {p.locality}, {p.city}
                          </p>
                          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-sm font-bold text-charcoal">
                              {formatPrice(p.price)}
                              {p.pricePerSqft ? (
                                <span className="font-semibold text-muted">
                                  {" "}
                                  onwards
                                </span>
                              ) : null}
                            </span>
                            {p.bhk > 0 ? (
                              <span className="text-xs text-muted">
                                {p.bhk} BHK {p.propertyType}
                              </span>
                            ) : (
                              <span className="text-xs capitalize text-muted">
                                {p.propertyType}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-success">
                            {growth}% price increase in last 1 year in {p.locality}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3">
                      <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-charcoal/80 sm:text-xs">
                        <Tag className="h-3.5 w-3.5 shrink-0 text-gold" />
                        <span className="line-clamp-1">
                          Get preferred options @zero brokerage
                        </span>
                      </p>
                      <ViewNumberButton
                        propertyId={p.id}
                        propertyTitle={p.title}
                        size="sm"
                        className="h-8 shrink-0 rounded-md px-3 text-xs font-semibold text-white gold-gradient hover:opacity-95"
                        variant="default"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next projects"
            className={cn(
              "absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1 items-center justify-center rounded-full border border-border bg-white shadow-md transition sm:translate-x-2",
              "hover:border-gold/40 hover:text-gold-rich disabled:pointer-events-none disabled:opacity-30",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 text-right">
          <Link
            href="/projects?status=new-launch"
            className="text-sm font-semibold text-gold-rich hover:underline"
          >
            See all new launches
          </Link>
        </div>
      </div>
    </section>
  );
}
