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

const TYPES: PortalVisit["type"][] = ["Site Visit", "Office Meeting", "Video Call", "Callback"];
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

export default function PortalDiaryPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const token = useAuthStore((s) => s.token);
  const [visits, setVisits] = useState<PortalVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Site Visit" as PortalVisit["type"],
    date: tomorrowISO(),
    time: "11:00",
    customerName: "",
    customerPhone: "",
    propertyTitle: "",
    locationLabel: "",
    notes: "",
  });

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
    if (!form.title.trim() || !form.customerName.trim() || !form.date) {
      toast.error("Title, customer, and date are required");
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
          title: form.title.trim(),
          type: form.type,
          date: form.date,
          time: form.time,
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          propertyTitle: form.propertyTitle.trim() || undefined,
          locationLabel: form.locationLabel.trim() || "TBD",
          notes: form.notes.trim() || undefined,
          status: "Scheduled",
        },
        token,
      );
      upsertVisit(res.data);
      setShowForm(false);
      setForm({
        title: "",
        type: "Site Visit",
        date: tomorrowISO(),
        time: "11:00",
        customerName: "",
        customerPhone: "",
        propertyTitle: "",
        locationLabel: "",
        notes: "",
      });
      toast.success("Visit added to diary");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not schedule visit");
    } finally {
      setSubmitting(false);
    }
  };

  const onStatus = async (id: string, status: PortalVisit["status"]) => {
    if (!token) return;
    try {
      const res = await portalApi.updateVisit(id, { status }, token);
      upsertVisit(res.data);
      toast.success("Visit status updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update visit");
    }
  };

  return (
    <div className="mx-auto max-w-8  xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Diary</h1>
          <p className="mt-1 text-sm text-muted">
            Site visits &amp; meetings — same pattern as Growra admin diary.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          <CalendarPlus className="h-4 w-4" />
          Schedule
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
                {v.date === todayISO() ? "Today" : "Tomorrow"} {v.time} — {v.customerName}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {showForm ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Schedule visit / meeting</CardTitle>
            <CardDescription>Link it to an inquiry when you capture offline leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSchedule} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Site visit — Sector 150"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.locationLabel}
                  onChange={(e) => set("locationLabel", e.target.value)}
                  placeholder="Address or Phone"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.customerPhone}
                  onChange={(e) => set("customerPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Property (optional)</Label>
                <Input
                  value={form.propertyTitle}
                  onChange={(e) => set("propertyTitle", e.target.value)}
                />
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
                    <p className="font-semibold text-charcoal">{v.title}</p>
                    <Badge variant="outline">{v.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {v.date} · {v.time} · {v.customerName} · {v.locationLabel}
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
            Diary is empty. Schedule a visit or add one from an inquiry.
          </Card>
        ) : null}
      </div>
    </div>
  );
}
