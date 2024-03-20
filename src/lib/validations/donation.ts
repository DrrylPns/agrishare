import { z } from "zod";

export type DonationType = z.infer<typeof DonationSchema>

export const DonationSchema = z.object({
    donatee: z.string().min(2, { message: "Invalid donatee." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    name: z.string().min(2, { message: "Invalid name." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    product: z.string().min(2, { message: "Invalid product." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    date: z.coerce.date(),
    image: z.string().optional(),
    quantity: z.coerce.number(),
})