import { z } from "zod"

const numberError = { message: "Field must be 0 or more" }

export type TradeType = z.infer<typeof TradeSchema>

export const TradeSchema = z.object({
    item: z.string({
        required_error: "Please select an item"
    }).min(2, { message: "Please select a valid item" }),
    quantity: z.coerce.number().min(0, numberError),
    value: z.coerce.number().min(0, numberError),
    weight: z.coerce.number().min(0, numberError),
    description: z.string({
        required_error: "Add some description!"
    }).min(5, {
        message: "Make atleast 5 character long"
    }),
})