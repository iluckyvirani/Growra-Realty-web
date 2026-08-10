"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useSafeEmblaCarousel } from "@/hooks";
import { getTestimonials } from "@/services/property-service";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const testimonials = getTestimonials();
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
    <section className="bg-cream/40 py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-rich uppercase">
          Testimonials
        </p>
        <h2 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          What our customers are saying about {SITE_NAME}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Hear from our satisfied buyers, tenants, owners and dealers
        </p>

        <div className="relative mt-8 sm:mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[55%] lg:basis-[38%] xl:basis-[32%]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="More testimonials"
            className={cn(
              "absolute top-1/2 -right-1 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md transition sm:right-0",
              "hover:border-gold/40 hover:text-gold-rich disabled:pointer-events-none disabled:opacity-30",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/about"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold-rich hover:underline"
        >
          View all testimonials
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
