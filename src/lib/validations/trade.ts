import { z } from "zod"

const numberError = { message: "Field must be 0 or more" }

export type TradeType = z.infer<typeof TradeSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])
const Subcategory = z.enum([
    "LEAFY_VEGETABLES",
    "PODDED_VEGETABLES",
    "FRUIT_VEGETABLES",
    "ROOT_VEGETABLES",
    "HERBS_VEGETABLES",
    "FRUIT1",
    "FRUIT2",
    "SMALL",
    "MEDIUM",
    "LARGE",
    "SEEDS1",
    "SEEDS2",
    "ORGANIC_SOIL",
    "NOT_ORGANIC_SOIL",
    "ORGANIC_FERTILIZER",
    "NOT_ORGANIC_FERTILIZER",
])

export const TradeSchema = z.object({
    item: z.string({
        required_error: "Please select an item"
    }).min(2, { message: "Please select a valid item" }),
    quantity: z.coerce.number().min(0, numberError),
    value: z.coerce.number().min(0, numberError),
    weight: z.coerce.number().min(0, numberError),
    shelfLife: z.string().min(5).max(35),
    description: z.string({
        required_error: "Add some description!"
    }).min(5, {
        message: "Make atleast 5 character long"
    }),
    subcategory: Subcategory,
    category: Category,
})