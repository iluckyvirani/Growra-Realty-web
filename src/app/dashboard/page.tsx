"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  GitCompare,
  Heart,
  Headphones,
  Home,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { DashboardSidebar, type DashboardSection } from "@/components/dashboard/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore, useCompareStore, useInquiryStore, useRecentStore, useWishlistStore } from "@/store";

export default function DashboardPage() {
  const [section, setSection] = useState<DashboardSection>("overview");
  const { isAuthenticated, user } = useAuthStore();
  const wishlist = useWishlistStore((s) => s.items);
  const compared = useCompareStore((s) => s.items);
  const viewed = useRecentStore((s) => s.viewed);
  const inquiries = useInquiryStore((s) => s.items);

  const stats = useMemo(
    () => ({
      saved: wishlist.length,
      compared: compared.length,
      viewed: viewed.length,
      inquiries: inquiries.length,
    }),
    [wishlist.length, compared.length, viewed.length, inquiries.length],
  );

  if (!isAuthenticated) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Track saved homes, inquiries, and listing performance in one place."
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        <div className="container-luxury section-padding">
          <FadeIn>
            <Card className="mx-auto max-w-xl border-border/80 bg-gradient-to-br from-card to-champagne/30 shadow-xl shadow-charcoal/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign in to unlock your dashboard</CardTitle>
                <CardDescription>
                  Access saved properties, inquiry history, analytics, and personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3 pb-8 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/auth/login">
                    Log in
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/buy">Browse homes</Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Your curated overview of listings, inquiries, and market activity."
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      <div className="container-luxury section-padding pt-10 md:pt-12">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <FadeIn direction="left">
            <DashboardSidebar active={section} onChange={setSection} className="lg:sticky lg:top-24" />
          </FadeIn>

          <div className="min-w-0 space-y-8">
            {section === "overview" ? (
              <>
                <FadeIn>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Saved" value={stats.saved} icon={Heart} hint="Wishlist homes" />
                    <StatCard label="Compared" value={stats.compared} icon={GitCompare} hint="Up to 4 at once" />
                    <StatCard label="Recently viewed" value={stats.viewed} icon={Eye} hint="Last 12 visits" />
                    <StatCard label="Inquiries" value={stats.inquiries} icon={MessageSquare} hint="Open threads" />
                  </div>
                </FadeIn>

                <div className="grid gap-6 xl:grid-cols-5">
                  <FadeIn delay={0.08} className="xl:col-span-3">
                    <ViewsChart />
                  </FadeIn>

                  <FadeIn delay={0.12} className="xl:col-span-2">
                    <Card className="h-full border-border/80 bg-gradient-to-br from-card to-champagne/20 shadow-lg shadow-charcoal/5">
                      <CardHeader>
                        <CardTitle>Recent activity</CardTitle>
                        <CardDescription>Latest inquiries and shortlist activity.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {inquiries.slice(0, 5).map((item) => (
                            <li
                              key={item.id}
                              className="flex items-start gap-3 border-b border-border/70 pb-4 last:border-0 last:pb-0"
                            >
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Inquiry sent for {item.propertyTitle}
                                </p>
                                <p className="mt-0.5 text-xs text-muted">
                                  {new Date(item.createdAt).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </li>
                          ))}
                          {!inquiries.length ? (
                            <li className="text-sm text-muted">
                              No recent inquiries yet. Contact a dealer from any listing.
                            </li>
                          ) : null}
                        </ul>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>

                <FadeIn delay={0.16}>
                  <Card className="border-border/80 bg-gradient-to-r from-charcoal to-ink text-champagne shadow-xl">
                    <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                          Quick actions
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white">Move faster on your next home</h3>
                        <p className="mt-1 text-sm text-champagne/70">
                          List a property, explore curated inventory, or reach our concierge desk.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="secondary" className="bg-white text-charcoal hover:bg-champagne">
                          <Link href="/contact">
                            <Plus className="h-4 w-4" />
                            List property
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-champagne/40 text-champagne hover:bg-white/10">
                          <Link href="/buy">
                            <Search className="h-4 w-4" />
                            Browse
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-champagne/40 text-champagne hover:bg-white/10">
                          <Link href="/contact">
                            <Headphones className="h-4 w-4" />
                            Contact support
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </>
            ) : null}

            {section === "listings" ? (
              <FadeIn>
                <EmptyState
                  icon={Home}
                  title="No active listings yet"
                  description="Submit your property for a quality review. Verified listings go live within 48 hours."
                  action={{ label: "List a property", href: "/contact" }}
                />
              </FadeIn>
            ) : null}

            {section === "inquiries" ? (
              <FadeIn>
                <Card className="border-border/80 shadow-lg shadow-charcoal/5">
                  <CardHeader>
                    <CardTitle>Inquiries</CardTitle>
                    <CardDescription>
                      Leads you sent from property cards and contact forms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {inquiries.length ? (
                      inquiries.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-border bg-champagne/20 px-4 py-3 text-sm text-foreground"
                        >
                          <p className="font-medium">{item.propertyTitle}</p>
                          <p className="mt-1 line-clamp-2 text-muted">{item.message}</p>
                          <p className="mt-2 text-[11px] text-muted">
                            {new Date(item.createdAt).toLocaleString("en-IN")} · {item.phone}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">
                        No inquiries yet. Open a listing and tap Contact to send one.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            ) : null}

            {section === "analytics" ? (
              <FadeIn>
                <ViewsChart />
              </FadeIn>
            ) : null}

            {section === "saved" ? (
              <FadeIn>
                <EmptyState
                  icon={Heart}
                  title={wishlist.length ? `${wishlist.length} homes saved` : "Your saved homes"}
                  description="Open your wishlist for the full collection of shortlisted properties."
                  action={{ label: "View wishlist", href: "/wishlist" }}
                />
              </FadeIn>
            ) : null}

            {section === "settings" ? (
              <FadeIn>
                <Card className="border-border/80 shadow-lg shadow-charcoal/5">
                  <CardHeader>
                    <CardTitle>Account settings</CardTitle>
                    <CardDescription>Manage profile details and notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/profile">Go to profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
