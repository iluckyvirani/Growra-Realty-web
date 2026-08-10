"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getAllBlogPosts } from "@/services/property-service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TABS = ["News", "Tax & Legal", "Help Guides", "Investment"] as const;

const RENT_NEWS = [
  {
    id: "r1",
    title: "Emerald Court asks bachelor tenants to vacate premises",
    date: "Dec 07, 2022",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80",
    slug: "guide-to-buying-luxury-home-2026",
  },
  {
    id: "r2",
    title: "New GST rule on house rent explained for tenants",
    date: "Sep 21, 2022",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&q=80",
    slug: "home-loan-emi-strategies",
  },
  {
    id: "r3",
    title: "Rental units to get UID number in Ludhiana soon",
    date: "Nov 25, 2022",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80",
    slug: "top-investment-localities-india",
  },
  {
    id: "r4",
    title: "Noida: New e-rent agreement portal goes live",
    date: "Sep 19, 2022",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    slug: "sustainable-luxury-homes",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RentHomesSection() {
  const posts = getAllBlogPosts();
  const [tab, setTab] = useState<(typeof TABS)[number]>("News");
  const [page, setPage] = useState(0);

  const filtered = posts.filter((p) => {
    const hay = `${p.category} ${p.tags.join(" ")}`.toLowerCase();
    if (tab === "News") return true;
    if (tab === "Tax & Legal") return hay.includes("finance") || hay.includes("loan");
    if (tab === "Help Guides") return hay.includes("guide");
    if (tab === "Investment") return hay.includes("invest") || hay.includes("market");
    return true;
  });

  const blogArticles =
    tab === "News"
      ? RENT_NEWS
      : (filtered.length ? filtered : posts).slice(0, 4).map((p) => ({
          id: p.id,
          title: p.title,
          date: formatDate(p.publishedAt),
          image: p.coverImage,
          slug: p.slug,
        }));

  const pages = Math.max(1, Math.ceil(blogArticles.length / 4));
  const visible = blogArticles.slice(page * 4, page * 4 + 4);

  return (
    <section className="bg-cream/50 pb-12 pt-4 sm:pb-16 sm:pt-6">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-border/60 sm:aspect-[16/11]">
            <Image
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
              alt="Cozy rental living room with armchair"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:pl-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
              Rent a home
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Rental Homes for Everyone
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Explore from apartments, builder floors, villas and more — verified listings with
              transparent monthly pricing.
            </p>
            <Button asChild className="mt-6 rounded-lg px-6 text-white gold-gradient">
              <Link href="/rent">Explore Renting</Link>
            </Button>
          </div>
        </div>

        <div className="relative z-10 -mt-8 rounded-2xl border border-border bg-white p-4 shadow-xl shadow-charcoal/10 sm:-mt-12 sm:p-5 lg:ml-[8%] lg:w-[92%]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <div className="shrink-0 lg:w-52 xl:w-60">
              <h4 className="text-base font-bold leading-snug text-charcoal sm:text-lg">
                Best Renting Advice by Our Top Editors
              </h4>
              <p className="mt-1.5 text-xs text-muted sm:text-sm">
                Read from Beginners check-list to Pro Tips
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex gap-4 overflow-x-auto border-b border-border">
                {TABS.map((t) => {
                  const active = tab === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTab(t);
                        setPage(0);
                      }}
                      className={cn(
                        "relative shrink-0 pb-2.5 text-sm font-medium transition-colors",
                        active ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal",
                      )}
                    >
                      {t}
                      {active ? (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-gold" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {visible.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="group flex gap-3 rounded-lg p-1 transition hover:bg-champagne/30"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-cream sm:h-16 sm:w-24">
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-charcoal group-hover:text-gold-rich">
                          {article.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">{article.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {pages > 1 && page < pages - 1 ? (
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(p + 1, pages - 1))}
                    aria-label="More articles"
                    className="absolute top-1/2 -right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md hover:border-gold/40 hover:text-gold-rich sm:right-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <Link
                href="/blog"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-rich hover:underline"
              >
                Read realty news, guides &amp; articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
