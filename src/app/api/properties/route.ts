import { getAllProperties, searchProperties } from "@/services/property-service";
import type { SearchFilters } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: SearchFilters = {
    query: searchParams.get("q") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    listingType: (searchParams.get("listingType") as SearchFilters["listingType"]) ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    verified: searchParams.get("verified") === "true" ? true : undefined,
    sortBy: (searchParams.get("sortBy") as SearchFilters["sortBy"]) ?? "relevance",
  };

  const bhk = searchParams.get("bhk");
  if (bhk) {
    filters.bhk = bhk.split(",").map(Number).filter(Boolean);
  }

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "relevance" && !(Array.isArray(v) && v.length === 0),
  );

  const data = hasFilters
    ? await searchProperties(filters)
    : await getAllProperties();

  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}
