import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';

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

export function formattedCategory(category: string) {

  const formatted = category.toLowerCase().replace(/_/g, ' ');

  return formatted.replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

export const formatCreatedAt = (createdAt: Date): string => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};