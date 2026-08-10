import { getPropertiesByListingType } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { ProjectCard } from "@/components/cards/project-card";

export async function FeaturedProjects() {
  const projects = (await getPropertiesByListingType("projects")).slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Developments"
          title="Featured projects"
          subtitle="New launches and under-construction residences from India's trusted builders."
          cta={{ label: "All projects", href: "/projects" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.07}>
              <ProjectCard property={p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
