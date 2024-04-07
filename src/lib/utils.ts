import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';
import { randomBytes } from 'crypto';
import prisma from "./db";
import { ShelfLifeUnit } from "@prisma/client";

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

// Function to generate userId in the format "XX-yyyy"
export async function generateUserId() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Count the number of users created in the current year
  const usersCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
      },
    },
  });

  // Increment the count and format it
  const incrementedCount = (usersCount + 1).toString().padStart(2, '0');

  // Combine the incremented count with the current year to form userId
  const userId = `${incrementedCount}-${currentYear}`;

  return userId;
}

export function formattedSLU(duration: number, unit: ShelfLifeUnit): string {
  const formattedUnit = unit.toLowerCase().charAt(0) + unit.toLowerCase().slice(1).toLowerCase();

  if (duration === 1) {
    return `1 ${formattedUnit}`;
  } else {
    return `${duration} ${formattedUnit}s`;
  }
}

export function isExpired(dateString: string, shelfLifeDuration: number, shelfLifeUnit: string) {
  const currentDate = new Date();
  const expirationDate = new Date(dateString);

  switch (shelfLifeUnit) {
      case 'DAY':
          expirationDate.setDate(expirationDate.getDate() + shelfLifeDuration);
          break;
      case 'WEEK':
          expirationDate.setDate(expirationDate.getDate() + (shelfLifeDuration * 7));
          break;
      case 'MONTH':
          expirationDate.setMonth(expirationDate.getMonth() + shelfLifeDuration);
          break;
      case 'YEAR':
          expirationDate.setFullYear(expirationDate.getFullYear() + shelfLifeDuration);
          break;
      default:
          throw new Error('Invalid shelfLifeUnit');
  }

  return currentDate > expirationDate;
}