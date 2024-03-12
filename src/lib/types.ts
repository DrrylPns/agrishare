import { User } from "@prisma/client";

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