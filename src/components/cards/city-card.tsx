import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import type { City } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CityCardProps {
  city: City;
  className?: string;
}

export function CityCard({ city, className }: CityCardProps) {
  return (
    <Link
      href={`/city/${city.slug}`}
      className={cn(
        "group hover-lift relative block aspect-[4/5] overflow-hidden rounded-2xl",
        className,
      )}
    >
      <Image
        src={city.image}
        alt={city.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

      {city.trending ? (
        <Badge variant="gold" className="absolute top-3 left-3 gap-1">
          <TrendingUp className="h-3 w-3" />
          Trending
        </Badge>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold tracking-tight">{city.name}</h3>
          <ArrowUpRight className="h-5 w-5 opacity-0 transition group-hover:opacity-100" />
        </div>
        <p className="text-sm text-white/75">{city.state}</p>
        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/80">
          <span>{city.propertyCount.toLocaleString("en-IN")} properties</span>
          <span>Avg {formatPrice(city.avgPrice)}/sq.ft</span>
        </div>
      </div>
    </Link>
  );
}
