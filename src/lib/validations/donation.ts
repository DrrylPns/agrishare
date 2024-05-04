import { z } from "zod";
import { Subcat } from "../utils";

export type DonationType = z.infer<typeof DonationSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])

export const DonationSchema = z.object({
    // donatee: z.string().min(2, { message: "Invalid donatee." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    name: z.string().min(2, { message: "Invalid name." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    // product: z.string().min(2, { message: "Invalid product." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    image: z.string().optional(),
    quantity: z.coerce.number(),
    subcategory: z.optional(Subcat),
    category: Category,
    pickUpDate: z.coerce.date(),
    size: z.optional(z.string()),
})

export type FormType = z.infer<typeof CancelDonationSchema>

export const CancelDonationSchema = z.object({
    donationId: z.string().optional(),
    type: z.enum([
        "NotAvailable", "ChangeOfMind", "ChangeOfDonation", "FailedToAppear", "Others"
    ], {
        required_error: "You need to select a reason for cancelling.",
    }),
})

export type SendDonationType = z.infer<typeof sendDonationSchema>

export const sendDonationSchema = z.object({
    dn: z.string({
        required_error: "Donation ID is required!"
    }).min(2).max(20),
    name: z.string({
        required_error: "Donator name is required!"
    }).min(2).max(50),
    item: z.string({
        required_error: "Donation item is required!"
    }).min(2).max(100),
})