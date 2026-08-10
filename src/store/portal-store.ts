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

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function id(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const OWNER_LISTINGS: PortalListing[] = [
  {
    id: "PL-501",
    title: "Bel-Air Modern Architectural Haven",
    city: "Agra",
    locality: "Fatehabad Road",
    priceLabel: "₹6.45 Cr",
    category: "Villa",
    purpose: "Buy",
    availability: "Live",
    areaSqft: 5200,
    bedrooms: 5,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-02-10",
    staffNote: "Documents verified by Elena Rostova.",
    isFeatured: true,
    bathrooms: 5,
    balconies: 3,
    facing: "West",
    furnished: "Furnished",
    possession: "Ready to Move",
    constructionStatus: "Ready to Move",
    coordinates: { lat: 27.1592, lng: 78.0421 },
    description: "Modern architectural villa with landscaped gardens and private pool.",
    tags: ["Villa", "Verified"],
    amenities: ["Parking", "Security", "Pool", "Garden"],
  },
  {
    id: "PL-502",
    title: "Kamla Nagar Residential Plot",
    city: "Agra",
    locality: "Kamla Nagar",
    priceLabel: "₹35 Lakh",
    category: "Plot",
    purpose: "Plot",
    availability: "Reserved",
    areaSqft: 1250,
    bedrooms: 0,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-02-01",
    staffNote: "Token received — marked Reserved.",
    coordinates: { lat: 27.2046, lng: 78.0081 },
    possession: "Immediate",
    constructionStatus: "Ready to Move",
    tags: ["Plot"],
  },
];

const AGENT_LISTINGS: PortalListing[] = [
  {
    id: "PL-401",
    title: "Skyline Imperial Penthouse",
    city: "Noida",
    locality: "Sector 150",
    priceLabel: "₹4.85 Cr",
    category: "Penthouse",
    purpose: "Buy",
    availability: "Live",
    areaSqft: 3800,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    facing: "East",
    furnished: "Semi-furnished",
    possession: "Ready to Move",
    constructionStatus: "Ready to Move",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-01-28",
    staffNote: "Approved & live.",
    isFeatured: true,
    coordinates: { lat: 28.4229, lng: 77.4895 },
    description: "Premium penthouse on Expressway corridor with club access.",
    tags: ["Penthouse", "Featured"],
    amenities: ["Parking", "Gym", "Pool", "Security"],
    price: 48500000,
    pricePerSqft: 12763,
  },
  {
    id: "PL-402",
    title: "Orbit Studio for Rent — Sector 62",
    city: "Noida",
    locality: "Sector 62",
    priceLabel: "₹28,000/mo",
    category: "Apartment",
    purpose: "Rent",
    availability: "Sold",
    areaSqft: 520,
    bedrooms: 1,
    bathrooms: 1,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-01-22",
    staffNote: "Tenant agreement closed.",
    coordinates: { lat: 28.627, lng: 77.3649 },
    furnished: "Furnished",
    possession: "Ready to Move",
    price: 28000,
  },
  {
    id: "PL-403",
    title: "Golf Course Road Builder Floor",
    city: "Delhi NCR",
    locality: "Gurgaon",
    priceLabel: "₹2.1 Cr",
    category: "Apartment",
    purpose: "Buy",
    availability: "Pending Verification",
    areaSqft: 2100,
    bedrooms: 3,
    bathrooms: 3,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    createdAt: daysFromNow(-1),
    staffNote: "Awaiting staff assignment.",
    coordinates: { lat: 28.4396, lng: 77.1012 },
    facing: "North",
    possession: "Within 6 months",
    constructionStatus: "Under Construction",
    price: 21000000,
    pricePerSqft: 10000,
  },
];

const AGENT_INQUIRIES: PortalInquiry[] = [
  {
    id: "PI-901",
    source: "Website",
    inquiryType: "Price Negotiation",
    priority: "High",
    customerName: "Beatriz Santos",
    customerPhone: "+91 98765 55667",
    customerEmail: "bsantos@globalventures.com",
    propertyId: "PL-401",
    propertyTitle: "Skyline Imperial Penthouse",
    message: "Interested in all-cash offer. Open to negotiation?",
    status: "New",
    createdAt: daysFromNow(-2),
    logs: [
      {
        id: "IL-901-1",
        date: daysFromNow(-2),
        author: "System",
        text: "Inquiry received from website form.",
      },
    ],
  },
  {
    id: "PI-902",
    source: "Offline",
    inquiryType: "Site Visit Request",
    priority: "Medium",
    customerName: "Ravi Mehta",
    customerPhone: "+91 98100 11223",
    propertyTitle: "Orbit Studio for Rent — Sector 62",
    propertyId: "PL-402",
    message: "Walk-in from Sector 62. Wants weekend viewing.",
    status: "Site Visit Scheduled",
    createdAt: daysFromNow(-1),
    nextFollowUp: daysFromNow(0),
    logs: [
      {
        id: "IL-902-1",
        date: daysFromNow(-1),
        author: "You",
        text: "Captured offline walk-in lead.",
      },
      {
        id: "IL-902-2",
        date: daysFromNow(-1),
        author: "You",
        text: "Status changed to Site Visit Scheduled.",
      },
    ],
  },
  {
    id: "PI-903",
    source: "Phone",
    inquiryType: "Buying Intent",
    priority: "Medium",
    customerName: "Ananya Kapoor",
    customerPhone: "+91 99001 33445",
    propertyTitle: "General Noida 3BHK search",
    message: "Called office. Budget ₹1.5–2 Cr, Sector 137–150.",
    status: "In Discussion",
    createdAt: daysFromNow(-3),
    nextFollowUp: daysFromNow(1),
    logs: [
      {
        id: "IL-903-1",
        date: daysFromNow(-3),
        author: "You",
        text: "Phone inquiry logged. Sent 3 matching listings via WhatsApp.",
      },
    ],
  },
];

const AGENT_VISITS: PortalVisit[] = [
  {
    id: "PV-701",
    title: "Site visit — Skyline Penthouse",
    type: "Site Visit",
    status: "Confirmed",
    date: daysFromNow(0),
    time: "16:30",
    customerName: "Beatriz Santos",
    customerPhone: "+91 98765 55667",
    propertyTitle: "Skyline Imperial Penthouse",
    locationLabel: "Sector 150, Noida",
    notes: "Bring brochure pack.",
  },
  {
    id: "PV-702",
    title: "Callback — Noida 3BHK",
    type: "Callback",
    status: "Scheduled",
    date: daysFromNow(1),
    time: "11:00",
    customerName: "Ananya Kapoor",
    customerPhone: "+91 99001 33445",
    locationLabel: "Phone",
  },
];

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

function seedNotifications(role: PortalRole): PortalNotification[] {
  const base: PortalNotification[] = [
    {
      id: "PN-1",
      title: "Welcome to Growra Partner Portal",
      body: "Your account is active. Complete KYC to unlock full listing features.",
      createdAt: daysFromNow(-7),
      read: true,
      type: "general",
    },
  ];
  if (role === "owner") {
    return [
      ...base,
      {
        id: "PN-2",
        title: "Listing reserved — Kamla Nagar Plot",
        body: "PL-502 marked Reserved after token received.",
        createdAt: daysFromNow(-1),
        read: false,
        type: "listing",
      },
      {
        id: "PN-3",
        title: "KYC document rejected",
        body: "Tax Receipt upload rejected — please re-upload a clear scan.",
        createdAt: daysFromNow(-2),
        read: false,
        type: "kyc",
      },
      {
        id: "PN-4",
        title: "Ticket update",
        body: "Verification team is reviewing your title deed for PL-501.",
        createdAt: daysFromNow(-3),
        read: false,
        type: "ticket",
      },
    ];
  }
  return [
    ...base,
    {
      id: "PN-2",
      title: "New website inquiry",
      body: "Beatriz Santos asked about Skyline Imperial Penthouse.",
      createdAt: daysFromNow(-2),
      read: false,
      type: "inquiry",
    },
    {
      id: "PN-3",
      title: "Site visit tomorrow",
      body: "Confirmed visit with Beatriz Santos at Sector 150.",
      createdAt: daysFromNow(-1),
      read: false,
      type: "inquiry",
    },
    {
      id: "PN-4",
      title: "Listing pending verification",
      body: "Golf Course Road Builder Floor awaits staff review.",
      createdAt: daysFromNow(0),
      read: false,
      type: "listing",
    },
  ];
}

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
