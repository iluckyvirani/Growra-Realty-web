import type { NavItem } from "@/types";

export const SITE_NAME = "Growra Realty";
export const SITE_TAGLINE = "Discover Extraordinary Living";
export const SITE_DESCRIPTION =
  "Growra Realty is a premium luxury real estate platform helping you buy, rent, and invest in exceptional properties across India.";
export const SITE_URL = "https://growrarealty.com";
export const SITE_LOGO = "/growra-logo.png";

export const BRAND_COLORS = {
  primaryGold: "#C89B3C",
  richGold: "#B8860B",
  lightGold: "#E8C76A",
  champagne: "#F5E6C4",
  darkCharcoal: "#1B1B1B",
  secondaryBlack: "#111111",
  background: "#FAF8F3",
  surface: "#FFFFFF",
  border: "#E8E2D8",
  textPrimary: "#222222",
  textSecondary: "#6B7280",
  success: "#16A34A",
  danger: "#DC2626",
} as const;

export const BUDGET_RANGES = [
  { label: "Under ₹50 L", min: 0, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5 Cr – ₹10 Cr", min: 50_000_000, max: 100_000_000 },
  { label: "Above ₹10 Cr", min: 100_000_000, max: Infinity },
] as const;

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "pg", label: "PG / Co-living" },
] as const;

export const BHK_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export const AMENITIES_LIST = [
  { id: "pool", name: "Swimming Pool", icon: "Waves", category: "lifestyle" },
  { id: "gym", name: "Gym", icon: "Dumbbell", category: "sports" },
  { id: "parking", name: "Parking", icon: "Car", category: "convenience" },
  { id: "security", name: "24/7 Security", icon: "Shield", category: "security" },
  { id: "garden", name: "Landscaped Garden", icon: "TreePine", category: "lifestyle" },
  { id: "clubhouse", name: "Clubhouse", icon: "Building2", category: "lifestyle" },
  { id: "playground", name: "Kids Play Area", icon: "Baby", category: "lifestyle" },
  { id: "power-backup", name: "Power Backup", icon: "Zap", category: "convenience" },
  { id: "lift", name: "Elevator", icon: "ArrowUpDown", category: "convenience" },
  { id: "cctv", name: "CCTV", icon: "Camera", category: "security" },
  { id: "spa", name: "Spa & Wellness", icon: "Sparkles", category: "lifestyle" },
  { id: "tennis", name: "Tennis Court", icon: "Circle", category: "sports" },
  { id: "concierge", name: "Concierge", icon: "Bell", category: "convenience" },
  { id: "smart-home", name: "Smart Home", icon: "Home", category: "eco" },
  { id: "ev-charging", name: "EV Charging", icon: "BatteryCharging", category: "eco" },
] as const;

export type AmenityDef = (typeof AMENITIES_LIST)[number];

/** Match portal/API values that may be ids (`gym`) or labels (`Gym`, `24/7 Security`). */
export function resolveAmenities(amenities: string[]): Array<{
  id: string;
  name: string;
  icon: string;
  category: string;
}> {
  return amenities
    .map((raw) => raw?.trim())
    .filter(Boolean)
    .map((raw) => {
      const key = raw.toLowerCase();
      const found = AMENITIES_LIST.find(
        (a) =>
          a.id === key ||
          a.id === raw ||
          a.name.toLowerCase() === key ||
          a.name.toLowerCase().includes(key) ||
          key.includes(a.id.replace(/-/g, " ")),
      );
      if (found) return { ...found };
      return {
        id: key.replace(/\s+/g, "-"),
        name: raw,
        icon: "Sparkles",
        category: "convenience",
      };
    });
}

/** Audience-style top nav (99acres-inspired IA, Growra branding) */
export const AUDIENCE_NAV = [
  { label: "For Buyers", href: "/buy" },
  { label: "For Tenants", href: "/rent" },
  { label: "For Owners", href: "/portal" },
  { label: "For Dealers / Builders", href: "/builders/oberoi-legacy" },
  { label: "Insights", href: "/blog", badge: "NEW" as const },
] as const;

