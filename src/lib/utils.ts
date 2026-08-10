import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "INR"): string {
  if (price >= 10_000_000) {
    return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  }
  if (price >= 100_000) {
    return `₹${(price / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number, unit = "sq.ft"): string {
  return `${area.toLocaleString("en-IN")} ${unit}`;
}

export function calculateEMI(principal: number, ratePercent: number, years: number): number {
  const monthlyRate = ratePercent / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
