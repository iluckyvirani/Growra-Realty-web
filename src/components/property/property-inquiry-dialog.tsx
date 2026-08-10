"use client";

import { useEffect, useState } from "react";
import { Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, useInquiryStore } from "@/store";
import { GROWRA_CONTACT } from "@/constants";
import { propertyApi } from "@/lib/property-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface PropertyInquiryTarget {
  id: string;
  slug: string;
  title: string;
  locality?: string;
  city?: string;
}

interface PropertyInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: PropertyInquiryTarget | null;
}

export function PropertyInquiryDialog({
  open,
  onOpenChange,
  property,
}: PropertyInquiryDialogProps) {
  const user = useAuthStore((s) => s.user);
  const addInquiry = useInquiryStore((s) => s.add);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !property) return;
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setMessage(
      `Hi, I'm interested in ${property.title}${
        property.locality ? ` in ${property.locality}` : ""
      }${property.city ? `, ${property.city}` : ""}. Please share more details.`,
    );
  }, [open, property, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    if (name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    if (message.trim().length < 8) {
      toast.error("Please add a short message");
      return;
    }

    setSubmitting(true);
    try {
      const token = useAuthStore.getState().token;
      await propertyApi.createInquiry(
        {
          propertyId: property.id,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          message: message.trim(),
        },
        token,
      );
      addInquiry({
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      onOpenChange(false);
      toast.success("Inquiry sent to Growra Realty", {
        description: `We'll connect you about ${property.title}.`,
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inquire with Growra Realty</DialogTitle>
          <DialogDescription>
            {property
              ? `Send your details for ${property.title}. Our Growra Realty team will contact you — owner and agent numbers are never shared.`
              : "Send your details to Growra Realty about this property."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inq-name">Full name</Label>
            <Input
              id="inq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-phone">Phone</Label>
            <Input
              id="inq-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-email">Email (optional)</Label>
            <Input
              id="inq-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-message">Message</Label>
            <Textarea
              id="inq-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={submitting} className="w-full gap-2 text-white gold-gradient sm:w-auto">
              <Send className="h-4 w-4" />
              {submitting ? "Sending…" : "Send inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ViewNumberButtonProps {
  propertyId: string;
  propertyTitle: string;
  className?: string;
  size?: "sm" | "default";
  variant?: "outline" | "default";
}

export function ViewNumberButton({
  propertyId,
  propertyTitle,
  className,
  size = "sm",
  variant = "outline",
}: ViewNumberButtonProps) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (revealed) {
      window.location.href = `tel:${GROWRA_CONTACT.phoneTel}`;
      return;
    }
    try {
      const token = useAuthStore.getState().token;
      await propertyApi.revealContact(propertyId, token);
    } catch {
      // Still show Growra number even if logging fails
    }
    setRevealed(true);
    try {
      await navigator.clipboard.writeText(GROWRA_CONTACT.phoneTel);
      toast.success(`Growra Realty — ${propertyTitle}`, {
        description: `${GROWRA_CONTACT.phoneDisplay} · copied. Tap again to call.`,
      });
    } catch {
      toast.success(`Growra Realty — ${propertyTitle}`, {
        description: GROWRA_CONTACT.phoneDisplay,
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={
        className ??
        "rounded-md border-gold/40 text-gold-rich hover:bg-champagne/50"
      }
      onClick={handleReveal}
    >
      <Phone className="h-3.5 w-3.5" />
      {revealed ? GROWRA_CONTACT.phoneDisplay : "View Growra number"}
    </Button>
  );
}
