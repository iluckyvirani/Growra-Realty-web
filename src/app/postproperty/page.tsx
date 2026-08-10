"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Menu, User } from "lucide-react";
import { PostPropertyAuthModal } from "@/components/auth/post-property-auth-modal";
import { SiteLogo } from "@/components/common/site-logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Advertise for FREE",
  "Get unlimited enquiries",
  "Get shortlisted buyers and tenants",
  "Assistance in co-ordinating site visits",
] as const;

const LOOKING_TO = ["Sell", "Rent / Lease", "PG"] as const;
const CATEGORIES = ["Residential", "Commercial"] as const;
const RESIDENTIAL_TYPES = [
  "Flat/Apartment",
  "Independent House / Villa",
  "Builder Floor",
  "Plot / Land",
  "Studio",
  "Farm House",
] as const;
const COMMERCIAL_TYPES = [
  "Office",
  "Shop",
  "Showroom",
  "Warehouse",
  "Industrial",
] as const;

export default function PostPropertyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [lookingTo, setLookingTo] = useState<(typeof LOOKING_TO)[number]>("Sell");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Residential");
  const [propertyType, setPropertyType] = useState<string>("Flat/Apartment");
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [phone, setPhone] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const types = category === "Residential" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES;
  const visibleTypes = useMemo(() => {
    if (showMoreTypes) return types;
    return types.slice(0, 4);
  }, [showMoreTypes, types]);

  const isPartner =
    isAuthenticated && (user?.role === "owner" || user?.role === "agent") && user?.roleChosen;

  const startNow = () => {
    if (isPartner) {
      router.push("/portal/listings/new");
      return;
    }
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal top bar like 99acres postproperty */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <SiteLogo size="sm" />
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                href={isPartner ? "/portal" : "/dashboard"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white"
                aria-label="Account"
              >
                <User className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white"
                aria-label="Login"
              >
                <User className="h-4 w-4" />
              </button>
            )}
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center text-white"
              aria-label="Menu / Home"
            >
              <Menu className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_minmax(320px,420px)] lg:items-start lg:gap-12 lg:py-12">
        {/* Left marketing */}
        <div className="lg:pt-4">
          <h1 className="max-w-xl text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
            Sell or Rent Property{" "}
            <span className="text-gold-rich">online faster</span> with Growra Realty
          </h1>

          <ul className="mt-6 space-y-3">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal sm:text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="relative mt-10 hidden aspect-[16/10] max-w-lg overflow-hidden rounded-lg bg-champagne/40 lg:block">
            <Image
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80"
              alt="Post property online"
              fill
              className="object-cover object-center opacity-90"
              sizes="520px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-charcoal shadow">
              Post Property — FREE
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="rounded-lg border border-border/70 bg-white p-5 shadow-[0_8px_30px_rgba(15,27,45,0.08)] sm:p-6">
          <h2 className="text-lg font-bold text-charcoal sm:text-xl">
            Start posting your property, it&apos;s free
          </h2>
          <p className="mt-1 text-sm text-muted">Add Basic Details</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-charcoal">You&apos;re looking to ...</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {LOOKING_TO.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLookingTo(opt)}
                  className={cn(
                    "rounded-md border px-3.5 py-2 text-sm font-medium transition",
                    lookingTo === opt
                      ? "border-gold bg-champagne/40 text-charcoal"
                      : "border-border text-muted hover:border-gold/40",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-charcoal">And it&apos;s a ...</p>
            <div className="mt-2 flex gap-4">
              {CATEGORIES.map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
                  <input
                    type="radio"
                    name="category"
                    checked={category === opt}
                    onChange={() => {
                      setCategory(opt);
                      setPropertyType(opt === "Residential" ? "Flat/Apartment" : "Office");
                      setShowMoreTypes(false);
                    }}
                    className="h-4 w-4 accent-[#C89B3C]"
                  />
                  {opt}
                </label>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {visibleTypes.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPropertyType(opt)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-[13px] font-medium transition",
                    propertyType === opt
                      ? "border-gold bg-champagne/40 text-charcoal"
                      : "border-border text-muted hover:border-gold/40",
                  )}
                >
                  {opt}
                </button>
              ))}
              {types.length > 4 ? (
                <button
                  type="button"
                  onClick={() => setShowMoreTypes((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-[13px] font-medium text-gold-rich"
                >
                  {showMoreTypes ? "Less" : `${types.length - 4} more`}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition", showMoreTypes && "rotate-180")}
                  />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-charcoal">
              Your contact details for the buyer to reach you
            </p>
            <div className="mt-2 rounded-md border border-border px-3 py-2 focus-within:border-gold">
              <div className="flex items-center gap-2">
                <span className="border-r border-border pr-2 text-sm font-semibold text-charcoal">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Phone Number"
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              Are you a registered user?{" "}
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="font-semibold text-gold-rich hover:underline"
              >
                Login
              </button>
            </p>
          </div>

          <Button
            type="button"
            onClick={startNow}
            className="mt-6 h-11 w-full rounded-md text-base font-semibold text-white gold-gradient"
          >
            Start now
          </Button>

          <p className="mt-3 text-center text-[11px] text-muted">
            Listing as: {lookingTo} · {category} · {propertyType}
          </p>
        </div>
      </div>

      <PostPropertyAuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        initialPhone={phone}
      />
    </div>
  );
}
