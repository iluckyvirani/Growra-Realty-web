"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { AUDIENCE_MEGA_MENUS } from "@/constants/mega-menu";
import { FOOTER_CONTACT } from "@/constants";
import { useAuthStore } from "@/store";
import { userInitials } from "@/components/auth/auth-login-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

const SERVICE_ITEMS = AUDIENCE_MEGA_MENUS.filter((m) =>
  ["buyers", "tenants", "owners", "dealers"].includes(m.id),
);

const EXTRA_LINKS = [
  { label: "Home Loans", href: "/contact", expandable: false },
  { label: "Insights", href: "/blog", expandable: true, badge: "NEW" as const },
  { label: "Articles & News", href: "/blog", expandable: true },
] as const;

const HELP_LINKS = [
  { label: "About Us", href: "/about", expandable: false },
  { label: "Get Help", href: "/contact", expandable: true },
  { label: "Download App", href: "/#app-download", expandable: false },
] as const;

export function MobileNav({ open, onClose, onLoginClick }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [propertyCode, setPropertyCode] = useState("");
  const { isAuthenticated, user } = useAuthStore();
  const showUser = isAuthenticated && user;

  const toggle = (id: string) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-charcoal/45"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[22rem] flex-col bg-white shadow-2xl sm:max-w-[24rem]"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            {/* Header — Login / Register */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3.5">
              {showUser ? (
                <Link
                  href={
                    user.role === "owner" || user.role === "agent" ? "/portal" : "/dashboard"
                  }
                  onClick={onClose}
                  className="flex min-w-0 items-center gap-2.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8E6C9] text-[11px] font-bold text-charcoal">
                    {userInitials(user.name, user.phone)}
                  </span>
                  <span className="truncate text-sm font-bold text-charcoal">{user.name}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLoginClick?.();
                  }}
                  className="flex items-center gap-2.5 text-gold-rich"
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm font-bold tracking-wide uppercase">
                    Login / Register
                  </span>
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md text-charcoal hover:bg-cream"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Promo banner */}
              <div className="p-4">
                <div className="relative overflow-hidden rounded-xl bg-[#E8F5E9] p-4 pr-28">
                  <p className="max-w-[11rem] text-[15px] font-bold leading-snug text-charcoal">
                    Sell or rent faster at the right price!
                  </p>
                  <Link
                    href="/postproperty"
                    onClick={onClose}
                    className="mt-3 inline-flex rounded-md px-4 py-2 text-sm font-semibold text-white gold-gradient"
                  >
                    Post Property
                  </Link>
                  <div className="pointer-events-none absolute -right-1 bottom-0 h-[7.5rem] w-[6.5rem]">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
                      alt=""
                      fill
                      sizes="104px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Explore our Services */}
              <div className="border-t border-border px-4 pt-4 pb-2">
                <p className="mb-1 text-[13px] font-semibold text-charcoal">
                  Explore our Services
                </p>
                <ul>
                  {SERVICE_ITEMS.map((item) => {
                    const isOpen = expanded === item.id;
                    const panel = item.panels[item.defaultPanel];
                    return (
                      <li key={item.id} className="border-b border-border/70">
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className="flex w-full items-center gap-2 py-3.5 text-left text-[15px] font-medium text-charcoal"
                          aria-expanded={isOpen}
                        >
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted transition-transform",
                              isOpen && "rotate-90 text-gold-rich",
                            )}
                          />
                          {item.label}
                          {item.badge ? (
                            <span className="rounded-sm bg-gold px-1.5 py-px text-[9px] font-bold text-white">
                              {item.badge}
                            </span>
                          ) : null}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden pb-2 pl-6"
                            >
                              <li>
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className="block py-2 text-sm font-medium text-gold-rich"
                                >
                                  View all
                                </Link>
                              </li>
                              {panel?.links.slice(0, 6).map((link) => (
                                <li key={link.href + link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="block py-2 text-sm text-muted hover:text-charcoal"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Extra links */}
              <ul className="border-t border-border px-4">
                {EXTRA_LINKS.map((item) => (
                  <li key={item.label} className="border-b border-border/70">
                    {item.expandable ? (
                      <button
                        type="button"
                        onClick={() => toggle(item.label)}
                        className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-charcoal"
                      >
                        <span className="flex items-center gap-2">
                          {item.label}
                          {"badge" in item && item.badge ? (
                            <span className="rounded-sm bg-[#2563EB] px-1.5 py-px text-[9px] font-bold text-white">
                              {item.badge}
                            </span>
                          ) : null}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted transition-transform",
                            expanded === item.label && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-3.5 text-[15px] font-medium text-charcoal"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.expandable && expanded === item.label ? (
                      <div className="pb-2 pl-3">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block py-2 text-sm text-gold-rich"
                        >
                          Open {item.label}
                        </Link>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* Help */}
              <ul className="border-t border-border px-4">
                {HELP_LINKS.map((item) => (
                  <li key={item.label} className="border-b border-border/70 last:border-b-0">
                    {item.expandable ? (
                      <button
                        type="button"
                        onClick={() => toggle(item.label)}
                        className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-charcoal"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted transition-transform",
                            expanded === item.label && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-3.5 text-[15px] font-medium text-charcoal"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.expandable && expanded === item.label ? (
                      <div className="space-y-1 pb-2 pl-3">
                        <Link
                          href="/contact"
                          onClick={onClose}
                          className="block py-2 text-sm text-muted hover:text-charcoal"
                        >
                          Contact us
                        </Link>
                        <Link
                          href="/#faq"
                          onClick={onClose}
                          className="block py-2 text-sm text-muted hover:text-charcoal"
                        >
                          FAQs
                        </Link>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* Property code search */}
              <div className="border-t border-border p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = propertyCode.trim();
                    onClose();
                    if (q) window.location.href = `/buy?q=${encodeURIComponent(q)}`;
                  }}
                  className="relative"
                >
                  <Input
                    value={propertyCode}
                    onChange={(e) => setPropertyCode(e.target.value)}
                    placeholder="Search by Property Code"
                    className="h-11 rounded-lg border-border bg-cream/80 pr-11 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-gold-rich"
                    aria-label="Search property code"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Footer contact */}
              <div className="border-t border-border px-4 py-4 text-[12px] leading-relaxed text-muted">
                <p>
                  Toll Free Number:{" "}
                  <a
                    href={`tel:${FOOTER_CONTACT.tollFree}`}
                    className="font-medium text-charcoal"
                  >
                    {FOOTER_CONTACT.tollFree}
                  </a>
                  .
                </p>
                <p className="mt-1">
                  For international numbers{" "}
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="font-semibold text-charcoal underline-offset-2 hover:underline"
                  >
                    click here
                  </Link>
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
