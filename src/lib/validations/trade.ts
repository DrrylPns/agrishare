import { z } from "zod"
import { Subcat } from "../utils"

const numberError = { message: "Field must be 0 or more" }

export type TradeType = z.infer<typeof TradeSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])


export const TradeSchema = z.object({
    item: z.string({
        required_error: "Please select an item"
    }).min(2, { message: "Please select a valid item" }),
    // quantity: z.coerce.number().min(0, numberError),
    // value: z.coerce.number().min(0, numberError),
    weight: z.coerce.number().min(0, numberError),
    shelfLife: z.string().min(5).max(35).optional(),
    description: z.string({
        required_error: "Add some description!"
    }).min(5, {
        message: "Make atleast 5 character long"
    }),
    subcategory: Subcat,
    category: Category,
    size: z.optional(z.string()),
})