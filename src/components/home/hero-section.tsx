"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSearch } from "@/components/search/hero-search";

const FALLBACK_IMAGE = "/banner.png";

export type HeroBannerData = {
  title?: string;
  note?: string;
  linkUrl?: string;
  imageUrl?: string;
} | null;

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

export function HeroSection({ banner }: { banner?: HeroBannerData }) {
  const imageUrl = banner?.imageUrl?.trim() || FALLBACK_IMAGE;
  const title = banner?.title?.trim() || "";
  const note = banner?.note?.trim() || "";
  const linkUrl = banner?.linkUrl?.trim() || "";
  const isRemote = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  const media = (
    <>
      <Image
        src={imageUrl}
        alt={title || "Growra Realty featured banner"}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        unoptimized={isRemote}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-charcoal/15" />
      {title || note ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-10 sm:px-8 sm:pb-14 md:pb-16">
          <div className="mx-auto max-w-[1100px]">
            {title ? (
              <p className="text-xl font-semibold tracking-tight text-white drop-shadow sm:text-2xl md:text-3xl">
                {title}
              </p>
            ) : null}
            {note ? (
              <p className="mt-1 max-w-2xl text-sm text-white/90 drop-shadow sm:text-base">{note}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );

  return (
    <section className="relative bg-white md:bg-cream">
      <div className="relative min-h-[200px] overflow-hidden pt-14 sm:min-h-[260px] sm:pt-16 md:min-h-[360px] md:pt-16 lg:min-h-[400px]">
        {linkUrl ? (
          isExternalLink(linkUrl) ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 block"
              aria-label={title || "Open banner link"}
            >
              {media}
            </a>
          ) : (
            <Link href={linkUrl} className="absolute inset-0 block" aria-label={title || "Open banner link"}>
              {media}
            </Link>
          )
        ) : (
          <div className="absolute inset-0">{media}</div>
        )}
      </div>

      <div className="relative z-20 mx-auto -mt-8 max-w-[1100px] px-3 pb-2 sm:-mt-10 sm:px-6 md:-mt-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HeroSearch />
        </motion.div>
      </div>
    </section>
  );
}
