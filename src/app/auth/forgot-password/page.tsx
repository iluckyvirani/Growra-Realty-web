"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotValues) => {
    try {
      const res = await authApi.forgotPassword(values.email);
      setDemoToken(res.demoResetToken ?? null);
      setSent(true);
      toast.success("Reset link sent");
      if (res.demoResetToken) {
        console.log("[dev] reset token:", res.demoResetToken);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Request failed");
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-champagne/70 text-gold-rich">
          <MailCheck className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-charcoal">
            Check your inbox
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>, you
            will receive a secure reset link shortly.
          </p>
          {demoToken ? (
            <p className="rounded-md bg-cream px-3 py-2 text-xs text-muted">
              Dev reset token: <code className="text-charcoal">{demoToken}</code>
            </p>
          ) : null}
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-charcoal">
          Reset password
        </h1>
        <p className="text-sm text-muted">
          Enter the email linked to your Growra account and we will send a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            {...register("email")}
          />
          {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/auth/login" className="font-medium text-gold-rich hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
