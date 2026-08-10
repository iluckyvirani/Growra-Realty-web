import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "hover-lift overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-champagne/30 shadow-lg shadow-charcoal/5",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5 md:p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-charcoal">{value}</p>
          {hint ? <p className="text-xs text-muted">{hint}</p> : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gold-gradient text-white shadow-md shadow-gold/25">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
