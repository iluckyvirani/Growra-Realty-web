"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store";
import { type PortalVisit } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { ApiError } from "@/lib/api";

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "Independent House",
  "Commercial",
  "Office",
  "Shop",
  "Other",
];

const STATUSES: PortalVisit["status"][] = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "No-show",
  "Cancelled",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const emptyForm = {
  customerName: "",
  locationLabel: "",
  propertyName: "",
  customerPhone: "",
  propertySize: "",
  rate: "",
  date: tomorrowISO(),
  propertyTypeLabel: "Apartment",
};

export default function PortalDiaryPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const token = useAuthStore((s) => s.token);
  const [visits, setVisits] = useState<PortalVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (role === "owner") {
      router.replace("/portal");
    }
  }, [role, router]);

  useEffect(() => {
    if (!token || role !== "agent") return;
    let cancelled = false;
    setLoading(true);
    portalApi
      .visits(token)
      .then((res) => {
        if (!cancelled) setVisits(res.data);
      })
      .catch(() => {
        if (!cancelled) setVisits([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  const reminders = useMemo(() => {
    const t = todayISO();
    const tm = tomorrowISO();
    return visits.filter(
      (v) =>
        (v.date === t || v.date === tm) &&
        (v.status === "Scheduled" || v.status === "Confirmed"),
    );
  }, [visits]);

  if (role !== "agent") return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const upsertVisit = (item: PortalVisit) => {
    setVisits((prev) => {
      const idx = prev.findIndex((v) => v.id === item.id);
      if (idx === -1) return [item, ...prev];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  };

  const onSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.propertyName.trim() || !form.date) {
      toast.error("Name, property name, and alert date are required");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setSubmitting(true);
    try {
      const res = await portalApi.createVisit(
        {
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          locationLabel: form.locationLabel.trim() || "TBD",
          propertyName: form.propertyName.trim(),
          propertyTitle: form.propertyName.trim(),
          propertySize: form.propertySize.trim() || undefined,
          rate: form.rate.trim() || undefined,
          propertyTypeLabel: form.propertyTypeLabel.trim() || undefined,
          date: form.date,
          time: "09:00",
          type: "Site Visit",
          status: "Scheduled",
        },
        token,
      );
      upsertVisit(res.data);
      setShowForm(false);
      setForm({ ...emptyForm, date: tomorrowISO() });
      toast.success("Added to agent diary");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save diary entry");
    } finally {
      setSubmitting(false);
    }
  };

  const onStatus = async (id: string, status: PortalVisit["status"]) => {
    if (!token) return;
    try {
      const res = await portalApi.updateVisit(id, { status }, token);
      upsertVisit(res.data);
      toast.success("Diary status updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update entry");
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Diary</h1>
          <p className="mt-1 text-sm text-muted">
            Agent diary — leads, property details, and reminder alerts.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          <CalendarPlus className="h-4 w-4" />
          Add entry
        </Button>
      </div>

      {reminders.length > 0 ? (
        <Card className="border-gold/30 bg-champagne/30 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reminders — today &amp; tomorrow</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {reminders.map((v) => (
              <Badge key={v.id} variant="gold" className="text-xs">
                {v.date === todayISO() ? "Today" : "Tomorrow"} — {v.customerName}
                {v.propertyTitle ? ` · ${v.propertyTitle}` : ""}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {showForm ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">New diary entry</CardTitle>
            <CardDescription>
              Save contact &amp; property details with an alert date for reminder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSchedule} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  placeholder="Customer / owner name"
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile number</Label>
                <Input
                  value={form.customerPhone}
                  onChange={(e) => set("customerPhone", e.target.value)}
                  placeholder="10-digit mobile"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <Input
                  value={form.locationLabel}
                  onChange={(e) => set("locationLabel", e.target.value)}
                  placeholder="Full address / locality"
                />
              </div>
              <div className="space-y-2">
                <Label>Property Name</Label>
                <Input
                  value={form.propertyName}
                  onChange={(e) => set("propertyName", e.target.value)}
                  placeholder="Project / society name"
                />
              </div>
              <div className="space-y-2">
                <Label>Property type</Label>
                <select
                  value={form.propertyTypeLabel}
                  onChange={(e) => set("propertyTypeLabel", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Property Size</Label>
                <Input
                  value={form.propertySize}
                  onChange={(e) => set("propertySize", e.target.value)}
                  placeholder="e.g. 1200 sq.ft"
                />
              </div>
              <div className="space-y-2">
                <Label>Rate</Label>
                <Input
                  value={form.rate}
                  onChange={(e) => set("rate", e.target.value)}
                  placeholder="e.g. ₹85 Lakh / ₹6500 per sq.ft"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Alert Date for Reminder</Label>
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save to diary
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        {loading ? <p className="py-8 text-center text-sm text-muted">Loading diary…</p> : null}
        {!loading &&
          visits.map((v) => (
            <Card key={v.id} className="border-border/80 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-charcoal">
                      {v.propertyTitle || v.title}
                    </p>
                    {v.propertyTypeLabel ? (
                      <Badge variant="outline">{v.propertyTypeLabel}</Badge>
                    ) : (
                      <Badge variant="outline">{v.type}</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {v.customerName}
                    {v.customerPhone ? ` · ${v.customerPhone}` : ""}
                    {v.locationLabel && v.locationLabel !== "TBD" ? ` · ${v.locationLabel}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Alert: {v.date}
                    {v.propertySize ? ` · Size: ${v.propertySize}` : ""}
                    {v.rate ? ` · Rate: ${v.rate}` : ""}
                  </p>
                  {v.notes ? <p className="mt-1 text-xs text-muted">{v.notes}</p> : null}
                </div>
                <select
                  value={v.status}
                  onChange={(e) => {
                    void onStatus(v.id, e.target.value as PortalVisit["status"]);
                  }}
                  className="h-9 rounded-[8px] border border-border bg-surface px-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          ))}
        {!loading && visits.length === 0 ? (
          <Card className="border-dashed p-8 text-center text-sm text-muted">
            Diary is empty. Add a lead with property details and an alert date.
          </Card>
        ) : null}
      </div>
    </div>
  );
}
