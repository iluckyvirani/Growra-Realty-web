import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getAllBlogPosts, getBlogBySlug } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { BlogCard } from "@/components/cards/blog-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

function renderContent(content: string) {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={index} />;
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={index} className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-foreground">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <li key={index} className="ml-5 list-disc text-base leading-relaxed text-muted">
          {trimmed.replace(/^-\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li key={index} className="ml-5 list-decimal text-base leading-relaxed text-muted">
          {trimmed.replace(/^\d+\.\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    return (
      <p key={index} className="mb-4 text-base leading-relaxed text-muted">
        {trimmed.replace(/\*\*(.*?)\*\*/g, "$1")}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const related = getAllBlogPosts()
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHeader
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      >
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>
        </Button>
      </PageHeader>

      <article className="container-luxury section-padding pt-10 md:pt-12">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} min read
              </span>
              <span className="text-sm text-muted">{date}</span>
            </div>

            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-lg shadow-charcoal/10">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>

            <div className="mb-10 flex items-center gap-3 border-b border-border pb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.authorAvatar} alt={post.author} />
                <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <p className="text-sm text-muted">{post.tags.join(" · ")}</p>
              </div>
            </div>

            <div className="prose-luxury">{renderContent(post.content)}</div>
          </div>
        </FadeIn>

        {related.length > 0 ? (
          <div className="mt-20 border-t border-border pt-16">
            <SectionHeading
              eyebrow="Keep reading"
              title="Related articles"
              subtitle="More perspectives aligned with this topic."
            />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item, i) => (
                <FadeIn key={item.id} delay={0.06 * i}>
                  <BlogCard post={item} />
                </FadeIn>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
