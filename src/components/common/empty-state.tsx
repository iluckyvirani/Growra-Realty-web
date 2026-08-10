import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center dark:bg-card/40",
        className,
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-champagne/50 text-gold">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-6">
          {action.href ? (
            <Button asChild className="rounded-2xl gold-gradient border-0 text-white">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              className="rounded-2xl gold-gradient border-0 text-white"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
