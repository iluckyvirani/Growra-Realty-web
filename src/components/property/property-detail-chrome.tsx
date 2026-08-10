"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Info } from "lucide-react";
import { toast } from "sonner";
import { useMounted } from "@/hooks";
import { useWishlistStore } from "@/store";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PropertyInquiryDialog,
  type PropertyInquiryTarget,
} from "@/components/property/property-inquiry-dialog";

export const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "society", label: "Society" },
  { id: "dealer", label: "Contact" },
  { id: "reviews", label: "Reviews" },
  { id: "explore", label: "Locality" },
  { id: "recommendations", label: "Similar" },
] as const;

export type DetailTabId = (typeof DETAIL_TABS)[number]["id"];

interface PropertyDetailChromeProps {
  property: PropertyInquiryTarget & {
    price: number;
    listingType: string;
    bhk: number;
    bathrooms: number;
    reraId?: string;
    constructionStatus: string;
    featured: boolean;
    propertyType: string;
  };
  configLabel: string;
  typeLabel: string;
  children: React.ReactNode;
}

export function PropertyDetailChrome({
  property,
  configLabel,
  typeLabel,
  children,
}: PropertyDetailChromeProps) {
  const mounted = useMounted();
  const wishlist = useWishlistStore();
  const wished = mounted && wishlist.has(property.id);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState<DetailTabId>("overview");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById("detail-sticky-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    DETAIL_TABS.forEach((tab) => {
      const el = document.getElementById(`section-${tab.id}`);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(tab.id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollTabs = (dir: -1 | 1) => {
    tabsRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  const scrollTo = (id: DetailTabId) => {
    setActive(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleWishlist = () => {
    wishlist.toggle(property.id);
    toast.success(wished ? "Removed from shortlist" : "Added to shortlist");
  };

  const isRent = property.listingType === "rent";
  const possessionLabel =
    property.constructionStatus === "ready" ? "Ready to move" : "Under construction";
  const listingPhrase = isRent ? "Rent" : "Sale";

  return (
    <div>
      {/* ── Page header (scrolls away) ── */}
      <div id="detail-sticky-sentinel" className="border-b border-border pb-1">
        <div className="flex flex-col gap-1.5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <nav
            className="flex min-w-0 flex-wrap items-center gap-x-1 text-[12px] text-[#888]"
            aria-label="Breadcrumb"
          >
            <a href="/" className="hover:text-gold-rich">
              Home
            </a>
            <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            <span className="truncate">
              Property for {isRent ? "rent" : "sale"} in {property.city}
            </span>
            <ChevronRight className="hidden h-3 w-3 shrink-0 opacity-50 sm:inline" />
            <span className="hidden truncate sm:inline">
              {typeLabel}s for {isRent ? "rent" : "sale"} in {property.locality}
            </span>
            <ChevronRight className="hidden h-3 w-3 shrink-0 opacity-50 md:inline" />
            <span className="hidden truncate text-[#555] md:inline">{property.title}</span>
          </nav>
          <p className="shrink-0 text-[12px] text-[#888]">
            Updated recently
            <span className="mx-1.5 text-[#ccc]">·</span>
            <span className="text-[#555]">{possessionLabel}</span>
          </p>
        </div>

        <div className="flex flex-col gap-5 pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-0">
            <div className="shrink-0 sm:min-w-[9.5rem] sm:pr-6 lg:pr-8">
              {property.featured ? (
                <span className="mb-2 inline-block rounded-md bg-[#7a3ea1] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                  Featured
                </span>
              ) : null}
              <p className="text-[1.85rem] leading-none font-bold tracking-tight text-charcoal sm:text-[2.15rem]">
                {formatPrice(property.price)}
              </p>
              {isRent ? (
                <p className="mt-1.5 text-[13px] text-muted">Per month</p>
              ) : null}
            </div>

            <div className="hidden w-px self-stretch bg-border sm:block" aria-hidden />

            <div className="min-w-0 sm:flex sm:flex-col sm:justify-center sm:pl-6 lg:pl-8">
              <h1 className="text-[1.35rem] leading-snug font-semibold text-charcoal sm:text-[1.5rem]">
                {configLabel || typeLabel}
              </h1>
              <p className="mt-1 text-[14px] text-[#666]">
                {typeLabel} for {listingPhrase}
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
                {property.title}
                {property.locality ? ` · ${property.locality}` : ""}
                {property.city ? `, ${property.city}` : ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 cursor-pointer gap-2 rounded-lg border-border bg-white px-4 text-[14px] font-medium text-charcoal shadow-none hover:border-gold/50 hover:bg-champagne/30",
                wished && "border-danger/40 text-danger hover:text-danger",
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              Shortlist
            </Button>
            <Button
              type="button"
              className="h-11 cursor-pointer gap-2 rounded-lg px-5 text-[14px] font-semibold shadow-sm gold-gradient sm:min-w-[11.5rem]"
              onClick={() => setInquiryOpen(true)}
            >
              Contact Growra
            </Button>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap items-center gap-x-3 gap-y-2 bg-[#f7f7f7] px-4 py-2.5 sm:mx-0 sm:mb-1 sm:rounded-lg sm:px-3.5">
          {property.reraId ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#00897b] px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                RERA
                <Info className="h-3 w-3 opacity-90" />
              </span>
              <span className="text-[12px] font-bold tracking-wide text-[#00897b]">
                Registered
              </span>
              <span className="hidden h-3.5 w-px bg-[#ddd] sm:block" aria-hidden />
              <span className="text-[12px] text-[#666]">
                No: <span className="font-medium text-[#444]">{property.reraId}</span>
              </span>
            </>
          ) : (
            <span className="text-[12px] font-medium text-[#888]">RERA status not available</span>
          )}
        </div>
      </div>

      {/* Sticky chrome — clear fixed navbar (desktop ~76px, mobile + search ~116px) */}
      <div className="sticky top-[8.25rem] z-40 -mx-4 border-b border-border bg-white shadow-[0_4px_16px_rgba(27,27,27,0.06)] sm:mx-0 md:top-[4.75rem]">
        {compact ? (
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 pt-3.5 pb-3 sm:px-1">
            <div className="min-w-0">
              <p className="text-lg leading-none font-bold text-charcoal sm:text-xl">
                {formatPrice(property.price)}
              </p>
              <p className="mt-1 truncate text-[13px] text-muted">
                {configLabel}
                {property.locality ? ` · ${property.locality}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleWishlist}
                className={cn(
                  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-[#555] transition hover:border-gold/50 hover:text-gold-rich",
                  wished && "border-danger/40 text-danger",
                )}
                aria-label="Shortlist"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              </button>
              <Button
                type="button"
                className="h-10 cursor-pointer rounded-lg px-4 text-[13px] font-semibold shadow-none gold-gradient sm:min-w-[9.5rem] sm:px-5"
                onClick={() => setInquiryOpen(true)}
              >
                Contact Growra
              </Button>
            </div>
          </div>
        ) : null}

        <div className="relative">
          <nav
            ref={tabsRef}
            className="flex gap-1 overflow-x-auto px-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:px-1 [&::-webkit-scrollbar]:hidden"
            aria-label="Property sections"
          >
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollTo(tab.id)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-t-md border-b-2 px-3.5 py-3 text-[13px] font-medium whitespace-nowrap transition sm:px-4",
                  active === tab.id
                    ? "border-gold bg-champagne/25 text-gold-rich"
                    : "border-transparent text-[#666] hover:bg-cream/60 hover:text-charcoal",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {canScrollLeft ? (
            <button
              type="button"
              onClick={() => scrollTabs(-1)}
              className="absolute top-1/2 left-1 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-[#666] shadow-sm"
              aria-label="Previous tabs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}

          {canScrollRight ? (
            <button
              type="button"
              onClick={() => scrollTabs(1)}
              className="absolute top-1/2 right-1 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-[#666] shadow-sm"
              aria-label="More tabs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-7 space-y-0">{children}</div>

      <PropertyInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        property={property}
      />
    </div>
  );
}
