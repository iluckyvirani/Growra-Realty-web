import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { BetterPlacesSection } from "@/components/home/better-places-section";
import { RentHomesSection } from "@/components/home/rent-homes-section";
import { PostPropertySection } from "@/components/home/post-property-section";
import { PgColivingSection } from "@/components/home/pg-coliving-section";
import { OwnerServicesSection } from "@/components/home/owner-services-section";
import { NewlyLaunchedSection } from "@/components/home/newly-launched-section";
import { PopularCities } from "@/components/home/popular-cities";
import { BenefitsSection } from "@/components/home/benefits-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { TrendingProperties } from "@/components/home/trending-properties";
import { BudgetSection } from "@/components/home/budget-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CuratedQuickLinksSection } from "@/components/home/curated-quick-links-section";
import { AppCta } from "@/components/home/app-cta";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Discover Extraordinary Living`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <BetterPlacesSection />
      <RentHomesSection />
      <PostPropertySection />
      <PgColivingSection />
      <OwnerServicesSection />
      <NewlyLaunchedSection />
      <PopularCities />
      <BenefitsSection />
      <FeaturedProjects />
      <TrendingProperties />
      <BudgetSection />
      <TestimonialsSection />
      <FaqSection />
      <CuratedQuickLinksSection />
      <AppCta />
    </>
  );
}
