import { z } from "zod"

export type AgrimapType = z.infer<typeof AgrimapSchema>

export const AgrimapSchema = z.object({
    name: z.string({
        required_error: "Urban farm name required!"
    }),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
})