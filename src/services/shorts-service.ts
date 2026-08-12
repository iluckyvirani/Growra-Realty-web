import { PROPERTY_API_URL } from "@/services/property-service";

export type PropertyShort = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  propertyId: string | null;
  propertySlug: string | null;
  propertyTitle: string | null;
  propertyLocation: string | null;
  views: number;
  createdAt: string;
};

export async function getPropertyShorts(limit = 24): Promise<PropertyShort[]> {
  if (!PROPERTY_API_URL) return [];
  try {
    const res = await fetch(`${PROPERTY_API_URL}/shorts?limit=${limit}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: PropertyShort[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}