export const MAIN_NAV: NavItem[] = [
  {
    label: "Buy",
    href: "/buy",
    children: [
      { label: "Apartments", href: "/buy?type=apartment", description: "Premium flats & residences" },
      { label: "Villas", href: "/buy?type=villa", description: "Independent luxury homes" },
      { label: "Penthouses", href: "/buy?type=penthouse", description: "Sky-high living" },
      { label: "Ready to Move", href: "/buy?status=ready", description: "Immediate possession" },
    ],
  },
  {
    label: "Rent",
    href: "/rent",
    children: [
      { label: "Apartments", href: "/rent?type=apartment", description: "Furnished & unfurnished" },
      { label: "Villas", href: "/rent?type=villa", description: "Spacious family homes" },
      { label: "PG / Co-living", href: "/pg", description: "Shared premium stays" },
    ],
  },
  {
    label: "Commercial",
    href: "/commercial",
    children: [
      { label: "Office Spaces", href: "/commercial?type=office", description: "Grade-A workspaces" },
      { label: "Shops & Retail", href: "/commercial?type=shop", description: "High-footfall locations" },
      { label: "Plots", href: "/plots", description: "Investment-ready land" },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "New Launches", href: "/projects?status=new-launch", description: "Just announced" },
      { label: "Under Construction", href: "/projects?status=under-construction", description: "Upcoming homes" },
      { label: "Luxury Collection", href: "/luxury", description: "Ultra-premium residences" },
    ],
  },
  { label: "Luxury", href: "/luxury" },
  { label: "Blog", href: "/blog" },
];

export const FOOTER_LINKS = {
  primary: [
    { label: "Mobile Apps", href: "/#app-download" },
    { label: "Our Services", href: "/about" },
    { label: "Price Trends", href: "/blog" },
    { label: "Post your Property", href: "/postproperty" },
    { label: "Real Estate Investments", href: "/projects" },
    { label: "Builders in India", href: "/projects" },
    { label: "Area Converter", href: "/contact" },
    { label: "Articles", href: "/blog" },
    { label: "Rent Receipt", href: "/contact" },
    { label: "Customer Service", href: "/contact" },
    { label: "Sitemap", href: "/contact" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Careers with us", href: "/about#careers" },
    { label: "Terms & Conditions", href: "/about#terms" },
    { label: "Request Info", href: "/contact" },
    { label: "Feedback", href: "/contact" },
    { label: "Report a problem", href: "/contact" },
    { label: "Testimonials", href: "/about" },
    { label: "Privacy Policy", href: "/about#privacy" },
    { label: "Summons / Notices", href: "/about#legal" },
    { label: "Grievances", href: "/contact" },
    { label: "Safety Guide", href: "/about#safety" },
  ],
  partners: [
    { label: "Naukri.com — Jobs in India", href: "https://www.naukri.com" },
    { label: "Jeevansathi.com — Matrimonials", href: "https://www.jeevansathi.com" },
    { label: "Brijj.com — Professional Networking", href: "https://www.brijj.com" },
    { label: "Shiksha.com — Education", href: "https://www.shiksha.com" },
    { label: "Policybazaar.com — Insurance", href: "https://www.policybazaar.com" },
    { label: "AmbitionBox.com — Company Reviews", href: "https://www.ambitionbox.com" },
    { label: "FirstNaukri.com — Campus Hiring", href: "https://www.firstnaukri.com" },
    { label: "Jobhai.com — Jobs for Freshers", href: "https://www.jobhai.com" },
    { label: "Zomato.com — Order Food Online", href: "https://www.zomato.com" },
    { label: "Meritnation.com — Online Study", href: "https://www.meritnation.com" },
    { label: "Piesearch.com — Local Businesses", href: "https://www.piesearch.com" },
  ],
  explore: [
    { label: "Buy Property", href: "/buy" },
    { label: "Rent Property", href: "/rent" },
    { label: "Commercial", href: "/commercial" },
    { label: "New Projects", href: "/projects" },
    { label: "Luxury Homes", href: "/luxury" },
    { label: "Plots", href: "/plots" },
  ],
  support: [
    { label: "Help Center", href: "/contact" },
    { label: "Privacy Policy", href: "/about#privacy" },
    { label: "Terms of Use", href: "/about#terms" },
    { label: "RERA Info", href: "/about#rera" },
  ],
  cities: [
    { label: "Mumbai", href: "/city/mumbai" },
    { label: "Delhi NCR", href: "/city/delhi-ncr" },
    { label: "Bengaluru", href: "/city/bengaluru" },
    { label: "Hyderabad", href: "/city/hyderabad" },
    { label: "Pune", href: "/city/pune" },
    { label: "Chennai", href: "/city/chennai" },
  ],
} as const;

export const FOOTER_CONTACT = {
  tollFree: "1800-41-99099",
  hours: "9:30AM to 6:30PM, IST MON-SUN",
  email: "hello@growrarealty.com",
} as const;

/** Public Growra Realty contact — never expose owner/agent numbers on listings. */
export const GROWRA_CONTACT = {
  name: "Growra Realty",
  tagline: "Verified listings · Admin-managed leads",
  phoneDisplay: "+91 98765 00000",
  phoneTel: "+919876500000",
  email: "hello@growrarealty.com",
  address: "Growra Realty HQ · Serving buyers across India",
  hours: "Mon–Sun · 9:30 AM – 6:30 PM IST",
} as const;

