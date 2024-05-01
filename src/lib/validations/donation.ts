import { z } from "zod";
import { Subcategory } from "../utils";
import { CancelType } from "@prisma/client"

export type DonationType = z.infer<typeof DonationSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])

export const DonationSchema = z.object({
    // donatee: z.string().min(2, { message: "Invalid donatee." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    name: z.string().min(2, { message: "Invalid name." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    product: z.string().min(2, { message: "Invalid product." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    image: z.string().optional(),
    quantity: z.coerce.number(),
    subcategory: z.optional(Subcategory),
    category: Category,
    pickUpDate: z.coerce.date(),
    size: z.optional(z.string()),
})

export type FormType = z.infer<typeof CancelDonationSchema>

export const CancelDonationSchema = z.object({
    donationId: z.string().optional(),
    type: z.nativeEnum(CancelType, {
        required_error: "You need to select a reason for cancelling.",
    }),
})