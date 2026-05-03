import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeEmail(email: string) {
  const [local, domain] = email.toLowerCase().trim().split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    // Remove dots and everything after +
    const cleanLocal = local.split("+")[0].replace(/\./g, "");
    return `${cleanLocal}@${domain}`;
  }
  return `${local}@${domain}`;
}

