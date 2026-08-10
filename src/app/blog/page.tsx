import type { Metadata } from "next";
import { getAllBlogPosts } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { BlogCard } from "@/components/cards/blog-card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Market guides, investment insights, and luxury living perspectives from the Growra Realty editorial desk.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Curated perspectives for discerning buyers, investors, and design-led homeowners."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="container-luxury section-padding pt-10 md:pt-12">
        <SectionHeading
          eyebrow="Insights"
          title="Stories that sharpen every decision"
          subtitle="From RERA diligence to sustainable luxury — practical writing for India’s premium property market."
        />

        {featured ? (
          <FadeIn className="mb-10">
            <BlogCard post={featured} featured />
          </FadeIn>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((post, i) => (
            <FadeIn key={post.id} delay={0.06 * i}>
              <BlogCard post={post} />
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
