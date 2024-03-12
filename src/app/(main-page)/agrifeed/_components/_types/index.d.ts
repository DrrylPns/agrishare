'use server';

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    hashedPassword: string | null;
    phoneNumber: string | null;
    address: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    points: number;
    companyName: string;
  }
