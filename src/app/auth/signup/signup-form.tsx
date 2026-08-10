"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Eye, EyeOff, Home, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .min(10, "Enter a valid phone number")
      .refine(
        (v) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, "")),
        "Enter a valid Indian mobile number",
      ),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["buyer", "owner", "agent"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

const ROLES: {
  id: SignupValues["role"];
  title: string;
  blurb: string;
  icon: typeof Home;
}[] = [
  {
    id: "buyer",
    title: "Looking to buy / rent",
    blurb: "Save homes, inquire, and track visits.",
    icon: Home,
  },
  {
    id: "owner",
    title: "I am an Owner",
    blurb: "List your property and track status.",
    icon: Building2,
  },
  {
    id: "agent",
    title: "I am an Agent",
    blurb: "Manage listings, diary & offline leads.",
    icon: UserRound,
  },
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const defaultRole: SignupValues["role"] =
    intent === "owner" ? "owner" : intent === "agent" ? "agent" : intent === "portal" ? "owner" : "buyer";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: defaultRole,
    },
  });

  const role = watch("role");

  const onSubmit = async (values: SignupValues) => {
    try {
      const res = await authApi.register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      });
      setSession({
        token: res.token,
        user: {
          id: res.user.id,
          name: res.user.name || values.name,
          email: res.user.email || values.email,
          phone: res.user.phone || values.phone,
          role: res.user.uiRole === "owner" || res.user.uiRole === "agent" ? res.user.uiRole : "buyer",
          roleChosen: true,
        },
      });
      toast.success("Account created");
      router.push(
        values.role === "owner" || values.role === "agent" ? "/portal" : "/auth/otp",
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Signup failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-charcoal">Create your account</h1>
        <p className="text-[13px] text-muted">One-time choice: tell us how you&apos;ll use Growra.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[13px]">I am signing up as</Label>
          <div className="grid gap-1.5">
            {ROLES.map(({ id, title, blurb, icon: Icon }) => {
              const selected = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setValue("role", id, { shouldValidate: true })}
                  className={cn(
                    "flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition",
                    selected
                      ? "border-gold bg-champagne/40"
                      : "border-border bg-white hover:border-gold/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      selected ? "bg-gold text-white" : "bg-[#F7F5F0] text-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-charcoal">{title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("role")} />
          {errors.role ? <p className="text-xs text-danger">{errors.role.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" placeholder="Aanya Sharma" {...register("name")} />
          {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          {errors.phone ? <p className="text-xs text-danger">{errors.phone.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-foreground"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-md text-sm font-semibold text-white gold-gradient hover:opacity-95"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>

      <p className="text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-gold-rich hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
