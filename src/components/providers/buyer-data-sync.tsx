"use client";

import { useEffect } from "react";
import { useAuthStore, useInquiryStore, useWishlistStore } from "@/store";
import { meApi } from "@/lib/me-api";

/** Syncs wishlist + buyer inquiries after auth hydrate / login. */
export function BuyerDataSync() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncWishlist = useWishlistStore((s) => s.syncFromServer);
  const setInquiries = useInquiryStore((s) => s.setItems);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    void syncWishlist(token);
    void meApi
      .inquiries(token)
      .then((res) => setInquiries(res.data))
      .catch(() => undefined);
  }, [isAuthenticated, token, syncWishlist, setInquiries]);

  return null;
}
