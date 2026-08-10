"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import type { Property } from "@/types";
import { cn, formatPrice, formatArea } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  property: Property;
  className?: string;
}

export function ProjectCard({ property, className }: ProjectCardProps) {
  const statusLabel =
    property.constructionStatus === "new-launch"
      ? "New Launch"
      : property.constructionStatus === "under-construction"
        ? "Under Construction"
        : "Ready";

  return (
    <Link
      href={`/property/${property.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group hover-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-charcoal/5",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent opacity-60" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="gold" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {statusLabel}
          </Badge>
          {property.reraId ? <Badge variant="verified">RERA</Badge> : null}
        </div>
        <div className="absolute right-3 bottom-3 rounded-xl bg-white/95 px-3 py-1.5 text-sm font-semibold text-charcoal shadow backdrop-blur-sm">
          {formatPrice(property.price)}
          <span className="font-normal text-muted"> onwards</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium tracking-wide text-gold uppercase">
          {property.builderName}
        </p>
        <h3 className="text-lg font-semibold text-foreground transition group-hover:text-gold">
          {property.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {property.locality}, {property.city}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
          <span>
            {property.bhk > 0 ? `${property.bhk} BHK · ` : null}
            {formatArea(property.area)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {property.possession}
          </span>
        </div>
      </div>
    </Link>
  );
}
