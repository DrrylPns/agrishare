import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';
import { randomBytes } from 'crypto';

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



export function generateTRD(): string {
  const randomBytesHex = randomBytes(3).toString('hex').toUpperCase();
  return `TRD#${randomBytesHex}`;
}

export function generateDonationHistoryID(): string {
  const randomBytesHex = randomBytes(3).toString('hex').toUpperCase();
  return `DN#${randomBytesHex}`;
}

export function generatePointsHistoryID(): string {
  const randomBytesHex = randomBytes(3).toString('hex').toUpperCase();
  return `PS#${randomBytesHex}`;
}

export function generateClaimedHistoryID(): string {
  const randomBytesHex = randomBytes(3).toString('hex').toUpperCase();
  return `ITM#${randomBytesHex}`;
}

export function generateAgriquestHistoryID(): string {
  const randomBytesHex = randomBytes(3).toString('hex').toUpperCase();
  return `AQ#${randomBytesHex}`;
}