"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2, MessageSquarePlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store";
import {
  type PortalInquiry,
  type PortalInquiryPriority,
  type PortalInquiryType,
  type PortalListing,
} from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const SOURCES: PortalInquiry["source"][] = [
  "Offline",
  "Phone",
  "Walk-in",
  "Other platform",
  "Website",
];

const INQUIRY_TYPES: PortalInquiryType[] = [
  "Site Visit Request",
  "Price Negotiation",
  "General Info",
  "Buying Intent",
];

const PRIORITIES: PortalInquiryPriority[] = ["Low", "Medium", "High"];

const STATUSES: PortalInquiry["status"][] = [
  "New",
  "In Discussion",
  "Site Visit Scheduled",
  "Closed Won",
  "Closed Lost",
];

function priorityVariant(p: PortalInquiryPriority) {
  if (p === "High") return "gold" as const;
  if (p === "Medium") return "secondary" as const;
  return "outline" as const;
}

export default function PortalInquiriesPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const token = useAuthStore((s) => s.token);
  const [listings, setListings] = useState<PortalListing[]>([]);
  const [inquiries, setInquiries] = useState<PortalInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PortalInquiryPriority | "All">("All");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    propertyId: "",
    propertyTitle: "",
    message: "",
    source: "Offline" as PortalInquiry["source"],
    inquiryType: "General Info" as PortalInquiryType,
    priority: "Medium" as PortalInquiryPriority,
    scheduleVisit: false,
    visitDate: "",
    visitTime: "11:00",
  });

  const upsertInquiry = (item: PortalInquiry) => {
    setInquiries((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx === -1) return [item, ...prev];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  };

  useEffect(() => {
    if (role === "owner") {
      toast.message("Inquiries & diary are available on the Agent portal");
      router.replace("/portal");
    }
  }, [role, router]);

  useEffect(() => {
    if (!token || role !== "agent") return;
    let cancelled = false;
    setLoading(true);
    Promise.all([portalApi.inquiries(token), portalApi.listings(token)])
      .then(([inqRes, listRes]) => {
        if (cancelled) return;
        setInquiries(inqRes.data);
        setListings(listRes.data);
      })
      .catch(() => {
        if (!cancelled) {
          setInquiries([]);
          setListings([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  const filtered = useMemo(
    () =>
      priorityFilter === "All"
        ? inquiries
        : inquiries.filter((i) => i.priority === priorityFilter),
    [inquiries, priorityFilter],
  );

  if (role !== "agent") {
    return null;
  }

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.customerPhone.trim() || !form.message.trim()) {
      toast.error("Name, phone, and message are required");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    const listing = listings.find((l) => l.id === form.propertyId);
    const propertyTitle =
      listing?.title || form.propertyTitle.trim() || "General inquiry";

    setSubmitting(true);
    try {
      const res = await portalApi.createInquiry(
        {
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          customerEmail: form.customerEmail.trim() || undefined,
          propertyId: listing?.id || undefined,
          propertyTitle,
          message: form.message.trim(),
          source: form.source,
          inquiryType: form.inquiryType,
          priority: form.priority,
          nextFollowUp: form.scheduleVisit ? form.visitDate || undefined : undefined,
          scheduleVisit: form.scheduleVisit,
          visitDate: form.visitDate || undefined,
          visitTime: form.visitTime || undefined,
        },
        token,
      );
      upsertInquiry(res.data);
      toast.success(res.visit ? "Inquiry added & visit scheduled in Diary" : "Offline inquiry added");
      setOpenForm(false);
      setForm({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        propertyId: "",
        propertyTitle: "",
        message: "",
        source: "Offline",
        inquiryType: "General Info",
        priority: "Medium",
        scheduleVisit: false,
        visitDate: "",
        visitTime: "11:00",
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const onAddNote = async (inqId: string) => {
    const text = noteDrafts[inqId]?.trim();
    if (!text) {
      toast.error("Enter a note");
      return;
    }
    if (!token) return;
    try {
      const res = await portalApi.addInquiryLog(inqId, text, token, "You");
      upsertInquiry(res.data);
      setNoteDrafts((d) => ({ ...d, [inqId]: "" }));
      toast.success("Note added to timeline");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not add note");
    }
  };

  const onStatus = async (id: string, status: PortalInquiry["status"]) => {
    if (!token) return;
    try {
      const res = await portalApi.updateInquiryStatus(id, status, token);
      upsertInquiry(res.data);
      toast.success("Inquiry status updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update status");
    }
  };

  const onPriority = async (id: string, priority: PortalInquiryPriority) => {
    if (!token) return;
    try {
      const res = await portalApi.updateInquiryPriority(id, priority, token);
      upsertInquiry(res.data);
      toast.success("Priority updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update priority");
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Inquiries</h1>
          <p className="mt-1 text-sm text-muted">
            Website leads plus offline / phone / walk-in inquiries — aligned with admin leads
            workflow.
          </p>
        </div>
        <Button type="button" onClick={() => setOpenForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Add inquiry
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", ...PRIORITIES] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriorityFilter(p)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              priorityFilter === p
                ? "border-gold bg-champagne text-gold-rich"
                : "border-border bg-white text-muted hover:border-gold/40",
            )}
          >
            {p === "All" ? "All priorities" : p}
          </button>
        ))}
      </div>

      {openForm ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add offline / external inquiry</CardTitle>
            <CardDescription>
              Same workflow as admin — capture leads from anywhere and optionally schedule a diary
              visit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onAdd} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer name</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.customerPhone}
                  onChange={(e) => set("customerPhone", e.target.value)}
                  placeholder="+91…"
                />
              </div>
              <div className="space-y-2">
                <Label>Email (optional)</Label>
                <Input
                  value={form.customerEmail}
                  onChange={(e) => set("customerEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <select
                  value={form.source}
                  onChange={(e) => set("source", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Inquiry type</Label>
                <select
                  value={form.inquiryType}
                  onChange={(e) => set("inquiryType", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={form.priority}
                  onChange={(e) => set("priority", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Link to your listing (optional)</Label>
                <select
                  value={form.propertyId}
                  onChange={(e) => set("propertyId", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  <option value="">General / not linked</option>
                  {listings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
              {!form.propertyId ? (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Property / requirement title</Label>
                  <Input
                    value={form.propertyTitle}
                    onChange={(e) => set("propertyTitle", e.target.value)}
                    placeholder="e.g. Noida 3BHK under 2 Cr"
                  />
                </div>
              ) : null}
              <div className="space-y-2 sm:col-span-2">
                <Label>Message / notes</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.scheduleVisit}
                  onChange={(e) => set("scheduleVisit", e.target.checked)}
                  className="rounded border-border"
                />
                Also schedule a diary visit
              </label>
              {form.scheduleVisit ? (
                <>
                  <div className="space-y-2">
                    <Label>Visit date</Label>
                    <Input
                      type="date"
                      value={form.visitDate}
                      onChange={(e) => set("visitDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={form.visitTime}
                      onChange={(e) => set("visitTime", e.target.value)}
                    />
                  </div>
                </>
              ) : null}
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save inquiry
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpenForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted">Loading inquiries…</p>
        ) : null}
        {!loading &&
          filtered.map((inq) => {
          const expanded = expandedId === inq.id;
          return (
            <Card key={inq.id} className="border-border/80 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-charcoal">{inq.customerName}</p>
                      <Badge variant="outline">{inq.source}</Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {inq.inquiryType}
                      </Badge>
                      <Badge variant={priorityVariant(inq.priority)} className="text-[10px]">
                        {inq.priority}
                      </Badge>
                      <Badge
                        variant={inq.status === "New" ? "gold" : "secondary"}
                        className="text-[10px]"
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {inq.propertyTitle} · {inq.customerPhone}
                      {inq.customerEmail ? ` · ${inq.customerEmail}` : ""}
                    </p>
                    <p className="text-sm text-charcoal/90">{inq.message}</p>
                    <p className="text-[11px] text-muted">
                      {inq.id} · {inq.createdAt}
                      {inq.nextFollowUp ? ` · Follow-up ${inq.nextFollowUp}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                    <div>
                      <Label className="mb-1 block text-[11px] text-muted">Priority</Label>
                      <select
                        value={inq.priority}
                        onChange={(e) => {
                          void onPriority(inq.id, e.target.value as PortalInquiryPriority);
                        }}
                        className="flex h-9 w-full rounded-[8px] border border-border bg-surface px-2 text-sm"
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="mb-1 block text-[11px] text-muted">Update status</Label>
                      <select
                        value={inq.status}
                        onChange={(e) => {
                          void onStatus(inq.id, e.target.value as PortalInquiry["status"]);
                        }}
                        className="flex h-9 w-full rounded-[8px] border border-border bg-surface px-2 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-gold hover:underline"
                  onClick={() => setExpandedId(expanded ? null : inq.id)}
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Hide timeline
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> View timeline ({inq.logs.length}{" "}
                      entries)
                    </>
                  )}
                </button>

                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-border/70 pt-4">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                        Activity log
                      </p>
                      <ul className="space-y-2 border-l-2 border-gold/30 pl-4">
                        {inq.logs.map((log) => (
                          <li key={log.id} className="relative">
                            <span className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-gold" />
                            <p className="text-sm text-charcoal">{log.text}</p>
                            <p className="text-[10px] text-muted">
                              {log.author} · {log.date}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={noteDrafts[inq.id] ?? ""}
                        onChange={(e) =>
                          setNoteDrafts((d) => ({ ...d, [inq.id]: e.target.value }))
                        }
                        placeholder="Add a follow-up note…"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={() => onAddNote(inq.id)}>
                        <MessageSquarePlus className="h-4 w-4" />
                        Add note
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
        {!loading && filtered.length === 0 ? (
          <Card className="border-dashed p-8 text-center text-sm text-muted">
            {inquiries.length === 0
              ? "No inquiries yet. Add offline leads from other platforms here."
              : "No inquiries match this priority filter."}
          </Card>
        ) : null}
      </div>
    </div>
  );
}
