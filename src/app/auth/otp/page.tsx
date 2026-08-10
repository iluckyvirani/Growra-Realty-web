"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const code = digits.join("");

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success("Phone verified");
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    const role = user?.role;
    router.push(role === "owner" || role === "agent" ? "/portal" : "/dashboard");
  };

  const resend = () => {
    toast.message("A new code is on its way");
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-charcoal">Verify OTP</h1>
        <p className="text-sm text-muted">
          Enter the 6-digit code we sent to your phone. Demo tip: any digits work.
        </p>
      </div>

      <form onSubmit={onVerify} className="space-y-6">
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-12 w-10 rounded-[8px] border border-border bg-surface text-center text-lg font-semibold shadow-sm transition",
                "focus-visible:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none",
                "md:h-14 md:w-12",
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={submitting || code.length !== OTP_LENGTH}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Verify & continue
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm text-muted">
        <button
          type="button"
          onClick={resend}
          className="font-medium text-gold-rich hover:underline"
        >
          Resend code
        </button>
        <Link href="/auth/login" className="hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
