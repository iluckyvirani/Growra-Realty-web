import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { ShortCard } from "@/components/shorts/short-card";
import type { PropertyShort } from "@/services/shorts-service";

export function PropertyShortsSection({ shorts }: { shorts: PropertyShort[] }) {
  if (!shorts.length) return null;

  return (
    <section className="section-padding bg-cream/40">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Watch & explore"
          title="Property Shorts"
          subtitle="Quick vertical tours — tap a short, then open the full property details."
          cta={{ label: "View all", href: "/shorts" }}
        />

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
          {shorts.slice(0, 8).map((short, i) => (
            <FadeIn key={short.id} delay={i * 0.04}>
              <ShortCard short={short} compact />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
