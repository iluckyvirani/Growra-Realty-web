import { BUDGET_RANGES } from "@/constants";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { BudgetCard } from "@/components/cards/budget-card";

export function BudgetSection() {
  return (
    <section className="section-padding bg-champagne/20 dark:bg-ink/40">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Affordability"
          title="Homes by budget"
          subtitle="Start with a price band that fits — refine as you explore."
          align="center"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUDGET_RANGES.map((range, i) => (
            <FadeIn key={range.label} delay={i * 0.05}>
              <BudgetCard
                label={range.label}
                min={range.min}
                max={range.max}
                index={i}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
