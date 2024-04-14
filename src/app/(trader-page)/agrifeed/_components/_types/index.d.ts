'use server';

import { ShelfLifeUnit, Types } from "@prisma/client";

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

export type Post = {
  id: string
  image: string
  name: string
  description: string
  quantity: number
  weight: number
  color: string
  type: Types
  isFavorite: boolean
  category: string
  subcategory: string | null
  status: string
  shelfLifeDuration: number
  shelfLifeUnit: ShelfLifeUnit
  preferedOffers: string
  harvestDate: Date
  reviews: Reviews[]
  createdAt: Date
  updatedAt: Date
  User: User
  userId: string
}

export type Reviews = {
  id: string
  review: string
  createdAt: Date
  updatedAt: Date
  User: User
  userId: string

  postId: string
}

export type Agrichange = {
  id: string
  image: string
  name: string
  description: string
  quantityPerTrade: number
  quantity: number
  weight: number
  color: string
  type: string
  isFavorite: Boolean
  category: string
  subcategory: string
  status: Status
  shelfLife: string
  pointsNeeded: number
  createdAt: Date
  updatedAt: Date
}
