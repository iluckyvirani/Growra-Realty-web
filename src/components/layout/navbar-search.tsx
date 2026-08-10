"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Mic, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocationStore, useRecentStore, useSearchStore } from "@/store";

const MODES = [
  { value: "buy", label: "Buy", path: "/buy" },
  { value: "rent", label: "Rent", path: "/rent" },
  { value: "commercial", label: "Commercial", path: "/commercial" },
  { value: "projects", label: "Projects", path: "/projects" },
  { value: "plots", label: "Plots", path: "/plots" },
] as const;

interface NavbarSearchProps {
  className?: string;
}

export function NavbarSearch({ className }: NavbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addSearch = useRecentStore((s) => s.addSearch);
  const setFilters = useSearchStore((s) => s.setFilters);
  const { cityName, setCity } = useLocationStore();

  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("buy");
  const [chips, setChips] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [modeOpen, setModeOpen] = useState(false);

  const active = MODES.find((m) => m.value === mode) ?? MODES[0];

  // Sync mode + chips from URL / location store
  useEffect(() => {
    const fromPath = MODES.find((m) => pathname.startsWith(m.path));
    if (fromPath) setMode(fromPath.value);

    const cityParam = searchParams.get("city") || searchParams.get("q");
    const next: string[] = [];
    if (cityParam) next.push(cityParam);
    else if (cityName && cityName !== "All India") next.push(cityName);
    setChips((prev) => {
      const unique = Array.from(new Set(next.filter(Boolean)));
      // Keep extra chips user added that aren't city
      const extras = prev.filter(
        (c) => !unique.includes(c) && c !== cityName && c !== "All India",
      );
      return [...unique, ...extras].slice(0, 4);
    });
  }, [pathname, searchParams, cityName]);

  const removeChip = (chip: string) => {
    setChips((prev) => prev.filter((c) => c !== chip));
    if (chip === cityName || chip.toLowerCase() === cityName.toLowerCase()) {
      setCity("all-india", "All India");
    }
  };

  const addChipFromQuery = () => {
    const q = query.trim();
    if (!q) return;
    if (!chips.includes(q)) setChips((prev) => [...prev, q].slice(0, 4));
    setQuery("");
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    let nextChips = [...chips];
    if (q && !nextChips.includes(q)) {
      nextChips = [...nextChips, q].slice(0, 4);
      setChips(nextChips);
      setQuery("");
    }

    const primary = nextChips[0] || q;
    if (primary) addSearch(primary);

    const params = new URLSearchParams();
    if (nextChips[0]) params.set("city", nextChips[0]);
    if (nextChips.length > 1) params.set("q", nextChips.slice(1).join(" "));
    else if (q) params.set("q", q);

    setFilters({
      city: nextChips[0],
      query: nextChips.slice(1).join(" ") || q || undefined,
    });

    const qs = params.toString();
    router.push(`${active.path}${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex h-11 min-w-0 flex-1 items-center overflow-hidden rounded-lg bg-white shadow-sm",
        className,
      )}
    >
      {/* Mode dropdown */}
      <div className="relative shrink-0 border-r border-border">
        <button
          type="button"
          onClick={() => setModeOpen((o) => !o)}
          className="flex h-11 items-center gap-1 px-3 text-[13px] font-semibold text-charcoal"
          aria-expanded={modeOpen}
          aria-haspopup="listbox"
        >
          {active.label}
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition", modeOpen && "rotate-180")} />
        </button>
        {modeOpen ? (
          <ul
            role="listbox"
            className="absolute top-full left-0 z-[60] mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-border bg-white py-1 shadow-xl"
          >
            {MODES.map((m) => (
              <li key={m.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={m.value === mode}
                  className={cn(
                    "w-full px-3 py-2 text-left text-[13px] hover:bg-champagne/50",
                    m.value === mode && "font-semibold text-gold-rich",
                  )}
                  onClick={() => {
                    setMode(m.value);
                    setModeOpen(false);
                  }}
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Chips + input */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-champagne/80 px-2 py-1 text-[12px] font-medium text-charcoal"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              className="rounded-sm text-muted hover:text-charcoal"
              aria-label={`Remove ${chip}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              e.preventDefault();
              addChipFromQuery();
            }
            if (e.key === "Backspace" && !query && chips.length) {
              removeChip(chips[chips.length - 1]);
            }
          }}
          placeholder={chips.length ? "Add more" : "Enter Locality / Project"}
          className="h-10 min-w-[7rem] flex-1 bg-transparent text-[13px] text-charcoal outline-none placeholder:text-muted"
          aria-label="Search locality or project"
        />
      </div>

      <div className="flex shrink-0 items-center gap-0.5 border-l border-border px-1.5">
        <button
          type="button"
          onClick={() => toast.message("Voice search coming soon")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gold-rich hover:bg-champagne"
          aria-label="Voice search"
        >
          <Mic className="h-4 w-4" />
        </button>
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-md text-gold-rich hover:bg-champagne"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
