"use client";

import { useState } from "react";
import { CalendarDays, GitCompare, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useMounted } from "@/hooks";
import { useCompareStore, useWishlistStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyActionsProps {
  propertyId: string;
  propertyTitle: string;
  slug: string;
  className?: string;
}

export function PropertyActions({
  propertyId,
  propertyTitle,
  slug,
  className,
}: PropertyActionsProps) {
  const mounted = useMounted();
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  const wished = mounted && wishlist.has(propertyId);
  const compared = mounted && compare.has(propertyId);
  const [visitOpen, setVisitOpen] = useState(false);

  const handleWishlist = () => {
    wishlist.toggle(propertyId);
    toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleCompare = () => {
    if (!compared && compare.items.length >= 4) {
      toast.error("Compare up to 4 properties");
      return;
    }
    compare.toggle(propertyId);
    toast.success(compared ? "Removed from compare" : "Added to compare");
  };

  const handleShare = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/property/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: propertyTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const handleSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Visit request received — our concierge will confirm shortly.");
    setVisitOpen(false);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        className={cn(wished && "border-danger/40 text-danger")}
        onClick={handleWishlist}
      >
        <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        {wished ? "Saved" : "Wishlist"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className={cn(compared && "border-gold/50 text-gold-rich")}
        onClick={handleCompare}
      >
        <GitCompare className="h-4 w-4" />
        Compare
      </Button>
      <Button type="button" variant="outline" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
        <DialogTrigger asChild>
          <Button type="button">
            <CalendarDays className="h-4 w-4" />
            Schedule Visit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a site visit</DialogTitle>
            <DialogDescription>
              Tell us when you would like to tour {propertyTitle}. A Growra concierge will
              confirm within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visit-name">Full name</Label>
              <Input id="visit-name" name="name" required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-phone">Phone</Label>
              <Input
                id="visit-phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-date">Preferred date</Label>
              <Input id="visit-date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-notes">Notes (optional)</Label>
              <Textarea
                id="visit-notes"
                name="notes"
                placeholder="Preferred time window, number of visitors…"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">
                Request visit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
