"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ShieldCheck, X } from "lucide-react";
import { AMENITIES_LIST, BHK_OPTIONS } from "@/constants";
import type { ConstructionStatus, PropertyType, SearchFilters } from "@/types";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const PROPERTY_CHIPS: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Residential Apartment" },
  { value: "plot", label: "Residential Land" },
  { value: "villa", label: "Independent House/Villa" },
  { value: "studio", label: "Builder Floor" },
  { value: "farmhouse", label: "Farm House" },
  { value: "penthouse", label: "Penthouse" },
];

const STATUS_CHIPS: { value: ConstructionStatus; label: string }[] = [
  { value: "new-launch", label: "New Launch" },
  { value: "under-construction", label: "Under Construction" },
  { value: "ready", label: "Ready to move" },
];

const BHK_CHIPS: { value: number; label: string }[] = [
  { value: 1, label: "1 RK/1 BHK" },
  ...BHK_OPTIONS.filter((n) => n >= 2).map((n) => ({
    value: n,
    label: `${n} BHK`,
  })),
];

const POSTED_BY = ["Owner", "Builder", "Dealer", "Feature Dealer"] as const;

const FURNISHED = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
] as const;

const LOCALITIES = [
  { name: "Bandra West", badge: "NEW" as const },
  { name: "Whitefield", badge: "NEW" as const },
  { name: "Golf Course Road", badge: "NEW" as const },
  { name: "Koregaon Park", badge: null },
  { name: "Jubilee Hills", badge: "NEW" as const },
];

const AMENITY_VISIBLE = 5;

interface SearchFiltersProps {
  className?: string;
  onApply?: (filters: SearchFilters) => void;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-gold bg-champagne/70 text-charcoal"
          : "border-border bg-white text-charcoal/80 hover:border-gold/40",
      )}
    >
      {label}
    </button>
  );
}

