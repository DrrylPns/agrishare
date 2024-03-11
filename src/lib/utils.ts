import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categories = [
  {
    value: "DONATOR",
    label: "Non-Urban Farmer",
  },
  {
    value: "TRADER",
    label: "Urban Farmer",
  },
];
