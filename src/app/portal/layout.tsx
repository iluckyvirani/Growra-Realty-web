"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { toast } from "sonner";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { PortalNotificationsBell } from "@/components/portal/portal-notifications-bell";
import { Button } from "@/components/ui/button";
import { userInitials } from "@/components/auth/auth-login-modal";
import { useAuthStore } from "@/store";
import { usePortalStore } from "@/store/portal-store";
import { cn } from "@/lib/utils";

function panelTitle(pathname: string, role?: string) {
  const portalName = role === "agent" ? "Agent Portal" : "Owner Portal";

  if (pathname === "/portal") return { title: portalName, subtitle: "Dashboard" };
  if (pathname.startsWith("/portal/listings/new"))
    return { title: portalName, subtitle: "Post Property" };
  if (pathname.startsWith("/portal/listings"))
    return { title: portalName, subtitle: "My Properties" };
  if (pathname.startsWith("/portal/inquiries"))
    return { title: portalName, subtitle: "Inquiries" };
  if (pathname.startsWith("/portal/diary")) return { title: portalName, subtitle: "Diary" };
  if (pathname.startsWith("/portal/calculators"))
    return { title: portalName, subtitle: "Calculators" };
  if (pathname.startsWith("/portal/tickets")) return { title: portalName, subtitle: "Tickets" };
  if (pathname.startsWith("/portal/chat")) return { title: portalName, subtitle: "Live Chat" };
  if (pathname.startsWith("/portal/profile")) return { title: portalName, subtitle: "Profile" };
  if (pathname.startsWith("/portal/settings")) return { title: portalName, subtitle: "Settings" };
  return { title: portalName, subtitle: "" };
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const seedForRole = usePortalStore((s) => s.seedForRole);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { title, subtitle } = panelTitle(pathname, user?.role);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?as=owner");
      return;
    }
    if (user?.role !== "owner" && user?.role !== "agent") {
      toast.message("Partner portal is for owners and agents");
      router.replace("/dashboard");
      return;
    }
    seedForRole(user.role);
  }, [isAuthenticated, user?.role, router, seedForRole]);

  if (!isAuthenticated || (user?.role !== "owner" && user?.role !== "agent")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted">
        Opening partner portal…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <div className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <PortalSidebar />
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(17rem,88vw)] border-r border-border bg-[#FAF8F3] shadow-xl">
            <PortalSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-white/90 shadow-[0_1px_0_rgba(27,27,27,0.04)] backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md text-charcoal hover:bg-cream lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-base font-semibold tracking-tight text-charcoal sm:text-[17px]">
                    {title}
                  </h1>
                  <span className="hidden rounded border border-gold/30 bg-champagne/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-gold-rich uppercase sm:inline">
                    {user?.role === "agent" ? "Agent" : "Owner"}
                  </span>
                </div>
                {subtitle ? (
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    <span className="text-gold-rich/80">●</span> {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <div className="overflow-visible p-0.5">
                <PortalNotificationsBell />
              </div>
              <div className="hidden h-8 w-px bg-border/80 sm:block" aria-hidden />
              <Link
                href="/portal/profile"
                className="group flex items-center gap-2.5 rounded-md px-1.5 py-1 transition hover:bg-cream/80 sm:pr-2.5"
                aria-label="Profile"
              >
                {user?.name ? (
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] text-[11px] font-bold tracking-wide text-charcoal ring-2 ring-white shadow-sm">
                    {userInitials(user.name, user.phone)}
                  </span>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-muted ring-2 ring-white shadow-sm">
                    <User className="h-4 w-4" />
                  </span>
                )}
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-[8rem] truncate text-sm font-semibold text-charcoal">
                    {user?.name?.split(" ")[0] ?? "Profile"}
                  </span>
                  <span className="block max-w-[8rem] truncate text-[11px] text-muted">
                    {user?.email || "View profile"}
                  </span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted transition group-hover:text-charcoal sm:block" />
              </Link>
            </div>
          </div>
        </header>

        <main className={cn("flex-1 p-3 md:p-4 lg:p-5")}>{children}</main>
      </div>
    </div>
  );
}
