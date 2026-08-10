import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Building2, Compass, HeartHandshake, Scale, ShieldCheck, Users } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the Growra Realty story — curated luxury real estate, trusted advisors, and RERA-first transparency across India’s finest cities.",
};

const VALUES = [
  {
    icon: Compass,
    title: "Curated, never crowded",
    description:
      "We publish fewer listings with deeper diligence — so every home on Growra earns its place.",
  },
  {
    icon: ShieldCheck,
    title: "Verified by default",
    description:
      "Document checks, RERA alignment, and on-ground validation before a listing earns our badge.",
  },
  {
    icon: HeartHandshake,
    title: "Concierge care",
    description:
      "From first shortlist to keys in hand, our advisors stay present without pressure.",
  },
  {
    icon: Scale,
    title: "Transparent counsel",
    description:
      "Clear pricing context, realistic timelines, and honest trade-offs — never glossy half-truths.",
  },
];

const TEAM = [
  {
    name: "Aarav Deshmukh",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    name: "Ishita Banerjee",
    role: "Head of Advisory",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    name: "Kabir Menon",
    role: "Director, Markets",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
  {
    name: "Sara Almeida",
    role: "Head of Experience",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
  },
];

const STATS = [
  { label: "Cities covered", value: "6+" },
  { label: "Verified listings", value: "2,400+" },
  { label: "Families advised", value: "12k+" },
  { label: "Avg. response time", value: "< 2 hrs" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Growra Realty"
        description="We exist to make extraordinary living feel considered, calm, and confidently chosen."
        breadcrumbs={[{ label: "About" }]}
      />

      <section className="container-luxury section-padding pt-10 md:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <SectionHeading
              eyebrow="Our story"
              title="Built for people who refuse to settle"
              subtitle="Growra Realty began with a simple frustration: premium property platforms were either too noisy or too opaque. We set out to craft a quieter alternative — one that treats buying, renting, and investing as life decisions, not transactions."
              className="mb-6"
            />
            <div className="space-y-4 text-base leading-relaxed text-muted">
              <p>
                Today, Growra connects discerning seekers with landmark residences, thoughtfully planned
                communities, and investment-grade assets across Mumbai, Delhi NCR, Bengaluru, Hyderabad,
                Pune, and Chennai.
              </p>
              <p>
                Our advisors combine local intuition with rigorous verification — so you spend less time
                filtering noise and more time falling in love with the right home.
              </p>
            </div>
            <Button asChild className="mt-8">
              <Link href="/contact">Talk to an advisor</Link>
            </Button>
          </FadeIn>

          <FadeIn delay={0.1} direction="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-xl shadow-charcoal/10 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                alt="Luxury interior representing Growra Realty"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-border bg-champagne/25 dark:bg-ink/40">
        <div className="container-luxury section-padding">
          <SectionHeading
            align="center"
            eyebrow="By the numbers"
            title="Trust measured in outcomes"
            subtitle="A snapshot of the Growra community and the care behind every introduction."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.05 * i}>
                <Card className="border-border/80 bg-card/90 text-center shadow-md shadow-charcoal/5">
                  <CardContent className="p-6">
                    <p className="text-3xl font-semibold tracking-tight text-charcoal">{stat.value}</p>
                    <p className="mt-2 text-sm text-muted">{stat.label}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxury section-padding">
        <SectionHeading
          eyebrow="Values"
          title="What we refuse to compromise"
          subtitle="Four principles that shape how we list, advise, and support."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {VALUES.map((value, i) => (
            <FadeIn key={value.title} delay={0.06 * i}>
              <Card className="h-full border-border/80 bg-gradient-to-br from-card to-champagne/20 shadow-lg shadow-charcoal/5">
                <CardContent className="flex gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gold-gradient text-white shadow-md shadow-gold/25">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-cream/60 dark:bg-ink/30">
        <div className="container-luxury section-padding">
          <SectionHeading
            eyebrow="Team"
            title="People behind the platform"
            subtitle="Placeholders for the advisors and operators shaping Growra’s next chapter."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={0.06 * i}>
                <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-charcoal/5">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted">{member.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="careers" className="scroll-mt-24 container-luxury section-padding">
        <FadeIn>
          <Card className="overflow-hidden border-border/80 bg-gradient-to-r from-charcoal to-ink text-champagne shadow-xl">
            <CardContent className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                  <Users className="h-4 w-4" />
                  Careers
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                  Build the future of considered real estate
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-champagne/70">
                  We hire advisors, product thinkers, and city specialists who care about craft. Remote-friendly
                  roles with Mumbai and Bengaluru hubs.
                </p>
              </div>
              <Button asChild variant="secondary" className="bg-white text-charcoal hover:bg-champagne">
                <Link href="/contact">Share your résumé</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      <section id="rera" className="scroll-mt-24 border-t border-border bg-champagne/20 dark:bg-ink/40">
        <div className="container-luxury section-padding">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient text-white shadow-lg shadow-gold/30">
                <Award className="h-6 w-6" />
              </span>
              <SectionHeading
                align="center"
                eyebrow="Compliance"
                title="Our RERA commitment"
                subtitle="Growra Realty champions Real Estate (Regulation and Development) Act compliance. We surface RERA IDs on eligible listings, encourage buyers to verify registrations, and decline inventory that cannot meet our documentation bar."
                className="mb-6"
              />
              <p className="text-sm leading-relaxed text-muted">
                Always cross-check project registration on the official state RERA portal before you pay a
                booking amount. Our advisors can walk you through the process — we never replace statutory
                verification.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-24 container-luxury section-padding">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-gold" />
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Privacy Policy</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              <p>
                We collect account details, search preferences, and inquiry messages solely to personalize
                your experience and respond to requests. We do not sell personal data to third-party marketers.
              </p>
              <p>
                Cookies and local storage power wishlist, compare, and recent-view features on your device.
                You may clear these anytime via browser settings or in-app controls.
              </p>
              <p>
                For privacy requests, email{" "}
                <a href="mailto:privacy@growrarealty.com" className="text-gold hover:underline">
                  privacy@growrarealty.com
                </a>
                .
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="terms" className="scroll-mt-24 border-t border-border bg-cream/50 dark:bg-ink/30">
        <div className="container-luxury section-padding">
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-gold" />
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Terms of Use</h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-muted">
                <p>
                  Growra Realty provides informational listings and advisory facilitation. Property details are
                  supplied by sellers, builders, or partners and may change without notice. Always conduct
                  independent due diligence before committing funds.
                </p>
                <p>
                  Unauthorized scraping, misuse of inquiry forms, or misrepresentation of identity may result in
                  account restriction. Premium advisory engagements are governed by separate written agreements.
                </p>
                <p>
                  Questions about these terms? Reach us via the{" "}
                  <Link href="/contact" className="text-gold hover:underline">
                    contact page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
