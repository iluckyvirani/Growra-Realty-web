import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[8px] border border-border bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold text-charcoal">{testimonial.name}</p>
          <p className="text-sm text-muted">
            {testimonial.role}, {testimonial.location}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-charcoal/85 sm:text-[15px]">
        {testimonial.content}
      </p>
    </article>
  );
}
