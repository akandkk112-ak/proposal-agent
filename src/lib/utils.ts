import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getStatusStyles(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case "DRAFT":
      return { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" };
    case "UNDER_REVIEW":
      return { bg: "bg-amber-100", text: "text-amber-700", label: "In Review" };
    case "SIGNED":
      return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Signed" };
    case "SENT":
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Sent" };
    case "DECLINED":
      return { bg: "bg-red-100", text: "text-red-700", label: "Declined" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-600", label: status };
  }
}

export function generateReference(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 900) + 100;
  return `PR-${year}-${num.toString().padStart(3, "0")}`;
}
