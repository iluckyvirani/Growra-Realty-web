"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Lightbulb } from "lucide-react";
import {
  MEGA_INSIGHTS_FEATURES,
  type MegaMenuConfig,
  type MegaPanel,
} from "@/constants/mega-menu";
import { FOOTER_CONTACT } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function InsightsPromo({ onClose }: { onClose: () => void }) {
  return (
    <Link
      href="/blog"
      onClick={onClose}
      className="group relative flex flex-col rounded-xl bg-champagne/50 p-5 transition hover:bg-champagne/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-white">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-gold-rich uppercase">
              Introducing
            </p>
            <p className="text-lg font-bold text-charcoal">Insights</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gold-rich opacity-70 transition group-hover:opacity-100" />
      </div>
      <ul className="mt-4 space-y-2.5">
        {MEGA_INSIGHTS_FEATURES.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-charcoal/80">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Link>
  );
}

function PostPropertyPromo({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-champagne/80 via-cream to-champagne/40 p-5">
      <p className="max-w-[11rem] text-base font-bold leading-snug text-charcoal">
        Sell or rent faster at the right price!
      </p>
      <p className="mt-1.5 text-sm text-muted">List your property now for FREE</p>
      <Button asChild className="mt-4 rounded-md px-4 text-white gold-gradient">
        <Link href="/postproperty" onClick={onClose}>
          Post Property
        </Link>
      </Button>
      <div className="pointer-events-none absolute -right-2 bottom-0 h-28 w-24 overflow-hidden rounded-tl-xl">
        <Image
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&q=80"
          alt=""
          width={96}
          height={112}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

function PanelLinks({
  panel,
  onClose,
}: {
  panel: MegaPanel;
  onClose: () => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        {panel.heading}
      </p>
      <ul className="mt-4 space-y-3">
        {panel.links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              onClick={onClose}
              className={cn(
                "inline-flex items-center gap-2 text-sm text-charcoal transition hover:text-gold-rich",
                link.bold && "font-semibold",
              )}
            >
              {link.label}
              {link.badge === "FREE" ? (
                <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  Free
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {panel.footerLink ? (
        <Link
          href={panel.footerLink.href}
          onClick={onClose}
          className="mt-5 inline-block text-sm font-medium text-gold-rich hover:underline"
        >
          {panel.footerLink.label}
        </Link>
      ) : null}
    </div>
  );
}

interface AudienceMegaMenuProps {
  config: MegaMenuConfig;
  onClose: () => void;
}

export function AudienceMegaMenu({ config, onClose }: AudienceMegaMenuProps) {
  const [active, setActive] = useState(config.defaultPanel);

  useEffect(() => {
    setActive(config.defaultPanel);
  }, [config.defaultPanel, config.id]);

  const panel = config.panels[active] ?? config.panels[config.defaultPanel];

  return (
    <div
      className="w-full"
      role="menu"
      aria-label={`${config.label} menu`}
    >
      <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_24px_60px_-16px_rgba(27,27,27,0.35)]">
        <div className="flex min-h-[280px]">
          {/* Sidebar */}
          <aside className="flex w-[11.5rem] shrink-0 flex-col border-r border-border bg-cream/80 sm:w-[13rem]">
            <nav className="flex-1 space-y-0.5 p-3 sm:p-4">
              {config.sidebar.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActive(item.id)}
                    onClick={() => setActive(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-[12px] font-semibold tracking-wide uppercase transition",
                      isActive
                        ? "bg-white text-charcoal shadow-sm"
                        : "text-charcoal/65 hover:bg-white/70 hover:text-charcoal",
                    )}
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="rounded-sm bg-gold px-1 py-px text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            {config.sidebarFooter === "contact" ? (
              <div className="border-t border-border/60 p-4 text-[11px] leading-relaxed text-muted">
                contact us toll free on
                <br />
                <a
                  href={`tel:${FOOTER_CONTACT.tollFree}`}
                  className="font-semibold text-charcoal hover:text-gold-rich"
                >
                  {FOOTER_CONTACT.tollFree}
                </a>{" "}
                <span className="text-muted">(9AM-11PM IST)</span>
              </div>
            ) : null}

            {config.sidebarFooter === "builder" ? (
              <div className="border-t border-border/60 p-4 text-[11px] text-muted">
                Are you a builder?{" "}
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="font-semibold text-gold-rich hover:underline"
                >
                  click here
                </Link>
              </div>
            ) : null}
          </aside>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-1 gap-6 p-5 sm:gap-8 sm:p-6">
              <PanelLinks panel={panel} onClose={onClose} />
              {config.promo === "insights" ? <div className="hidden w-[15rem] shrink-0 lg:block"><InsightsPromo onClose={onClose} /></div> : null}
              {config.promo === "post-property" ? (
                <div className="hidden w-[15rem] shrink-0 lg:block">
                  <PostPropertyPromo onClose={onClose} />
                </div>
              ) : null}
            </div>

            <div className="border-t border-border px-5 py-3 text-[11px] text-muted sm:px-6">
              Email us at{" "}
              <a href={`mailto:${FOOTER_CONTACT.email}`} className="hover:text-gold-rich">
                {FOOTER_CONTACT.email}
              </a>
              , or call us at {FOOTER_CONTACT.tollFree} (IND Toll-Free)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
