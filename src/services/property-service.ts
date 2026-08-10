import type { Property, SearchFilters } from "@/types";
import { builders, cities, blogPosts, testimonials, faqs, reviews } from "@/data";
import type { Builder, City, BlogPost } from "@/types";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000/api";

/** Placeholder / invalid hosts must not break Vercel builds. */
function isUsableApiUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (!host || host === "your-api-host" || host.includes("example.com") || host.includes("YOUR-")) {
      return false;
    }
    if (host.startsWith("your-") || host.includes("placeholder")) return false;
    return true;
  } catch {
    return false;
  }
}

const API_URL = isUsableApiUrl(RAW_API_URL) ? RAW_API_URL : "";

type ListResponse = {
  success: boolean;
  data: Property[];
  meta?: { page: number; limit: number; total: number; pages: number };
};

type DetailResponse = {
  success: boolean;
  data: Property;
  similar?: Property[];
};

async function fetchProperties(
  params: Record<string, string | number | undefined> = {},
): Promise<Property[]> {
  if (!API_URL) return [];

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) qs.set(k, String(v));
  });
  const url = `${API_URL}/properties${qs.toString() ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ListResponse;
    return json.data ?? [];
  } catch {
    // Offline / bad DNS / build without API — never fail the Next build
    return [];
  }
}

export async function getAllProperties(): Promise<Property[]> {
  return fetchProperties({ limit: 100, sort: "relevance" });
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  if (!API_URL) return undefined;
  try {
    const res = await fetch(`${API_URL}/properties/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });
    if (res.status === 404) return undefined;
    if (!res.ok) return undefined;
    const json = (await res.json()) as DetailResponse;
    return json.data;
  } catch {
    return undefined;
  }
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const all = await getAllProperties();
  return all.find((p) => p.id === id);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return fetchProperties({ featured: "true", limit: 12 });
}

export async function getLuxuryProperties(): Promise<Property[]> {
  return fetchProperties({ luxury: "true", limit: 12 });
}

export async function getTrendingProperties(): Promise<Property[]> {
  return fetchProperties({ sort: "views", limit: 8 });
}

export async function getPropertiesByListingType(listingType: string): Promise<Property[]> {
  if (listingType === "luxury") return getLuxuryProperties();
  if (listingType === "projects") {
    return fetchProperties({ listingType: "project", limit: 50 });
  }
  return fetchProperties({ listingType, limit: 50 });
}

export async function getPropertiesByCity(citySlug: string): Promise<Property[]> {
  const city = cities.find((c) => c.slug === citySlug);
  if (!city) return [];
  return fetchProperties({ city: city.name, limit: 50 });
}

export async function getSimilarProperties(
  property: Property,
  limit = 4,
): Promise<Property[]> {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/properties/${encodeURIComponent(property.slug)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("similar failed");
    const json = (await res.json()) as DetailResponse;
    return (json.similar ?? []).slice(0, limit);
  } catch {
    const all = await getAllProperties();
    return all
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.city === property.city || p.propertyType === property.propertyType),
      )
      .slice(0, limit);
  }
}

export async function searchProperties(filters: SearchFilters): Promise<Property[]> {
  const listingType = filters.listingType;

  const rows = await fetchProperties({
    q: filters.query,
    city: filters.city,
    listingType: listingType === "luxury" ? "luxury" : listingType,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice === Infinity ? undefined : filters.maxPrice,
    minBeds: filters.bhk?.[0],
    sort:
      filters.sortBy === "price-asc"
        ? "price-asc"
        : filters.sortBy === "price-desc"
          ? "price-desc"
          : filters.sortBy === "newest"
            ? "newest"
            : "relevance",
    limit: 100,
  });

  let results = rows;

  if (filters.propertyType?.length) {
    results = results.filter((p) => filters.propertyType!.includes(p.propertyType));
  }
  if (filters.bhk?.length) {
    results = results.filter((p) => filters.bhk!.includes(p.bhk));
  }
  if (filters.furnished?.length) {
    results = results.filter((p) => filters.furnished!.includes(p.furnished));
  }
  if (filters.amenities?.length) {
    results = results.filter((p) =>
      filters.amenities!.every((a) => p.amenities.includes(a)),
    );
  }
  if (filters.verified) {
    results = results.filter((p) => p.verified);
  }
  if (filters.constructionStatus?.length) {
    results = results.filter((p) =>
      filters.constructionStatus!.includes(p.constructionStatus),
    );
  }

  return results;
}

export function getAllBuilders(): Builder[] {
  return builders;
}

export function getBuilderById(id: string): Builder | undefined {
  return builders.find((b) => b.id === id);
}

export function getBuilderBySlug(slug: string): Builder | undefined {
  return builders.find((b) => b.slug === slug);
}

export function getAllCities(): City[] {
  return cities;
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((b) => b.slug === slug);
}

export function getTestimonials() {
  return testimonials;
}

export function getFaqs() {
  return faqs;
}

export function getReviews(propertyId?: string) {
  if (!propertyId) return reviews;
  return reviews.filter((r) => r.propertyId === propertyId);
}

export { API_URL as PROPERTY_API_URL };
