'use server';

import { Prisma, ShelfLifeUnit, Types } from "@prisma/client";

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
  size: string | undefined;
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

export type TradesWithRelations = Prisma.TradeGetPayload<{
  include: {
    tradee: true,
    trader: true,
    post: true,
  }
}>

export type DonationWithDonator = Prisma.DonationGetPayload<{
  include: {
    donator: true,
  }
}>

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    post: true,
    user: true,
  }
}>

export type ClaimWithRelations = Prisma.ClaimGetPayload<{
  include: {
    agriChange: true,
    user: true,
  }
}>

export type AgriquestWithRelations = Prisma.RequestGetPayload<{
  include: {
    agriquest: true,
    user: true,
  }
}>