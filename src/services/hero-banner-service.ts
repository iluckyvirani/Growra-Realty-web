import { PROPERTY_API_URL } from "@/services/property-service";

export type HeroBanner = {
  id: string;
  title: string;
  note: string;
  linkUrl: string;
  imageUrl: string;
};

export async function getHeroBanner(): Promise<HeroBanner | null> {
  if (!PROPERTY_API_URL) return null;
  try {
    const res = await fetch(`${PROPERTY_API_URL}/hero-banner`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: HeroBanner | null };
    return json.data ?? null;
  } catch {
    return null;
  }
}
