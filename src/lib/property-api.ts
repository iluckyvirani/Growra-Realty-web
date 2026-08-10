import { api } from "./api";
import type { Property } from "@/types";

export const propertyApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return api<{ success: boolean; data: Property[] }>(
      `/properties${qs.toString() ? `?${qs}` : ""}`,
    );
  },

  bySlug: (slug: string) =>
    api<{ success: boolean; data: Property; similar?: Property[] }>(
      `/properties/${encodeURIComponent(slug)}`,
    ),

  revealContact: (idOrSlug: string, token?: string | null) =>
    api<{
      success: boolean;
      data: { display: string; tel: string; email?: string; dealerName: string };
    }>(`/properties/${encodeURIComponent(idOrSlug)}/reveal-contact`, {
      method: "POST",
      body: {},
      token,
    }),

  createInquiry: (
    payload: {
      propertyId: string;
      name: string;
      phone: string;
      email?: string;
      message?: string;
    },
    token?: string | null,
  ) =>
    api<{ success: boolean; data: { id: string } }>("/inquiries", {
      method: "POST",
      body: payload,
      token,
    }),
};
