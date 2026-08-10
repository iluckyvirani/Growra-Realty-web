"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { propertyApi } from "@/lib/property-api";
import { ApiError } from "@/lib/api";
import { GROWRA_CONTACT } from "@/constants";
import { useAuthStore, useInquiryStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DealerEnquiryFormProps {
  propertyId: string;
  propertySlug?: string;
  propertyTitle?: string;
  className?: string;
  /** @deprecated ignored — enquiries always go to Growra Realty */
  dealerName?: string;
}

export function DealerEnquiryForm({
  propertyId,
  propertySlug,
  propertyTitle,
  className,
}: DealerEnquiryFormProps) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const addInquiry = useInquiryStore((s) => s.add);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setMessage(
      propertyTitle
        ? `Hi Growra Realty, I'm interested in ${propertyTitle}. Please share more details.`
        : "Hi Growra Realty, I'm interested in this property. Please share more details.",
    );
  }, [user, propertyTitle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Enter your name");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (message.trim().length < 8) {
      toast.error("Please add a short message");
      return;
    }
    if (!agreed) {
      toast.error("Please accept Terms & Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const token = useAuthStore.getState().token;
      await propertyApi.createInquiry(
        {
          propertyId,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          message: message.trim(),
        },
        token,
      );
      addInquiry({
        propertyId,
        propertySlug: propertySlug ?? propertyId,
        propertyTitle: propertyTitle ?? "Property inquiry",
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setSent(true);
      toast.success("Inquiry sent to Growra Realty", {
        description: "Our team will contact you shortly.",
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send enquiry");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-8 text-center shadow-sm",
          className,
        )}
      >
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="text-base font-bold text-charcoal">Inquiry received</h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Growra Realty will reach you on {phone || "your phone"} soon.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 rounded-md"
          onClick={() => setSent(false)}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-charcoal">Property inquiry</h3>
        <p className="mt-1 text-sm text-muted">
          Send your details to <span className="font-semibold text-charcoal">{GROWRA_CONTACT.name}</span>.
          Owner and agent numbers are never shared.
        </p>
      </div>

      <div className="mt-4 grid gap-2 rounded-xl bg-cream/60 p-3 sm:grid-cols-2">
        <a
          href={`tel:${GROWRA_CONTACT.phoneTel}`}
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-charcoal ring-1 ring-border transition hover:ring-gold/40"
        >
          <Phone className="h-4 w-4 text-gold-rich" />
          {GROWRA_CONTACT.phoneDisplay}
        </a>
        <a
          href={`mailto:${GROWRA_CONTACT.email}`}
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-charcoal ring-1 ring-border transition hover:ring-gold/40"
        >
          <Mail className="h-4 w-4 text-gold-rich" />
          {GROWRA_CONTACT.email}
        </a>
      </div>

      <div className="mt-5 space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="enq-name">Full name</Label>
          <Input
            id="enq-name"
            name="name"
            required
            placeholder="Your full name"
            className="h-11 bg-cream/30"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="enq-phone">Phone</Label>
            <div className="flex gap-2">
              <span className="flex h-11 shrink-0 items-center rounded-md border border-border bg-cream/30 px-3 text-sm text-muted">
                +91
              </span>
              <Input
                id="enq-phone"
                name="phone"
                type="tel"
                required
                inputMode="numeric"
                placeholder="10-digit mobile"
                className="h-11 bg-cream/30"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="enq-email">Email (optional)</Label>
            <Input
              id="enq-email"
              name="email"
              type="email"
              placeholder="you@email.com"
              className="h-11 bg-cream/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enq-message">Message</Label>
          <Textarea
            id="enq-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 400))}
            rows={4}
            className="resize-none bg-cream/30"
            required
          />
          <p className="text-right text-[11px] text-muted">{message.length}/400</p>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-[var(--gold,#C89B3C)]"
        />
        <span>
          I agree to the{" "}
          <Link href="/contact" className="font-medium text-gold-rich hover:underline">
            Terms & Conditions
          </Link>{" "}
          and Privacy Policy. Growra Realty may contact me about this property.
        </span>
      </label>

      <Button
        type="submit"
        disabled={loading}
        className="mt-5 h-11 w-full cursor-pointer gap-2 rounded-md text-white gold-gradient"
      >
        <Send className="h-4 w-4" />
        {loading ? "Sending…" : "Send inquiry to Growra Realty"}
      </Button>
    </form>
  );
}
