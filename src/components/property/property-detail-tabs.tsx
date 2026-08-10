"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "society", label: "Society" },
  { id: "dealer", label: "Contact" },
  { id: "trends", label: "Price Trends" },
  { id: "registry", label: "Registry Record" },
  { id: "reviews", label: "Society Reviews" },
  { id: "explore", label: "Explore" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface PropertyDetailTabsProps {
  sections: Partial<Record<TabId, React.ReactNode>>;
}

export function PropertyDetailTabs({ sections }: PropertyDetailTabsProps) {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-white/95 backdrop-blur sm:mx-0">
        <nav className="flex gap-1 overflow-x-auto px-4 sm:px-0" aria-label="Property sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActive(tab.id);
                document.getElementById(`section-${tab.id}`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={cn(
                "shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition",
                active === tab.id
                  ? "border-gold text-gold-rich"
                  : "border-transparent text-muted hover:text-charcoal",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-10">
        {TABS.map((tab) =>
          sections[tab.id] ? (
            <section key={tab.id} id={`section-${tab.id}`} className="scroll-mt-28">
              {sections[tab.id]}
            </section>
          ) : null,
        )}
      </div>
    </div>
  );
}
