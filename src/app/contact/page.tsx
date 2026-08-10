"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { MapPlaceholder } from "@/components/map/map-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPropertyBySlug } from "@/services/property-service";
import type { Property } from "@/types";
import { useAuthStore, useInquiryStore } from "@/store";
import { propertyApi } from "@/lib/property-api";
import { ApiError } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[+\d\s()-]{10,18}$/, "Enter a valid phone number"),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const OFFICES = [
  {
    city: "Mumbai",
    address: "12th Floor, One BKC, Bandra Kurla Complex, Mumbai 400051",
    phone: "+91 22 4000 1200",
    email: "mumbai@growrarealty.com",
    lat: 19.0596,
    lng: 72.8656,
  },
  {
    city: "Bengaluru",
    address: "Level 8, Prestige Tech Park, Outer Ring Road, Bengaluru 560103",
    phone: "+91 80 4500 8800",
    email: "bengaluru@growrarealty.com",
    lat: 12.9352,
    lng: 77.6946,
  },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const propertySlug = searchParams.get("property") ?? "";
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const user = useAuthStore((s) => s.user);
  const addInquiry = useInquiryStore((s) => s.add);

  useEffect(() => {
    if (!propertySlug) {
      setProperty(undefined);
      return;
    }
    let cancelled = false;
    getPropertyBySlug(propertySlug).then((p) => {
      if (!cancelled) setProperty(p);
    });
    return () => {
      cancelled = true;
    };
  }, [propertySlug]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (property) {
      setValue(
        "message",
        `Hi, I'm interested in ${property.title} in ${property.locality}, ${property.city}. Please share more details.`,
      );
    }
  }, [user, property, setValue]);

  const onSubmit = async (values: ContactFormValues) => {
    try {
      if (property) {
        const token = useAuthStore.getState().token;
        await propertyApi.createInquiry(
          {
            propertyId: property.id,
            name: values.name,
            email: values.email || undefined,
            phone: values.phone,
            message: values.message,
          },
          token,
        );
        addInquiry({
          propertyId: property.id,
          propertySlug: property.slug,
          propertyTitle: property.title,
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
        });
        toast.success("Inquiry sent to the dealer", {
          description: `Thanks, ${values.name.split(" ")[0]}. We'll connect you about ${property.title}.`,
        });
      } else {
        toast.success("Message sent — our concierge team will reply shortly.", {
          description: `Thanks, ${values.name.split(" ")[0]}.`,
        });
      }
      reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        message: "",
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send message");
    }
  };

  return (
    <Card className="border-border/80 bg-gradient-to-br from-card to-champagne/25 shadow-xl shadow-charcoal/5">
      <CardHeader>
        <CardTitle>{property ? "Send inquiry" : "Send a message"}</CardTitle>
        <CardDescription>
          {property
            ? `Inquiry for ${property.title} · ${property.locality}, ${property.city}`
            : "Buying, renting, listing, or partnership inquiries — we read every note."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your full name" {...register("name")} />
            {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} />
            {errors.phone ? <p className="text-xs text-danger">{errors.phone.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can we help?" rows={5} {...register("message")} />
            {errors.message ? (
              <p className="text-xs text-danger">{errors.message.message}</p>
            ) : null}
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Sending…" : property ? "Send inquiry" : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact"
        description="Reach our advisors in Mumbai and Bengaluru — or send a note and we will respond within one business day."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="container-luxury section-padding pt-10 md:pt-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <FadeIn>
            <Suspense
              fallback={
                <Card className="border-border/80 p-8 text-sm text-muted">Loading form…</Card>
              }
            >
              <ContactForm />
            </Suspense>
          </FadeIn>

          <div className="space-y-8">
            <FadeIn delay={0.08}>
              <SectionHeading
                eyebrow="Offices"
                title="Visit us"
                subtitle="Two hubs, one concierge standard — schedule a private appointment anytime."
                className="mb-6"
              />
              <div className="grid gap-4">
                {OFFICES.map((office) => (
                  <Card key={office.city} className="border-border/80 shadow-md shadow-charcoal/5">
                    <CardContent className="space-y-3 p-5">
                      <h3 className="text-lg font-semibold text-foreground">{office.city}</h3>
                      <p className="flex items-start gap-2 text-sm text-muted">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {office.address}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted">
                        <Phone className="h-4 w-4 text-gold" />
                        <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                          {office.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted">
                        <Mail className="h-4 w-4 text-gold" />
                        <a href={`mailto:${office.email}`} className="hover:text-gold">
                          {office.email}
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <MapPlaceholder
                lat={OFFICES[0].lat}
                lng={OFFICES[0].lng}
                label="Growra Realty · Mumbai HQ"
                size="lg"
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
