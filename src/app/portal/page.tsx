"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  Clock3,
  MessageCircle,
  MessageSquare,
  Plus,
  Ticket,
} from "lucide-react";
import { useAuthStore } from "@/store";
import {
  usePortalStore,
  type ListingAvailability,
  type PortalListing,
} from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { cn } from "@/lib/utils";

const AVAIL_STYLE: Record<ListingAvailability, string> = {
  "Pending Verification": "bg-amber-50 text-amber-800 border-amber-200",
  Live: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Reserved: "bg-sky-50 text-sky-800 border-sky-200",
  Sold: "bg-slate-100 text-slate-700 border-slate-200",
  Rejected: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function PortalDashboardPage() {
  const role = useAuthStore((s) => s.user?.role);
  const name = useAuthStore((s) => s.user?.name);
  const token = useAuthStore((s) => s.token);
  const inquiries = usePortalStore((s) => s.inquiries);
  const visits = usePortalStore((s) => s.visits);
  const tickets = usePortalStore((s) => s.tickets);
  const isAgent = role === "agent";

  const [listings, setListings] = useState<PortalListing[]>([]);
  const [counts, setCounts] = useState({ total: 0, live: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    portalApi
      .dashboard(token)
      .then((res) => {
        if (cancelled) return;
        setCounts({
          total: res.data.counts.total,
          live: res.data.counts.live,
          pending: res.data.counts.pending,
        });
        setListings(res.data.recentListings);
      })
      .catch(() => {
        if (!cancelled) {
          setListings([]);
          setCounts({ total: 0, live: 0, pending: 0 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;
  const openInquiries = inquiries.filter(
    (i) => i.status === "New" || i.status === "In Discussion",
  ).length;
  const upcomingVisits = visits.filter(
    (v) => v.status === "Scheduled" || v.status === "Confirmed",
  ).length;

  const firstName = name?.split(" ")[0] ?? "there";

  return (
    <div className="w-full space-y-6">
      <div className="overflow-hidden rounded-lg border border-border/70 bg-white">
        <div className="flex flex-col gap-5 border-b border-border/60 bg-gradient-to-r from-[#FAF8F3] via-white to-champagne/30 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-gold-rich uppercase">
              {isAgent ? "Agent portal" : "Owner portal"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-charcoal">
              Welcome, {firstName}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {isAgent
                ? "Manage listings, offline inquiries, and your visit diary in one place."
                : "Track listings and status updates from Growra staff."}
            </p>
          </div>
          <Link
            href="/portal/listings/new"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-white transition hover:bg-gold-rich"
          >
            <Plus className="h-4 w-4" />
            Post property
          </Link>
        </div>

        <div className="grid divide-y divide-border/60 sm:grid-cols-2 sm:divide-x xl:grid-cols-4">
          <Stat
            label="Properties"
            value={loading ? "…" : counts.total}
            icon={Building2}
            hint="Total listed"
          />
          <Stat
            label="Live"
            value={loading ? "…" : counts.live}
            icon={CheckCircle2}
            hint="Visible to buyers"
            accent="emerald"
          />
          <Stat
            label="Pending"
            value={loading ? "…" : counts.pending}
            icon={Clock3}
            hint="Awaiting verification"
            accent="amber"
          />
          {isAgent ? (
            <Stat
              label="Inquiries"
              value={openInquiries}
              icon={MessageSquare}
              hint="Need follow-up"
            />
          ) : (
            <Stat
              label="Tickets"
              value={openTickets}
              icon={Ticket}
              hint="Open support"
            />
          )}
        </div>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-border/70 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-[15px] font-semibold text-charcoal">Your properties</h2>
              <p className="mt-0.5 text-xs text-muted">Statuses managed by Growra admin &amp; staff</p>
            </div>
            <Link
              href="/portal/listings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold-rich hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {listings.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted sm:px-8">
                {loading ? "Loading listings…" : "No properties yet. Post your first listing."}
              </p>
            ) : (
              listings.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-4 px-6 py-4 sm:px-8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt=""
                    className="h-14 w-20 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-charcoal">{l.title}</p>
                    <p className="truncate text-xs text-muted">
                      {l.locality}, {l.city} · {l.priceLabel}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                      AVAIL_STYLE[l.availability],
                    )}
                  >
                    {l.availability}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          {isAgent ? (
            <QuickCard
              href="/portal/diary"
              title="Diary"
              subtitle={`${upcomingVisits} upcoming visits`}
              icon={BookOpen}
            />
          ) : null}
          {isAgent ? (
            <QuickCard
              href="/portal/calculators"
              title="Calculators"
              subtitle="Area, construction & EMI"
              icon={Calculator}
            />
          ) : null}
          <QuickCard
            href="/portal/tickets"
            title="Support tickets"
            subtitle={`${openTickets} open`}
            icon={Ticket}
          />
          <QuickCard
            href="/portal/chat"
            title="Live chat"
            subtitle="Message Growra staff"
            icon={MessageCircle}
          />
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  hint,
  accent,
}: {
  label: string;
  value: number | string;
  icon: typeof Building2;
  hint: string;
  accent?: "emerald" | "amber";
}) {
  return (
    <div className="px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted">{label}</p>
        <Icon
          className={cn(
            "h-4 w-4",
            accent === "emerald"
              ? "text-emerald-600"
              : accent === "amber"
                ? "text-amber-600"
                : "text-gold",
          )}
        />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-charcoal">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{hint}</p>
    </div>
  );
}

function QuickCard({
  href,
  title,
  subtitle,
  icon: Icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: typeof Ticket;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-border/70 bg-white px-5 py-4 transition hover:border-gold/40 hover:shadow-sm"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-champagne/60 text-gold-rich">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-charcoal">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted" />
    </Link>
  );
}
