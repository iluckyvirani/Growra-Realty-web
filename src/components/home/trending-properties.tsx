import { getTrendingProperties } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { PropertyCard } from "@/components/cards/property-card";

export async function TrendingProperties() {
  const properties = await getTrendingProperties();

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Most viewed"
          title="Trending properties"
          subtitle="Homes capturing attention from discerning buyers this week."
          cta={{ label: "Browse all", href: "/buy" }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.05}>
              <PropertyCard property={p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
