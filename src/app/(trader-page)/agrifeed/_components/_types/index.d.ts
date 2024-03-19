'use server';

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
  type: string | null
  isFavorite: boolean
  category: string
  subcategory: string | null
  status: string
  shelfLife: string
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
