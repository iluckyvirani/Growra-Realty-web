import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";

const INVEST_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80";

const POINTS = [
  {
    icon: TrendingUp,
    title: "Yield-focused picks",
    text: "Properties screened for rental demand and long-term appreciation.",
  },
  {
    icon: ShieldCheck,
    title: "Verified developers",
    text: "RERA-backed projects with transparent timelines and documentation.",
  },
  {
    icon: LineChart,
    title: "Market intelligence",
    text: "City-level price trends and micro-location insights for smarter bets.",
  },
];

export function InvestmentSection() {
  return (
    <section className="section-padding bg-champagne/20 dark:bg-ink/40">
      <div className="container-luxury">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={INVEST_IMAGE}
                alt="Modern skyline investment opportunity"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
            </div>
          </FadeIn>

          <div>
            <SectionHeading
              eyebrow="Invest"
              title="Build wealth with confidence"
              subtitle="From first-time investors to portfolio diversifiers — grow with curated opportunities."
              className="mb-8"
            />

            <ul className="space-y-5">
              {POINTS.map((point, i) => (
                <FadeIn key={point.title} delay={0.1 + i * 0.08}>
                  <li className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-champagne text-gold-rich">
                      <point.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{point.title}</h3>
                      <p className="mt-1 text-sm text-muted">{point.text}</p>
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/projects">
                  Explore investment options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
