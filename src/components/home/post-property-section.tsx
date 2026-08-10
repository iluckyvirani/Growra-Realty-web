"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OWNER_ARTICLES = [
  {
    id: "o1",
    title: "Impact of Jewar Airport on real estate prices",
    date: "Jul 09, 2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    slug: "top-investment-localities-india",
  },
  {
    id: "o2",
    title: "Noida's Floor-wise registration policy explained",
    date: "Jun 09, 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&q=80",
    slug: "home-loan-emi-strategies",
  },
  {
    id: "o3",
    title: "Noida Sports City projects update for owners",
    date: "Jul 08, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    slug: "guide-to-buying-luxury-home-2026",
  },
  {
    id: "o4",
    title: "Cost of construction in India: 2026 guide",
    date: "Jun 04, 2026",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80",
    slug: "sustainable-luxury-homes",
  },
];

export function PostPropertySection() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(OWNER_ARTICLES.length / 4);
  const visible = OWNER_ARTICLES.slice(page * 4, page * 4 + 4);

  return (
    <section className="bg-white pb-12 pt-4 sm:pb-16 sm:pt-6">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative flex items-end justify-center overflow-hidden rounded-2xl bg-champagne/60 p-6 sm:aspect-[16/11] sm:p-8">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
              alt="Property owner listing on mobile"
              width={400}
              height={480}
              className="relative z-10 h-auto max-h-[320px] w-auto rounded-xl object-cover shadow-lg"
            />
          </div>

          <div className="lg:pl-4">
            <h3 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Sell or rent faster at the right price!
            </h3>
            <p className="mt-2 text-sm text-muted sm:text-base">List your property now</p>
            <Button asChild className="mt-6 rounded-lg px-6 py-6 text-base font-semibold text-white gold-gradient">
              <Link href="/auth/signup?intent=portal">
                Post Property, It&apos;s{" "}
                <span className="ml-1 rounded bg-success px-2 py-0.5 text-xs font-bold uppercase">
                  Free
                </span>
              </Link>
            </Button>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-gold-rich"
            >
              Post via
              <span className="inline-flex items-center gap-1 text-[#25D366]">
                <MessageCircle className="h-4 w-4 fill-[#25D366] text-white" />
                Whatsapp
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 -mt-8 rounded-2xl border border-border bg-white p-4 shadow-xl shadow-charcoal/10 sm:-mt-12 sm:p-5 lg:ml-[8%] lg:w-[92%]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <div className="shrink-0 lg:w-52 xl:w-60">
              <h4 className="text-base font-bold leading-snug text-charcoal sm:text-lg">
                Articles and guides for property owners
              </h4>
              <p className="mt-1.5 text-xs text-muted sm:text-sm">
                Read from Beginners check-list to Pro Tips
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
