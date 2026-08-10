import { getAllBuilders } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { BuilderCard } from "@/components/cards/builder-card";

export function TopBuilders() {
  const builders = getAllBuilders().slice(0, 4);

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Partners"
          title="Top builders"
          subtitle="Trusted developers known for delivery excellence and landmark residences."
          cta={{ label: "All builders", href: "/builders" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {builders.map((b, i) => (
            <FadeIn key={b.id} delay={i * 0.07}>
              <BuilderCard builder={b} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
