import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("section-padding border-b border-border bg-cream/80 dark:bg-ink/40", className)}>
      <div className="container-luxury">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-gold">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  {item.href ? (
                    <Link href={item.href} className="transition-colors hover:text-gold">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="text-base leading-relaxed text-muted md:text-lg">{description}</p>
            ) : null}
          </div>
          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
