"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";

const APP_IMAGE =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80";

export function AppCta() {
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-charcoal text-white shadow-xl">
          <div className="absolute inset-0 opacity-30">
            <Image
              src={APP_IMAGE}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />

          <div className="relative grid items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16 lg:px-16">
            <FadeIn>
              <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-light uppercase">
                Mobile experience
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Growra Realty in your pocket
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                Shortlist, compare, and schedule visits on the go. Get alerts when new verified
                listings match your search.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="rounded-2xl"
                  onClick={() => {}}
                >
                  <Smartphone className="h-4 w-4" />
                  App Store
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/30 text-white hover:bg-white/10"
                  onClick={() => {}}
                >
                  Google Play
                </Button>
              </div>
            </FadeIn>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[9/16] w-48 overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl md:w-56"
            >
              <Image
                src={APP_IMAGE}
                alt="Growra Realty mobile app preview"
                fill
                sizes="224px"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
