import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  featured?: boolean;
}

export function BlogCard({ post, className, featured = false }: BlogCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group hover-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-charcoal/5",
        featured && "md:flex-row",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[16/10] md:aspect-auto md:w-1/2 md:min-h-[280px]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "md:justify-center md:p-8")}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" />
            {post.readTime} min read
          </span>
        </div>

        <h3
          className={cn(
            "font-semibold text-foreground transition group-hover:text-gold",
            featured ? "text-2xl" : "line-clamp-2 text-lg",
          )}
        >
          {post.title}
        </h3>

        <p className={cn("text-sm text-muted", featured ? "line-clamp-3" : "line-clamp-2")}>
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{post.author}</p>
            <p className="text-xs text-muted">{date}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
