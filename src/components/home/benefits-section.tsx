import { Building2, ShieldCheck, Users } from "lucide-react";
import { SITE_NAME } from "@/constants";

const BENEFITS = [
  {
    number: "01",
    title: "Over 12 Lac properties",
    description: "10,000+ properties are added every day",
    icon: Building2,
  },
  {
    number: "02",
    title: `Verification by ${SITE_NAME} team`,
    description: "Photos, videos and other details are verified on location",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Large user base",
    description: "High active user count and user engagement to find and close deals",
    icon: Users,
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="bg-cream/40 py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
            Benefits of {SITE_NAME}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
            Why choose {SITE_NAME.split(" ")[0]}
          </h2>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-12 md:grid-cols-3 md:gap-8">
          {BENEFITS.map((benefit) => (
            <article key={benefit.number} className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border/60">
                <benefit.icon className="h-8 w-8 text-gold-rich" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-charcoal sm:text-xl">
                <span className="text-gold-rich">{benefit.number}.</span> {benefit.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted sm:text-base">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
