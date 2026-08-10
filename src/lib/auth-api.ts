import { api } from "./api";

export type ApiUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  uiRole: "buyer" | "owner" | "agent" | "admin" | "staff";
  avatar?: string | null;
  status?: string;
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: ApiUser;
};

export const authApi = {
  sendOtp: (phone: string) =>
    api<{ success: boolean; message: string; demoOtp?: string }>("/auth/otp/send", {
      method: "POST",
      body: { phone },
    }),

  verifyOtp: (phone: string, otp: string) =>
    api<{
      success: boolean;
      verified: boolean;
      isNewUser: boolean;
      phone?: string;
      userId?: string;
      token?: string;
      user?: ApiUser;
    }>("/auth/otp/verify", {
      method: "POST",
      body: { phone, otp },
    }),

  register: (payload: {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role: "buyer" | "owner" | "agent";
  }) =>
    api<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload: { email?: string; phone?: string; password: string }) =>
    api<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  me: (token: string) =>
    api<{ success: boolean; user: ApiUser }>("/auth/me", { token }),

  forgotPassword: (email: string) =>
    api<{ success: boolean; message: string; demoResetToken?: string }>(
      "/auth/forgot-password",
      { method: "POST", body: { email } },
    ),

  resetPassword: (token: string, password: string) =>
    api<{ success: boolean; message: string }>("/auth/reset-password", {
      method: "POST",
      body: { token, password },
    }),

  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    api<{ success: boolean; message: string }>("/auth/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
      token,
    }),
};
