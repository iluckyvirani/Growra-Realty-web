import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "Commercial Properties",
  description:
    "Explore offices, shops, and commercial spaces in high-growth business districts.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function CommercialPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "commercial" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="Commercial Properties"
      description="Premium offices and retail spaces designed for ambition and visibility."
      breadcrumbs={[{ label: "Commercial" }]}
      initialFilters={filters}
    />
  );
}
