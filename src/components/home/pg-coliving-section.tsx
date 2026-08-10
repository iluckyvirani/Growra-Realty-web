"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PG_ARTICLES = [
  {
    id: "pg1",
    title: "PG vs independent home: Which is better for students?",
    date: "Feb 27, 2025",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=80",
    slug: "guide-to-buying-luxury-home-2026",
  },
  {
    id: "pg2",
    title: "Where to find a PG under ₹10,000 in metro cities?",
    date: "May 01, 2023",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=80",
    slug: "top-investment-localities-india",
  },
  {
    id: "pg3",
    title: "How to convert your home into a PG legally",
    date: "Mar 14, 2024",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80",
    slug: "home-loan-emi-strategies",
  },
  {
    id: "pg4",
    title: "Top areas to rent a PG in Noida for professionals",
    date: "Jan 08, 2025",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80",
    slug: "sustainable-luxury-homes",
  },
];

export function PgColivingSection() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(PG_ARTICLES.length / 4);
  const visible = PG_ARTICLES.slice(page * 4, page * 4 + 4);

  return (
    <section className="bg-cream/50 pb-12 pt-4 sm:pb-16 sm:pt-6">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-border/60 sm:aspect-[16/11]">
            <Image
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80"
              alt="Modern PG co-living bedroom"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:pl-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
              Rent a PG / Co-living
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Paying Guest or Co-living options
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Explore shared and private rooms in all top cities of India — flexible stays for
              students and professionals.
            </p>
            <Button asChild className="mt-6 rounded-lg px-6 text-white gold-gradient">
              <Link href="/pg">Explore PG / Co-living</Link>
            </Button>
          </div>
        </div>

        <div className="relative z-10 -mt-8 rounded-2xl border border-border bg-white p-4 shadow-xl shadow-charcoal/10 sm:-mt-12 sm:p-5 lg:ml-[8%] lg:w-[92%]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <div className="shrink-0 lg:w-52 xl:w-60">
              <h4 className="text-base font-bold leading-snug text-charcoal sm:text-lg">
                Best articles on PG / Co-living
              </h4>
              <p className="mt-1.5 text-xs text-muted sm:text-sm">
                Read from beginners checklist to pro-tips
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <div className="relative">
                <div className="grid gap-4 sm:grid-cols-2">
                  {visible.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="group flex gap-3 rounded-lg p-1 transition hover:bg-champagne/30"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-cream">
                        <Image src={article.image} alt="" fill sizes="96px" className="object-cover" />
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

                {page < pages - 1 ? (
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
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
