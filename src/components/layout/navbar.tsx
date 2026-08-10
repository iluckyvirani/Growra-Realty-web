"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Headphones, Menu, User } from "lucide-react";
import { AUDIENCE_MEGA_MENUS } from "@/constants/mega-menu";
import { useMounted } from "@/hooks";
import { useAuthStore } from "@/store";
import { AuthLoginModal, userInitials } from "@/components/auth/auth-login-modal";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { LocationPicker } from "@/components/layout/location-picker";
import { NavbarSearch } from "@/components/layout/navbar-search";
import { AudienceMegaMenu } from "@/components/layout/audience-mega-menu";
import { ContactDropdown } from "@/components/layout/contact-dropdown";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { SiteLogo } from "@/components/common/site-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OpenMenu = string | null;

const LISTING_PATHS = [
  "/buy",
  "/rent",
  "/commercial",
  "/pg",
  "/plots",
  "/projects",
  "/luxury",
  "/city",
];

function NavbarSearchFallback() {
  return (
    <div className="h-11 min-w-0 flex-1 animate-pulse rounded-lg bg-white/90" aria-hidden />
  );
}

export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const showUser = mounted && isAuthenticated && user;

  const isHome = pathname === "/";
  const isListing = LISTING_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const overHero = isHome && !scrolled;
  const solid = !isHome || scrolled;

  const activeMega = AUDIENCE_MEGA_MENUS.find((m) => m.id === openMenu);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const open = (id: string) => {
    clearCloseTimer();
    setOpenMenu(id);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  const close = () => {
    clearCloseTimer();
    setOpenMenu(null);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const iconBtn = cn(
    "rounded-lg text-white hover:bg-white/15 hover:text-white",
    !solid && overHero && "text-white",
  );

  const renderAudienceLinks = () => (
    <nav
      className="flex items-center gap-1 xl:gap-2"
      aria-label="Audience"
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      {AUDIENCE_MEGA_MENUS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "relative whitespace-nowrap px-2 py-2 text-[13px] font-medium text-white/90 transition hover:text-white",
            openMenu === item.id && "text-white",
          )}
          aria-expanded={openMenu === item.id}
          aria-haspopup="true"
          onMouseEnter={() => open(item.id)}
          onFocus={() => open(item.id)}
          onClick={() => (openMenu === item.id ? close() : open(item.id))}
        >
          {item.label}
          {item.badge ? (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-sm bg-danger px-1 text-[9px] font-bold text-white">
              {item.badge}
            </span>
          ) : null}
          {openMenu === item.id ? (
            <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold" />
          ) : null}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
          solid
            ? "border-b border-white/10 bg-charcoal py-2.5 shadow-lg"
            : "border-b border-transparent bg-transparent py-3",
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <SiteLogo size={solid ? "sm" : "md"} priority />
            {!isListing ? (
              <LocationPicker
                overHero
                className="hidden text-white hover:bg-white/10 hover:text-white md:inline-flex"
              />
            ) : null}
          </div>

          {solid ? (
            <Suspense fallback={<NavbarSearchFallback />}>
              <NavbarSearch className="mx-1 hidden max-w-3xl md:flex lg:mx-4" />
            </Suspense>
          ) : (
            <div className="ml-auto hidden lg:block">{renderAudienceLinks()}</div>
          )}

          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 sm:gap-2",
              !solid && "ml-auto lg:ml-0",
              solid && "ml-auto md:ml-0",
            )}
          >
            <Link
              href="/postproperty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white px-2.5 py-1 text-[11px] font-semibold text-charcoal shadow-sm transition hover:bg-cream sm:gap-1.5 sm:rounded-md sm:px-3 sm:py-1.5 sm:text-[13px]"
            >
              <span className="sm:hidden">Post</span>
              <span className="hidden sm:inline">Post property</span>
              <span className="rounded bg-success px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase sm:text-[10px]">
                Free
              </span>
            </Link>

            <div
              className="relative hidden shrink-0 sm:block"
              onMouseEnter={() => open("contact")}
              onMouseLeave={scheduleClose}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(iconBtn, "h-9 w-9")}
                aria-label="Contact us"
                aria-expanded={openMenu === "contact"}
                onClick={() => (openMenu === "contact" ? close() : open("contact"))}
              >
                <Headphones className="h-5 w-5" />
              </Button>
              <ContactDropdown open={openMenu === "contact"} onClose={close} />
            </div>

            <div
              className="relative shrink-0"
              onMouseEnter={() => open("profile")}
              onMouseLeave={scheduleClose}
            >
              <Button
                variant="ghost"
                size="default"
                className={cn(
                  iconBtn,
                  "relative h-9 gap-1 rounded-full px-1.5 hover:bg-white/15",
                )}
                aria-label={showUser ? "Account" : "Sign in"}
                aria-expanded={openMenu === "profile"}
                onClick={() => (openMenu === "profile" ? close() : open("profile"))}
              >
                {showUser ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8E6C9] text-[11px] font-bold tracking-wide text-charcoal">
                    {userInitials(user.name, user.phone)}
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center">
                    <User className="h-5 w-5" />
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 opacity-90 transition",
                    openMenu === "profile" && "rotate-180",
                  )}
                />
              </Button>
              <ProfileDropdown
                open={openMenu === "profile"}
                onClose={close}
                onLoginClick={() => setAuthOpen(true)}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtn, "h-9 w-9")}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {solid ? (
          <div className="mx-auto max-w-[1400px] px-4 pt-2 pb-1 md:hidden sm:px-6">
            <Suspense fallback={<NavbarSearchFallback />}>
              <NavbarSearch />
            </Suspense>
          </div>
        ) : null}

        {/* Mega menu only while audience links are visible (home, not scrolled) */}
        {!solid && activeMega ? (
          <div className="pointer-events-none relative z-50 flex w-full justify-center px-4 pb-2 sm:px-6 lg:px-8">
            <div
              className="pointer-events-auto w-[min(52rem,calc(100%-2rem))]"
              onMouseEnter={() => {
                clearCloseTimer();
                open(activeMega.id);
              }}
              onMouseLeave={scheduleClose}
            >
              {/* Hover bridge so pointer can move from nav → panel without closing */}
              <div className="h-2" aria-hidden />
              <AudienceMegaMenu config={activeMega} onClose={close} />
            </div>
          </div>
        ) : null}
      </header>

      {!isHome || solid ? (
        <div className="h-[8.25rem] shrink-0 md:h-[4.75rem]" aria-hidden />
      ) : null}

      {openMenu ? (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-charcoal/20"
          aria-hidden
          onMouseEnter={close}
          onClick={close}
        />
      ) : null}

      <MobileBottomNav
        menuOpen={mobileOpen}
        onMenuClick={() => setMobileOpen((v) => !v)}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLoginClick={() => {
          setMobileOpen(false);
          setAuthOpen(true);
        }}
      />

      <AuthLoginModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
