"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeroSearch } from "@/components/search/hero-search";

const HERO_IMAGE = "/banner.png";

export function HeroSection() {
  return (
    <section className="relative bg-white md:bg-cream">
      {/* Banner image from /public/banner.png */}
      <div className="relative min-h-[200px] overflow-hidden pt-14 sm:min-h-[260px] sm:pt-16 md:min-h-[360px] md:pt-16 lg:min-h-[400px]">
        <Image
          src={HERO_IMAGE}
          alt="Growra Realty featured banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-charcoal/15" />
      </div>

      {/* Floating search overlapping banner */}
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
