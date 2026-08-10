"use client";

import Link from "next/link";
import { useAuthStore } from "@/store";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  className?: string;
}

const ACTIVITY = [
  { label: "Recently Searched", href: "/dashboard" },
  { label: "Recently Viewed", href: "/dashboard" },
  { label: "Shortlisted", href: "/wishlist" },
  { label: "Contacted", href: "/dashboard" },
] as const;

export function ProfileDropdown({
  open,
  onClose,
  onLoginClick,
  className,
}: ProfileDropdownProps) {
  const mounted = useMounted();
  const { isAuthenticated, user, logout } = useAuthStore();
  const showUser = mounted && isAuthenticated && user;

  if (!open) return null;

  return (
    <div
      className={cn(
        // Right-align under the profile icon; compact like 99acres
        "absolute top-full right-0 z-50 w-[14.5rem] pt-2 sm:w-[15rem]",
        className,
      )}
      role="menu"
      aria-label="Account menu"
    >
      <div className="absolute inset-x-0 top-0 h-2" aria-hidden />

      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_12px_32px_-10px_rgba(27,27,27,0.35)]">
        {/* Accent under profile icon (right) */}
        <div className="flex justify-end px-3">
          <span className="h-0.5 w-8 rounded-b-full bg-gold" aria-hidden />
        </div>

        {!showUser ? (
          <div className="pb-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLoginClick?.();
              }}
              className="block w-full px-3.5 py-2.5 text-left text-[13px] font-bold tracking-wide text-gold-rich uppercase hover:bg-champagne/40"
            >
              Login / Register
            </button>

            <div className="px-3.5 pb-1.5">
              <p className="text-[13px] font-semibold text-charcoal">My Activity</p>
              <ul className="mt-0.5">
                {ACTIVITY.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 pl-2.5 text-[13px] text-charcoal/80 transition hover:text-gold-rich"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-1.5 py-1">
              <Link
                href="/postproperty"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-md px-2 py-2 text-[13px] font-medium text-charcoal hover:bg-champagne/40"
              >
                Post Property
                <span className="rounded bg-success px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  Free
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="pb-1.5">
            <div className="px-3.5 py-2.5">
              <p className="truncate text-[13px] font-bold text-charcoal">{user.name}</p>
            </div>
            <div className="px-3.5 pb-1.5">
              <p className="text-[13px] font-semibold text-charcoal">My Activity</p>
              <ul className="mt-0.5">
                {ACTIVITY.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 pl-2.5 text-[13px] text-charcoal/80 transition hover:text-gold-rich"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border px-1.5 py-1">
              <Link
                href="/profile"
                onClick={onClose}
                className="block rounded-md px-2 py-2 text-[13px] text-charcoal hover:bg-champagne/40"
              >
                Modify Profile
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="block rounded-md px-2 py-2 text-[13px] text-charcoal hover:bg-champagne/40"
              >
                Change Password
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full rounded-md px-2 py-2 text-left text-[13px] text-charcoal hover:bg-champagne/40"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
