"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Heart,
  MapPin,
  Maximize,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/types";
import { cn, formatPrice, formatArea, calculateEMI } from "@/lib/utils";
import { useMounted, useSafeEmblaCarousel } from "@/hooks";
import { useWishlistStore, useCompareStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PropertyInquiryDialog,
  ViewNumberButton,
} from "@/components/property/property-inquiry-dialog";

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
  className?: string;
}

export function PropertyCard({
  property,
  variant = "grid",
  className,
}: PropertyCardProps) {
  const mounted = useMounted();
  const [emblaRef, emblaApi] = useSafeEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  // Avoid SSR/client mismatch — persisted wishlist only exists in the browser
  const wished = mounted && wishlist.has(property.id);
  const compared = mounted && compare.has(property.id);
  const emi = calculateEMI(property.price * 0.8, 8.5, 20);
  const images = property.images.length ? property.images : ["/placeholder.jpg"];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(property.id);
    toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!compared && compare.items.length >= 4) {
      toast.error("Compare up to 4 properties");
      return;
    }
    compare.toggle(property.id);
    toast.success(compared ? "Removed from compare" : "Added to compare");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/property/${property.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const detailsHref = `/property/${property.slug}`;

  const goToDetails = () => {
    window.open(detailsHref, "_blank", "noopener,noreferrer");
  };

  const stopNav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const actionButtons = (
    <div className="relative z-20 flex items-center gap-1.5">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className={cn(
          "h-9 w-9 rounded-xl border border-border/40 bg-white text-charcoal shadow-md hover:bg-white",
          wished && "text-danger",
        )}
        onClick={handleWishlist}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-4 w-4", wished && "fill-current")} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className={cn(
          "h-9 w-9 rounded-xl border border-border/40 bg-white text-charcoal shadow-md hover:bg-white",
          compared && "text-gold-rich",
        )}
        onClick={handleCompare}
        aria-label="Compare"
      >
        <GitCompare className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="h-9 w-9 rounded-xl border border-border/40 bg-white text-charcoal shadow-md hover:bg-white"
        onClick={handleShare}
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const badges = (
    <div className="absolute top-3 left-3 z-20 flex max-w-[calc(100%-7.5rem)] flex-wrap gap-1.5">
      {property.verified ? (
        <Badge variant="verified" className="gap-1">
          <Check className="h-3 w-3" strokeWidth={2.5} />
          Verified
        </Badge>
      ) : null}
      {property.featured ? <Badge variant="featured">Featured</Badge> : null}
      {property.luxury ? <Badge variant="gold">Luxury</Badge> : null}
    </div>
  );

  const meta = (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
      {property.bhk > 0 ? (
        <span className="inline-flex items-center gap-1">
          <BedDouble className="h-3.5 w-3.5" />
          {property.bhk} BHK
        </span>
      ) : null}
      {property.bathrooms > 0 ? (
        <span className="inline-flex items-center gap-1">
          <Bath className="h-3.5 w-3.5" />
          {property.bathrooms} Bath
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1">
        <Maximize className="h-3.5 w-3.5" />
        {formatArea(property.area)}
      </span>
    </div>
  );

  if (variant === "list") {
    const pricePerSqft =
      property.pricePerSqft ??
      (property.area > 0 ? Math.round(property.price / property.area) : undefined);
    const statusLabel = property.constructionStatus
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const listingTag =
      property.listingType === "rent"
        ? "RENT"
        : property.constructionStatus === "new-launch"
          ? "NEW LAUNCH"
          : "RESALE";

    return (
      <article
        role="link"
        tabIndex={0}
        onClick={goToDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToDetails();
          }
        }}
        className={cn(
          "cursor-pointer overflow-hidden rounded-[8px] border border-border bg-white shadow-sm transition hover:border-gold/30 hover:shadow-md",
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Media */}
          <div className="group relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[280px] md:w-[320px]">
            {property.featured ? (
              <span className="absolute top-0 left-0 z-20 rounded-br-md bg-charcoal px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                Featured
              </span>
            ) : null}
            <div className="absolute top-2 right-2 z-20 flex gap-1.5">
              <button
                type="button"
                onClick={handleWishlist}
                className={cn(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/95 text-charcoal shadow",
                  wished && "text-danger",
                )}
                aria-label={wished ? "Remove from wishlist" : "Save"}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              </button>
            </div>
            <div className="h-full min-h-[200px] overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((src, i) => (
                  <div key={src + i} className="relative min-h-[200px] min-w-0 flex-[0_0_100%]">
                    <Image
                      src={src}
                      alt={`${property.title} photo ${i + 1}`}
                      fill
                      sizes="320px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    stopNav(e);
                    emblaApi?.scrollPrev();
                  }}
                  className="absolute top-1/2 left-2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    stopNav(e);
                    emblaApi?.scrollNext();
                  }}
                  className="absolute top-1/2 right-2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : null}
            <span className="absolute right-2 bottom-2 z-10 rounded bg-charcoal/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {images.length}
            </span>
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-base font-bold text-charcoal sm:text-lg">
                  {property.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted">
                  {property.bhk > 0 ? `${property.bhk} BHK ` : ""}
                  {property.propertyType === "apartment" ? "Flat" : property.propertyType} in{" "}
                  {property.locality}, {property.city}
                </p>
              </div>
              <span className="shrink-0 rounded border border-border px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
                {listingTag}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border/70 py-3">
              <div>
                <p className="text-base font-bold text-charcoal sm:text-lg">
                  {formatPrice(property.price)}
                  {property.listingType === "rent" ? (
                    <span className="text-xs font-normal text-muted">/mo</span>
                  ) : null}
                </p>
                {pricePerSqft ? (
                  <p className="text-[11px] text-muted">
                    ₹{pricePerSqft.toLocaleString("en-IN")} /sqft
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-base font-bold text-charcoal sm:text-lg">
                  {formatArea(property.area)}
                </p>
                <p className="text-[11px] text-muted">Super Built-up Area</p>
              </div>
              <div>
                <p className="text-base font-bold text-charcoal sm:text-lg">
                  {property.bhk > 0 ? `${property.bhk} BHK` : "—"}
                  {property.bathrooms > 0 ? (
                    <span className="text-sm font-normal text-muted">
                      {" "}
                      ({property.bathrooms} Baths)
                    </span>
                  ) : null}
                </p>
                <p className="text-[11px] text-muted">{property.possession || statusLabel}</p>
              </div>
            </div>

            {(property.facing || property.floors || property.tags.length > 0) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted">Highlights:</span>
                {property.floors ? (
                  <span className="rounded-md bg-champagne/60 px-2 py-0.5 text-xs text-charcoal">
                    {property.floors} Floors
                  </span>
                ) : null}
                {property.facing ? (
                  <span className="rounded-md bg-champagne/60 px-2 py-0.5 text-xs text-charcoal">
                    {property.facing} Facing
                  </span>
                ) : null}
                {property.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-champagne/60 px-2 py-0.5 text-xs text-charcoal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-2 line-clamp-2 text-sm text-muted">{property.description}</p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-charcoal">
                  {property.builderName}
                </p>
                {property.featured ? (
                  <p className="text-[11px] text-gold-rich">Featured Dealer</p>
                ) : property.verified ? (
                  <p className="text-[11px] text-success">Verified</p>
                ) : (
                  <p className="text-[11px] text-muted">Posted by builder</p>
                )}
              </div>
              <div
                className="relative z-20 flex items-center gap-2"
                onClick={stopNav}
              >
                <ViewNumberButton
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
                <Button
                  type="button"
                  size="sm"
                  className="cursor-pointer rounded-md text-white gold-gradient"
                  onClick={(e) => {
                    stopNav(e);
                    setInquiryOpen(true);
                  }}
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        <PropertyInquiryDialog
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          property={{
            id: property.id,
            slug: property.slug,
            title: property.title,
            locality: property.locality,
            city: property.city,
          }}
        />
      </article>
    );
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
      className={cn(
        "group hover-lift flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-charcoal/5",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {badges}
        <div className="absolute top-3 right-3 z-20" onClick={stopNav}>
          {actionButtons}
        </div>

        {images.length > 1 ? (
          <>
            <div className="h-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((src, i) => (
                  <div key={src + i} className="relative min-w-0 flex-[0_0_100%]">
                    <Image
                      src={src}
                      alt={`${property.title} photo ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                stopNav(e);
                emblaApi?.scrollPrev();
              }}
              className="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                stopNav(e);
                emblaApi?.scrollNext();
              }}
              className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition",
                    i === selected ? "bg-white" : "bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        ) : (
          <Image
            src={images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xl font-semibold tracking-tight text-charcoal">
              {formatPrice(property.price)}
              {property.listingType === "rent" ? (
                <span className="text-sm font-normal text-muted"> /mo</span>
              ) : null}
            </p>
          </div>
          {property.listingType !== "rent" ? (
            <p className="text-xs text-muted">EMI from {formatPrice(emi)}/mo</p>
          ) : null}
        </div>

        <h3 className="line-clamp-1 text-base font-semibold text-foreground transition group-hover:text-gold">
          {property.title}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
          <span className="line-clamp-1">
            {property.locality}, {property.city}
          </span>
        </p>

        {meta}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
          <span className="line-clamp-1">{property.possession}</span>
          <span className="capitalize">{property.propertyType}</span>
        </div>
      </div>
    </article>
  );
}
