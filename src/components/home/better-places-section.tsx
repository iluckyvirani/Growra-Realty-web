"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getAllBlogPosts } from "@/services/property-service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TABS = ["News", "Tax & Legal", "Help Guides", "Investment"] as const;
const PAGE_SIZE = 4;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BetterPlacesSection() {
  const posts = getAllBlogPosts();
  const [tab, setTab] = useState<(typeof TABS)[number]>("News");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = posts.filter((p) => {
      const hay = `${p.category} ${p.tags.join(" ")}`.toLowerCase();
      if (tab === "News") return true;
      if (tab === "Tax & Legal") return hay.includes("finance") || hay.includes("loan");
      if (tab === "Help Guides") return hay.includes("guide") || hay.includes("buying");
      if (tab === "Investment") return hay.includes("invest") || hay.includes("market");
      return true;
    });
    return list.length ? list : posts;
  }, [posts, tab]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const articles = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const onTab = (t: (typeof TABS)[number]) => {
    setTab(t);
    setPage(0);
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
          All property needs — one portal
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-2xl font-bold tracking-tight text-charcoal sm:text-3xl md:text-4xl">
          Find Better Places to Live, Work and Wonder…
        </h2>

        {/* Buy featured block */}
        <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-border/60 sm:aspect-[16/11]">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
              alt="Bright modern living room"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:pl-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
              Buy a home
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Find, Buy &amp; Own Your Dream Home
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Explore from apartments, land, builder floors, villas and more — curated for Growra
              seekers.
            </p>
            <Button asChild className="mt-6 rounded-lg px-6 text-white gold-gradient">
              <Link href="/buy">Explore Buying</Link>
            </Button>
          </div>
        </div>

        {/* Articles card — match Rent section design */}
        <div className="relative z-10 -mt-8 rounded-2xl border border-border bg-white p-4 shadow-xl shadow-charcoal/10 sm:-mt-12 sm:p-5 lg:ml-[8%] lg:w-[92%]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <div className="shrink-0 lg:w-52 xl:w-60">
              <h4 className="text-base font-bold leading-snug text-charcoal sm:text-lg">
                Top articles on home buying
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
                      onClick={() => onTab(t)}
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
                  {articles.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-3 rounded-lg p-1 transition hover:bg-champagne/30"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-cream sm:h-16 sm:w-24">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-charcoal group-hover:text-gold-rich">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">{formatDate(post.publishedAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {pages > 1 && page < pages - 1 ? (
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                    aria-label="More articles"
                    className="absolute top-1/2 -right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md hover:border-gold/40 hover:text-gold-rich sm:right-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : page > 0 ? (
                  <button
                    type="button"
                    onClick={() => setPage(0)}
                    aria-label="Back to first articles"
                    className="absolute top-1/2 -right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-md hover:border-gold/40 hover:text-gold-rich sm:right-0"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
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
