"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { cities } from "@/data";
import { PROPERTY_TYPES } from "@/constants";
import type { ListingType } from "@/types";
import { cn } from "@/lib/utils";
import { useLocationStore, useRecentStore, useSearchStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS: { value: string; label: string; path: string }[] = [
  { value: "buy", label: "Buy", path: "/buy" },
  { value: "rent", label: "Rent / Lease", path: "/rent" },
  { value: "plot", label: "Plots/Land", path: "/plots" },
  { value: "pg", label: "PG / Co-living", path: "/pg" },
];

const FOOTER_LINKS = [
  { label: "All India", href: "/buy" },
  { label: "Dubai", href: "/buy?city=Dubai" },
  { label: "For NRI", href: "/buy" },
] as const;

interface ExploreLocationDropdownProps {
  onClose: () => void;
}

export function ExploreLocationDropdown({ onClose }: ExploreLocationDropdownProps) {
  const router = useRouter();
  const setFilters = useSearchStore((s) => s.setFilters);
  const addSearch = useRecentStore((s) => s.addSearch);
  const setCity = useLocationStore((s) => s.setCity);

  const [tab, setTab] = useState("buy");
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [openSuggest, setOpenSuggest] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities.slice(0, 6);
    return cities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.slug.includes(q),
      )
      .slice(0, 6);
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const active = TABS.find((t) => t.value === tab) ?? TABS[0];
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("city", query.trim());
      params.set("q", query.trim());
      addSearch(query.trim());
      const match = cities.find(
        (c) => c.name.toLowerCase() === query.trim().toLowerCase(),
      );
      if (match) setCity(match.slug, match.name);
    }
    if (propertyType && propertyType !== "all") {
      params.set("type", propertyType);
    }

    setFilters({
      listingType: tab as ListingType,
      query: query.trim() || undefined,
      city: query.trim() || undefined,
      propertyType:
        propertyType && propertyType !== "all" ? [propertyType as never] : undefined,
    });

    const qs = params.toString();
    onClose();
    router.push(qs ? `${active.path}?${qs}` : active.path);
  };

  return (
    <div className="w-[min(38rem,calc(100vw-1.25rem))] overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_20px_50px_-16px_rgba(27,27,27,0.4)]">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
          Explore real estate in...
        </h2>

        <div className="mt-4 flex items-center gap-1 overflow-x-auto border-b border-border">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "relative shrink-0 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4",
                  active ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal",
                )}
              >
                {t.label}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-gold" />
                ) : null}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 mb-5 flex flex-col overflow-hidden rounded-lg border border-border shadow-sm sm:flex-row sm:items-stretch"
        >
          <div className="shrink-0 border-b border-border sm:border-r sm:border-b-0">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger
                className="h-12 w-full rounded-none border-0 bg-transparent px-4 text-sm font-medium shadow-none focus:ring-0 sm:w-[9.5rem]"
                aria-label="Property category"
              >
                <SelectValue placeholder="Residential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Residential</SelectItem>
                {PROPERTY_TYPES.filter((t) =>
                  ["apartment", "villa", "penthouse", "studio", "farmhouse", "plot", "pg"].includes(
                    t.value,
                  ),
                ).map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenSuggest(true);
              }}
              onFocus={() => setOpenSuggest(true)}
              onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
              placeholder="City Name"
              className="h-12 rounded-none border-0 bg-transparent pr-4 pl-11 text-sm shadow-none placeholder:text-muted focus-visible:ring-0"
              autoComplete="off"
              aria-label="City name"
            />

            {openSuggest && suggestions.length > 0 ? (
              <ul className="absolute top-full left-0 z-[60] mt-1 max-h-48 w-full overflow-auto rounded-[8px] border border-border bg-white py-1 shadow-xl">
                {suggestions.map((city) => (
                  <li key={city.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-champagne/40"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setQuery(city.name);
                        setCity(city.slug, city.name);
                        setOpenSuggest(false);
                      }}
                    >
                      <span className="font-medium text-charcoal">{city.name}</span>
                      <span className="text-muted">· {city.state}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="shrink-0 p-1.5">
            <Button
              type="submit"
              className="h-9 w-full rounded-md px-6 text-sm font-semibold text-white gold-gradient sm:h-10 sm:w-auto"
            >
              Explore
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-cream/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => {
                if (link.label === "All India") {
                  setCity("all-india", "All India");
                }
                onClose();
              }}
              className="font-medium text-charcoal/80 transition hover:text-gold-rich"
            >
              {link.label}
            </Link>
          ))}
          <span className="hidden text-border sm:inline">|</span>
          <div className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1.5">
            <Link
              href="/buy"
              onClick={onClose}
              className="font-medium text-charcoal/80 hover:text-gold-rich"
            >
              International
            </Link>
            <span className="text-[11px] text-muted">Powered by Growra Global</span>
          </div>
        </div>

        <Link
          href="/#top-cities"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-sm font-semibold text-gold-rich hover:underline"
        >
          View top cities
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
