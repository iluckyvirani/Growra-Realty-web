import type { Metadata } from "next";
import {
  getAllProperties,
  searchProperties,
} from "@/services/property-service";
import type { SearchFilters } from "@/types";
import { ListingView } from "@/components/search/listing-view";
import {
  filterPropertyList,
  searchParamsToFilters,
  type ListingSearchParams,
} from "@/lib/listing";

export const metadata: Metadata = {
  title: "Buy Properties",
  description:
    "Browse premium apartments, villas, and luxury homes for sale across India's top cities with Growra Realty.",
};

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

async function getBuyList(filters: SearchFilters) {
  const buy = await searchProperties({ ...filters, listingType: "buy" });
  const all = await getAllProperties();
  const luxury = all.filter(
    (p) =>
      p.listingType === "luxury" ||
      (p.luxury && p.listingType !== "rent" && p.listingType !== "pg"),
  );
  const map = new Map(buy.map((p) => [p.id, p]));
  luxury.forEach((p) => {
    if (!map.has(p.id)) map.set(p.id, p);
  });
  return filterPropertyList(Array.from(map.values()), filters);
}

export default async function BuyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = searchParamsToFilters(params, { listingType: "buy" });
  const properties = await getBuyList(filters);

  return (
    <ListingView
      initialProperties={properties}
      title="Buy Properties"
      description="Discover verified homes for sale — from elegant apartments to signature luxury residences."
      breadcrumbs={[{ label: "Buy" }]}
      initialFilters={filters}
    />
  );
}
