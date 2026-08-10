"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { usePortalStore } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";

/** Hydrate portal notifications + prefs from the API when a partner is logged in. */
export function PortalMessagingSync() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const setPortalNotifications = usePortalStore((s) => s.setPortalNotifications);
  const setNotificationPrefs = usePortalStore((s) => s.setNotificationPrefs);

  useEffect(() => {
    if (!token) {
      setPortalNotifications([]);
      return;
    }
    if (role !== "owner" && role !== "agent") return;

    let cancelled = false;
    void Promise.all([
      portalApi.notifications(token),
      portalApi.notificationPrefs(token),
    ])
      .then(([notifs, prefs]) => {
        if (cancelled) return;
        setPortalNotifications(notifs.data);
        setNotificationPrefs(prefs.data);
      })
      .catch(() => undefined);

    const id = window.setInterval(() => {
      void portalApi
        .notifications(token)
        .then((res) => {
          if (!cancelled) setPortalNotifications(res.data);
        })
        .catch(() => undefined);
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [token, role, setPortalNotifications, setNotificationPrefs]);

  return null;
}
