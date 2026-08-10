import { api } from "./api";
import type {
  PortalInquiry,
  PortalInquiryPriority,
  PortalKycDoc,
  PortalListing,
  PortalTicket,
  PortalVisit,
  PortalChatMessage,
  PortalNotification,
  PortalNotificationPrefs,
} from "@/store/portal-store";

export type PortalDashboard = {
  counts: {
    total: number;
    live: number;
    pending: number;
    reserved: number;
    sold: number;
    rejected: number;
  };
  recentListings: PortalListing[];
};

export type PortalProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  avatar?: string | null;
  status?: string;
  kycStatus?: string;
  blockReason?: string | null;
};

export const portalApi = {
  dashboard: (token: string) =>
    api<{ success: boolean; data: PortalDashboard }>("/portal/dashboard", { token }),

  listings: (token: string) =>
    api<{ success: boolean; data: PortalListing[] }>("/portal/listings", { token }),

  listing: (id: string, token: string) =>
    api<{ success: boolean; data: PortalListing }>(`/portal/listings/${id}`, { token }),

  createListing: (payload: Record<string, unknown>, token: string) =>
    api<{ success: boolean; data: PortalListing }>("/portal/listings", {
      method: "POST",
      body: payload,
      token,
    }),

  inquiries: (token: string) =>
    api<{ success: boolean; data: PortalInquiry[] }>("/portal/inquiries", { token }),

  createInquiry: (payload: Record<string, unknown>, token: string) =>
    api<{ success: boolean; data: PortalInquiry; visit?: PortalVisit }>("/portal/inquiries", {
      method: "POST",
      body: payload,
      token,
    }),

  updateInquiryStatus: (id: string, status: PortalInquiry["status"], token: string) =>
    api<{ success: boolean; data: PortalInquiry }>(`/portal/inquiries/${id}/status`, {
      method: "PATCH",
      body: { status },
      token,
    }),

  updateInquiryPriority: (id: string, priority: PortalInquiryPriority, token: string) =>
    api<{ success: boolean; data: PortalInquiry }>(`/portal/inquiries/${id}/priority`, {
      method: "PATCH",
      body: { priority },
      token,
    }),

  addInquiryLog: (id: string, text: string, token: string, author?: string) =>
    api<{ success: boolean; data: PortalInquiry }>(`/portal/inquiries/${id}/logs`, {
      method: "POST",
      body: { text, author },
      token,
    }),

  visits: (token: string) =>
    api<{ success: boolean; data: PortalVisit[] }>("/portal/visits", { token }),

  createVisit: (payload: Record<string, unknown>, token: string) =>
    api<{ success: boolean; data: PortalVisit }>("/portal/visits", {
      method: "POST",
      body: payload,
      token,
    }),

  updateVisit: (id: string, payload: Record<string, unknown>, token: string) =>
    api<{ success: boolean; data: PortalVisit }>(`/portal/visits/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    }),

  tickets: (token: string) =>
    api<{ success: boolean; data: PortalTicket[] }>("/portal/tickets", { token }),

  createTicket: (
    payload: {
      subject: string;
      category: string;
      priority?: string;
      message: string;
    },
    token: string,
  ) =>
    api<{ success: boolean; data: PortalTicket }>("/portal/tickets", {
      method: "POST",
      body: payload,
      token,
    }),

  updateTicketStatus: (id: string, status: PortalTicket["status"], token: string) =>
    api<{ success: boolean; data: PortalTicket }>(`/portal/tickets/${id}/status`, {
      method: "PATCH",
      body: { status },
      token,
    }),

  replyTicket: (id: string, text: string, token: string) =>
    api<{ success: boolean; data: PortalTicket }>(`/portal/tickets/${id}/replies`, {
      method: "POST",
      body: { text },
      token,
    }),

  profile: (token: string) =>
    api<{ success: boolean; data: PortalProfile }>("/portal/profile", { token }),

  updateProfile: (
    payload: { name?: string; email?: string; phone?: string; avatar?: string | null },
    token: string,
  ) =>
    api<{ success: boolean; data: PortalProfile }>("/portal/profile", {
      method: "PATCH",
      body: payload,
      token,
    }),

  kyc: (token: string) =>
    api<{ success: boolean; data: PortalKycDoc[] }>("/portal/kyc", { token }),

  uploadKyc: (
    payload: { type: string; fileName: string; fileUrl?: string },
    token: string,
  ) =>
    api<{ success: boolean; data: PortalKycDoc }>("/portal/kyc", {
      method: "POST",
      body: payload,
      token,
    }),

  chat: (token: string) =>
    api<{
      success: boolean;
      data: {
        id: string;
        subject: string;
        status: string;
        unreadCount: number;
        lastMessageAt: string;
        messages: PortalChatMessage[];
      };
    }>("/portal/chat", { token }),

  sendChat: (text: string, token: string) =>
    api<{
      success: boolean;
      data: {
        message: PortalChatMessage;
        thread: {
          id: string;
          messages: PortalChatMessage[];
        };
      };
    }>("/portal/chat/messages", {
      method: "POST",
      body: { text },
      token,
    }),

  notifications: (token: string) =>
    api<{ success: boolean; data: PortalNotification[] }>("/portal/notifications", { token }),

  markNotificationRead: (id: string, token: string) =>
    api<{ success: boolean; data: PortalNotification }>(`/portal/notifications/${id}/read`, {
      method: "POST",
      token,
    }),

  markAllNotificationsRead: (token: string) =>
    api<{ success: boolean; data: PortalNotification[] }>("/portal/notifications/read-all", {
      method: "POST",
      token,
    }),

  notificationPrefs: (token: string) =>
    api<{ success: boolean; data: PortalNotificationPrefs }>("/portal/notification-prefs", {
      token,
    }),

  updateNotificationPrefs: (payload: Partial<PortalNotificationPrefs>, token: string) =>
    api<{ success: boolean; data: PortalNotificationPrefs }>("/portal/notification-prefs", {
      method: "PUT",
      body: payload,
      token,
    }),
};
