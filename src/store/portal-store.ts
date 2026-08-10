import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PortalRole = "owner" | "agent";

export type ListingAvailability =
  | "Pending Verification"
  | "Live"
  | "Reserved"
  | "Sold"
  | "Rejected";

export interface PortalListing {
  id: string;
  title: string;
  description?: string;
  city: string;
  locality: string;
  address?: string;
  state?: string;
  pincode?: string;
  priceLabel: string;
  /** Numeric price for EMI / card formatting */
  price?: number;
  pricePerSqft?: number;
  category: string;
  purpose: "Buy" | "Rent" | "Commercial" | "Plot";
  availability: ListingAvailability;
  areaSqft: number;
  carpetArea?: number;
  bedrooms: number;
  bathrooms?: number;
  balconies?: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  facing?: string;
  floors?: number;
  parking?: number;
  furnished?: "Furnished" | "Semi-furnished" | "Unfurnished";
  possession?: string;
  constructionStatus?: "Ready to Move" | "Under Construction" | "New Launch";
  amenities?: string[];
  tags?: string[];
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  staffNote?: string;
  isFeatured?: boolean;
}

export type PortalInquiryType =
  | "Site Visit Request"
  | "Price Negotiation"
  | "General Info"
  | "Buying Intent";

export type PortalInquiryPriority = "Low" | "Medium" | "High";

export interface PortalInquiryLog {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface PortalInquiry {
  id: string;
  source: "Website" | "Offline" | "Phone" | "Walk-in" | "Other platform";
  inquiryType: PortalInquiryType;
  priority: PortalInquiryPriority;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  propertyId?: string;
  propertyTitle: string;
  message: string;
  status: "New" | "In Discussion" | "Site Visit Scheduled" | "Closed Won" | "Closed Lost";
  createdAt: string;
  nextFollowUp?: string;
  logs: PortalInquiryLog[];
}

export interface PortalVisit {
  id: string;
  title: string;
  type: "Site Visit" | "Office Meeting" | "Video Call" | "Callback";
  status: "Scheduled" | "Confirmed" | "Completed" | "No-show" | "Cancelled";
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  propertyTitle?: string;
  locationLabel: string;
  notes?: string;
}

export interface PortalTicketLog {
  id: string;
  at: string;
  author: string;
  action: string;
  detail?: string;
}

export interface PortalTicket {
  id: string;
  subject: string;
  category: "Listing" | "Verification" | "Payment" | "Technical" | "Other";
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  message: string;
  createdAt: string;
  replies: { author: string; text: string; at: string }[];
  logs: PortalTicketLog[];
}

export interface PortalKycDoc {
  id: string;
  type:
    | "Aadhaar"
    | "PAN"
    | "RERA"
    | "Title Deed"
    | "Tax Receipt"
    | "Bank Proof"
    | "Agency License"
    | "Other";
  fileName: string;
  fileUrl?: string;
  uploadedAt: string;
  status: "Pending Review" | "Verified" | "Rejected";
  note?: string;
}

export interface PortalNotificationPrefs {
  emailEnabled: boolean;
  emailAddress: string;
  smsEnabled: boolean;
  mobileNumber: string;
  events: {
    listingStatus: boolean;
    ticketUpdates: boolean;
    inquiryFollowUps: boolean;
    chatMessages: boolean;
    kycUpdates: boolean;
  };
}

export interface PortalNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "listing" | "ticket" | "inquiry" | "chat" | "kyc" | "general";
}

export interface PortalChatMessage {
  id: string;
  from: "me" | "admin";
  text: string;
  at: string;
}


