"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Eye,
  LayoutGrid,
  MapPin,
  Maximize,
  Plus,
  Search,
  Star,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { type ListingAvailability, type PortalListing } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";

const AVAIL_COLOR: Record<ListingAvailability, string> = {
  "Pending Verification": "bg-amber-100 text-amber-900 border-amber-200",
  Live: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Reserved: "bg-sky-100 text-sky-900 border-sky-200",
  Sold: "bg-slate-200 text-slate-800 border-slate-300",
  Rejected: "bg-rose-100 text-rose-900 border-rose-200",
};

const STATUSES: Array<ListingAvailability | "All"> = [
  "All",
  "Pending Verification",
  "Live",
  "Reserved",
  "Sold",
  "Rejected",
];

type ViewMode = "cards" | "table";

function formatPosted(raw: string) {
  if (!raw) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.slice(0, 10);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusPill({ status }: { status: ListingAvailability }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-[8px] border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap",
        AVAIL_COLOR[status],
      )}
    >
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 py-2 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-charcoal">{value}</span>
    </div>
  );
}

export default function PortalListingsPage() {
  const token = useAuthStore((s) => s.token);
  const [listings, setListings] = useState<PortalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("cards");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [purpose, setPurpose] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<PortalListing | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    portalApi
      .listings(token)
      .then((res) => {
        if (!cancelled) setListings(res.data);
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const purposes = useMemo(
    () => ["All", ...Array.from(new Set(listings.map((l) => l.purpose))).sort()],
    [listings],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(listings.map((l) => l.category))).sort()],
    [listings],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (status !== "All" && l.availability !== status) return false;
      if (purpose !== "All" && l.purpose !== purpose) return false;
      if (category !== "All" && l.category !== category) return false;
      if (!needle) return true;
      const hay = [l.title, l.city, l.locality, l.id, l.priceLabel, l.description ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [listings, q, status, purpose, category]);

  const clearFilters = () => {
    setQ("");
    setStatus("All");
    setPurpose("All");
    setCategory("All");
  };

  const hasFilters = q || status !== "All" || purpose !== "All" || category !== "All";

  const openDetails = (listing: PortalListing) => {
    setSelected(listing);
    setActiveImage(0);
  };

  const gallery =
    selected?.images && selected.images.length > 0
      ? selected.images
      : selected?.image
        ? [selected.image]
        : [];

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">My properties</h1>
          <p className="mt-1 text-sm text-muted">
            Switch between compact cards and table. Filter by status, purpose, or type.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[8px] border border-border bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition",
                view === "cards" ? "bg-gold text-white" : "text-muted hover:text-charcoal",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition",
                view === "table" ? "bg-gold text-white" : "text-muted hover:text-charcoal",
              )}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
          <Button asChild>
            <Link href="/portal/listings/new">
              <Plus className="h-4 w-4" />
              Post property
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title, city, locality, ID…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
              className="flex h-11 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Purpose</Label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="flex h-11 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
            >
              {purposes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-11 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted">
          <span>
            Showing <span className="font-semibold text-charcoal">{filtered.length}</span> of{" "}
            {listings.length}
          </span>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-gold-rich hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted">Loading listings…</p>
      ) : null}

      {!loading && listings.length === 0 ? (
        <Card className="border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted">No properties yet.</p>
          <Button asChild className="mt-4">
            <Link href="/portal/listings/new">Post your first property</Link>
          </Button>
        </Card>
      ) : null}

      {!loading && listings.length > 0 && filtered.length === 0 ? (
        <Card className="border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted">No properties match your filters.</p>
          <Button type="button" variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </Card>
      ) : null}

      {!loading && filtered.length > 0 && view === "cards" ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) => (
            <Card key={l.id} className="overflow-hidden border-border/80 shadow-sm">
              <button type="button" className="relative aspect-[16/9] w-full" onClick={() => openDetails(l)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
                {l.isFeatured ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-[8px] bg-[#B8860B] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                ) : null}
                <span className="absolute top-2 right-2">
                  <StatusPill status={l.availability} />
                </span>
              </button>
              <CardContent className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold tracking-tight text-gold-rich">
                    {l.priceLabel}
                  </p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {l.purpose}
                  </Badge>
                </div>
                <div>
                  <p className="truncate text-sm font-semibold text-charcoal">{l.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3 w-3 shrink-0 text-gold" />
                    <span className="truncate">
                      {l.locality}, {l.city}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  {l.bedrooms > 0 ? (
                    <span className="inline-flex items-center gap-0.5">
                      <BedDouble className="h-3 w-3" />
                      {l.bedrooms} BHK
                    </span>
                  ) : null}
                  {(l.bathrooms ?? 0) > 0 ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Bath className="h-3 w-3" />
                      {l.bathrooms}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-0.5">
                    <Maximize className="h-3 w-3" />
                    {l.areaSqft.toLocaleString("en-IN")} sqft
                  </span>
                  <span className="text-border">·</span>
                  <span>{l.category}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openDetails(l)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!loading && filtered.length > 0 && view === "table" ? (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-border bg-cream/60 text-[11px] tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Specs</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Posted</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={l.image}
                          alt=""
                          className="h-12 w-16 shrink-0 rounded-[8px] object-cover border border-border"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-charcoal">{l.title}</p>
                          <p className="truncate text-xs text-muted">
                            {l.locality}, {l.city} · {l.category} · {l.purpose}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-gold-rich">{l.priceLabel}</p>
                      {l.pricePerSqft ? (
                        <p className="text-[11px] text-muted">
                          ₹{l.pricePerSqft.toLocaleString("en-IN")}/sqft
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                      {l.bedrooms > 0 ? `${l.bedrooms} BHK` : "—"}
                      {(l.bathrooms ?? 0) > 0 ? ` · ${l.bathrooms} Bath` : ""}
                      <br />
                      {l.areaSqft.toLocaleString("en-IN")} sqft
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={l.availability} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                      {formatPosted(l.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => openDetails(l)}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[8px] p-0">
          {selected ? (
            <>
              <div className="border-b border-border/70 p-5 pr-12">
                <DialogHeader>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusPill status={selected.availability} />
                    {selected.isFeatured ? (
                      <Badge variant="gold" className="text-[10px]">
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                  <DialogTitle className="text-left text-xl">{selected.title}</DialogTitle>
                  <DialogDescription className="text-left">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {selected.locality}, {selected.city}
                      {selected.coordinates
                        ? ` · ${selected.coordinates.lat.toFixed(3)}, ${selected.coordinates.lng.toFixed(3)}`
                        : ""}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <p className="mt-3 text-2xl font-semibold text-gold-rich">{selected.priceLabel}</p>
                {selected.pricePerSqft ? (
                  <p className="text-xs text-muted">
                    ₹{selected.pricePerSqft.toLocaleString("en-IN")} /sqft
                  </p>
                ) : null}
              </div>

              <div className="space-y-5 p-5">
                {gallery.length > 0 ? (
                  <div className="space-y-2">
                    <div className="overflow-hidden rounded-[8px] border border-border bg-cream">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gallery[activeImage] ?? gallery[0]}
                        alt={selected.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </div>
                    {gallery.length > 1 ? (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {gallery.map((url, i) => (
                          <button
                            key={`${url}-${i}`}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            className={cn(
                              "h-14 w-20 shrink-0 overflow-hidden rounded-[8px] border",
                              i === activeImage ? "border-gold ring-2 ring-gold/30" : "border-border",
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {selected.videoUrl ? (
                  <div className="overflow-hidden rounded-[8px] border border-border bg-black">
                    <video src={selected.videoUrl} controls className="aspect-video w-full" />
                  </div>
                ) : null}

                {selected.description ? (
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed text-charcoal">{selected.description}</p>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[8px] border border-border/80 bg-cream/40 px-3">
                    <DetailRow label="Purpose" value={selected.purpose} />
                    <DetailRow label="Type" value={selected.category} />
                    <DetailRow
                      label="BHK"
                      value={selected.bedrooms > 0 ? `${selected.bedrooms} BHK` : null}
                    />
                    <DetailRow label="Bathrooms" value={selected.bathrooms} />
                    <DetailRow label="Balconies" value={selected.balconies} />
                    <DetailRow
                      label="Area"
                      value={`${selected.areaSqft.toLocaleString("en-IN")} sqft`}
                    />
                    <DetailRow
                      label="Carpet"
                      value={
                        selected.carpetArea
                          ? `${selected.carpetArea.toLocaleString("en-IN")} sqft`
                          : null
                      }
                    />
                  </div>
                  <div className="rounded-[8px] border border-border/80 bg-cream/40 px-3">
                    <DetailRow label="Facing" value={selected.facing} />
                    <DetailRow label="Furnished" value={selected.furnished} />
                    <DetailRow label="Possession" value={selected.possession} />
                    <DetailRow label="Construction" value={selected.constructionStatus} />
                    <DetailRow label="Floors" value={selected.floors} />
                    <DetailRow label="Parking" value={selected.parking} />
                    <DetailRow label="Posted" value={formatPosted(selected.createdAt)} />
                    <DetailRow label="ID" value={selected.id} />
                  </div>
                </div>

                {(selected.address || selected.state || selected.pincode) && (
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">
                      Address
                    </p>
                    <p className="text-sm text-charcoal">
                      {[selected.address, selected.locality, selected.city, selected.state, selected.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}

                {selected.amenities && selected.amenities.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-[10px]">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.tags && selected.tags.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.staffNote ? (
                  <div className="rounded-[8px] bg-cream px-3 py-2.5 text-sm text-muted">
                    <span className="font-semibold text-charcoal">Staff note: </span>
                    {selected.staffNote}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
