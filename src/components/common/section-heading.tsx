import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "left",
  className,
  cta,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:mb-12",
        align === "center" ? "items-center text-center" : "items-start text-left",
        cta && align === "left" && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>
        ) : null}
      </div>

      {cta ? (
        <Button asChild variant="outline" className="rounded-2xl border-gold/40 text-gold hover:bg-champagne/40">
          <Link href={cta.href}>
            {cta.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
