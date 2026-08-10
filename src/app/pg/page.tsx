import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "PG & Co-living",
  description:
    "Find verified paying guest and co-living spaces near workplaces and campuses.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function PgPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "pg" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="PG & Co-living"
      description="Comfortable, verified paying guest accommodations with flexible stay options."
      breadcrumbs={[{ label: "PG" }]}
      initialFilters={filters}
    />
  );
}
