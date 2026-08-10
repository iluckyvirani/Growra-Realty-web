"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { Mail, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "phone" | "otp" | "email";

interface AuthLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function initialsFromPhone(phone: string) {
  return phone.slice(-2);
}

export function AuthLoginModal({ open, onOpenChange }: AuthLoginModalProps) {
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setPhoneError("");
      setOtp(["", "", "", ""]);
      setEmail("");
      setEmailError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 10) {
      setPhoneError("That looks like an invalid number");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setPhoneError("That looks like an invalid number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const continuePhone = () => {
    if (!validatePhone(phone)) return;
    setStep("otp");
    toast.message("OTP sent", { description: "Use 1234 for demo login" });
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: ReactKeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 4) {
      toast.error("Enter the 4 digit OTP");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    login({
      name: "Growra Member",
      email: `${digits}@growra.user`,
      phone: `+91${digits}`,
    });
    toast.success("Logged in successfully");
    onOpenChange(false);
  };

  const continueEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    login({
      name: email.split("@")[0],
      email: email.trim(),
      phone: "",
    });
    toast.success("Logged in successfully");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-[400px] rounded-[8px] border border-border bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-md p-1 text-muted hover:bg-cream hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "phone" ? (
          <>
            <h2 id="auth-modal-title" className="text-xl font-bold text-charcoal">
              Login / Register
            </h2>
            <p className="mt-1 text-sm text-muted">Please enter your Phone Number</p>

            <div
              className={cn(
                "mt-6 rounded-lg border px-3 py-2",
                phoneError ? "border-danger" : "border-border focus-within:border-gold",
              )}
            >
              {phoneError ? (
                <p className="mb-1 text-xs font-medium text-danger">{phoneError}</p>
              ) : (
                <p className="mb-1 text-xs font-medium text-gold-rich">Phone Number</p>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1 border-r border-border pr-2 text-sm font-semibold text-charcoal"
                >
                  +91
                  <span className="text-[10px] text-muted">▼</span>
                </button>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (phoneError) setPhoneError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && continuePhone()}
                  className="h-9 w-full bg-transparent text-sm text-charcoal outline-none"
                  placeholder=""
                  autoFocus
                  aria-label="Phone number"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={continuePhone}
              className="mt-5 h-11 w-full rounded-lg text-base font-semibold text-white gold-gradient"
            >
              Continue
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("email")}
              className="mt-3 h-11 w-full gap-2 rounded-lg border-charcoal/30 text-charcoal"
            >
              <Mail className="h-4 w-4" />
              Login with Email
            </Button>

            <p className="mt-5 text-center text-xs text-muted">
              By clicking you agree to{" "}
              <Link href="/about#terms" className="font-medium text-gold-rich hover:underline">
                Terms and Conditions
              </Link>
            </p>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <h2 id="auth-modal-title" className="text-xl font-bold text-charcoal">
              Verify your number
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm font-semibold text-charcoal">
                +91-{phone.replace(/\D/g, "")}
              </p>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-gold-rich hover:opacity-80"
                aria-label="Edit number"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-6 text-sm text-charcoal">Enter your 4 digit OTP</p>
            <div className="mt-3 flex gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={cn(
                    "h-12 w-12 rounded-lg border text-center text-lg font-semibold text-charcoal outline-none",
                    digit ? "border-charcoal" : "border-border focus:border-charcoal",
                  )}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            <p className="mt-4 text-sm text-muted">
              Haven&apos;t received yet?{" "}
              <button
                type="button"
                onClick={() => toast.success("OTP resent — use 1234")}
                className="font-semibold text-gold-rich hover:underline"
              >
                Resend OTP
              </button>
            </p>

            <Button
              type="button"
              onClick={verifyOtp}
              className="mt-5 h-11 w-full rounded-lg text-base font-semibold text-white gold-gradient"
            >
              Verify &amp; Continue
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast.message("Missed call verification coming soon");
              }}
              className="mt-3 h-11 w-full rounded-lg border-charcoal/30 text-charcoal"
            >
              Or, Verify via Missed Call
            </Button>
          </>
        ) : null}

        {step === "email" ? (
          <>
            <h2 id="auth-modal-title" className="text-xl font-bold text-charcoal">
              Login with Email
            </h2>
            <p className="mt-1 text-sm text-muted">Enter your email to continue</p>

            <div className="mt-6">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="you@example.com"
                className={cn("h-11", emailError && "border-danger")}
                autoFocus
              />
              {emailError ? (
                <p className="mt-1 text-xs text-danger">{emailError}</p>
              ) : null}
            </div>

            <Button
              type="button"
              onClick={continueEmail}
              className="mt-5 h-11 w-full rounded-lg text-base font-semibold text-white gold-gradient"
            >
              Continue
            </Button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="mt-3 w-full text-center text-sm font-medium text-gold-rich hover:underline"
            >
              ← Back to phone login
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function userInitials(name: string, phone?: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase();
  if (phone) return initialsFromPhone(phone.replace(/\D/g, "")).toUpperCase() || "GR";
  return "GR";
}
