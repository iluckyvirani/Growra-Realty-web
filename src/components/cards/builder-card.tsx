import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, Star } from "lucide-react";
import type { Builder } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BuilderCardProps {
  builder: Builder;
  className?: string;
}

export function BuilderCard({ builder, className }: BuilderCardProps) {
  return (
    <Link
      href={`/builders/${builder.slug}`}
      className={cn(
        "group hover-lift relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-charcoal/5",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={builder.coverImage}
          alt={builder.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        {builder.verified ? (
          <Badge variant="verified" className="absolute top-3 right-3 gap-1 backdrop-blur-sm">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </Badge>
        ) : null}
      </div>

      <div className="relative -mt-8 flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md">
          <Image
            src={builder.logo}
            alt={`${builder.name} logo`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground transition group-hover:text-gold">
            {builder.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{builder.description}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-gold" />
            {builder.totalProjects} projects
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {builder.rating.toFixed(1)} ({builder.reviews.toLocaleString("en-IN")})
          </span>
          <span>Est. {builder.established}</span>
        </div>
      </div>
    </Link>
  );
}
