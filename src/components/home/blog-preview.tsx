import { getAllBlogPosts } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { BlogCard } from "@/components/cards/blog-card";

export function BlogPreview() {
  const posts = getAllBlogPosts().slice(0, 3);
  const [featured, ...rest] = posts;

  if (!featured) return null;

  return (
    <section className="section-padding bg-champagne/20 dark:bg-ink/40">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Insights"
          title="From the journal"
          subtitle="Guides, market perspectives, and design inspiration for thoughtful buyers."
          cta={{ label: "All articles", href: "/blog" }}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <BlogCard post={featured} featured />
          </FadeIn>
          <div className="grid gap-6">
            {rest.map((post, i) => (
              <FadeIn key={post.id} delay={0.1 + i * 0.08}>
                <BlogCard post={post} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
