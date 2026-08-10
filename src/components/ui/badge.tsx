import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[8px] border px-2.5 py-1 text-[11px] font-semibold tracking-wide shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-charcoal text-white",
        gold: "border-transparent bg-[#C89B3C] text-white",
        verified: "border-transparent bg-[#16A34A] text-white",
        featured: "border-transparent bg-[#B8860B] text-white",
        outline: "border-border bg-white/95 text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
