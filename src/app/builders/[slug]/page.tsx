import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Building2, MapPin, Star } from "lucide-react";
import {
  getAllBuilders,
  getAllProperties,
  getBuilderBySlug,
} from "@/services/property-service";
import { SITE_NAME } from "@/constants";
import { PropertyCard } from "@/components/cards/property-card";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";

interface BuilderPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBuilders().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: BuilderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const builder = getBuilderBySlug(slug);
  if (!builder) return { title: "Builder not found" };

  return {
    title: builder.name,
    description: builder.description.slice(0, 160),
    openGraph: {
      title: `${builder.name} | ${SITE_NAME}`,
      description: builder.description.slice(0, 160),
      images: [{ url: builder.coverImage }],
    },
  };
}

export default async function BuilderDetailPage({ params }: BuilderPageProps) {
  const { slug } = await params;
  const builder = getBuilderBySlug(slug);
  if (!builder) notFound();

  const all = await getAllProperties();
  const properties = all.filter((p) => p.builderId === builder.id);

  return (
    <div className="bg-cream/40">
      <div className="relative h-56 w-full overflow-hidden md:h-72 lg:h-80">
        <Image
          src={builder.coverImage}
          alt={builder.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-charcoal/10" />
      </div>

      <div className="container-luxury section-padding !pt-0 !pb-16">
        <div className="relative -mt-16 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-charcoal/10 md:-mt-20 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-md md:h-28 md:w-28">
              <Image
                src={builder.logo}
                alt={`${builder.name} logo`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {builder.verified ? (
                  <Badge variant="verified" className="gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified builder
                  </Badge>
                ) : null}
                <Badge variant="featured">Est. {builder.established}</Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {builder.name}
              </h1>
              <p className="max-w-3xl leading-relaxed text-muted">{builder.description}</p>
            </div>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-cream/50 p-4 dark:bg-ink/40">
              <dt className="text-xs text-muted">Total projects</dt>
              <dd className="mt-1 flex items-center gap-2 text-xl font-semibold">
                <Building2 className="h-5 w-5 text-gold" />
                {builder.totalProjects}
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-cream/50 p-4 dark:bg-ink/40">
              <dt className="text-xs text-muted">Ongoing</dt>
              <dd className="mt-1 text-xl font-semibold">{builder.ongoingProjects}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-cream/50 p-4 dark:bg-ink/40">
              <dt className="text-xs text-muted">Rating</dt>
              <dd className="mt-1 flex items-center gap-2 text-xl font-semibold">
                <Star className="h-5 w-5 fill-gold text-gold" />
                {builder.rating.toFixed(1)}
                <span className="text-sm font-normal text-muted">
                  ({builder.reviews.toLocaleString("en-IN")})
                </span>
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-cream/50 p-4 dark:bg-ink/40">
              <dt className="text-xs text-muted">Cities</dt>
              <dd className="mt-1 flex items-start gap-2 text-sm font-medium">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{builder.cities.join(", ")}</span>
              </dd>
            </div>
          </dl>
        </div>

        <section className="mt-14">
          <SectionHeading
            eyebrow="Portfolio"
            title={`Properties by ${builder.name}`}
            subtitle={
              properties.length
                ? `${properties.length} listing${properties.length === 1 ? "" : "s"} currently featured on Growra.`
                : "New inventory from this builder will appear here soon."
            }
          />

          {properties.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center text-sm text-muted">
              No live listings for this builder right now.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
