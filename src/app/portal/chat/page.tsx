"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store";
import { portalApi } from "@/lib/portal-api";
import type { PortalChatMessage } from "@/store/portal-store";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatChatClock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatChatDayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startToday.getTime() - startMsg.getTime()) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString([], { weekday: "long" });
  }
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function PortalChatPage() {
  const token = useAuthStore((s) => s.token);
  const [chat, setChat] = useState<PortalChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      setChat([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void portalApi
      .chat(token)
      .then((res) => {
        if (!cancelled) setChat(res.data.messages);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Could not load chat");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const id = window.setInterval(() => {
      void portalApi
        .chat(token)
        .then((res) => {
          if (!cancelled) setChat(res.data.messages);
        })
        .catch(() => undefined);
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !token || sending) return;
    setSending(true);
    const draft = text;
    setText("");
    try {
      const res = await portalApi.sendChat(draft, token);
      setChat(res.data.thread.messages);
    } catch (err) {
      setText(draft);
      toast.error(err instanceof ApiError ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-8xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Live chat</h1>
        <p className="mt-1 text-sm text-muted">Direct line to Growra admin — for owners and agents.</p>
      </div>

      <Card className="flex min-h-[28rem] flex-col border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-3">
          <CardTitle className="text-base">Growra Admin Support</CardTitle>
          <CardDescription>Usually replies during business hours.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 p-2 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : chat.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted">No messages yet — say hello.</p>
            ) : (
              chat.map((m, index) => {
                const prev = chat[index - 1];
                const showDay = !prev || dayKey(prev.at) !== dayKey(m.at);
                return (
                  <div key={m.id} className="space-y-3">
                    {showDay ? (
                      <div className="flex justify-center py-1">
                        <span className="rounded-md border border-border bg-white px-3 py-1 text-[11px] font-semibold text-muted shadow-sm">
                          {formatChatDayLabel(m.at)}
                        </span>
                      </div>
                    ) : null}
                    <div className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-[8px] px-3.5 py-2 text-sm shadow-sm",
                          m.from === "me"
                            ? "gold-gradient text-white"
                            : "border border-border bg-white text-charcoal",
                        )}
                      >
                        <p>{m.text}</p>
                        <p
                          className={cn(
                            "mt-1 text-right text-[10px]",
                            m.from === "me" ? "text-white/80" : "text-muted",
                          )}
                        >
                          {formatChatClock(m.at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSend} className="flex gap-2 border-t border-border/60 pt-3">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message admin…"
              className="flex-1"
              disabled={sending || !token}
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={sending || !token}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
