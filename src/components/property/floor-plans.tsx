"use client";

import { useState } from "react";
import Image from "next/image";
import type { FloorPlan } from "@/types";
import { cn, formatArea, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FloorPlansProps {
  plans: FloorPlan[];
  className?: string;
}

export function FloorPlans({ plans, className }: FloorPlansProps) {
  const [active, setActive] = useState(plans[0]?.id ?? "");

  if (!plans.length) {
    return (
      <p className={cn("text-sm text-muted", className)}>
        Floor plans will be available soon.
      </p>
    );
  }

  return (
    <Tabs
      value={active || plans[0].id}
      onValueChange={setActive}
      className={cn("w-full", className)}
    >
      <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1">
        {plans.map((plan) => (
          <TabsTrigger key={plan.id} value={plan.id} className="rounded-xl">
            {plan.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {plans.map((plan) => (
        <TabsContent key={plan.id} value={plan.id} className="mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-cream">
              <Image
                src={plan.image}
                alt={plan.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <Badge variant="featured" className="mb-2">
                  {plan.bhk} BHK
                </Badge>
                <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <dt className="text-xs text-muted">Carpet / Saleable</dt>
                  <dd className="mt-1 text-lg font-semibold">{formatArea(plan.area)}</dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <dt className="text-xs text-muted">Price</dt>
                  <dd className="mt-1 text-lg font-semibold text-gold-rich">
                    {formatPrice(plan.price)}
                  </dd>
                </div>
              </dl>
              <p className="text-sm leading-relaxed text-muted">
                Layout optimized for natural light and efficient living. Exact dimensions may vary —
                request a brochure for detailed measurements.
              </p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
