import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLuxuryProperties } from "@/services/property-service";
import { formatPrice } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function LuxuryCollection() {
  const luxury = (await getLuxuryProperties()).slice(0, 4);
  const [hero, ...rest] = luxury;

  if (!hero) return null;

  return (
    <section className="section-padding bg-charcoal text-white">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Exclusive"
          title="Luxury collection"
          subtitle="Exceptional residences defined by architecture, privacy, and timeless craft."
          cta={{ label: "View collection", href: "/luxury" }}
          className="[&_h2]:text-white [&_p]:text-white/70"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <FadeIn>
            <Link
              href={`/property/${hero.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]"
            >
              <Image
                src={hero.images[0]}
                alt={hero.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <Badge variant="gold" className="mb-3">
                  Signature
                </Badge>
                <h3 className="text-2xl font-semibold md:text-3xl">{hero.title}</h3>
                <p className="mt-1 text-white/70">
                  {hero.locality}, {hero.city}
                </p>
                <p className="mt-3 text-xl font-semibold text-gold-light">
                  {formatPrice(hero.price)}
                </p>
              </div>
            </Link>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((p, i) => (
              <FadeIn key={p.id} delay={0.1 + i * 0.08}>
                <Link
                  href={`/property/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-white/70">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/luxury">
              Explore luxury homes
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
