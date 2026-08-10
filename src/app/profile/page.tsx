"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Clock, Heart, UserRound } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { PropertyCard } from "@/components/cards/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property } from "@/types";
import { getPropertyById } from "@/services/property-service";
import { useAuthStore, useRecentStore, useWishlistStore } from "@/store";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Price drop alert",
    body: "Aurelia Residences reduced asking price by 3%.",
    time: "Today · 10:24 AM",
  },
  {
    id: "n2",
    title: "New matching listing",
    body: "A 3 BHK in Whitefield matches your saved filters.",
    time: "Yesterday · 6:12 PM",
  },
  {
    id: "n3",
    title: "Site visit reminder",
    body: "Your Bengaluru visit is confirmed for Saturday 11 AM.",
    time: "Mon · 9:00 AM",
  },
];

export default function ProfilePage() {
  const { isAuthenticated, user, updateUser, login } = useAuthStore();
  const wishlistIds = useWishlistStore((s) => s.items);
  const viewedIds = useRecentStore((s) => s.viewed);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [viewedProperties, setViewedProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(wishlistIds.map((id) => getPropertyById(id))).then((rows) => {
      if (!cancelled) {
        setSavedProperties(rows.filter((p): p is Property => Boolean(p)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [wishlistIds]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(viewedIds.map((id) => getPropertyById(id))).then((rows) => {
      if (!cancelled) {
        setViewedProperties(rows.filter((p): p is Property => Boolean(p)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [viewedIds]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      login({ name: name || "Guest User", email, phone });
      toast.success("Profile created and signed in");
      return;
    }
    updateUser({ name, email, phone });
    toast.success("Profile updated");
  };

  return (
    <div>
      <PageHeader
        title="Your profile"
        description="Manage account details, shortlists, viewing history, and alerts."
        breadcrumbs={[{ label: "Profile" }]}
      />

      <div className="container-luxury section-padding pt-10 md:pt-12">
        <FadeIn>
          <Tabs defaultValue="info" className="space-y-8">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 sm:w-auto">
              <TabsTrigger value="info" className="gap-2">
                <UserRound className="h-4 w-4" />
                Profile info
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Heart className="h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="viewed" className="gap-2">
                <Clock className="h-4 w-4" />
                Recently viewed
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-0">
              <Card className="max-w-2xl border-border/80 bg-gradient-to-br from-card to-champagne/20 shadow-lg shadow-charcoal/5">
                <CardHeader>
                  <CardTitle>Profile information</CardTitle>
                  <CardDescription>
                    {isAuthenticated
                      ? "Update how we address you across Growra Realty."
                      : "Fill in your details to create a local profile session."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <Button type="submit">{isAuthenticated ? "Save changes" : "Save & sign in"}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              {savedProperties.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="No saved properties"
                  description="Tap the heart on any listing to build your shortlist."
                  action={{ label: "Browse homes", href: "/buy" }}
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {savedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="viewed" className="mt-0">
              {viewedProperties.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No recently viewed homes"
                  description="Properties you open will appear here for quick revisit."
                  action={{ label: "Explore luxury", href: "/luxury" }}
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {viewedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/80 shadow-lg shadow-charcoal/5">
                  <CardHeader>
                    <CardTitle>Alert preferences</CardTitle>
                    <CardDescription>Choose how Growra keeps you informed.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Email alerts</p>
                        <p className="text-xs text-muted">Price drops and new matches</p>
                      </div>
                      <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">SMS alerts</p>
                        <p className="text-xs text-muted">Visit reminders and hot leads</p>
                      </div>
                      <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toast.success("Notification preferences saved")}
                    >
                      Save preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/80 shadow-lg shadow-charcoal/5">
                  <CardHeader>
                    <CardTitle>Recent notifications</CardTitle>
                    <CardDescription>Mock inbox for demo purposes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="rounded-2xl border border-border bg-champagne/15 px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <p className="mt-1 text-sm text-muted">{n.body}</p>
                        <p className="mt-2 text-xs text-muted">{n.time}</p>
                      </div>
                    ))}
                    <Button asChild variant="ghost" className="px-0 text-gold">
                      <Link href="/dashboard">Open dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}
