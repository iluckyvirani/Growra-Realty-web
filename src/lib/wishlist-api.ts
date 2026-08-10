import { api } from "./api";
import type { Property } from "@/types";

export type WishlistListResponse = {
  success: boolean;
  data: {
    propertyIds: string[];
    items: Array<{
      id: string;
      propertyId: string;
      createdAt: string;
      property: Property;
    }>;
  };
};

export const wishlistApi = {
  list: (token: string) => api<WishlistListResponse>("/wishlist", { token }),

  add: (propertyId: string, token: string) =>
    api<{ success: boolean; data: { propertyId: string } }>("/wishlist", {
      method: "POST",
      body: { propertyId },
      token,
    }),

  remove: (propertyId: string, token: string) =>
    api<{ success: boolean }>(`/wishlist/${propertyId}`, {
      method: "DELETE",
      token,
    }),

  clear: (token: string) =>
    api<{ success: boolean }>("/wishlist", {
      method: "DELETE",
      token,
    }),
};
