"use client";

import Link from "next/link";
import { ChevronRight, Headphones, Phone } from "lucide-react";
import { FOOTER_CONTACT } from "@/constants";
import { cn } from "@/lib/utils";

interface ContactDropdownProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function ContactDropdown({ open, onClose, className }: ContactDropdownProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        // Right-align under the headset icon; keep compact like 99acres
        "absolute top-full right-0 z-50 w-[16.5rem] pt-2 sm:w-[17rem]",
        className,
      )}
      role="menu"
      aria-label="Contact us"
    >
      {/* Hover bridge — only as wide as the panel, not the full header */}
      <div className="absolute inset-x-0 top-0 h-2" aria-hidden />

      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_12px_32px_-10px_rgba(27,27,27,0.35)]">
        {/* Accent sits under the support icon (right side) */}
        <div className="flex justify-end px-4">
          <span className="h-0.5 w-8 rounded-b-full bg-gold" aria-hidden />
        </div>

        <div className="px-3.5 pt-2.5 pb-3.5">
          <p className="text-[11px] font-bold tracking-[0.08em] text-charcoal uppercase">
            Contact Us
          </p>

          <div className="mt-3 space-y-1">
            <a
              href={`tel:${FOOTER_CONTACT.tollFree}`}
              className="flex gap-2.5 rounded-md px-1.5 py-2 transition hover:bg-champagne/40"
              onClick={onClose}
            >
              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-rich" />
              <div className="min-w-0">
                <p className="text-[10px] leading-snug text-muted">
                  Toll Free | 9:30 AM to 6:30 PM (Mon-Sun)
                </p>
                <p className="mt-0.5 text-[15px] font-bold leading-tight text-charcoal">
                  {FOOTER_CONTACT.tollFree}
                </p>
              </div>
            </a>

            <a
              href="tel:+911206637501"
              className="flex items-center gap-2.5 rounded-md px-1.5 py-2 transition hover:bg-champagne/40"
              onClick={onClose}
            >
              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-rich" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] leading-snug text-muted">For International Users</p>
                <p className="mt-0.5 text-[15px] font-bold leading-tight text-charcoal">
                  +91-120-6637501
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />
            </a>
          </div>

          <Link
            href="/contact"
            onClick={onClose}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-gold/50 px-3 py-2 text-[12px] font-semibold text-gold-rich transition hover:bg-champagne/50"
          >
            <Headphones className="h-3.5 w-3.5" />
            Request a Call Back
          </Link>

          <p className="mt-3 text-center text-[11px] text-muted">
            To check all the FAQ{" "}
            <Link
              href="/#faq"
              onClick={onClose}
              className="font-medium text-gold-rich hover:underline"
            >
              click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
