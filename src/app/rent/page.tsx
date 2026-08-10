import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "Rent Properties",
  description:
    "Find premium rental apartments, villas, and furnished homes across India's finest localities.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function RentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "rent" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="Rent Properties"
      description="Curated rental homes with flexible tenancy — ready to move in when you are."
      breadcrumbs={[{ label: "Rent" }]}
      initialFilters={filters}
    />
  );
}
