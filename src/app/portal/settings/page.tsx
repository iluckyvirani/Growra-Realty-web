"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store";
import { usePortalStore } from "@/store/portal-store";
import { authApi } from "@/lib/auth-api";
import { portalApi } from "@/lib/portal-api";
import { ApiError } from "@/lib/api";

export default function PortalSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const notificationPrefs = usePortalStore((s) => s.notificationPrefs);
  const updateNotificationPrefs = usePortalStore((s) => s.updateNotificationPrefs);

  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [form, setForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [notifForm, setNotifForm] = useState(notificationPrefs);

  useEffect(() => {
    setNotifForm({
      ...notificationPrefs,
      emailAddress: notificationPrefs.emailAddress || user?.email || "",
      mobileNumber: notificationPrefs.mobileNumber || user?.phone || "",
    });
  }, [notificationPrefs, user?.email, user?.phone]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current.trim()) {
      toast.error("Current password is required");
      return;
    }
    if (form.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (form.next !== form.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.changePassword(token, form.current, form.next);
      setForm({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update password");
    } finally {
      setSubmitting(false);
    }
  };

  const onSaveNotifs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setSavingNotifs(true);
    try {
      const res = await portalApi.updateNotificationPrefs(notifForm, token);
      updateNotificationPrefs(res.data);
      setNotifForm(res.data);
      toast.success("Notification preferences saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save preferences");
    } finally {
      setSavingNotifs(false);
    }
  };

  const eventLabels: { key: keyof typeof notifForm.events; label: string }[] = [
    { key: "listingStatus", label: "Listing status changes" },
    { key: "ticketUpdates", label: "Support ticket updates" },
    { key: "inquiryFollowUps", label: "Inquiry follow-ups" },
    { key: "chatMessages", label: "Live chat messages" },
    { key: "kycUpdates", label: "KYC document updates" },
  ];

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Settings</h1>
        <p className="mt-1 text-sm text-muted">Security and account preferences.</p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Change password</CardTitle>
          <CardDescription>Use a strong password you don&apos;t reuse elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                type={show ? "text" : "password"}
                value={form.current}
                onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next">New password</Label>
              <div className="relative">
                <Input
                  id="next"
                  type={show ? "text" : "password"}
                  className="pr-11"
                  value={form.next}
                  onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted"
                  onClick={() => setShow((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Notification channels</CardTitle>
          <CardDescription>
            Choose how Growra alerts you about listings, tickets, inquiries, and KYC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveNotifs} className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border/70 bg-cream/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="email-enabled">Email alerts</Label>
                  <p className="text-xs text-muted">Listing updates, tickets, and KYC status</p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={notifForm.emailEnabled}
                  onCheckedChange={(v) => setNotifForm((f) => ({ ...f, emailEnabled: v }))}
                />
              </div>
              {notifForm.emailEnabled ? (
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email address</Label>
                  <Input
                    id="email-address"
                    type="email"
                    value={notifForm.emailAddress}
                    onChange={(e) => setNotifForm((f) => ({ ...f, emailAddress: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 bg-cream/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="sms-enabled">Mobile / SMS alerts</Label>
                  <p className="text-xs text-muted">Urgent updates and visit reminders</p>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={notifForm.smsEnabled}
                  onCheckedChange={(v) => setNotifForm((f) => ({ ...f, smsEnabled: v }))}
                />
              </div>
              {notifForm.smsEnabled ? (
                <div className="space-y-2">
                  <Label htmlFor="mobile-number">Mobile number</Label>
                  <Input
                    id="mobile-number"
                    value={notifForm.mobileNumber}
                    onChange={(e) => setNotifForm((f) => ({ ...f, mobileNumber: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-charcoal">Event types</p>
              {eventLabels.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label htmlFor={`event-${key}`} className="font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={`event-${key}`}
                    checked={notifForm.events[key]}
                    onCheckedChange={(v) =>
                      setNotifForm((f) => ({
                        ...f,
                        events: { ...f.events, [key]: v },
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={savingNotifs}>
              {savingNotifs ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save notification preferences
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
