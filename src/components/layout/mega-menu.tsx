"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Castle,
  Home,
  KeyRound,
  Landmark,
  Layers,
  MapPinned,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Apartments: Building2,
  Villas: Home,
  Penthouses: Castle,
  "Ready to Move": KeyRound,
  "PG / Co-living": Layers,
  "Office Spaces": Landmark,
  "Shops & Retail": Store,
  Plots: MapPinned,
  "New Launches": Sparkles,
  "Under Construction": Layers,
  "Luxury Collection": Sparkles,
};

const FEATURED: Record<
  string,
  { title: string; blurb: string; href: string; cta: string }
> = {
  Buy: {
    title: "Curated for sale",
    blurb: "Verified homes from trusted builders across India’s finest addresses.",
    href: "/buy",
    cta: "Explore buy",
  },
  Rent: {
    title: "Move-in ready",
    blurb: "Furnished and unfurnished residences with transparent monthly pricing.",
    href: "/rent",
    cta: "Explore rent",
  },
  Commercial: {
    title: "Workspace & retail",
    blurb: "Grade-A offices, high-street shops, and investment-ready plots.",
    href: "/commercial",
    cta: "Explore commercial",
  },
  Projects: {
    title: "New horizons",
    blurb: "Launches and under-construction communities worth the wait.",
    href: "/projects",
    cta: "Explore projects",
  },
};

interface MegaMenuProps {
  item: NavItem;
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ item, open, onClose }: MegaMenuProps) {
  if (!item.children?.length || !open) return null;

  const featured = FEATURED[item.label];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 z-50 pt-3"
      role="menu"
      aria-label={`${item.label} menu`}
    >
      {/* Hover bridge so the menu doesn't close when moving from trigger → panel */}
      <div className="absolute inset-x-0 top-0 h-3" aria-hidden />

      <div
        className={cn(
          "relative w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-2xl",
          "border border-border/80 bg-surface shadow-[0_24px_60px_-20px_rgba(27,27,27,0.35)]",
          "dark:border-border dark:bg-card dark:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.65)]",
        )}
      >
        {/* Gold accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 gold-gradient" aria-hidden />

        <div className="grid md:grid-cols-[1fr_11.5rem]">
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-end justify-between gap-3 border-b border-border/70 pb-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-muted">Choose a category to continue</p>
              </div>
              <Link
                href={item.href}
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-rich transition-colors hover:text-gold"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div
              className={cn(
                "grid gap-1.5",
                item.children.length > 3 ? "sm:grid-cols-2" : "sm:grid-cols-1",
              )}
            >
              {item.children.map((child) => {
                const Icon = ICON_MAP[child.label] ?? Building2;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    role="menuitem"
                    className={cn(
                      "group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3",
                      "transition-all duration-200",
                      "hover:border-gold/25 hover:bg-champagne/40 hover:shadow-sm",
                      "dark:hover:bg-secondary/50",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        "bg-champagne/70 text-gold-rich ring-1 ring-gold/15",
                        "transition-colors group-hover:bg-gold group-hover:text-white group-hover:ring-gold/40",
                        "dark:bg-secondary dark:text-gold-light",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-gold-rich">
                          {child.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-gold" />
                      </span>
                      {child.description ? (
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                          {child.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {featured ? (
            <aside className="relative hidden overflow-hidden border-l border-border/70 bg-gradient-to-b from-champagne/50 via-cream to-champagne/30 p-5 md:flex md:flex-col dark:from-secondary/80 dark:via-card dark:to-secondary/40">
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/15 blur-2xl"
                aria-hidden
              />
              <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-rich uppercase">
                Featured
              </p>
              <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">
                {featured.title}
              </h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{featured.blurb}</p>
              <Link
                href={featured.href}
                onClick={onClose}
                className={cn(
                  "mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold",
                  "gold-gradient text-white shadow-md shadow-gold/20 transition hover:brightness-105",
                )}
              >
                {featured.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </aside>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
