"use client";

import { useEffect, useState } from "react";
import { Bath, BedDouble, ImagePlus, Loader2, Maximize, Star, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationMapPicker } from "@/components/portal/location-map-picker";
import { useAuthStore } from "@/store";
import { portalApi } from "@/lib/portal-api";
import { ensureGoogleMapsKeyStored } from "@/lib/google-maps";
import { ApiError, uploadFile } from "@/lib/api";

const PURPOSES = ["Buy", "Rent", "Commercial", "Plot"] as const;
const CATEGORIES = [
  "Apartment",
  "Villa",
  "Penthouse",
  "Plot",
  "Office",
  "Shop",
  "Studio",
  "Farmhouse",
  "PG",
];
const FURNISHED = ["Furnished", "Semi-furnished", "Unfurnished"] as const;
const POSSESSION = [
  "Ready to Move",
  "Within 3 months",
  "Within 6 months",
  "Within 1 year",
  "After 1 year",
];
const CONSTRUCTION = ["Ready to Move", "Under Construction", "New Launch"] as const;
const FACING = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const AMENITIES = [
  "Parking",
  "Security",
  "Lift",
  "Power Backup",
  "Gym",
  "Pool",
  "Garden",
  "Clubhouse",
  "Playground",
  "CCTV",
  "Water Supply",
  "Gas Pipeline",
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";

function formatInrLabel(amount: number, purpose: string) {
  if (!amount || Number.isNaN(amount)) return "";
  if (purpose === "Rent") {
    return `₹${amount.toLocaleString("en-IN")}/mo`;
  }
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)} Lakh`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function PostPropertyPage() {
  const token = useAuthStore((s) => s.token);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureGoogleMapsKeyStored();
  }, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "Agra",
    locality: "",
    address: "",
    state: "Uttar Pradesh",
    pincode: "",
    price: "",
    priceLabel: "",
    category: "Apartment",
    purpose: "Buy" as (typeof PURPOSES)[number],
    areaSqft: "1200",
    carpetArea: "1000",
    bedrooms: "3",
    bathrooms: "2",
    balconies: "1",
    facing: "East",
    floors: "1",
    parking: "1",
    furnished: "Semi-furnished" as (typeof FURNISHED)[number],
    possession: "Ready to Move",
    constructionStatus: "Ready to Move" as (typeof CONSTRUCTION)[number],
    tags: "",
    notes: "",
    lat: null as number | null,
    lng: null as number | null,
  });
  const [amenities, setAmenities] = useState<string[]>(["Parking", "Security"]);
  const [images, setImages] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>(DEFAULT_IMAGE);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const set = (key: keyof typeof form, value: string | number | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onImagesSelected = async (files: FileList | null) => {
    if (!files?.length || !token) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast.error("Choose image files (jpg, png, webp)");
      return;
    }
    if (images.length + list.length > 12) {
      toast.error("You can upload up to 12 photos");
      return;
    }
    setUploadingImages(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const res = await uploadFile(file, "property", token);
        uploaded.push(res.url);
      }
      const wasEmpty = images.length === 0;
      setImages((prev) => [...prev, ...uploaded]);
      if (wasEmpty && uploaded[0]) setCoverUrl(uploaded[0]);
      toast.success(uploaded.length === 1 ? "Photo uploaded" : `${uploaded.length} photos uploaded`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      if (coverUrl === url) setCoverUrl(next[0] || DEFAULT_IMAGE);
      return next;
    });
  };

  const makeCover = (url: string) => {
    setCoverUrl(url);
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  };

  const onVideoSelected = async (file: File | null) => {
    if (!file || !token) return;
    if (file.type !== "video/mp4") {
      toast.error("Only MP4 video is supported");
      return;
    }
    setUploadingVideo(true);
    try {
      const res = await uploadFile(file, "video", token);
      setVideoUrl(res.url);
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  };

  const priceNum = Number(form.price) || 0;
  const areaNum = Number(form.areaSqft) || 0;
  const pricePerSqft = priceNum > 0 && areaNum > 0 ? Math.round(priceNum / areaNum) : 0;
  const autoPriceLabel = formatInrLabel(priceNum, form.purpose);

  const toggleAmenity = (name: string) => {
    setAmenities((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.locality.trim() || !form.city.trim()) {
      toast.error("City and locality are required");
      return;
    }
    if (!priceNum) {
      toast.error("Enter a numeric price");
      return;
    }
    if (form.lat == null || form.lng == null) {
      toast.error("Pin the property location on the map");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await portalApi.createListing(
        {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          city: form.city.trim(),
          locality: form.locality.trim(),
          address: form.address.trim() || undefined,
          state: form.state.trim() || undefined,
          pincode: form.pincode.trim() || undefined,
          price: priceNum,
          pricePerSqft: pricePerSqft || undefined,
          category: form.category,
          purpose: form.purpose,
          areaSqft: areaNum || 0,
          carpetArea: Number(form.carpetArea) || undefined,
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || undefined,
          balconies: Number(form.balconies) || undefined,
          facing: form.facing || undefined,
          floors: Number(form.floors) || undefined,
          parking: Number(form.parking) || undefined,
          furnished: form.furnished,
          possession: form.possession,
          constructionStatus: form.constructionStatus,
          amenities,
          tags,
          lat: form.lat,
          lng: form.lng,
          image: coverUrl || images[0] || DEFAULT_IMAGE,
          images:
            images.length > 0
              ? [coverUrl, ...images.filter((u) => u !== coverUrl)].filter(Boolean)
              : [coverUrl || DEFAULT_IMAGE],
          videoUrl: videoUrl || undefined,
          notes: form.notes.trim() || undefined,
        },
        token,
      );
      toast.success("Property submitted — Pending Verification");
      // Hard navigate so My Properties always remounts and refetches
      window.location.assign("/portal/listings");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not submit listing");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Post property</h1>
        <p className="mt-1 text-sm text-muted">
          Full listing details (as shown on website cards) plus live map location.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Basic details</CardTitle>
            <CardDescription>Title, type, and description for the property card.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. 3BHK Builder Floor — Kamla Nagar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Highlights buyers will see on the card / detail page"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Purpose *</Label>
                <select
                  value={form.purpose}
                  onChange={(e) => set("purpose", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Property type *</Label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Price &amp; size</CardTitle>
            <CardDescription>Matches website card price, area, and BHK row.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price amount (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder={form.purpose === "Rent" ? "25000" : "12500000"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceLabel">Price label (optional)</Label>
                <Input
                  id="priceLabel"
                  value={form.priceLabel}
                  onChange={(e) => set("priceLabel", e.target.value)}
                  placeholder={autoPriceLabel || "₹1.25 Cr"}
                />
                {autoPriceLabel ? (
                  <p className="text-[11px] text-muted">Auto: {autoPriceLabel}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Super built-up (sqft) *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.areaSqft}
                  onChange={(e) => set("areaSqft", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Carpet (sqft)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.carpetArea}
                  onChange={(e) => set("carpetArea", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>₹ / sqft</Label>
                <Input value={pricePerSqft ? pricePerSqft.toLocaleString("en-IN") : "—"} disabled />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="inline-flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" /> Bedrooms / BHK
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="inline-flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" /> Bathrooms
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Balconies</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.balconies}
                  onChange={(e) => set("balconies", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 rounded-xl border border-border/70 bg-cream/50 px-3 py-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {form.bedrooms || 0} BHK
              </span>
              <span className="inline-flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {form.bathrooms || 0} Bath
              </span>
              <span className="inline-flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {areaNum.toLocaleString("en-IN")} sqft
              </span>
              <span className="font-semibold text-gold-rich">
                {form.priceLabel || autoPriceLabel || "Price"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Location &amp; map *</CardTitle>
            <CardDescription>Select live pin — city / locality auto-fill when possible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationMapPicker
              value={form.lat != null && form.lng != null ? { lat: form.lat, lng: form.lng } : null}
              onChange={(loc) => {
                setForm((f) => ({
                  ...f,
                  lat: loc.lat,
                  lng: loc.lng,
                  address: loc.address || f.address,
                  locality: loc.locality || f.locality,
                  city: loc.city || f.city,
                  state: loc.state || f.state,
                  pincode: loc.pincode || f.pincode,
                }));
              }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Locality *</Label>
                <Input value={form.locality} onChange={(e) => set("locality", e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Full address</Label>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Highlights &amp; specs</CardTitle>
            <CardDescription>Facing, floors, furnished — same chips as website cards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Facing</Label>
                <select
                  value={form.facing}
                  onChange={(e) => set("facing", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {FACING.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Furnished</Label>
                <select
                  value={form.furnished}
                  onChange={(e) => set("furnished", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {FURNISHED.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Floors</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.floors}
                  onChange={(e) => set("floors", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Parking slots</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.parking}
                  onChange={(e) => set("parking", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Possession</Label>
                <select
                  value={form.possession}
                  onChange={(e) => set("possession", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {POSSESSION.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Construction status</Label>
                <select
                  value={form.constructionStatus}
                  onChange={(e) => set("constructionStatus", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {CONSTRUCTION.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Sea View, Corner, Park Facing"
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label>Property photos</Label>
                <p className="mt-0.5 text-xs text-muted">
                  Upload up to 12 images. Click the star to set the cover photo.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-border bg-cream/40 px-4 py-6 text-center transition hover:border-gold/50 hover:bg-cream/70">
                <ImagePlus className="h-6 w-6 text-gold" />
                <span className="text-sm font-medium text-charcoal">
                  {uploadingImages ? "Uploading…" : "Add photos"}
                </span>
                <span className="text-xs text-muted">JPG, PNG, or WebP</span>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={uploadingImages || !token}
                  className="hidden"
                  onChange={(e) => {
                    void onImagesSelected(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {uploadingImages ? (
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading photos…
                </p>
              ) : null}

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((url) => {
                    const isCover = url === coverUrl;
                    return (
                      <div
                        key={url}
                        className={`group relative overflow-hidden rounded-[8px] border bg-white ${
                          isCover ? "border-gold ring-2 ring-gold/30" : "border-border"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                        {isCover ? (
                          <span className="absolute top-2 left-2 rounded-[8px] bg-gold px-2 py-0.5 text-[10px] font-bold text-white">
                            Cover
                          </span>
                        ) : null}
                        <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => makeCover(url)}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-[8px] bg-white/95 px-2 py-1.5 text-[11px] font-semibold text-charcoal"
                          >
                            <Star className={`h-3 w-3 ${isCover ? "fill-gold text-gold" : ""}`} />
                            {isCover ? "Cover" : "Set cover"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="inline-flex items-center justify-center rounded-[8px] bg-white/95 px-2 py-1.5 text-danger"
                            aria-label="Remove photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted">
                  No photos yet — a default image will be used until you upload.
                </p>
              )}
            </div>

            <div className="space-y-3 border-t border-border/60 pt-4">
              <div>
                <Label>Property video (optional)</Label>
                <p className="mt-0.5 text-xs text-muted">MP4 only, up to ~40MB.</p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-dashed border-border bg-cream/40 px-4 py-4 transition hover:border-gold/50">
                <Video className="h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-charcoal">
                    {uploadingVideo ? "Uploading video…" : videoUrl ? "Replace video" : "Upload MP4"}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {videoUrl || "Walkthrough or exterior clip"}
                  </p>
                </div>
                <Input
                  type="file"
                  accept="video/mp4,.mp4"
                  disabled={uploadingVideo || !token}
                  className="hidden"
                  onChange={(e) => {
                    void onVideoSelected(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              </label>
              {uploadingVideo ? (
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading video…
                </p>
              ) : null}
              {videoUrl ? (
                <div className="overflow-hidden rounded-[8px] border border-border bg-black">
                  <video src={videoUrl} controls className="aspect-video w-full" />
                  <div className="flex justify-end bg-white px-2 py-1.5">
                    <button
                      type="button"
                      className="text-xs font-medium text-danger"
                      onClick={() => setVideoUrl("")}
                    >
                      Remove video
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Notes for staff</Label>
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Docs ready, preferred contact time…"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Submit for verification
        </Button>
      </form>
    </div>
  );
}
