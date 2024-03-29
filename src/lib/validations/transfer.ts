import { z } from "zod";

export type TransferType = z.infer<typeof TransferSchema>

export const TransferSchema = z.object({
    amount: z.coerce.number().refine(value => value > 0, {
        message: "Amount should be a non-negative value.",
    }),
    userId: z.string(),
    password: z.string()
        .min(8, { message: "Minimum password length is 8 characters" })
        .max(20, { message: "Maximum password length is 20 characters" }),
    purpose: z.optional(z.string()),
})