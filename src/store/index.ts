import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Property, SearchFilters } from "@/types";
import { wishlistApi } from "@/lib/wishlist-api";

interface CompareState {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (id) =>
        set((s) => {
          if (s.items.includes(id) || s.items.length >= 4) return s;
          return { items: [...s.items, id] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
      toggle: (id) => {
        const { items, add, remove } = get();
        if (items.includes(id)) remove(id);
        else add(id);
      },
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: "growra-compare" },
  ),
);

interface RecentState {
  searches: string[];
  viewed: string[];
  addSearch: (q: string) => void;
  addViewed: (id: string) => void;
  clearSearches: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      searches: [],
      viewed: [],
      addSearch: (q) => {
        const trimmed = q.trim();
        if (!trimmed) return;
        const next = [trimmed, ...get().searches.filter((s) => s !== trimmed)].slice(0, 8);
        set({ searches: next });
      },
      addViewed: (id) => {
        const next = [id, ...get().viewed.filter((v) => v !== id)].slice(0, 12);
        set({ viewed: next });
      },
      clearSearches: () => set({ searches: [] }),
    }),
    { name: "growra-recent" },
  ),
);

interface SearchState {
  filters: SearchFilters;
  viewMode: "grid" | "list" | "map";
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: "grid" | "list" | "map") => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: { sortBy: "relevance" },
  viewMode: "list",
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: { sortBy: "relevance" } }),
  setViewMode: (viewMode) => set({ viewMode }),
}));

interface AuthUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  /** buyer = website end user; owner/agent = partner portal */
  role?: "buyer" | "owner" | "agent";
  roleChosen?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (user: AuthUser, token?: string | null) => void;
  setSession: (payload: { user: AuthUser; token: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  setRole: (role: "buyer" | "owner" | "agent") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (user, token = null) => {
        set({
          isAuthenticated: true,
          token,
          user: {
            role: "buyer",
            roleChosen: false,
            ...user,
          },
        });
        if (token) void useWishlistStore.getState().syncFromServer(token);
      },
      setSession: ({ user, token }) => {
        set({
          isAuthenticated: true,
          token,
          user: {
            role: "buyer",
            roleChosen: Boolean(user.role),
            ...user,
          },
        });
        void useWishlistStore.getState().syncFromServer(token);
      },
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
      setRole: (role) =>
        set((s) => ({
          user: s.user ? { ...s.user, role, roleChosen: true } : null,
        })),
    }),
    { name: "growra-auth" },
  ),
);

interface WishlistState {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  syncFromServer: (token: string) => Promise<void>;
  setItems: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (ids) => set({ items: [...new Set(ids)] }),
      add: (id) => {
        set((s) => ({ items: s.items.includes(id) ? s.items : [...s.items, id] }));
        const token = useAuthStore.getState().token;
        if (token) void wishlistApi.add(id, token).catch(() => undefined);
      },
      remove: (id) => {
        set((s) => ({ items: s.items.filter((i) => i !== id) }));
        const token = useAuthStore.getState().token;
        if (token) void wishlistApi.remove(id, token).catch(() => undefined);
      },
      toggle: (id) => {
        const { items } = get();
        const has = items.includes(id);
        if (has) {
          set({ items: items.filter((i) => i !== id) });
          const token = useAuthStore.getState().token;
          if (token) void wishlistApi.remove(id, token).catch(() => undefined);
        } else {
          set({ items: [...items, id] });
          const token = useAuthStore.getState().token;
          if (token) void wishlistApi.add(id, token).catch(() => undefined);
        }
      },
      has: (id) => get().items.includes(id),
      clear: () => {
        set({ items: [] });
        const token = useAuthStore.getState().token;
        if (token) void wishlistApi.clear(token).catch(() => undefined);
      },
      syncFromServer: async (token: string) => {
        try {
          const local = get().items;
          const remote = await wishlistApi.list(token);
          const remoteIds = remote.data.propertyIds;
          const missing = local.filter((id) => !remoteIds.includes(id));
          if (missing.length) {
            await Promise.all(
              missing.map((id) => wishlistApi.add(id, token).catch(() => undefined)),
            );
            const refreshed = await wishlistApi.list(token);
            set({ items: refreshed.data.propertyIds });
          } else {
            set({ items: remoteIds });
          }
        } catch {
          // keep local guest wishlist on network errors
        }
      },
    }),
    { name: "growra-wishlist" },
  ),
);

interface LocationState {
  citySlug: string;
  cityName: string;
  setCity: (slug: string, name: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      citySlug: "all-india",
      cityName: "All India",
      setCity: (citySlug, cityName) => set({ citySlug, cityName }),
    }),
    {
      name: "growra-location",
      version: 2,
      migrate: () => ({
        citySlug: "all-india",
        cityName: "All India",
      }),
    },
  ),
);

export interface BuyerInquiry {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface InquiryState {
  items: BuyerInquiry[];
  add: (inquiry: Omit<BuyerInquiry, "id" | "createdAt">) => BuyerInquiry;
  setItems: (items: BuyerInquiry[]) => void;
}

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      add: (inquiry) => {
        const entry: BuyerInquiry = {
          ...inquiry,
          id: `INQ-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };
        set({ items: [entry, ...get().items].slice(0, 50) });
        return entry;
      },
    }),
    { name: "growra-buyer-inquiries" },
  ),
);

export type { Property };
