"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store";
import { type PortalTicket } from "@/store/portal-store";
import { portalApi } from "@/lib/portal-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const CATEGORIES: PortalTicket["category"][] = [
  "Listing",
  "Verification",
  "Payment",
  "Technical",
  "Other",
];
const PRIORITIES: PortalTicket["priority"][] = ["Low", "Medium", "High"];
const STATUSES: PortalTicket["status"][] = ["Open", "In Progress", "Resolved", "Closed"];

export default function PortalTicketsPage() {
  const token = useAuthStore((s) => s.token);
  const [tickets, setTickets] = useState<PortalTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    subject: "",
    category: "Listing" as PortalTicket["category"],
    priority: "Medium" as PortalTicket["priority"],
    message: "",
  });

  const upsertTicket = (item: PortalTicket) => {
    setTickets((prev) => {
      const idx = prev.findIndex((t) => t.id === item.id);
      if (idx === -1) return [item, ...prev];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    portalApi
      .tickets(token)
      .then((res) => {
        if (!cancelled) setTickets(res.data);
      })
      .catch(() => {
        if (!cancelled) setTickets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (!token) {
      toast.error("Please sign in again");
      return;
    }
    setSubmitting(true);
    try {
      const res = await portalApi.createTicket(
        {
          subject: form.subject.trim(),
          category: form.category,
          priority: form.priority,
          message: form.message.trim(),
        },
        token,
      );
      upsertTicket(res.data);
      setOpen(false);
      setForm({ subject: "", category: "Listing", priority: "Medium", message: "" });
      toast.success("Ticket raised — Growra admin will respond soon");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const onReply = async (ticketId: string) => {
    const text = replyDrafts[ticketId]?.trim();
    if (!text) {
      toast.error("Enter a reply");
      return;
    }
    if (!token) return;
    try {
      const res = await portalApi.replyTicket(ticketId, text, token);
      upsertTicket(res.data);
      setReplyDrafts((d) => ({ ...d, [ticketId]: "" }));
      toast.success("Reply sent");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send reply");
    }
  };

  const onStatus = async (ticketId: string, status: PortalTicket["status"]) => {
    if (!token) return;
    try {
      const res = await portalApi.updateTicketStatus(ticketId, status, token);
      upsertTicket(res.data);
      toast.success("Ticket status updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update status");
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Tickets</h1>
          <p className="mt-1 text-sm text-muted">
            Raise issues for verification, listings, payments — available to owners and agents.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen((v) => !v)}>
          <Plus className="h-4 w-4" />
          Raise ticket
        </Button>
      </div>

      {open ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">New ticket</CardTitle>
            <CardDescription>Sent to Growra admin support queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Documents uploaded — please verify"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as PortalTicket["category"],
                      }))
                    }
                    className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        priority: e.target.value as PortalTicket["priority"],
                      }))
                    }
                    className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {loading ? (
          <Card className="flex items-center justify-center gap-2 border-dashed p-8 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tickets…
          </Card>
        ) : null}
        {!loading &&
          tickets.map((t) => {
          const expanded = expandedId === t.id;
          return (
            <Card key={t.id} className="border-border/80 shadow-sm">
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-charcoal">{t.subject}</p>
                      <Badge variant="outline">{t.status}</Badge>
                      <Badge variant="secondary">{t.priority}</Badge>
                      <Badge variant="outline">{t.category}</Badge>
                    </div>
                    <p className="text-[11px] text-muted">
                      {t.id} · {t.createdAt} · {t.replies.length} message(s)
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Label className="mb-1 block text-[11px] text-muted">Status</Label>
                    <select
                      value={t.status}
                      onChange={(e) => {
                        void onStatus(t.id, e.target.value as PortalTicket["status"]);
                      }}
                      className="flex h-9 rounded-[8px] border border-border bg-surface px-2 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-xs font-medium text-gold hover:underline"
                  onClick={() => setExpandedId(expanded ? null : t.id)}
                >
                  {expanded ? "Collapse thread" : "View thread & activity"}
                </button>

                {expanded ? (
                  <>
                    <div className="space-y-3 rounded-[8px] border border-border/70 bg-cream/30 p-4">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                        Conversation
                      </p>
                      {t.replies.map((r, idx) => (
                        <div
                          key={`${t.id}-reply-${idx}`}
                          className={cn(
                            "rounded-[8px] px-3 py-2",
                            r.author === "You" ? "bg-white" : "bg-champagne/50",
                          )}
                        >
                          <p className="text-xs font-medium text-charcoal">{r.author}</p>
                          <p className="mt-0.5 text-sm text-charcoal/90">{r.text}</p>
                          <p className="mt-1 text-[10px] text-muted">{r.at}</p>
                        </div>
                      ))}
                      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                        <Textarea
                          value={replyDrafts[t.id] ?? ""}
                          onChange={(e) =>
                            setReplyDrafts((d) => ({ ...d, [t.id]: e.target.value }))
                          }
                          placeholder="Write a reply…"
                          rows={2}
                          className="flex-1"
                        />
                        <Button type="button" onClick={() => void onReply(t.id)}>
                          <Send className="h-4 w-4" />
                          Reply
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                        Activity log
                      </p>
                      <ul className="space-y-2 border-l-2 border-gold/30 pl-4">
                        {t.logs.map((log) => (
                          <li key={log.id} className="relative">
                            <span className="absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full bg-gold" />
                            <p className="text-sm text-charcoal">
                              <span className="font-medium">{log.action}</span>
                              {log.detail ? ` — ${log.detail}` : ""}
                            </p>
                            <p className="text-[10px] text-muted">
                              {log.author} · {log.at}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
        {!loading && tickets.length === 0 ? (
          <Card className="border-dashed p-8 text-center text-sm text-muted">
            No tickets yet. Raise one when you need admin help.
          </Card>
        ) : null}
      </div>
    </div>
  );
}
