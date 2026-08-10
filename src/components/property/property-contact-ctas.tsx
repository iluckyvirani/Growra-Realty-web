"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PropertyInquiryDialog,
  ViewNumberButton,
  type PropertyInquiryTarget,
} from "@/components/property/property-inquiry-dialog";
import { cn } from "@/lib/utils";

interface PropertyContactCtasProps {
  property: PropertyInquiryTarget;
  className?: string;
  showViewNumber?: boolean;
  contactLabel?: string;
  fullWidth?: boolean;
}

export function PropertyContactCtas({
  property,
  className,
  showViewNumber = true,
  contactLabel = "Contact Growra Realty",
  fullWidth = false,
}: PropertyContactCtasProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {showViewNumber ? (
        <ViewNumberButton
          propertyId={property.id}
          propertyTitle={property.title}
          size="default"
          className={cn(
            "rounded-md border-gold/40 text-gold-rich hover:bg-champagne/50",
            fullWidth && "flex-1",
          )}
        />
      ) : null}
      <Button
        type="button"
        className={cn("rounded-md text-white gold-gradient", fullWidth && "w-full flex-1")}
        onClick={() => setOpen(true)}
      >
        {contactLabel}
      </Button>
      <PropertyInquiryDialog open={open} onOpenChange={setOpen} property={property} />
    </div>
  );
}
