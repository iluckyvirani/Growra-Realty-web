"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Step = "phone" | "email" | "password" | "otp" | "create";
type PartnerRole = "owner" | "agent";

function toAuthUser(apiUser: {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  uiRole: string;
  avatar?: string | null;
}) {
  const role =
    apiUser.uiRole === "owner" || apiUser.uiRole === "agent" || apiUser.uiRole === "buyer"
      ? apiUser.uiRole
      : "buyer";
  return {
    id: apiUser.id,
    name: apiUser.name || "User",
    email: apiUser.email || "",
    phone: apiUser.phone ? (apiUser.phone.startsWith("+") ? apiUser.phone : `+91${apiUser.phone}`) : "",
    avatar: apiUser.avatar || undefined,
    role: role as "buyer" | "owner" | "agent",
    roleChosen: true,
  };
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const asParam = searchParams.get("as");

  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [role, setRole] = useState<PartnerRole>(asParam === "agent" ? "agent" : "owner");
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (asParam === "agent") setRole("agent");
    if (asParam === "owner") setRole("owner");
  }, [asParam]);

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
      setPhoneError("That looks like an invalid number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const enterSession = (token: string, user: Parameters<typeof toAuthUser>[0]) => {
    setSession({ token, user: toAuthUser(user) });
    const uiRole = user.uiRole;
    toast.success("Welcome to Growra");
    router.push(uiRole === "owner" || uiRole === "agent" ? "/portal" : "/dashboard");
  };

  const goOtp = async () => {
    if (!validatePhone(phone)) return;
    setLoading(true);
    try {
      const res = await authApi.sendOtp(phone);
      setStep("otp");
      toast.message("OTP sent", {
        description: res.demoOtp ? `Demo OTP: ${res.demoOtp}` : "Check your phone",
      });
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const goEmailPassword = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setStep("password");
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

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      toast.error("Enter the 4 digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, code);
      if (res.token && res.user && !res.isNewUser) {
        enterSession(res.token, res.user);
        return;
      }
      setStep("create");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const finishPassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({ email: email.trim(), password });
      enterSession(res.token, res.user);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setStep("create");
        toast.message("No account yet — create one");
      } else {
        toast.error(err instanceof ApiError ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    if (fullName.trim().length < 2) {
      setNameError("Enter your full name");
      return;
    }
    setNameError("");
    if (!agreed) {
      setAgreeError("This is required for creating an account");
      return;
    }
    setAgreeError("");

    const digits = phone.replace(/\D/g, "");
    setLoading(true);
    try {
      const res = await authApi.register({
        name: fullName.trim(),
        phone: digits || undefined,
        email: email.trim() || undefined,
        password: password.length >= 6 ? password : undefined,
        role,
      });
      enterSession(res.token, res.user);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (step === "otp" || step === "email") setStep("phone");
    else if (step === "password") setStep("email");
    else if (step === "create") setStep(otp.some(Boolean) ? "otp" : "password");
  };

  return (
    <div className="relative space-y-5">
      {step !== "phone" ? (
        <button
          type="button"
          onClick={back}
          className="absolute -top-1 left-0 rounded-md p-1 text-muted hover:bg-cream hover:text-charcoal"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      ) : null}

      {step === "phone" ? (
        <>
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-charcoal">Login / Register</h1>
            <p className="text-[13px] text-muted">Please enter your Phone Number</p>
          </div>

          <div
            className={cn(
              "rounded-md border px-3 py-2",
              phoneError ? "border-danger" : "border-border focus-within:border-gold",
            )}
          >
            <p
              className={cn(
                "mb-1 text-xs font-medium",
                phoneError ? "text-danger" : "text-gold-rich",
              )}
            >
              {phoneError || "What's your Phone Number?"}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex shrink-0 items-center gap-1 border-r border-border pr-2 text-sm font-semibold text-charcoal">
                +91
                <span className="text-[10px] text-muted">▼</span>
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  if (phoneError) setPhoneError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && goOtp()}
                className="h-9 w-full bg-transparent text-sm text-charcoal outline-none"
                autoFocus
                aria-label="Phone number"
              />
            </div>
          </div>

          <Button
            type="button"
            disabled={loading}
            onClick={goOtp}
            className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient"
          >
            {loading ? "Sending…" : "Continue"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("email")}
            className="h-10 w-full gap-2 rounded-md border-border text-charcoal"
          >
            <Mail className="h-4 w-4" />
            Login with Email
          </Button>

          <p className="text-center text-xs text-muted">
            By clicking you agree to{" "}
            <Link href="/about" className="font-medium text-gold-rich hover:underline">
              Terms and Conditions
            </Link>
          </p>
        </>
      ) : null}

      {step === "email" ? (
        <>
          <div className="space-y-1 px-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-charcoal">Login / Register</h1>
            <p className="text-[13px] text-muted">Please enter your Email ID/Username</p>
          </div>

          <div className="rounded-md border border-border px-3 py-2 focus-within:border-gold">
            <p className="mb-1 text-xs font-medium text-gold-rich">Email Id/Username</p>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && goEmailPassword()}
              className="h-9 w-full bg-transparent text-sm text-charcoal outline-none"
              autoFocus
            />
          </div>
          {emailError ? <p className="text-xs text-danger">{emailError}</p> : null}

          <Button
            type="button"
            onClick={goEmailPassword}
            className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient"
          >
            Continue
          </Button>
        </>
      ) : null}

      {step === "password" ? (
        <>
          <div className="space-y-1 px-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-charcoal">Enter Password</h1>
            <p className="text-[13px] text-muted">
              Your Password for <span className="font-medium text-gold-rich">{email}</span>{" "}
              <button type="button" onClick={() => setStep("email")} aria-label="Edit email">
                <Pencil className="inline h-3.5 w-3.5 text-gold-rich" />
              </button>
            </p>
          </div>

          <div className="relative rounded-md border border-border px-3 py-2 focus-within:border-gold">
            <p className="mb-1 text-xs font-medium text-gold-rich">Password</p>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && finishPassword()}
              className="h-9 w-full bg-transparent pr-8 text-sm text-charcoal outline-none"
              autoFocus
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 text-muted hover:text-charcoal"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-gold-rich hover:underline"
            >
              Forgot Password
            </Link>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={whatsappUpdates}
              onChange={(e) => setWhatsappUpdates(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[#C89B3C]"
            />
            Get updates via WhatsApp
          </label>

          <Button
            type="button"
            disabled={loading}
            onClick={finishPassword}
            className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient"
          >
            {loading ? "Signing in…" : "Continue"}
          </Button>
        </>
      ) : null}

      {step === "otp" ? (
        <>
          <div className="space-y-1 px-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-charcoal">Verify your number</h1>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-semibold text-charcoal">+91-{phone.replace(/\D/g, "")}</p>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-gold-rich"
                aria-label="Edit number"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-charcoal">Enter your 4 digit OTP</p>
            <div className="mt-3 flex justify-center gap-3">
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
                    "h-12 w-12 rounded-md border text-center text-lg font-semibold text-charcoal outline-none",
                    digit ? "border-charcoal" : "border-border focus:border-charcoal",
                  )}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-muted">
              Haven&apos;t received yet?{" "}
              <button
                type="button"
                onClick={() => goOtp()}
                className="font-semibold text-gold-rich hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>

          <Button
            type="button"
            disabled={loading}
            onClick={verifyOtp}
            className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient"
          >
            {loading ? "Verifying…" : "Verify & Continue"}
          </Button>
        </>
      ) : null}

      {step === "create" ? (
        <>
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-charcoal">Create Account</h1>
            <p className="text-[13px] text-muted">Tell us how you&apos;ll use Growra</p>
          </div>

          <div>
            <p className="text-sm font-medium text-charcoal">You are</p>
            <div className="mt-2 flex gap-2">
              {(
                [
                  { id: "owner", label: "Owner" },
                  { id: "agent", label: "Broker" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2.5 text-sm font-semibold transition",
                    role === opt.id
                      ? "border-gold bg-champagne/50 text-charcoal"
                      : "border-border bg-white text-muted hover:border-gold/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border px-3 py-2 focus-within:border-gold">
            <p className="mb-1 text-xs font-medium text-gold-rich">Full Name</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setNameError("");
              }}
              className="h-9 w-full bg-transparent text-sm text-charcoal outline-none"
              placeholder="Full Name"
              autoFocus
            />
          </div>
          {nameError ? <p className="text-xs text-danger">{nameError}</p> : null}

          {!phone ? (
            <div className="rounded-md border border-border px-3 py-2 focus-within:border-gold">
              <p className="mb-1 text-xs font-medium text-gold-rich">Set Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full bg-transparent text-sm text-charcoal outline-none"
                placeholder="Min 6 characters"
              />
            </div>
          ) : (
            <div className="rounded-md border border-border bg-[#F7F5F0] px-3 py-2">
              <p className="mb-1 text-xs font-medium text-muted">Phone Number</p>
              <div className="flex items-center gap-2 text-sm text-charcoal">
                <span className="border-r border-border pr-2 font-semibold">+91</span>
                {phone}
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setAgreeError("");
              }}
              className="mt-0.5 h-4 w-4 rounded border-border accent-[#C89B3C]"
            />
            <span>
              I agree to the{" "}
              <Link href="/about" className="font-medium text-gold-rich hover:underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/about" className="font-medium text-gold-rich hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {agreeError ? <p className="text-xs text-danger">! {agreeError}</p> : null}

          <Button
            type="button"
            disabled={loading}
            onClick={createAccount}
            className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient"
          >
            {loading ? "Creating…" : "Create Account"}
          </Button>
        </>
      ) : null}
    </div>
  );
}
