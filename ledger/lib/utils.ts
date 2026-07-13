import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, opts?: { signed?: boolean }) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(amount) < 1000 ? 2 : 0,
  }).format(Math.abs(amount));

  if (!opts?.signed) return formatted;
  return amount < 0 ? `−${formatted}` : `+${formatted}`;
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...opts,
  });
}
