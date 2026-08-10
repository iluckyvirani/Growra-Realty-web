import type {
  ConstructionStatus,
  Property,
  PropertyType,
  SearchFilters,
} from "@/types";

export type ListingSearchParams = {
  type?: string | string[];
  status?: string | string[];
  q?: string | string[];
  city?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  bhk?: string | string[];
  sortBy?: string | string[];
};

function first(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function searchParamsToFilters(
  params: ListingSearchParams,
  defaults: Partial<SearchFilters> = {},
): SearchFilters {
  const filters: SearchFilters = { sortBy: "relevance", ...defaults };

  const q = first(params.q);
  if (q) filters.query = q;

  const city = first(params.city);
  if (city) filters.city = city;

  const type = first(params.type);
  if (type) {
    filters.propertyType = type.split(",").filter(Boolean) as PropertyType[];
  }

  const status = first(params.status);
  if (status) {
    filters.constructionStatus = status
      .split(",")
      .filter(Boolean) as ConstructionStatus[];
  }

  const minPrice = first(params.minPrice);
  if (minPrice && !Number.isNaN(Number(minPrice))) {
    filters.minPrice = Number(minPrice);
  }

  const maxPrice = first(params.maxPrice);
  if (maxPrice && !Number.isNaN(Number(maxPrice))) {
    filters.maxPrice = Number(maxPrice);
  }

  const bhk = first(params.bhk);
  if (bhk) {
    filters.bhk = bhk
      .split(",")
      .map((n) => Number(n))
      .filter((n) => !Number.isNaN(n));
  }

  const sortBy = first(params.sortBy) as SearchFilters["sortBy"] | undefined;
  if (
    sortBy &&
    ["relevance", "price-asc", "price-desc", "newest", "area-desc"].includes(sortBy)
  ) {
    filters.sortBy = sortBy;
  }

  return filters;
}

/** Client-side filter/sort over an already listing-scoped property list. */
export function filterPropertyList(
  properties: Property[],
  filters: SearchFilters,
): Property[] {
  let results = [...properties];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.builderName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filters.city) {
    const city = filters.city.toLowerCase();
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(city) ||
        p.locality.toLowerCase().includes(city),
    );
  }

  if (filters.propertyType?.length) {
    results = results.filter((p) => filters.propertyType!.includes(p.propertyType));
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== Infinity) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.bhk?.length) {
    results = results.filter(
      (p) =>
        filters.bhk!.includes(p.bhk) || (filters.bhk!.includes(6) && p.bhk >= 6),
    );
  }

  if (filters.bathrooms?.length) {
    results = results.filter((p) =>
      filters.bathrooms!.some((b) => p.bathrooms >= b),
    );
  }

  if (filters.minArea !== undefined) {
    results = results.filter((p) => p.area >= filters.minArea!);
  }

  if (filters.maxArea !== undefined) {
    results = results.filter((p) => p.area <= filters.maxArea!);
  }

  if (filters.amenities?.length) {
    results = results.filter((p) =>
      filters.amenities!.every((a) => p.amenities.includes(a)),
    );
  }

  if (filters.constructionStatus?.length) {
    results = results.filter((p) =>
      filters.constructionStatus!.includes(p.constructionStatus),
    );
  }

  if (filters.furnished?.length) {
    results = results.filter((p) => filters.furnished!.includes(p.furnished));
  }

  if (filters.verified) {
    results = results.filter((p) => p.verified);
  }

  if (filters.rera) {
    results = results.filter((p) => Boolean(p.reraId));
  }

  switch (filters.sortBy) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results.sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
      break;
    case "area-desc":
      results.sort((a, b) => b.area - a.area);
      break;
    default:
      results.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.views - a.views,
      );
  }

  return results;
}
