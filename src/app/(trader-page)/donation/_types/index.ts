'use server'

export type Community = {
    id:             string   
    thumbnail:      string   
    name:           string
    story :         string
    currentDonated: number   
    neededDonation: number 
    title:          string | null
    communityImage: string | null
    createdAt:      Date 
    updatedAt:      Date
    donations: Donation[]
}

export type Donation = {
    id:                  string   
    // fetch full name, contact #, email at zip sa session
    name:                string // can fetch and be used as default values
    lastName:            string // can fetch and be used as default values
    phoneNumber:         string // can fetch and be used as default values
    email:               string // can fetch and be used as default values
    district:            string
    zip:                 string // can fetch and be used as default values
    category:            string
    productName:         String
    condition:           String
    quantity:            String
    preservationReq:     String
    deliveryTime:        Date
    deliveryAddress:     String
    specialInstructions: String  
    comment:             String   
    image:               String   
    isAnonymous:         boolean
    createdAt:           Date 
    updatedAt:           Date 
    donator: User
    donatorId: String
    communityId: String
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
