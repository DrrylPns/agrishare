import { Post, Role, StatusType, User } from "@prisma/client";

export interface Posts {
    id: string;
    image: string;
    name: string;
    description: string;
    quantity: number; // if qty === 0 oos if qty >= 1 && qty <= 5 lowstck, else instock
    weight: number;
    color: string;
    type: string;
    isFavorite: Boolean;
    category: string;
    status: string;
    shelfLife: string;
    preferedOffers: string;
    harvestDate: Date;
    // reviews        Reviews[]
    // transaction    Transaction[]
    // claimedProduct ClaimedProduct[]
    createdAt: Date;
    updatedAt: Date;
    User: User;
}

export interface TradeWithTradeeTraders {
    id: string;
    item: string;
    image: string;
    quantity: number;
    tradedQuantity: number;
    shelfLife: string;
    weight: number;
    value: number;
    description: string;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
    trader: User;
    tradee: User;
    post: Post;
}

interface UserHardCoded {
    id: string;
    name: string | null;
    lastName: string | null;
    middleInitial: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    phoneNumber: string | null;
    address: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    companyName: string | null;
    points: number;
    isTwoFactorEnabled: boolean;
    role: Role
    post: Post[]
}