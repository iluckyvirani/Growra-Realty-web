import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "Luxury Collection",
  description:
    "Ultra-luxury residences, penthouses, and signature homes curated by Growra Realty.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function LuxuryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "luxury" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="Luxury Collection"
      description="An exclusive selection of ultra-premium homes where craftsmanship meets lifestyle."
      breadcrumbs={[{ label: "Luxury" }]}
      initialFilters={filters}
    />
  );
}
