"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, LocateFixed, Mic, Search } from "lucide-react";
import { toast } from "sonner";
import { cities } from "@/data";
import type { ListingType } from "@/types";
import { cn } from "@/lib/utils";
import { useLocationStore, useRecentStore, useSearchStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TabId = "buy" | "rent" | "new-launch" | "commercial" | "plot" | "project";

const TABS: { value: TabId; label: string; path: string; dot?: boolean }[] = [
  { value: "buy", label: "Buy", path: "/buy" },
  { value: "rent", label: "Rent", path: "/rent" },
  { value: "new-launch", label: "New Launch", path: "/projects?status=new-launch", dot: true },
  { value: "commercial", label: "Commercial", path: "/commercial" },
  { value: "plot", label: "Plots/Land", path: "/plots" },
  { value: "project", label: "Projects", path: "/projects" },
];

const RESIDENTIAL_TYPES = [
  "Flat/Apartment",
  "Independent House / Villa",
  "Builder Floor",
  "Plot / Land",
  "Studio",
  "Serviced Apartments",
  "Farm House",
  "1 RK / Studio Apartment",
  "Other",
] as const;

const COMMERCIAL_PROPERTY_TYPES = [
  "Ready to move offices",
  "Bare shell offices",
  "Shops & Retail",
  "Commercial / Inst. Land",
  "Agricultural / Farm Land",
  "Industrial Land / Plots",
  "Warehouse",
  "Cold Storage",
  "Factory & Manufacturing",
  "Hotel / Resorts",
  "Others",
] as const;

const INVESTMENT_OPTIONS = [
  "Pre Leased Spaces",
  "Food Courts",
  "Restaurants",
  "Multiplexes",
  "SCO Plots",
] as const;

type TabConfig = {
  typeTrigger: string;
  placeholders: string[];
  filters: string[];
  mode: "residential-multi" | "commercial" | "plots" | "simple";
  simpleOptions?: string[];
  showIntent?: boolean;
  intentOptions?: string[];
  crossLink?: { text: string; action: TabId };
};

const TAB_CONFIG: Record<TabId, TabConfig> = {
  buy: {
    typeTrigger: "All Residential",
    placeholders: ['Search "3 BHK for sale in Mumbai"', 'Search "Flats in Bangalore"'],
    filters: ["Budget", "Bedroom", "Construction Status", "Posted By"],
    mode: "residential-multi",
    crossLink: { text: "Looking for commercial properties?", action: "commercial" },
  },
  rent: {
    typeTrigger: "All Residential",
    placeholders: ['Search "PG in sector 74 Noida"', 'Search "2 BHK for rent"'],
    filters: ["Budget", "Bedroom", "Posted By", "Furnishing"],
    mode: "residential-multi",
    crossLink: { text: "Looking for commercial properties?", action: "commercial" },
  },
  "new-launch": {
    typeTrigger: "Residential",
    placeholders: ['Search "New projects in Hyderabad"', 'Search "Upcoming projects"'],
    filters: ["Budget", "Area", "Posted By"],
    mode: "simple",
    simpleOptions: ["Residential", "Commercial", "Plots"],
  },
  commercial: {
    typeTrigger: "All Commercial",
    placeholders: ['Search "Hyderabad"', 'Search "Office space in Pune"'],
    filters: ["Budget", "Area", "Construction Status", "Posted By"],
    mode: "commercial",
    showIntent: true,
    intentOptions: ["Buy", "Lease", "Invest"],
    crossLink: { text: "Looking for residential properties?", action: "buy" },
  },
  plot: {
    typeTrigger: "Residential",
    placeholders: ['Search "3 BHK for sale in Mumbai"', 'Search "Plots in Noida"'],
    filters: ["Budget", "Area", "Posted By"],
    mode: "plots",
    simpleOptions: ["Residential", "Commercial"],
  },
  project: {
    typeTrigger: "Residential",
    placeholders: ['Search "Hyderabad"', 'Search "Projects in Pune"'],
    filters: ["Budget", "Area", "Posted By"],
    mode: "simple",
    simpleOptions: ["Residential", "Commercial", "Plots"],
  },
};

const MOBILE_TABS = TABS.slice(0, 4);

interface HeroSearchProps {
  className?: string;
}

export function HeroSearch({ className }: HeroSearchProps) {
  const router = useRouter();
  const setFilters = useSearchStore((s) => s.setFilters);
  const addSearch = useRecentStore((s) => s.addSearch);
  const setCity = useLocationStore((s) => s.setCity);
  const cityName = useLocationStore((s) => s.cityName);
  const citySlug = useLocationStore((s) => s.citySlug);

  const [tab, setTab] = useState<TabId>("buy");
  const [query, setQuery] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const [typePanelOpen, setTypePanelOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [simpleType, setSimpleType] = useState("Residential");
  const [intent, setIntent] = useState("Buy");
  const [plotMode, setPlotMode] = useState<"residential" | "commercial">("residential");
  const [investment, setInvestment] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const config = TAB_CONFIG[tab];

  useEffect(() => {
    setTypePanelOpen(false);
    setSearchActive(false);
    setSelectedTypes([]);
    setInvestment([]);
    setSimpleType(config.simpleOptions?.[0] ?? "Residential");
    setIntent(config.intentOptions?.[0] ?? "Buy");
    setPlotMode("residential");
  }, [tab, config.intentOptions, config.simpleOptions]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setTypePanelOpen(false);
        setSearchActive(false);
        setOpenSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const placeholderCity =
    !cityName || cityName === "All India" || citySlug === "all-india"
      ? "All India"
      : cityName;

  const placeholder =
    config.placeholders[0]?.includes("All India") || placeholderCity === "All India"
      ? config.placeholders[0]
      : `Search "${placeholderCity}"`;

  const typeTriggerLabel = useMemo(() => {
    if (config.mode === "residential-multi") {
      if (selectedTypes.length === 0) return "All Residential";
      if (selectedTypes.length === 1) return selectedTypes[0];
      return `${selectedTypes.length} selected`;
    }
    if (config.mode === "commercial") {
      if (selectedTypes.length === 0) return "All Commercial";
      if (selectedTypes.length === 1) return selectedTypes[0];
      return `${selectedTypes.length} selected`;
    }
    return simpleType;
  }, [config.mode, selectedTypes, simpleType]);

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

  const toggleType = (label: string) => {
    setSelectedTypes((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const toggleInvestment = (label: string) => {
    setInvestment((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const active = TABS.find((t) => t.value === tab) ?? TABS[0];
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
      addSearch(query.trim());
    }
    if (selectedTypes.length) params.set("type", selectedTypes.join(","));
    if (config.showIntent) params.set("intent", intent.toLowerCase());
    if (config.mode === "plots") params.set("plot", plotMode);

    setFilters({
      listingType: (tab === "new-launch" ? "project" : tab) as ListingType,
      query: query.trim() || undefined,
    });

    const qs = params.toString();
    router.push(qs ? `${active.path}${active.path.includes("?") ? "&" : "?"}${qs}` : active.path);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("all-india", "All India");
        setQuery("");
        toast.success("Showing properties across All India");
      },
      () => toast.error("Could not detect location"),
      { timeout: 8000 },
    );
  };

  const switchTab = (next: TabId) => {
    setTab(next);
    setTypePanelOpen(false);
  };

  const renderSuggestions = () =>
    openSuggest && suggestions.length > 0 ? (
      <ul className="absolute top-[calc(100%-2px)] left-0 z-[80] mt-0 max-h-56 w-full min-w-[16rem] overflow-auto rounded-md border border-border bg-white py-1.5 shadow-[0_12px_32px_-8px_rgba(27,27,27,0.28)]">
        {suggestions.map((city) => (
          <li key={city.id}>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-5 py-2.5 text-left text-sm transition hover:bg-champagne/50"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery(city.name);
                setCity(city.slug, city.name);
                setOpenSuggest(false);
              }}
            >
              <span className="font-semibold text-charcoal">{city.name}</span>
              <span className="text-muted">· {city.state}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  const checkbox = (label: string, checked: boolean, onChange: () => void) => (
    <label
      key={label}
      className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-charcoal"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition",
          checked ? "border-gold bg-gold text-white" : "border-border bg-white",
        )}
      >
        {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );

  const typePanel = typePanelOpen ? (
    <div className="rounded-b-xl border-t border-border bg-white px-4 py-4 sm:px-5">
      {config.mode === "residential-multi" ? (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal">Property type</p>
            <button
              type="button"
              className="text-xs font-semibold text-gold-rich hover:underline"
              onClick={() => setSelectedTypes([])}
            >
              Clear
            </button>
          </div>
          <div className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {RESIDENTIAL_TYPES.map((t) =>
              checkbox(t, selectedTypes.includes(t), () => toggleType(t)),
            )}
          </div>
          {config.crossLink ? (
            <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted">
              {config.crossLink.text}{" "}
              <button
                type="button"
                className="font-semibold text-gold-rich hover:underline"
                onClick={() => switchTab(config.crossLink!.action)}
              >
                Click here
              </button>
            </p>
          ) : null}
        </>
      ) : null}

      {config.mode === "commercial" ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-charcoal">Property Types</p>
            <div className="grid gap-x-4 sm:grid-cols-2">
              {COMMERCIAL_PROPERTY_TYPES.map((t) =>
                checkbox(t, selectedTypes.includes(t), () => toggleType(t)),
              )}
            </div>
          </div>
          <div className="border-t border-border pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                Investment Options
                <span className="rounded bg-danger px-1.5 py-0.5 text-[9px] font-bold text-white">
                  NEW
                </span>
              </p>
              <button
                type="button"
                className="text-xs font-semibold text-gold-rich hover:underline"
                onClick={() => {
                  setSelectedTypes([]);
                  setInvestment([]);
                }}
              >
                Clear
              </button>
            </div>
            <div className="max-h-40 space-y-0.5 overflow-y-auto pr-1">
              {INVESTMENT_OPTIONS.map((t) =>
                checkbox(t, investment.includes(t), () => toggleInvestment(t)),
              )}
            </div>
          </div>
          {config.crossLink ? (
            <p className="border-t border-border/60 pt-3 text-xs text-muted lg:col-span-2">
              {config.crossLink.text}{" "}
              <button
                type="button"
                className="font-semibold text-gold-rich hover:underline"
                onClick={() => switchTab(config.crossLink!.action)}
              >
                Click here
              </button>
            </p>
          ) : null}
        </div>
      ) : null}

      {config.mode === "simple" ? (
        <div className="flex flex-wrap gap-2">
          {config.simpleOptions?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSimpleType(opt);
                setTypePanelOpen(false);
              }}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                simpleType === opt
                  ? "border-gold bg-champagne/50 text-charcoal"
                  : "border-border text-muted hover:border-gold/40",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null}

      {config.mode === "plots" ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-charcoal">Plots/Land</p>
          <div className="flex flex-wrap gap-5">
            {(
              [
                { id: "residential", label: "Residential Plots/Land" },
                { id: "commercial", label: "Commercial Plots/Land" },
              ] as const
            ).map((opt) => (
              <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    plotMode === opt.id ? "border-gold" : "border-border",
                  )}
                >
                  {plotMode === opt.id ? (
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  ) : null}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={plotMode === opt.id}
                  onChange={() => setPlotMode(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom filter pills inside expanded panel for buy/rent/commercial */}
      {(config.mode === "residential-multi" || config.mode === "commercial") && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {config.filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toast.message(`${f} filter — coming on results page`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium text-charcoal transition hover:border-gold/40"
            >
              {f}
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null;

  const filterPills =
    searchActive && !typePanelOpen && (config.mode === "plots" || config.mode === "simple") ? (
      <div className="rounded-b-xl border-t border-border bg-white px-4 py-3 sm:px-5">
        {config.mode === "plots" ? (
          <>
            <p className="mb-2 text-sm font-semibold text-charcoal">Plots/Land</p>
            <div className="mb-3 flex flex-wrap gap-5">
              {(
                [
                  { id: "residential", label: "Residential Plots/Land" },
                  { id: "commercial", label: "Commercial Plots/Land" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      plotMode === opt.id ? "border-gold" : "border-border",
                    )}
                  >
                    {plotMode === opt.id ? (
                      <span className="h-2 w-2 rounded-full bg-gold" />
                    ) : null}
                  </span>
                  <input
                    type="radio"
                    className="sr-only"
                    checked={plotMode === opt.id}
                    onChange={() => setPlotMode(opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {config.filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toast.message(`${f} filter — coming on results page`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium text-charcoal transition hover:border-gold/40"
            >
              {f}
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            </button>
          ))}
        </div>
      </div>
    ) : searchActive &&
      !typePanelOpen &&
      (config.mode === "residential-multi" || config.mode === "commercial") ? (
      <div className="flex flex-wrap gap-2 rounded-b-xl border-t border-border bg-white px-4 py-3 sm:px-5">
        {config.showIntent ? (
          <div className="mb-1 flex w-full flex-wrap items-center gap-4">
            {config.intentOptions?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    intent === opt ? "border-gold" : "border-border",
                  )}
                >
                  {intent === opt ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={intent === opt}
                  onChange={() => setIntent(opt)}
                />
                {opt}
              </label>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
              <span className="rounded bg-danger px-1 py-px text-[9px] font-bold text-white">
                NEW
              </span>
              Looking to invest?{" "}
              <button
                type="button"
                className="font-semibold text-gold-rich hover:underline"
                onClick={() => setIntent("Invest")}
              >
                Click here
              </button>
            </span>
          </div>
        ) : null}
        {config.filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => toast.message(`${f} filter — coming on results page`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium text-charcoal transition hover:border-gold/40"
          >
            {f}
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div className={cn("w-full [&_a]:cursor-pointer [&_button]:cursor-pointer [&_label]:cursor-pointer", className)}>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="rounded-xl border border-border/80 bg-white shadow-[0_12px_40px_-12px_rgba(27,27,27,0.35)]">
          <div className="flex items-center gap-0.5 overflow-x-auto rounded-t-xl px-2 pt-1">
            {MOBILE_TABS.map((t) => {
              const active = tab === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => switchTab(t.value)}
                  className={cn(
                    "relative shrink-0 px-3 py-2.5 text-[13px] font-medium transition-colors",
                    active ? "font-semibold text-charcoal" : "text-muted",
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {t.label}
                    {t.dot ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
                    ) : null}
                  </span>
                  {active ? (
                    <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-gold" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <form onSubmit={handleSubmit} className="relative z-20 border-t border-border p-3">
            <div className="relative overflow-visible">
              <button
                type="submit"
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-muted"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenSuggest(true);
                }}
                onFocus={() => setOpenSuggest(true)}
                onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
                placeholder={placeholder}
                className="h-12 rounded-lg border border-border bg-cream/50 pr-12 pl-11 text-sm shadow-none placeholder:text-muted focus-visible:ring-gold/40"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => toast.message("Voice search coming soon")}
                className="absolute top-1/2 right-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gold-rich"
                aria-label="Voice search"
              >
                <Mic className="h-4 w-4" />
              </button>
              {renderSuggestions()}
            </div>
          </form>
        </div>
      </div>

      {/* Desktop */}
      <div
        ref={panelRef}
        className={cn(
          "hidden rounded-xl border border-border/80 bg-white shadow-[0_12px_40px_-12px_rgba(27,27,27,0.35)] md:block",
          !openSuggest && "overflow-hidden",
        )}
      >
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 pt-1 sm:px-5">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => switchTab(t.value)}
                className={cn(
                  "relative shrink-0 px-3 py-3 text-sm font-medium transition-colors sm:px-4",
                  active ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {t.label}
                  {t.dot ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
                  ) : null}
                </span>
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-gold" />
                ) : null}
              </button>
            );
          })}
          <span className="ml-auto hidden h-5 w-px bg-border sm:block" aria-hidden />
          <Link
            href="/postproperty"
            className="hidden shrink-0 items-center gap-1.5 px-3 py-3 text-sm font-medium text-charcoal hover:text-gold-rich sm:inline-flex"
          >
            Post Property
            <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
              FREE
            </span>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row sm:items-stretch"
          onFocusCapture={() => setSearchActive(true)}
          onMouseDown={() => setSearchActive(true)}
        >
          {config.showIntent ? (
            <div className="shrink-0 border-b border-border sm:border-r sm:border-b-0">
              <button
                type="button"
                className="flex h-14 w-full items-center gap-1.5 px-4 text-sm font-medium text-charcoal sm:w-auto"
                onClick={() => {
                  const opts = config.intentOptions ?? ["Buy"];
                  const i = opts.indexOf(intent);
                  setIntent(opts[(i + 1) % opts.length]);
                }}
              >
                {intent}
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
            </div>
          ) : null}

          <div className="relative shrink-0 border-b border-border sm:border-r sm:border-b-0">
            <button
              type="button"
              onClick={() => setTypePanelOpen((v) => !v)}
              className={cn(
                "flex h-14 w-full items-center gap-1.5 px-4 text-left text-sm font-medium text-charcoal sm:min-w-[11rem]",
                typePanelOpen && "text-gold-rich",
              )}
              aria-expanded={typePanelOpen}
            >
              <span className="truncate">{typeTriggerLabel}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-3.5 w-3.5 shrink-0 text-muted transition",
                  typePanelOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          <div className="relative z-20 min-w-0 flex-1 overflow-visible">
            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenSuggest(true);
              }}
              onFocus={() => {
                setOpenSuggest(true);
                setSearchActive(true);
              }}
              onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
              placeholder={placeholder}
              className="h-14 rounded-none border-0 bg-transparent pr-24 pl-11 text-sm shadow-none placeholder:text-muted focus-visible:ring-0"
              autoComplete="off"
              aria-label="Search properties"
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              <button
                type="button"
                onClick={detectLocation}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-gold-rich transition hover:bg-gold hover:text-white"
                aria-label="Use my location"
              >
                <LocateFixed className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toast.message("Voice search coming soon")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne text-gold-rich transition hover:bg-gold hover:text-white"
                aria-label="Voice search"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            {renderSuggestions()}
          </div>

          <div className="shrink-0 p-2.5">
            <Button
              type="submit"
              className="h-11 w-full rounded-md px-8 text-sm font-semibold text-white gold-gradient sm:w-auto"
            >
              Search
            </Button>
          </div>
        </form>

        {typePanel}
        {filterPills}
      </div>
    </div>
  );
}