function id(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const DEFAULT_NOTIFICATION_PREFS: PortalNotificationPrefs = {
  emailEnabled: true,
  emailAddress: "",
  smsEnabled: true,
  mobileNumber: "",
  events: {
    listingStatus: true,
    ticketUpdates: true,
    inquiryFollowUps: true,
    chatMessages: true,
    kycUpdates: true,
  },
};

interface PortalState {
  seededRole: PortalRole | null;
  listings: PortalListing[];
  inquiries: PortalInquiry[];
  visits: PortalVisit[];
  tickets: PortalTicket[];
  chat: PortalChatMessage[];
  kycDocuments: PortalKycDoc[];
  notificationPrefs: PortalNotificationPrefs;
  portalNotifications: PortalNotification[];
  seedForRole: (role: PortalRole) => void;
  addListing: (listing: Omit<PortalListing, "id" | "createdAt" | "availability">) => void;
  addInquiry: (
    inquiry: Omit<PortalInquiry, "id" | "createdAt" | "status" | "source" | "logs"> & {
      source?: PortalInquiry["source"];
    },
  ) => void;
  updateInquiryStatus: (id: string, status: PortalInquiry["status"]) => void;
  addInquiryLog: (id: string, author: string, text: string) => void;
  updateInquiryPriority: (id: string, priority: PortalInquiryPriority) => void;
  addVisit: (visit: Omit<PortalVisit, "id" | "status"> & { status?: PortalVisit["status"] }) => void;
  updateVisitStatus: (id: string, status: PortalVisit["status"]) => void;
  addTicket: (
    ticket: Omit<PortalTicket, "id" | "createdAt" | "status" | "replies" | "logs">,
  ) => void;
  updateTicketStatus: (id: string, status: PortalTicket["status"]) => void;
  addTicketReply: (id: string, author: string, text: string) => void;
  uploadKycDoc: (doc: Omit<PortalKycDoc, "id" | "uploadedAt" | "status">) => void;
  updateNotificationPrefs: (prefs: Partial<PortalNotificationPrefs>) => void;
  setNotificationPrefs: (prefs: PortalNotificationPrefs) => void;
  setPortalNotifications: (items: PortalNotification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendChat: (text: string) => void;
  setChat: (messages: PortalChatMessage[]) => void;
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      seededRole: null,
      listings: [],
      inquiries: [],
      visits: [],
      tickets: [],
      kycDocuments: [],
      notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
      portalNotifications: [],
      chat: [],

      seedForRole: (role) => {
        if (get().seededRole === role) return;
        const prefs = {
          ...DEFAULT_NOTIFICATION_PREFS,
          emailAddress: get().notificationPrefs.emailAddress || "",
          mobileNumber: get().notificationPrefs.mobileNumber || "",
        };
        if (role === "owner") {
          set({
            seededRole: role,
            listings: [],
            inquiries: [],
            visits: [],
            tickets: [],
            kycDocuments: [],
            notificationPrefs: prefs,
            portalNotifications: [],
          });
        } else {
          set({
            seededRole: role,
            listings: [],
            inquiries: [],
            visits: [],
            tickets: [],
            kycDocuments: [],
            notificationPrefs: prefs,
            portalNotifications: [],
          });
        }
      },

      addListing: (listing) =>
        set((s) => ({
          listings: [
            {
              ...listing,
              id: id("PL"),
              createdAt: new Date().toISOString().slice(0, 10),
              availability: "Pending Verification",
            },
            ...s.listings,
          ],
        })),

      addInquiry: (inquiry) =>
        set((s) => ({
          inquiries: [
            {
              ...inquiry,
              id: id("PI"),
              source: inquiry.source ?? "Offline",
              status: "New",
              createdAt: new Date().toISOString().slice(0, 10),
              logs: [
                {
                  id: id("IL"),
                  date: new Date().toISOString().slice(0, 10),
                  author: "You",
                  text: "Inquiry captured.",
                },
              ],
            },
            ...s.inquiries,
          ],
        })),

      updateInquiryStatus: (inquiryId, status) =>
        set((s) => ({
          inquiries: s.inquiries.map((i) => {
            if (i.id !== inquiryId) return i;
            const log: PortalInquiryLog = {
              id: id("IL"),
              date: new Date().toISOString().slice(0, 10),
              author: "You",
              text: `Status changed to ${status}.`,
            };
            return { ...i, status, logs: [...i.logs, log] };
          }),
        })),

      addInquiryLog: (inquiryId, author, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set((s) => ({
          inquiries: s.inquiries.map((i) =>
            i.id === inquiryId
              ? {
                  ...i,
                  logs: [
                    ...i.logs,
                    {
                      id: id("IL"),
                      date: new Date().toISOString().slice(0, 10),
                      author,
                      text: trimmed,
                    },
                  ],
                }
              : i,
          ),
        }));
      },

      updateInquiryPriority: (inquiryId, priority) =>
        set((s) => ({
          inquiries: s.inquiries.map((i) => {
            if (i.id !== inquiryId) return i;
            const log: PortalInquiryLog = {
              id: id("IL"),
              date: new Date().toISOString().slice(0, 10),
              author: "You",
              text: `Priority changed to ${priority}.`,
            };
            return { ...i, priority, logs: [...i.logs, log] };
          }),
        })),

      addVisit: (visit) =>
        set((s) => ({
          visits: [
            {
              ...visit,
              id: id("PV"),
              status: visit.status ?? "Scheduled",
            },
            ...s.visits,
          ],
        })),

      updateVisitStatus: (visitId, status) =>
        set((s) => ({
          visits: s.visits.map((v) => (v.id === visitId ? { ...v, status } : v)),
        })),

      addTicket: (ticket) => {
        const now = new Date().toLocaleString();
        const today = new Date().toISOString().slice(0, 10);
        set((s) => ({
          tickets: [
            {
              ...ticket,
              id: id("TK"),
              status: "Open",
              createdAt: today,
              replies: [
                {
                  author: "You",
                  text: ticket.message,
                  at: now,
                },
              ],
              logs: [
                {
                  id: id("TL"),
                  at: now,
                  author: "You",
                  action: "Created",
                },
              ],
            },
            ...s.tickets,
          ],
        }));
      },

      updateTicketStatus: (ticketId, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            const prev = t.status;
            const log: PortalTicketLog = {
              id: id("TL"),
              at: new Date().toLocaleString(),
              author: "You",
              action: "Status changed",
              detail: `${prev} → ${status}`,
            };
            return { ...t, status, logs: [...t.logs, log] };
          }),
        })),

      addTicketReply: (ticketId, author, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const at = new Date().toLocaleString();
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  replies: [...t.replies, { author, text: trimmed, at }],
                  logs: [
                    ...t.logs,
                    {
                      id: id("TL"),
                      at,
                      author,
                      action: "Reply added",
                    },
                  ],
                }
              : t,
          ),
        }));
      },

      uploadKycDoc: (doc) =>
        set((s) => ({
          kycDocuments: [
            {
              ...doc,
              id: id("KYC"),
              uploadedAt: new Date().toISOString().slice(0, 10),
              status: "Pending Review",
            },
            ...s.kycDocuments,
          ],
        })),

      updateNotificationPrefs: (prefs) =>
        set((s) => ({
          notificationPrefs: {
            ...s.notificationPrefs,
            ...prefs,
            events: prefs.events
              ? { ...s.notificationPrefs.events, ...prefs.events }
              : s.notificationPrefs.events,
          },
        })),

      setNotificationPrefs: (prefs) => set({ notificationPrefs: prefs }),

      setPortalNotifications: (items) => set({ portalNotifications: items }),

      setChat: (messages) => set({ chat: messages }),

      markNotificationRead: (notifId) =>
        set((s) => ({
          portalNotifications: s.portalNotifications.map((n) =>
            n.id === notifId ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          portalNotifications: s.portalNotifications.map((n) => ({ ...n, read: true })),
        })),

      sendChat: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const now = new Date().toISOString();
        set((s) => ({
          chat: [...s.chat, { id: id("CH"), from: "me", text: trimmed, at: now }],
        }));
      },
    }),
    {
      name: "growra-portal",
      version: 5,
      migrate: (persisted) => {
        const state = persisted as Record<string, unknown> | undefined;
        if (!state || typeof state !== "object") return persisted as never;
        return {
          ...state,
          seededRole: null,
          tickets: [],
          kycDocuments: [],
          chat: [],
          portalNotifications: [],
        } as never;
      },
    },
  ),
);