function Section({
  title,
  open,
  onToggle,
  clear,
  onClear,
  children,
  hint,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  clear?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="border-b border-border/80 py-3.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
        >
          <span className="text-sm font-semibold text-charcoal">
            {title}
            {hint ? (
              <span className="ml-1 text-xs font-normal text-muted">{hint}</span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted transition",
              open && "rotate-180",
            )}
          />
        </button>
        {clear && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs font-medium text-gold-rich hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export function SearchFiltersPanel({ className }: SearchFiltersProps) {
  const { filters, setFilters, resetFilters } = useSearchStore();
  const [open, setOpen] = useState<Record<string, boolean>>({
    budget: true,
    type: true,
    bhk: true,
    status: true,
    posted: true,
    area: true,
    localities: true,
    projects: false,
    purchase: false,
    amenities: true,
    furnished: false,
    rera: false,
  });
  const [showMoreType, setShowMoreType] = useState(false);
  const [showMoreBhk, setShowMoreBhk] = useState(false);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const [localities, setLocalities] = useState<string[]>([]);
  const [postedBy, setPostedBy] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  const toggleSection = (key: string) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  const toggleArray = <T extends string | number>(
    key: keyof SearchFilters,
    value: T,
    current?: T[],
  ) => {
    const list = current ?? [];
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    setFilters({ [key]: next.length ? next : undefined });
  };

  const applied = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    filters.propertyType?.forEach((t) => {
      const label = PROPERTY_CHIPS.find((p) => p.value === t)?.label ?? t;
      chips.push({
        key: `type-${t}`,
        label,
        clear: () =>
          setFilters({
            propertyType: filters.propertyType?.filter((x) => x !== t),
          }),
      });
    });
    filters.bhk?.forEach((b) => {
      chips.push({
        key: `bhk-${b}`,
        label: b === 1 ? "1 RK/1 BHK" : `${b} BHK`,
        clear: () => setFilters({ bhk: filters.bhk?.filter((x) => x !== b) }),
      });
    });
    filters.constructionStatus?.forEach((s) => {
      chips.push({
        key: `status-${s}`,
        label: STATUS_CHIPS.find((c) => c.value === s)?.label ?? s,
        clear: () =>
          setFilters({
            constructionStatus: filters.constructionStatus?.filter((x) => x !== s),
          }),
      });
    });
    if (filters.verified) {
      chips.push({
        key: "verified",
        label: "Verified",
        clear: () => setFilters({ verified: undefined }),
      });
    }
    if (filters.rera) {
      chips.push({
        key: "rera",
        label: "RERA Approved",
        clear: () => setFilters({ rera: undefined }),
      });
    }
    filters.amenities?.forEach((a) => {
      chips.push({
        key: `amenity-${a}`,
        label: AMENITIES_LIST.find((x) => x.id === a)?.name ?? a,
        clear: () =>
          setFilters({ amenities: filters.amenities?.filter((x) => x !== a) }),
      });
    });
    localities.forEach((loc) => {
      chips.push({
        key: `loc-${loc}`,
        label: loc,
        clear: () => setLocalities((prev) => prev.filter((l) => l !== loc)),
      });
    });
    return chips;
  }, [filters, localities, setFilters]);

  const applyBudget = () => {
    const min = minBudget ? Number(minBudget.replace(/,/g, "")) : undefined;
    const max = maxBudget ? Number(maxBudget.replace(/,/g, "")) : undefined;
    setFilters({
      minPrice: min && !Number.isNaN(min) ? min : undefined,
      maxPrice: max && !Number.isNaN(max) ? max : undefined,
    });
  };

  const applyArea = () => {
    const min = minArea ? Number(minArea.replace(/,/g, "")) : undefined;
    const max = maxArea ? Number(maxArea.replace(/,/g, "")) : undefined;
    setFilters({
      minArea: min && !Number.isNaN(min) ? min : undefined,
      maxArea: max && !Number.isNaN(max) ? max : undefined,
    });
  };

  const visibleTypes = showMoreType ? PROPERTY_CHIPS : PROPERTY_CHIPS.slice(0, 5);
  const visibleBhk = showMoreBhk ? BHK_CHIPS : BHK_CHIPS.slice(0, 5);
  const visibleAmenities = showMoreAmenities
    ? AMENITIES_LIST
    : AMENITIES_LIST.slice(0, AMENITY_VISIBLE);

  return (
    <aside
      className={cn(
        "flex h-fit max-h-[calc(100vh-7rem)] flex-col overflow-y-auto rounded-[8px] border border-border bg-white",
        className,
      )}
    >
      <div className="px-4 py-3">
        {/* Applied Filters */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-charcoal">Applied Filters</p>
          {applied.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setLocalities([]);
                setPostedBy([]);
                setMinBudget("");
                setMaxBudget("");
                setMinArea("");
                setMaxArea("");
              }}
              className="text-xs font-medium text-gold-rich hover:underline"
            >
              Clear All
            </button>
          ) : null}
        </div>
        {applied.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {applied.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-champagne/60 px-2.5 py-1 text-xs font-medium text-charcoal"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove ${chip.label}`}
                  className="text-muted hover:text-charcoal"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-muted">No filters applied</p>
        )}
      </div>

      <div className="border-t border-border px-4">
        {/* Verified */}
        <div className="flex items-center justify-between gap-3 border-b border-border/80 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal">Verified properties</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
              <span className="text-[11px] text-muted">By Growra Verification</span>
            </div>
          </div>
          <Switch
            checked={!!filters.verified}
            onCheckedChange={(v) => setFilters({ verified: v || undefined })}
          />
        </div>

        {/* Budget */}
        <Section
          title="Budget"
          open={open.budget}
          onToggle={() => toggleSection("budget")}
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              onBlur={applyBudget}
              placeholder="No min"
              className="h-9 rounded-lg text-sm"
              inputMode="numeric"
            />
            <Input
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              onBlur={applyBudget}
              placeholder="No max"
              className="h-9 rounded-lg text-sm"
              inputMode="numeric"
            />
          </div>
        </Section>

        {/* Type of property */}
        <Section
          title="Type of property"
          open={open.type}
          onToggle={() => toggleSection("type")}
          clear={!!filters.propertyType?.length}
          onClear={() => setFilters({ propertyType: undefined })}
        >
          <div className="flex flex-wrap gap-2">
            {visibleTypes.map((t) => (
              <FilterChip
                key={t.value}
                label={t.label}
                active={filters.propertyType?.includes(t.value)}
                onClick={() =>
                  toggleArray("propertyType", t.value, filters.propertyType)
                }
              />
            ))}
          </div>
          {PROPERTY_CHIPS.length > 5 ? (
            <button
              type="button"
              onClick={() => setShowMoreType((v) => !v)}
              className="mt-2 text-xs font-medium text-gold-rich hover:underline"
            >
              {showMoreType ? "Show less" : `+ ${PROPERTY_CHIPS.length - 5} more`}
            </button>
          ) : null}
        </Section>

        {/* Bedrooms */}
        <Section
          title="No. of Bedrooms"
          open={open.bhk}
          onToggle={() => toggleSection("bhk")}
        >
          <div className="flex flex-wrap gap-2">
            {visibleBhk.map((b) => (
              <FilterChip
                key={b.value}
                label={b.label}
                active={filters.bhk?.includes(b.value)}
                onClick={() => toggleArray("bhk", b.value, filters.bhk)}
              />
            ))}
          </div>
          {BHK_CHIPS.length > 5 ? (
            <button
              type="button"
              onClick={() => setShowMoreBhk((v) => !v)}
              className="mt-2 text-xs font-medium text-gold-rich hover:underline"
            >
              {showMoreBhk ? "Show less" : `+ ${BHK_CHIPS.length - 5} more`}
            </button>
          ) : null}
        </Section>

        {/* Construction Status */}
        <Section
          title="Construction Status"
          open={open.status}
          onToggle={() => toggleSection("status")}
        >
          <div className="flex flex-wrap gap-2">
            {STATUS_CHIPS.map((s) => (
              <FilterChip
                key={s.value}
                label={s.label}
                active={filters.constructionStatus?.includes(s.value)}
                onClick={() =>
                  toggleArray("constructionStatus", s.value, filters.constructionStatus)
                }
              />
            ))}
          </div>
        </Section>

        {/* Posted by */}
        <Section
          title="Posted by"
          open={open.posted}
          onToggle={() => toggleSection("posted")}
        >
          <div className="flex flex-wrap gap-2">
            {POSTED_BY.map((p) => (
              <FilterChip
                key={p}
                label={p}
                active={postedBy.includes(p)}
                onClick={() => {
                  setPostedBy((prev) =>
                    prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
                  );
                }}
              />
            ))}
          </div>
        </Section>

        {/* Area */}
        <Section
          title="Area"
          hint="sqft"
          open={open.area}
          onToggle={() => toggleSection("area")}
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              onBlur={applyArea}
              placeholder="No min"
              className="h-9 rounded-lg text-sm"
              inputMode="numeric"
            />
            <Input
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              onBlur={applyArea}
              placeholder="No max"
              className="h-9 rounded-lg text-sm"
              inputMode="numeric"
            />
          </div>
        </Section>

        {/* Localities */}
        <Section
          title="Localities"
          open={open.localities}
          onToggle={() => toggleSection("localities")}
        >
          <ul className="space-y-2.5">
            {LOCALITIES.map((loc) => {
              const checked = localities.includes(loc.name);
              return (
                <li key={loc.name}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal">
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        checked
                          ? "border-gold bg-gold text-white"
                          : "border-border",
                      )}
                    >
                      {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => {
                        setLocalities((prev) =>
                          checked
                            ? prev.filter((l) => l !== loc.name)
                            : [...prev, loc.name],
                        );
                        // Use locality as query hint via city filter loosely
                        if (!checked) {
                          setFilters({ query: loc.name });
                        }
                      }}
                    />
                    <span className="min-w-0 flex-1">{loc.name}</span>
                    {loc.badge ? (
                      <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-bold text-success uppercase">
                        {loc.badge}
                      </span>
                    ) : null}
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-gold-rich hover:underline"
          >
            More Localities
          </button>
        </Section>

        <Section
          title="New Projects / Societies"
          open={open.projects}
          onToggle={() => toggleSection("projects")}
        >
          <p className="text-xs text-muted">Browse new launches under Construction Status.</p>
        </Section>

        <Section
          title="Purchase type"
          open={open.purchase}
          onToggle={() => toggleSection("purchase")}
        >
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Resale" active={false} onClick={() => undefined} />
            <FilterChip label="New Booking" active={false} onClick={() => undefined} />
          </div>
        </Section>

        {/* Amenities */}
        <Section
          title="Amenities"
          open={open.amenities}
          onToggle={() => toggleSection("amenities")}
          clear={!!filters.amenities?.length}
          onClear={() => setFilters({ amenities: undefined })}
        >
          <div className="flex flex-wrap gap-2">
            {visibleAmenities.map((a) => (
              <FilterChip
                key={a.id}
                label={a.name}
                active={filters.amenities?.includes(a.id)}
                onClick={() => toggleArray("amenities", a.id, filters.amenities)}
              />
            ))}
          </div>
          {AMENITIES_LIST.length > AMENITY_VISIBLE ? (
            <button
              type="button"
              onClick={() => setShowMoreAmenities((v) => !v)}
              className="mt-2 text-xs font-medium text-gold-rich hover:underline"
            >
              {showMoreAmenities
                ? "Show less"
                : `+ ${AMENITIES_LIST.length - AMENITY_VISIBLE} more`}
            </button>
          ) : null}
        </Section>

        {/* Photos / Videos toggles */}
        <div className="flex items-center justify-between border-b border-border/80 py-3.5">
          <p className="text-sm font-semibold text-charcoal">Properties with photos</p>
          <Switch defaultChecked={false} />
        </div>
        <div className="flex items-center justify-between border-b border-border/80 py-3.5">
          <p className="text-sm font-semibold text-charcoal">Properties with videos</p>
          <Switch defaultChecked={false} />
        </div>

        {/* Furnishing */}
        <Section
          title="Furnishing status"
          open={open.furnished}
          onToggle={() => toggleSection("furnished")}
        >
          <div className="flex flex-wrap gap-2">
            {FURNISHED.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={filters.furnished?.includes(f.value)}
                onClick={() => toggleArray("furnished", f.value, filters.furnished)}
              />
            ))}
          </div>
        </Section>

        {/* RERA */}
        <Section
          title="RERA Approved"
          open={open.rera}
          onToggle={() => toggleSection("rera")}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Show only RERA registered</p>
            <Switch
              checked={!!filters.rera}
              onCheckedChange={(v) => setFilters({ rera: v || undefined })}
            />
          </div>
        </Section>
      </div>
    </aside>
  );
}

export { SearchFiltersPanel as SearchFilters };
