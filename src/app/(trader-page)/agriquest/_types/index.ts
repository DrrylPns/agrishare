'use server';

export type Agriquest = {
    id: string
    image: string
    name: string
    description: string

    quantity: number
    quantityPerTrade: number
    shelfLife: string
    category: string
    createdAt: Date
    updatedAt: Date
    createdBy: User
    createdById: String
    claimedBy: User[]
    request: Request[]
}

export type User = {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    phoneNumber: string | null;
    address: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    points: number;
    companyName: string | null;
}