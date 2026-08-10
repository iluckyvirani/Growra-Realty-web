"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/store";
import { usePortalStore, type PortalNotification } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (Number.isNaN(mins) || mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function hrefForNotification(n: PortalNotification) {
  switch (n.type) {
    case "ticket":
      return "/portal/tickets";
    case "chat":
      return "/portal/chat";
    case "listing":
      return "/portal/listings";
    case "kyc":
      return "/portal/profile";
    case "inquiry":
      return "/portal/inquiries";
    default:
      return null;
  }
}

export function PortalNotificationsBell() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const notifications = usePortalStore((s) => s.portalNotifications);
  const markReadLocal = usePortalStore((s) => s.markNotificationRead);
  const markAllLocal = usePortalStore((s) => s.markAllNotificationsRead);
  const setPortalNotifications = usePortalStore((s) => s.setPortalNotifications);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    markReadLocal(id);
    if (!token) return;
    void portalApi
      .markNotificationRead(id, token)
      .then((res) => {
        setPortalNotifications(
          notifications.map((n) => (n.id === res.data.id ? res.data : n)),
        );
      })
      .catch(() => undefined);
  };

  const markAllRead = () => {
    markAllLocal();
    if (!token) return;
    void portalApi
      .markAllNotificationsRead(token)
      .then((res) => setPortalNotifications(res.data))
      .catch(() => undefined);
  };

  const openNotification = (n: PortalNotification) => {
    markRead(n.id);
    setOpen(false);
    const href = hrefForNotification(n);
    if (href) router.push(href);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(true)}
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-[8px] text-charcoal transition",
          "hover:bg-cream",
          open && "bg-cream",
        )}
      >
        <Bell className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        {unread > 0 ? (
          <span
            className="absolute -top-0.5 -right-0.5 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] leading-none font-bold text-white shadow-sm ring-2 ring-white"
            aria-hidden
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-[380px]"
        >
          <SheetHeader className="border-b border-border/70 px-4 py-4 text-left">
            <div className="flex items-start justify-between gap-3 pr-6">
              <div>
                <SheetTitle className="text-lg font-extrabold text-charcoal">
                  Notifications
                </SheetTitle>
                <SheetDescription className="mt-0.5 text-xs text-muted">
                  {unread ? `${unread} unread` : "All caught up"}
                </SheetDescription>
              </div>
              <button
                type="button"
                disabled={!unread}
                onClick={() => markAllRead()}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-[8px] px-2 py-1.5 text-[11px] font-semibold text-gold-rich transition",
                  unread ? "hover:bg-cream" : "cursor-not-allowed opacity-40",
                )}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {notifications.length === 0 ? (
              <p className="px-2 py-10 text-center text-sm text-muted">No notifications yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(n)}
                      className={cn(
                        "w-full rounded-[8px] border px-3.5 py-3 text-left transition",
                        n.read
                          ? "border-border/70 bg-white hover:bg-cream/60"
                          : "border-gold/35 bg-[rgba(200,155,60,0.1)] hover:bg-[rgba(200,155,60,0.16)] border-l-[3px] border-l-gold",
                      )}
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <p
                          className={cn(
                            "text-sm leading-snug text-charcoal",
                            n.read ? "font-semibold" : "font-extrabold",
                          )}
                        >
                          {n.title}
                        </p>
                        <span className="shrink-0 pt-0.5 text-[11px] whitespace-nowrap text-muted">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted">{n.body}</p>
                      <span className="mt-2 inline-flex rounded-[8px] bg-[rgba(200,155,60,0.12)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-gold-rich uppercase">
                        {n.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
