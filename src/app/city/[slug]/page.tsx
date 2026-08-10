import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCities,
  getCityBySlug,
  getPropertiesByCity,
  searchProperties,
} from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export function generateStaticParams() {
  return getAllCities().map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) {
    return { title: "City Not Found" };
  }
  return {
    title: `Properties in ${city.name}`,
    description:
      city.description ||
      `Explore homes for sale and rent in ${city.name}, ${city.state}.`,
  };
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const sp = await searchParams;
  const filters = searchParamsToFilters(sp, { city: city.name });

  const hasExtraFilters = Boolean(
    sp.q || sp.type || sp.status || sp.minPrice || sp.maxPrice || sp.bhk || sp.sortBy,
  );

  const properties = hasExtraFilters
    ? await searchProperties(filters)
    : await getPropertiesByCity(slug);

  return (
    <ListingView
      initialProperties={properties}
      title={`Properties in ${city.name}`}
      description={`${city.propertyCount.toLocaleString("en-IN")}+ listings · Avg. ${formatPrice(city.avgPrice)} · ${city.state}`}
      breadcrumbs={[
        { label: "Cities", href: "/#cities" },
        { label: city.name },
      ]}
      initialFilters={filters}
    />
  );
}
