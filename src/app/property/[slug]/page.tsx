import {
  Armchair,
  Baby,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  Dumbbell,
  ExternalLink,
  FileText,
  Home,
  Mail,
  Maximize,
  MapPin,
  Phone,
  Shield,
  ShoppingCart,
  Sofa,
  Sparkles,
  Store,
  ThumbsDown,
  ThumbsUp,
  TreePine,
  Users,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProperties,
  getBuilderById,
  getPropertyBySlug,
  getSimilarProperties,
} from "@/services/property-service";
import { GROWRA_CONTACT, SITE_NAME, resolveAmenities } from "@/constants";
import { calculateEMI, cn, formatArea, formatPrice } from "@/lib/utils";
import { PropertyMediaPanel } from "@/components/property/property-media-panel";
import { PropertyDetailChrome } from "@/components/property/property-detail-chrome";
import { NearbyPlaces } from "@/components/property/nearby-places";
import { DealerEnquiryForm } from "@/components/property/dealer-enquiry-form";
import { ViewTracker } from "@/components/property/view-tracker";
import { PropertyCard } from "@/components/cards/property-card";
import { Button } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/map/map-placeholder";
import { PropertyContactCtas } from "@/components/property/property-contact-ctas";
import { SiteLogo } from "@/components/common/site-logo";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} | ${SITE_NAME}`,
      description: property.description.slice(0, 160),
      images: property.images[0] ? [{ url: property.images[0] }] : undefined,
    },
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  Waves,
  Dumbbell,
  Car,
  TreePine,
  Building2,
  Baby,
  Home,
  ShoppingCart,
  Store,
  Sparkles,
  Shield,
};

const FURNISHING_ITEMS = [
  { id: "wardrobe", label: "Wardrobe", icon: Armchair },
  { id: "fan", label: "Fan", icon: Wind },
  { id: "light", label: "Light", icon: Sparkles },
  { id: "modular-kitchen", label: "Modular Kitchen", icon: Home },
  { id: "ac", label: "AC", icon: Wind },
  { id: "bed", label: "Bed", icon: BedDouble },
  { id: "sofa", label: "Sofa", icon: Sofa },
  { id: "tv", label: "TV", icon: Maximize },
  { id: "fridge", label: "Fridge", icon: Store },
  { id: "geyser", label: "Geyser", icon: Bath },
  { id: "washing", label: "Washing Machine", icon: Waves },
  { id: "microwave", label: "Microwave", icon: Sparkles },
] as const;

function FactItem({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  link?: string;
}) {
  return (
    <div className="flex gap-3 border-b border-border/70 py-3 last:border-b-0 sm:border-0 sm:py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-champagne/60 text-gold-rich">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <div className="mt-0.5 text-sm font-semibold text-charcoal">{value}</div>
        {link ? (
          <button type="button" className="mt-0.5 text-xs font-medium text-gold-rich">
            {link}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const builder = getBuilderById(property.builderId);
  const similar = await getSimilarProperties(property, 4);
  const emi = calculateEMI(property.price * 0.8, 8.5, 20);
  const pps =
    property.pricePerSqft ??
    (property.area > 0 ? Math.round(property.price / property.area) : undefined);

  const amenityItems = resolveAmenities(property.amenities);
  const highlights = [
    property.facing ? `${property.facing} Facing` : null,
    property.furnished === "semi-furnished"
      ? "Semi-Furnished"
      : property.furnished === "furnished"
        ? "Fully Furnished"
        : null,
    property.parking ? `${property.parking} Open Parking` : null,
    property.amenities.includes("modular-kitchen") || property.furnished !== "unfurnished"
      ? "Modular Kitchen"
      : null,
    ...property.tags.slice(0, 2),
  ].filter(Boolean) as string[];

  const configLabel = [
    property.bhk > 0 ? `${property.bhk}BHK` : null,
    property.bathrooms > 0 ? `${property.bathrooms}Bath` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const typeLabel =
    property.propertyType === "apartment"
      ? "Flat/Apartment"
      : property.propertyType.replace(/-/g, " ");

  const furnishedPresent =
    property.furnished === "furnished"
      ? FURNISHING_ITEMS.map((f) => f.id)
      : property.furnished === "semi-furnished"
        ? ["wardrobe", "fan", "light", "modular-kitchen", "geyser"]
        : [];

  const inquiryTarget = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    locality: property.locality,
    city: property.city,
  };

  const localityPros = [
    "Well-connected residential micro-market",
    "Growing social & retail infrastructure",
    "Strong demand for quality homes",
  ];
  const localityCons = [
    "Peak-hour traffic on main corridors",
    "Ongoing construction in pockets",
    "Limited open green cover in denser stretches",
  ];

  return (
    <div className="bg-white pb-16">
      <ViewTracker propertyId={property.id} />

      <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-5 sm:px-6 sm:pt-8 lg:px-8">
        <PropertyDetailChrome
          configLabel={configLabel || typeLabel}
          typeLabel={typeLabel}
          property={{
            ...inquiryTarget,
            price: property.price,
            listingType: property.listingType,
            bhk: property.bhk,
            bathrooms: property.bathrooms,
            reraId: property.reraId,
            constructionStatus: property.constructionStatus,
            featured: property.featured,
            propertyType: property.propertyType,
          }}
        >
          {/* Overview */}
          <section id="section-overview" className="scroll-mt-52 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-[#f7f7f7] shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="p-3 sm:p-4">
                  <PropertyMediaPanel
                    images={property.images}
                    title={property.title}
                    videoUrl={property.videoUrl}
                  />
                </div>
                <div className="grid content-start gap-x-2 bg-white px-4 py-2 sm:grid-cols-2 sm:px-5 sm:py-3">
                  <FactItem
                    icon={BedDouble}
                    label="Configuration"
                    value={`${property.bhk} Bedroom${property.bhk !== 1 ? "s" : ""}, ${property.bathrooms} Bathroom${property.bathrooms !== 1 ? "s" : ""}${property.balconies ? `, ${property.balconies} Balcon${property.balconies > 1 ? "ies" : "y"}` : ""}`}
                  />
                  <FactItem
                    icon={FileText}
                    label={property.listingType === "rent" ? "Rent" : "Price"}
                    value={
                      <>
                        {formatPrice(property.price)}
                        {property.listingType === "rent" ? " /mo" : null}
                        {pps ? (
                          <span className="mt-0.5 block text-xs font-normal text-muted">
                            @ ₹{pps.toLocaleString("en-IN")} /sqft
                          </span>
                        ) : null}
                      </>
                    }
                    link="View Price Details"
                  />
                  <FactItem
                    icon={Maximize}
                    label="Area"
                    value={
                      <>
                        Super Built-up area {formatArea(property.area)}
                        {property.carpetArea ? (
                          <span className="mt-0.5 block text-xs font-normal text-muted">
                            Carpet area: {formatArea(property.carpetArea)}
                          </span>
                        ) : null}
                      </>
                    }
                  />
                  <FactItem
                    icon={MapPin}
                    label="Address"
                    value={`${property.title}, ${property.locality}, ${property.city}`}
                  />
                  <FactItem
                    icon={Sofa}
                    label="Furnishing"
                    value={property.furnished.replace(/-/g, " ")}
                    link="View Furnishings"
                  />
                  <FactItem
                    icon={Users}
                    label="Available For"
                    value={property.listingType === "rent" ? "Family / Bachelors" : "All"}
                  />
                  <FactItem
                    icon={CalendarDays}
                    label="Available From"
                    value={
                      property.constructionStatus === "ready" ? "Immediate" : property.possession
                    }
                  />
                  {property.floors ? (
                    <FactItem
                      icon={Building2}
                      label="Floor Number"
                      value={`${Math.min(9, Math.max(1, property.floors - 2))}th of ${property.floors} Floors`}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <NearbyPlaces places={property.nearby} />

            <div>
              <h2 className="text-lg font-bold text-charcoal">
                Why you should consider this property?
              </h2>
              <div className="mt-4 rounded-xl bg-champagne/40 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-2 text-sm font-semibold text-charcoal sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold-rich">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    Key Highlights
                  </div>
                  <div className="flex-1 rounded-lg border border-border bg-white p-4">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {highlights.map((h) => (
                        <p key={h} className="flex items-center gap-2 text-sm text-charcoal">
                          <Check className="h-4 w-4 shrink-0 text-success" />
                          {h}
                        </p>
                      ))}
                    </div>
                    {property.tags.length > 2 ? (
                      <button type="button" className="mt-3 text-sm font-medium text-gold-rich">
                        View {Math.max(property.tags.length - 2, 2)} More →
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-4 border-t border-border pt-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Parking",
                  value: property.parking ? `${property.parking} Open` : "Available",
                },
                { label: "Facing", value: property.facing ?? "—" },
                { label: "Width of facing road", value: "45.0 Feet" },
                {
                  label: property.listingType === "rent" ? "Security Deposit" : "Transaction Type",
                  value:
                    property.listingType === "rent"
                      ? formatPrice(property.price)
                      : "Resale",
                },
                {
                  label: "Modular Kitchen",
                  value: property.furnished !== "unfurnished" ? "Yes" : "No",
                },
                {
                  label: "Flooring",
                  value: property.specifications.Flooring ?? "Vitrified",
                },
                { label: "Property Age", value: property.age ?? "1 to 5 Year Old" },
                {
                  label: "Power Backup",
                  value: property.amenities.includes("power-backup") ? "Full" : "Partial",
                },
                ...(property.reraId
                  ? [{ label: "RERA", value: property.reraId }]
                  : []),
              ].map((row) => (
                <p key={row.label} className="text-muted">
                  {row.label}:{" "}
                  <span className="font-semibold capitalize text-charcoal">{row.value}</span>
                </p>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-charcoal">About Property</h2>
              <p className="mt-2 text-sm text-charcoal">
                Address:{" "}
                <span className="font-semibold">
                  {property.address || `${property.locality}, ${property.city}`}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {property.description}
              </p>
              {property.listingType !== "rent" ? (
                <p className="mt-2 text-sm font-medium text-gold-rich">
                  Estimated EMI ₹{emi.toLocaleString("en-IN")}
                </p>
              ) : null}
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold capitalize text-charcoal">
                {property.furnished.replace(/-/g, "")}
                <span className="ml-2 text-sm font-normal text-muted">Furnishing Details</span>
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {FURNISHING_ITEMS.map((item) => {
                  const present = furnishedPresent.includes(item.id);
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col items-center gap-1.5 text-center",
                        !present && "opacity-45",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-7 w-7",
                          present ? "text-gold-rich" : "text-muted",
                        )}
                        strokeWidth={1.5}
                      />
                      <p className="text-[11px] leading-tight text-muted">
                        {present ? item.label : `No ${item.label}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {property.coordinates ? (
              <div className="border-t border-border pt-6">
                <h2 className="mb-3 text-lg font-bold text-charcoal">Live location</h2>
                <MapPlaceholder
                  lat={property.coordinates.lat}
                  lng={property.coordinates.lng}
                  label={`${property.locality}, ${property.city}`}
                  size="md"
                  className="shadow-sm"
                />
              </div>
            ) : null}

            <div className="border-t border-border pt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-charcoal">Amenities</h2>
                  <p className="text-sm text-muted">in {property.title}</p>
                </div>
                <span className="text-sm font-medium text-gold-rich">
                  View All ({amenityItems.length})
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                {amenityItems.slice(0, 9).map((a, i) => {
                  const Icon = ICON_MAP[a.icon] ?? Sparkles;
                  const tones = [
                    "bg-emerald-50 text-emerald-700",
                    "bg-sky-50 text-sky-700",
                    "bg-amber-50 text-amber-800",
                    "bg-violet-50 text-violet-700",
                    "bg-rose-50 text-rose-700",
                  ];
                  const tone = tones[i % tones.length];
                  return (
                    <div
                      key={a.id}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center",
                        tone.split(" ")[0],
                      )}
                    >
                      <Icon className={cn("h-7 w-7", tone.split(" ")[1])} strokeWidth={1.5} />
                      <p className="text-[11px] leading-tight text-muted">{a.name}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
                <span className="text-xs text-muted">Property sold out? Incorrect data?</span>
                <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 rounded-md">
                  Report
                </Button>
              </div>
            </div>
          </section>

          {/* Society */}
          <section id="section-society" className="scroll-mt-52 space-y-6 border-t border-border pt-10">
            <div>
              <h2 className="text-lg font-bold text-charcoal">Society</h2>
              <Link
                href={builder ? `/builders/${builder.slug}` : "#"}
                className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-gold-rich hover:underline"
              >
                {property.title}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Maximize,
                    label: "Total occupied area",
                    value: "10 acres (40.47K sq.m.)",
                    sub: "65.0% Open area",
                    link: "View Master Plan",
                  },
                  {
                    icon: Building2,
                    label: "Project Details",
                    value: builder
                      ? `${Math.min(builder.totalProjects, 10)} Towers, ${builder.totalProjects * 80} Units`
                      : "8 Towers",
                    sub: property.floors ? `${property.floors} Floors` : "Multiple floors",
                    link: "View Amenities",
                  },
                  {
                    icon: FileText,
                    label: "Configuration",
                    value: `${Math.max(1, property.bhk - 1)}, ${property.bhk}${property.bhk < 4 ? `, ${property.bhk + 1}` : ""} BHK`,
                    link: "View Floor Plans",
                  },
                  {
                    icon: Home,
                    label: "Property Types",
                    value: typeLabel,
                    link: "View Specifications",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <Icon className="mb-2 h-5 w-5 text-muted" strokeWidth={1.5} />
                      <p className="text-xs font-medium text-muted">{item.label}</p>
                      <p className="mt-1 text-sm font-bold text-charcoal">{item.value}</p>
                      {"sub" in item && item.sub ? (
                        <p className="text-xs text-muted">{item.sub}</p>
                      ) : null}
                      <button type="button" className="mt-1 text-xs font-medium text-gold-rich">
                        {item.link}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-auto lg:min-h-[220px]">
                <Image
                  src={property.images[1] ?? property.images[0]}
                  alt={`${property.title} society`}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Growra Realty contact — never owner/agent numbers */}
          <section id="section-dealer" className="scroll-mt-52 border-t border-border pt-10">
            <h2 className="mb-5 text-lg font-bold text-charcoal">Contact Growra Realty</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-cream p-1.5">
                    <SiteLogo size="sm" className="pointer-events-none" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gold-rich">{GROWRA_CONTACT.name}</p>
                    <p className="text-sm text-muted">{GROWRA_CONTACT.tagline}</p>
                    {property.reraId ? (
                      <span className="mt-2 inline-flex rounded bg-success/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-success uppercase">
                        Listing RERA · {property.reraId}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-1">
                  <a
                    href={`tel:${GROWRA_CONTACT.phoneTel}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-cream/40 px-4 py-3 transition hover:border-gold/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gold-rich shadow-sm">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted">Phone</p>
                      <p className="text-sm font-semibold text-charcoal">{GROWRA_CONTACT.phoneDisplay}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${GROWRA_CONTACT.email}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-cream/40 px-4 py-3 transition hover:border-gold/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gold-rich shadow-sm">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted">Email</p>
                      <p className="text-sm font-semibold text-charcoal">{GROWRA_CONTACT.email}</p>
                    </div>
                  </a>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted">Property locality</p>
                    <p className="mt-0.5 text-charcoal">
                      {property.locality}, {property.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted">Hours</p>
                    <p className="mt-0.5 text-charcoal">{GROWRA_CONTACT.hours}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted">About</p>
                    <p className="mt-0.5 leading-relaxed text-muted">
                      All buyer inquiries are handled by Growra Realty. Owner and agent phone
                      numbers are never shown on the website — our team routes verified leads
                      securely.
                    </p>
                  </div>
                </div>

                <PropertyContactCtas
                  property={inquiryTarget}
                  contactLabel="Contact Growra Realty"
                  showViewNumber={false}
                  fullWidth
                />
              </div>

              <DealerEnquiryForm
                propertyId={property.id}
                propertySlug={property.slug}
                propertyTitle={property.title}
              />
            </div>
          </section>

          {/* Reviews */}
          <section id="section-reviews" className="scroll-mt-52 border-t border-border pt-10">
            <h2 className="text-lg font-bold text-charcoal">Society Reviews</h2>
            <p className="mt-1 text-sm text-muted">{property.title}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Rahul M.",
                  text: `Great society amenities and well-maintained common areas near ${property.locality}.`,
                  rating: 4.5,
                },
                {
                  name: "Priya S.",
                  text: "Good connectivity and peaceful surroundings. Security staff is responsive.",
                  rating: 4.2,
                },
              ].map((r) => (
                <div key={r.name} className="rounded-xl border border-border bg-cream/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-charcoal">{r.name}</p>
                    <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold-rich">
                      {r.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="cursor-pointer rounded-md border-gold/40 text-gold-rich">
                Review your Society / Locality
              </Button>
            </div>
          </section>

          {/* Explore locality */}
          <section id="section-explore" className="scroll-mt-52 border-t border-border pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-charcoal">
                  Explore {property.locality}, {property.city}
                </h2>
                <p className="text-sm text-muted">
                  {property.state} · {property.pincode}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                    ↑ 8.4% YoY
                  </span>
                  <span className="rounded bg-border/50 px-2 py-0.5 text-xs font-medium text-muted">
                    Premium Locality
                  </span>
                </div>
              </div>
              <Button variant="outline" className="cursor-pointer rounded-md border-gold/40 text-gold-rich">
                {property.locality} Overview
              </Button>
            </div>

            <div className="mt-5 grid gap-4 rounded-xl border border-border bg-champagne/30 p-4 sm:grid-cols-2 sm:p-5">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-charcoal">
                  <ThumbsUp className="h-4 w-4 text-success" />
                  What&apos;s great here!
                </p>
                <ul className="space-y-2.5">
                  {localityPros.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-charcoal">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-charcoal">
                  <ThumbsDown className="h-4 w-4 text-muted" />
                  What needs attention!
                </p>
                <ul className="space-y-2.5">
                  {localityCons.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-charcoal">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section id="section-recommendations" className="scroll-mt-52 border-t border-border pt-10">
            <h2 className="mb-5 text-lg font-bold text-charcoal">
              Recommendations in {property.locality}
            </h2>
            {similar.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No similar properties nearby.</p>
            )}
          </section>
        </PropertyDetailChrome>
      </div>
    </div>
  );
}
