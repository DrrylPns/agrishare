import { z } from "zod"

export type DateOfPickupInAgrichangeType = z.infer<typeof DateOfPickupInAgrichange>

export const DateOfPickupInAgrichange = z.object({
    pickupDate: z.date({
        required_error: "Pick up date is required",
    }),
})