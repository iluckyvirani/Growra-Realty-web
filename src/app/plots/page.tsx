import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "Plots & Land",
  description:
    "Browse residential and investment plots in prime localities across India.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function PlotsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "plot" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="Plots & Land"
      description="Secure premium plots and land parcels in high-potential growth corridors."
      breadcrumbs={[{ label: "Plots" }]}
      initialFilters={filters}
    />
  );
}
