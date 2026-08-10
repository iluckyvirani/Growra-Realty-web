import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  label: string;
  min: number;
  max: number;
  href?: string;
  className?: string;
  index?: number;
}

export function BudgetCard({
  label,
  min,
  max,
  href,
  className,
  index = 0,
}: BudgetCardProps) {
  const maxParam = max === Infinity ? "" : `&maxPrice=${max}`;
  const link = href ?? `/buy?minPrice=${min}${maxParam}`;

  const accents = [
    "from-champagne/80 to-gold-light/30",
    "from-gold/20 to-champagne/60",
    "from-charcoal/5 to-champagne/50",
    "from-gold-light/40 to-champagne/70",
    "from-champagne to-gold/15",
    "from-gold/10 to-champagne/80",
  ];

  return (
    <Link
      href={link}
      className={cn(
        "group hover-lift relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border p-6 shadow-md shadow-charcoal/5",
        `bg-gradient-to-br ${accents[index % accents.length]}`,
        className,
      )}
    >
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-gold shadow-sm">
        <IndianRupee className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium tracking-[0.15em] text-muted uppercase">Budget</p>
        <h3 className="mt-1 text-xl font-semibold text-charcoal">{label}</h3>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-rich transition group-hover:gap-2.5">
          Explore homes
          <ArrowRight className="h-4 w-4" />
        </p>
      </div>
    </Link>
  );
}
