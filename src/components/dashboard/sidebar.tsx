"use client";

import {
  BarChart3,
  Bookmark,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardSection =
  | "overview"
  | "listings"
  | "inquiries"
  | "analytics"
  | "saved"
  | "settings";

const NAV_ITEMS: { id: DashboardSection; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "My Listings", icon: Bookmark },
  { id: "inquiries", label: "Inquiries", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  className?: string;
}

export function DashboardSidebar({ active, onChange, className }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-champagne/25 p-3 shadow-lg shadow-charcoal/5",
        className,
      )}
    >
      <p className="mb-3 px-3 pt-2 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
        Dashboard
      </p>
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Dashboard">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "gold-gradient text-white shadow-md shadow-gold/25"
                  : "text-muted hover:bg-champagne/50 hover:text-charcoal",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
