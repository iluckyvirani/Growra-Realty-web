"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Menu, PlusSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onMenuClick: () => void;
  menuOpen?: boolean;
}

const SEARCH_PATHS = ["/buy", "/rent", "/commercial", "/pg", "/plots", "/projects", "/luxury", "/city"];

export function MobileBottomNav({ onMenuClick, menuOpen }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSearch =
    SEARCH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/property/");
  const isSell = pathname.startsWith("/portal") || pathname.startsWith("/dashboard");
  const isActivity =
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/profile");

  const items = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Home,
      active: isHome && !menuOpen,
    },
    {
      id: "search",
      label: "Search",
      href: "/buy",
      icon: Search,
      active: isSearch && !menuOpen,
    },
    {
      id: "sell",
      label: "Sell/Rent",
      href: "/portal",
      icon: PlusSquare,
      active: isSell && !menuOpen,
      badge: "FREE",
    },
    {
      id: "activity",
      label: "Activity",
      href: "/wishlist",
      icon: Heart,
      active: isActivity && !menuOpen,
    },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile primary"
    >
      <ul className="mx-auto flex h-[3.75rem] max-w-lg items-stretch justify-around px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex min-w-0 flex-1">
              <Link
                href={item.href}
                className={cn(
                  "relative flex w-full flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                  item.active ? "text-charcoal" : "text-muted",
                )}
                aria-current={item.active ? "page" : undefined}
              >
                <span className="relative inline-flex">
                  <Icon
                    className={cn("h-[22px] w-[22px]", item.active && "stroke-[2.25]")}
                    strokeWidth={item.active ? 2.25 : 1.75}
                  />
                  {"badge" in item && item.badge ? (
                    <span className="absolute -top-1.5 -right-3 rounded-[3px] bg-success px-1 py-px text-[8px] leading-none font-bold tracking-wide text-white uppercase">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className={cn(item.active && "font-semibold")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuClick}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
              menuOpen ? "text-charcoal" : "text-muted",
            )}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu
              className={cn("h-[22px] w-[22px]", menuOpen && "stroke-[2.25]")}
              strokeWidth={menuOpen ? 2.25 : 1.75}
            />
            <span className={cn(menuOpen && "font-semibold")}>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
