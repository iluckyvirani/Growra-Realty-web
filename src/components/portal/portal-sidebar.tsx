"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Building2,
  Calculator,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  Settings,
  Ticket,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteLogo } from "@/components/common/site-logo";
import { useAuthStore } from "@/store";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  owner?: boolean;
  agent?: boolean;
};

const NAV: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, owner: true, agent: true },
  { href: "/portal/listings", label: "My Properties", icon: Building2, owner: true, agent: true },
  { href: "/portal/inquiries", label: "Inquiries", icon: MessageSquare, owner: false, agent: true },
  { href: "/portal/diary", label: "Diary", icon: BookOpen, owner: false, agent: true },
  { href: "/portal/calculators", label: "Calculators", icon: Calculator, owner: false, agent: true },
  { href: "/portal/tickets", label: "Tickets", icon: Ticket, owner: true, agent: true },
  { href: "/portal/chat", label: "Live Chat", icon: MessageCircle, owner: true, agent: true },
  { href: "/portal/profile", label: "Profile", icon: UserRound, owner: true, agent: true },
  { href: "/portal/settings", label: "Settings", icon: Settings, owner: true, agent: true },
];

export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isAgent = user?.role === "agent";

  const items = NAV.filter((item) => (isAgent ? item.agent : item.owner));

  return (
    <aside className="flex h-full flex-col border-r border-border/80 bg-[#FAF8F3]">
      <div className="flex justify-center border-b border-border/70 px-4 py-5">
        <SiteLogo size="lg" />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-3" aria-label="Portal">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/portal"
              ? pathname === "/portal"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition",
                active
                  ? "bg-gold text-white"
                  : "text-muted hover:bg-white hover:text-charcoal",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1.5 border-t border-border/70 p-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold/40"
        >
          <ExternalLink className="h-4 w-4 text-gold" />
          View website
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
            router.push("/");
          }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
