import type { Metadata } from "next";
import { searchProperties } from "@/services/property-service";
import { ListingView } from "@/components/search/listing-view";
import {
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "New Projects",
  description:
    "Discover upcoming and under-construction residential projects from India's leading builders.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "project" });
  const properties = await searchProperties(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="New Projects"
      description="New launches and under-construction developments with exclusive pre-launch opportunities."
      breadcrumbs={[{ label: "Projects" }]}
      initialFilters={filters}
    />
  );
}
