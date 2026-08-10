import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  FileCheck,
  Headphones,
  Laptop,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    title: "Get assistance in selling faster",
    description: "Dedicated relationship manager to help you sell your property faster",
    href: "/portal",
    icon: Laptop,
    accent: "text-gold-rich",
  },
  {
    title: "Accurate property valuation",
    description: "Data-backed pricing insights so you list at the right market value",
    href: "/contact",
    icon: BadgeIndianRupee,
    accent: "text-gold",
  },
  {
    title: "Legal & documentation support",
    description: "RERA-compliant paperwork, agreements, and registration guidance",
    href: "/about#rera",
    icon: FileCheck,
    accent: "text-gold-rich",
  },
  {
    title: "Tenant verification & screening",
    description: "Verified tenants with background checks for worry-free renting",
    href: "/rent",
    icon: ShieldCheck,
    accent: "text-gold",
  },
  {
    title: "Dedicated owner concierge",
    description: "24/7 support for site visits, negotiations, and closing",
    href: "/contact",
    icon: Headphones,
    accent: "text-gold-rich",
  },
  {
    title: "Find quality tenants faster",
    description: "Reach serious buyers and tenants across Growra's premium network",
    href: "/portal",
    icon: Users,
    accent: "text-gold",
  },
];

export function OwnerServicesSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
            Our services for owners
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Make your life easier with our services
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-2xl border border-border/60 bg-champagne/40 p-5 transition hover:border-gold/30 hover:shadow-md sm:p-6"
            >
              <div className="mb-4 flex h-24 items-center justify-center rounded-xl bg-white/80">
                <service.icon className={cn("h-12 w-12", service.accent)} strokeWidth={1.25} />
              </div>
              <h3 className="text-base font-bold text-charcoal sm:text-lg">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-rich hover:underline"
              >
                Explore now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
