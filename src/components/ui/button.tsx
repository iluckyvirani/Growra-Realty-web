import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "gold-gradient text-white shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30 hover:brightness-105",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-champagne",
        outline:
          "border border-border bg-transparent shadow-sm hover:border-gold/50 hover:bg-champagne/40 hover:text-charcoal",
        ghost: "hover:bg-champagne/50 hover:text-charcoal",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-[8px] px-3.5 text-xs",
        default: "h-11 px-5 py-2",
        lg: "h-12 rounded-[8px] px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
